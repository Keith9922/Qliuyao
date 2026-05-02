"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { Yao } from "@/lib/quantum";
import { cn } from "@/lib/utils";

interface Props {
  question: string;
  yaos: Yao[];
  benBin: string;
  bianBin: string;
  /** 自动开始流式获取 */
  autoStart?: boolean;
}

interface Section {
  title: string;
  body: string;
}

/**
 * 把流式累积的 Markdown 文本切成四段。
 *
 * 容忍：
 *   - `## 一、卦象大意` / `## 一、 卦象大意` 都识别
 *   - 还没出现首个 `##` 时返回 trailing（前奏）
 */
function parseSections(raw: string): { sections: Section[]; trailing: string } {
  if (!raw) return { sections: [], trailing: "" };
  const headingRe = /(?:^|\n)[ \t]*##[ \t]+(.+?)(?=\n|$)/g;
  type Match = { idx: number; len: number; title: string };
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(raw)) !== null) {
    matches.push({ idx: m.index, len: m[0].length, title: m[1].trim() });
  }
  if (matches.length === 0) return { sections: [], trailing: raw.trim() };

  const sections: Section[] = matches.map((cur, i) => {
    const bodyStart = cur.idx + cur.len;
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].idx : raw.length;
    return { title: cur.title, body: raw.slice(bodyStart, bodyEnd).trim() };
  });
  return { sections, trailing: "" };
}

/** 简化 Markdown → React 节点，避免 dangerouslySetInnerHTML。 */
function bodyToNodes(body: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  const flushList = (key: number) => {
    if (listBuf.length === 0) return;
    out.push(
      <ol key={`l-${key}`} className="my-1 list-decimal pl-5 marker:text-gold-400">
        {listBuf.map((item, i) => (
          <li key={i} className="my-1">
            {renderInline(item)}
          </li>
        ))}
      </ol>
    );
    listBuf = [];
  };

  body.split("\n").forEach((line, i) => {
    const ordered = /^\s*(\d+)\.\s+(.*)$/.exec(line);
    if (ordered) {
      listBuf.push(ordered[2]);
      return;
    }
    flushList(i);
    if (line.trim() === "") {
      out.push(<div key={`s-${i}`} className="h-1.5" />);
    } else {
      out.push(
        <p key={`p-${i}`} className="my-1 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList(-1);
  return out;
}

/** 行内 markdown：**bold**、_italic_。 */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|_[^_\n]+?_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={key++} className="text-gold-200">
          {tok.slice(2, -2)}
        </strong>
      );
    } else {
      parts.push(
        <em key={key++} className="not-italic text-cinnabar-400">
          {tok.slice(1, -1)}
        </em>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

export function Interpretation({ question, yaos, benBin, bianBin, autoStart = true }: Props) {
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    setDone(false);
    setText("");

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, yaos, benBin, bianBin }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(errBody?.error || `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("无响应流");

      reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          let parsed: { text?: string; error?: string } | null = null;
          try {
            parsed = JSON.parse(payload);
          } catch {
            continue;
          }
          if (parsed?.error) throw new Error(parsed.error);
          if (parsed?.text) setText((t) => t + parsed.text);
        }
      }
      setDone(true);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message || "未知错误");
    } finally {
      try {
        reader?.releaseLock();
      } catch {
        /* already released */
      }
      setRunning(false);
    }
  };

  useEffect(() => {
    if (autoStart) start();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { sections, trailing } = useMemo(() => parseSections(text), [text]);

  return (
    <section className="scroll-card-elevated relative overflow-hidden p-6 md:p-8">
      <span className="absolute -top-3 left-6 rounded-md border border-cinnabar-500/40 bg-gradient-to-br from-cinnabar-700/40 to-cinnabar-800/40 px-3 py-1 font-display text-xs tracking-[0.3em] text-gold-100">
        AI 解卦
      </span>

      <header className="mb-5 mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-gold-200">解卦师正在落笔</h2>
          <p className="mt-1 text-xs text-ink-300">
            DeepSeek + 周易·十翼 经学知识库 · 朱子断卦法
          </p>
        </div>
        {!running && (done || error) && (
          <button onClick={start} className="btn-ghost btn-sm" type="button">
            重新解卦
          </button>
        )}
        {running && (
          <button onClick={() => abortRef.current?.abort()} className="btn-ghost btn-sm" type="button">
            中止
          </button>
        )}
      </header>

      {error && (
        <div className="rounded-md border border-cinnabar-500/40 bg-cinnabar-700/15 px-4 py-3 text-sm text-cinnabar-300">
          解卦失败：{error}
          <button onClick={start} className="ml-3 underline">
            重试
          </button>
        </div>
      )}

      {!error && sections.length === 0 && !done && (
        <SkeletonInterpretation streaming={running} trailing={trailing} />
      )}

      {sections.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((s, i) => (
            <SectionCard key={i} index={i} section={s} streaming={running && i === sections.length - 1} />
          ))}
        </div>
      )}

      {!running && done && sections.length > 0 && (
        <p className="mt-6 text-center text-[11px] text-ink-400">
          ✦ 解读由 AI 生成，仅供参考与反思。 ✦
        </p>
      )}
    </section>
  );
}

const SECTION_ICON = ["☰", "★", "☷", "✦"];

const SectionCard = memo(function SectionCard({
  section,
  index,
  streaming,
}: {
  section: Section;
  index: number;
  streaming: boolean;
}) {
  const nodes = useMemo(() => bodyToNodes(section.body), [section.body]);
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("scroll-card border border-gold-500/15 p-4", index === 1 && "md:col-span-2")}
    >
      <header className="mb-2 flex items-center gap-2">
        <span className="font-display text-lg text-cinnabar-400">{SECTION_ICON[index] ?? "❉"}</span>
        <h3 className="font-display text-base text-gold-200">{section.title}</h3>
      </header>
      <div className="prose-custom text-sm">{nodes}</div>
      {streaming && <span className="mt-2 inline-block h-3 w-2 animate-pulse bg-gold-400" />}
    </motion.article>
  );
});

function SkeletonInterpretation({ streaming, trailing }: { streaming: boolean; trailing: string }) {
  if (trailing) {
    return (
      <div className="prose-custom whitespace-pre-wrap text-sm">
        {trailing}
        {streaming && <span className="ml-1 inline-block h-3 w-2 animate-pulse bg-gold-400" />}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="shimmer-text font-display text-sm tracking-widest">研墨 · 落笔 · 推演 ...</p>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-md border border-ink-700/40 bg-ink-900/30 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-gradient-to-r from-ink-700 to-ink-800" />
            <div className="h-2.5 w-full animate-pulse rounded bg-ink-800/70" />
            <div className="h-2.5 w-5/6 animate-pulse rounded bg-ink-800/70" />
            <div className="h-2.5 w-4/6 animate-pulse rounded bg-ink-800/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
