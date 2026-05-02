import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import type { Yao } from "@/lib/quantum";

export const runtime = "edge";

const DEFAULT_BASE_URL = "https://api.deepseek.com/v1";
const DEFAULT_MODEL = "deepseek-chat";

interface InterpretRequest {
  question: string;
  yaos: Yao[];
  benBin: string;
  bianBin: string;
}

/**
 * POST /api/interpret
 *
 * 把 DeepSeek 的 SSE 输出转发给前端。
 * 关键点：
 *   - 客户端 abort 时通过 ReadableStream.cancel() 关掉上游连接，避免继续烧 token
 *   - 解析跨数据块的换行；只发送 `data: {"text":...}` 简化协议
 */
export async function POST(req: Request) {
  let body: InterpretRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Bad JSON" }), { status: 400 });
  }

  const { question, yaos, benBin, bianBin } = body;
  if (!question?.trim() || !Array.isArray(yaos) || yaos.length !== 6) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
  if (question.length > 200) {
    return new Response(JSON.stringify({ error: "问题过长（≤200 字）" }), { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "服务端未配置 DEEPSEEK_API_KEY。请联系管理员或自行部署。",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const baseUrl = (process.env.LLM_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.LLM_MODEL || DEFAULT_MODEL;
  const userPrompt = buildUserPrompt(question, yaos, benBin, bianBin);

  // 用一个 AbortController 让 cancel() 路径能传递到上游 fetch
  const upstreamCtrl = new AbortController();

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2400,
      stream: true,
    }),
    signal: upstreamCtrl.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({
        error: `AI 接口返回 HTTP ${upstream.status}`,
        detail: detail.slice(0, 500),
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const raw of lines) {
            const line = raw.trim();
            if (!line || !line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                send({ text: delta });
              }
            } catch {
              // 个别上游片段不是合法 JSON，跳过即可
            }
          }
        }
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (err) {
        send({ error: err instanceof Error ? err.message : "stream error" });
        controller.close();
      } finally {
        try {
          reader.releaseLock();
        } catch {
          /* already released */
        }
      }
    },
    cancel(reason) {
      // 客户端断开（如关闭页面）→ 关掉上游连接，避免继续烧 token
      upstreamCtrl.abort(reason);
      try {
        reader.cancel(reason);
      } catch {
        /* already canceled */
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
