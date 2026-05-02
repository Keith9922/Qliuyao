"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { QuantumCircuit } from "./QuantumCircuit";
import { HexagramCard } from "./HexagramCard";
import { StructureAnalysis } from "./StructureAnalysis";
import { DerivedHexagrams } from "./DerivedHexagrams";
import { Interpretation } from "./Interpretation";
import { saveHistory } from "@/lib/history";
import { ArrowRight, ArrowLeft, Copy, Check, Taiji } from "./Icon";
import { Reveal } from "./Reveal";
import { POSITION_NAME } from "@/lib/analysis";
import type { Yao } from "@/lib/quantum";
import type { DivineResult } from "@/lib/types";

type Phase = "ask" | "casting" | "results";

const SUGGESTIONS = [
  "我是不是该接这个新的工作机会？",
  "这段感情还要继续走下去吗？",
  "现在是不是搬家的好时机？",
  "我应该把存款投进这个项目吗？",
  "我该如何看待最近的这次冲突？",
];

export function DivinationFlow() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState(0);
  const [measuring, setMeasuring] = useState(false);
  const [currentMeasure, setCurrentMeasure] = useState<string | null>(null);
  const [revealedYaos, setRevealedYaos] = useState<Yao[]>([]);
  const [result, setResult] = useState<DivineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const cast = async () => {
    if (!question.trim()) return;
    setError(null);
    setPhase("casting");
    setStep(0);
    setCurrentMeasure(null);
    setResult(null);
    setRevealedYaos([]);

    // 先拿到 API 返回（含真实测量结果），再做"逐爻揭示"动画
    let data: DivineResult;
    try {
      const r = await fetch("/api/divine", { method: "POST" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      data = (await r.json()) as DivineResult;
    } catch (e) {
      setError((e as Error).message || "起卦失败");
      setPhase("ask");
      return;
    }

    // 用真实结果做六次"测量动画"——视觉上是一爻一爻揭开
    for (let i = 0; i < 6; i++) {
      setStep(i + 1);
      setMeasuring(true);
      setCurrentMeasure(null);
      await new Promise((res) => setTimeout(res, 520));
      // 把这一爻的真实 bitstring 放进电路图
      setCurrentMeasure(data.yaos[i].bitstring);
      setMeasuring(false);
      // 加入到已揭示爻列表
      setRevealedYaos((prev) => [...prev, data.yaos[i]]);
      await new Promise((res) => setTimeout(res, 320));
    }

    setResult(data);
    setPhase("results");
    saveHistory({
      id: data.castAt,
      castAt: data.castAt,
      question,
      benName: data.ben.hex.name,
      benSymbol: data.ben.hex.symbol,
      benBinary: data.ben.binary,
      bianName: data.bian?.hex.name,
      bianBinary: data.bian?.binary,
      moving: data.moving,
    });
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const reset = () => {
    setPhase("ask");
    setQuestion("");
    setResult(null);
    setStep(0);
    setCurrentMeasure(null);
    setRevealedYaos([]);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto max-w-3xl"
          >
            <AskCard
              question={question}
              setQuestion={setQuestion}
              onCast={cast}
              error={error}
            />
          </motion.div>
        )}

        {phase === "casting" && (
          <motion.div
            key="casting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-3xl"
          >
            <CastingCard
              question={question}
              step={step}
              measuring={measuring}
              measure={currentMeasure}
              revealedYaos={revealedYaos}
            />
          </motion.div>
        )}

        {phase === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            ref={resultsRef}
          >
            <ResultsHeader question={question} onReset={reset} result={result} />

            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <HexagramCard
                binary={result.ben.binary}
                hex={result.ben.hex}
                lower={result.ben.lower}
                upper={result.ben.upper}
                changing={result.moving}
                variant="ben"
              />
              {result.bian ? (
                <HexagramCard
                  binary={result.bian.binary}
                  hex={result.bian.hex}
                  lower={result.bian.lower}
                  upper={result.bian.upper}
                  changing={[]}
                  variant="bian"
                />
              ) : (
                <NoChangeCard rule={result.rule} />
              )}
            </div>

            <Reveal>
              <Interpretation
                question={question}
                yaos={result.yaos}
                benBin={result.ben.binary}
                bianBin={result.bian?.binary || result.ben.binary}
                autoStart
              />
            </Reveal>

            <Reveal delay={0.05}>
              <SectionHeader
                title="卦象解析"
                subtitle="当位 · 中正 · 应位 · 承乘"
              />
              <StructureAnalysis analysis={result.ben.analysis} changing={result.moving} />
            </Reveal>

            <Reveal delay={0.1}>
              <SectionHeader
                title="衍生卦"
                subtitle="互 · 错 · 综"
              />
              <DerivedHexagrams
                hu={result.derived.hu}
                cuo={result.derived.cuo}
                zong={result.derived.zong}
              />
            </Reveal>

            <Footer onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AskCard({
  question,
  setQuestion,
  onCast,
  error,
}: {
  question: string;
  setQuestion: (q: string) => void;
  onCast: () => void;
  error: string | null;
}) {
  const len = question.length;
  const max = 200;
  return (
    <div className="scroll-card-elevated stamp-border space-y-4 p-7 md:p-9">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-cinnabar-400">DIVINATION · 起卦</p>
        <h2 className="mt-2 font-display text-2xl text-gold-200 md:text-3xl">
          把心里的事写下来
        </h2>
        <p className="mt-1.5 font-serif text-sm italic text-ink-300">
          「寂然不动，感而遂通」 ——《系辞》
        </p>
      </div>

      <div className="relative">
        <textarea
          aria-label="求问内容"
          value={question}
          onChange={(e) => setQuestion(e.target.value.slice(0, max))}
          placeholder="例如：我应该接这个新项目吗？"
          rows={3}
          className="w-full resize-none rounded-md border border-ink-600/60 bg-ink-900/60 px-4 py-3 font-serif text-base leading-relaxed text-ink-100 placeholder:text-ink-400 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
          maxLength={max}
        />
        <span className="absolute bottom-2 right-3 font-mono text-[10px] text-ink-400">
          {len} / {max}
        </span>
      </div>

      <div>
        <p className="mb-2 text-[11px] tracking-widest text-ink-400">参考问句</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuestion(s)}
              type="button"
              className="min-h-[36px] rounded-full border border-ink-600/50 bg-ink-900/40 px-3.5 py-1.5 text-[13px] leading-snug text-ink-200 transition hover:border-gold-500/40 hover:bg-ink-800/40 hover:text-gold-200 focus-visible:border-gold-500/60"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-700/40 pt-4 md:flex-row">
        <p className="text-[11px] text-ink-400">
          量子电路 · 6 次 H<sup>⊗3</sup> + 单 shot 测量
        </p>
        <button
          type="button"
          className="btn-primary group"
          onClick={onCast}
          disabled={!question.trim()}
        >
          <span>起 · 卦</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-cinnabar-500/40 bg-cinnabar-700/15 px-4 py-3 text-sm text-cinnabar-300">
          {error}
        </div>
      )}
    </div>
  );
}

