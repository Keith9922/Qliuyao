"use client";

import { motion } from "framer-motion";
import { HexagramGlyph } from "./HexagramGlyph";
import type { Hexagram } from "@/lib/hexagrams";
import type { Trigram } from "@/lib/trigrams";

type Variant = "ben" | "bian" | "plain";

interface Props {
  binary: string;
  hex: Hexagram;
  lower: Trigram;
  upper: Trigram;
  changing?: number[];
  variant?: Variant;
  animate?: boolean;
}

const VARIANT_TAG: Record<Variant, { label: string; classes: string } | null> = {
  ben: {
    label: "本卦",
    classes: "from-gold-600/40 to-gold-800/40 text-gold-200 border-gold-500/40",
  },
  bian: {
    label: "变卦",
    classes: "from-quantum-700/40 to-quantum-900/40 text-quantum-200 border-quantum-500/40",
  },
  plain: null,
};

export function HexagramCard({
  binary,
  hex,
  lower,
  upper,
  changing = [],
  variant = "ben",
  animate = true,
}: Props) {
  const variantTag = VARIANT_TAG[variant];

  return (
    <motion.div
      className="scroll-card-elevated stamp-border relative flex flex-col gap-4 p-6"
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {variantTag && (
        <span
          className={`absolute -top-3 left-6 rounded-md border bg-gradient-to-br px-3 py-1 font-display text-xs tracking-[0.3em] ${variantTag.classes}`}
        >
          {variantTag.label}
        </span>
      )}

      <div className="mt-2 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl text-gold-200">{hex.symbol}</span>
            <span className="font-display text-3xl text-gold-100">{hex.name}</span>
          </div>
          <p className="mt-1 text-sm text-ink-300">
            <span className="font-mono">No.{hex.num}</span>
            <span className="mx-2 text-ink-400">·</span>
            <span className="italic">{hex.pinyin}</span>
            <span className="mx-2 text-ink-400">·</span>
            <span>
              上{upper.name}
              <span className="mx-1 text-ink-400">{upper.symbol}</span>下{lower.name}
              <span className="mx-1 text-ink-400">{lower.symbol}</span>
            </span>
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {upper.element}/{upper.attribute} · {lower.element}/{lower.attribute}
          </p>
        </div>
        <HexagramGlyph binary={binary} changing={changing} size="md" animate={animate} />
      </div>

      <div className="rounded-md border border-gold-500/20 bg-ink-900/40 px-4 py-3">
        <p className="mb-1 font-display text-xs tracking-widest text-gold-400">卦辞</p>
        <p className="font-serif text-base leading-relaxed text-ink-100">{hex.judgment}</p>
      </div>

      {hex.tuan && (
        <div className="rounded-md border border-ink-700/60 bg-ink-900/30 px-4 py-3">
          <p className="mb-1 font-display text-xs tracking-widest text-gold-400">彖传</p>
          <p className="font-serif text-sm leading-relaxed text-ink-200">{hex.tuan}</p>
        </div>
      )}

      {hex.daXiang && (
        <div className="rounded-md border border-ink-700/60 bg-ink-900/30 px-4 py-3">
          <p className="mb-1 font-display text-xs tracking-widest text-gold-400">大象传</p>
          <p className="font-serif text-sm leading-relaxed text-ink-200">{hex.daXiang}</p>
        </div>
      )}

      <div>
        <p className="mb-2 font-display text-xs tracking-widest text-gold-400">六爻爻辞</p>
        <ul className="space-y-1.5 font-serif text-sm leading-relaxed">
          {[...hex.lines].reverse().map((line, revIdx) => {
            const idx = 5 - revIdx; // 自上而下显示
            const isChanging = changing.includes(idx);
            return (
              <li
                key={idx}
                className={`flex gap-2 rounded px-2 py-1.5 ${
                  isChanging
                    ? "bg-cinnabar-700/15 ring-1 ring-cinnabar-500/30 text-ink-100"
                    : "text-ink-200"
                }`}
              >
                <span className="shrink-0 text-cinnabar-400">{isChanging ? "★" : "·"}</span>
                <span>{line}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {hex.extra && (
        <div className="rounded-md border border-cinnabar-500/30 bg-cinnabar-700/10 px-4 py-3">
          <p className="mb-1 font-display text-xs tracking-widest text-cinnabar-400">用</p>
          <p className="font-serif text-sm leading-relaxed text-ink-100">{hex.extra}</p>
        </div>
      )}
    </motion.div>
  );
}
