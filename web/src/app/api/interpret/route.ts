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
 * Streams the AI interpretation back as SSE.
 * Each chunk is a `data: {"text": "..."}` line; final `data: [DONE]`.
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

  // Re-stream OpenAI SSE → simplified SSE
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      try {
        while (true) {
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
              const parsed = JSON.parse(payload);
              const delta = parsed?.choices?.[0]?.delta?.content;
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