function CastingCard({
  question,
  step,
  measuring,
  measure,
  revealedYaos,
}: {
  question: string;
  step: number;
  measuring: boolean;
  measure: string | null;
  revealedYaos: Yao[];
}) {
  // 用已揭示的爻 + 还没揭示的占位，构造目前可见的卦象
  const visible = Array.from({ length: 6 }, (_, i) => revealedYaos[i] ?? null);
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px]">
      <div className="space-y-5 md:order-1 order-2">
        <div className="scroll-card p-5">
          <p className="text-xs text-ink-300">求问</p>
          <p className="mt-1 font-serif text-base text-ink-100">{question}</p>
        </div>

        <QuantumCircuit step={step} result={measure} measuring={measuring} />

        <div className="rounded-md border border-quantum-700/30 bg-quantum-900/20 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-quantum-200">摇卦中 · 第 {step} / 6 次</p>
            <p className="font-mono text-[11px] text-ink-400">|+⟩ → |k⟩</p>
          </div>
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  i < step
                    ? "bg-gold-400"
                    : i === step - 1
                      ? "animate-pulse bg-gold-400"
                      : "bg-ink-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-card-elevated stamp-border order-1 flex flex-col items-center justify-start gap-4 p-6 md:order-2">
        <p className="font-display text-xs tracking-[0.3em] text-gold-300">CAST IN PROGRESS</p>
        <p className="text-[10px] text-ink-300">自下而上 · 初爻 → 上爻</p>

        <div className="my-2 flex w-full flex-col-reverse gap-1.5">
          {visible.map((y, i) => (
            <YaoSlot key={i} yao={y} index={i} pending={step <= i} />
          ))}
        </div>

        <p className="text-center text-[11px] text-ink-300">
          {revealedYaos.length === 6
            ? "✓ 卦象已成，正在分析…"
            : `已成 ${revealedYaos.length} / 6 爻`}
        </p>
      </div>
    </div>
  );
}

function YaoSlot({
  yao,
  index,
  pending,
}: {
  yao: Yao | null;
  index: number;
  pending: boolean;
}) {
  const posName = POSITION_NAME[index];
  if (!yao) {
    return (
      <div
        className={`flex items-center gap-3 rounded-md border border-ink-700/40 bg-ink-900/30 px-3 py-2 text-xs ${
          pending ? "opacity-30" : "opacity-100"
        }`}
      >
        <span className="w-6 text-ink-400">{posName}</span>
        <span className="font-mono text-ink-500">| ? ⟩</span>
        <span className="ml-auto text-ink-500">未测</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex items-center gap-3 rounded-md border px-3 py-2 text-xs ${
        yao.isChanging
          ? "border-cinnabar-500/40 bg-cinnabar-700/15"
          : "border-gold-500/30 bg-gold-700/10"
      }`}
    >
      <span className="w-6 font-display text-gold-300">{posName}</span>
      <span className="font-mono text-quantum-200">|{yao.bitstring}⟩</span>
      <span className="font-display text-gold-200">{yao.name}</span>
      {yao.isChanging && (
        <span className="ml-auto rounded border border-cinnabar-500/40 px-1.5 py-0.5 font-display text-[9px] text-cinnabar-400">
          动爻
        </span>
      )}
    </motion.div>
  );
}

function ResultsHeader({
  question,
  onReset,
  result,
}: {
  question: string;
  onReset: () => void;
  result: DivineResult;
}) {
  const [copied, setCopied] = useState(false);

  const summary = () => {
    const parts: string[] = [];
    parts.push(`【量子六爻】`);
    parts.push(`求问：${question}`);
    parts.push(`本卦：${result.ben.hex.symbol} ${result.ben.hex.name}（${result.ben.hex.pinyin}）`);
    if (result.bian) {
      parts.push(`变卦：${result.bian.hex.symbol} ${result.bian.hex.name}（${result.bian.hex.pinyin}）`);
    }
    parts.push(
      `动爻：${
        result.moving.length === 0 ? "无" : result.moving.map((i) => `第${i + 1}爻`).join("、")
      }`
    );
    parts.push(`卦辞：${result.ben.hex.judgment}`);
    parts.push(`时间：${new Date(result.castAt).toLocaleString("zh-CN")}`);
    return parts.join("\n");
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="scroll-card-elevated stamp-border flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <p className="text-[11px] tracking-[0.3em] text-cinnabar-400">YOUR HEXAGRAM</p>
        <p className="mt-1 font-serif text-base text-ink-200">{question}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-display text-gold-200">
            {result.ben.hex.symbol} {result.ben.hex.name}
            {result.bian && (
              <>
                <span className="mx-2 text-ink-400">→</span>
                {result.bian.hex.symbol} {result.bian.hex.name}
              </>
            )}
          </span>
          <span className="rounded-md border border-ink-600/60 bg-ink-900/40 px-2.5 py-1 font-mono text-[11px] text-ink-200">
            动爻：{result.moving.length === 0 ? "无" : result.moving.map((i) => `第${i + 1}爻`).join(" · ")}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-ink-400">{result.rule}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 self-start md:self-center">
        <button onClick={onCopy} type="button" className="btn-ghost btn-sm" aria-label="复制卦象摘要">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "已复制" : "复制摘要"}</span>
        </button>
        <button onClick={onReset} type="button" className="btn-ghost btn-sm">
          <ArrowLeft size={14} />
          <span>再起一卦</span>
        </button>
      </div>
    </div>
  );
}

function NoChangeCard({ rule }: { rule: string }) {
  return (
    <div className="scroll-card relative flex flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="absolute -top-3 left-6 rounded-md border border-quantum-500/40 bg-gradient-to-br from-quantum-700/40 to-quantum-900/40 px-3 py-1 font-display text-xs tracking-[0.3em] text-quantum-200">
        无变卦
      </span>
      <span className="grid h-20 w-20 place-items-center rounded-full border border-gold-500/30 bg-ink-900/60 text-gold-300">
        <Taiji size={32} />
      </span>
      <h3 className="font-display text-xl text-gold-200">六爻皆静</h3>
      <p className="max-w-sm text-sm leading-relaxed text-ink-200">
        本次起卦没有动爻，势态稳定。{rule}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-3">
      <h2 className="font-display text-xl text-gold-200">{title}</h2>
      <p className="text-[12px] tracking-wide text-ink-300">{subtitle}</p>
    </header>
  );
}

function Footer({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-6">
      <button onClick={onReset} type="button" className="btn-primary">
        <span>再起一卦</span>
      </button>
    </div>
  );
}
