"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CircuitSVG } from "./CircuitSVG";

/**
 * 起卦页用的"摇卦中"电路面板：上面 SVG 电路图，下面三比特坍缩状态 + 当前 |ψ⟩ 描述。
 *
 * 电路本身的视觉由 <CircuitSVG size="compact" /> 统一渲染。
 */

interface Props {
  /** 当前是哪一爻（1..6），0 表示尚未开始 */
  step: number;
  /** 当前爻的测量结果 "010" 之类，未测量时为 null */
  result: string | null;
  /** 是否在测量中 */
  measuring: boolean;
}

export function QuantumCircuit({ step, result, measuring }: Props) {
  return (
    <div className="scroll-card overflow-hidden p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base text-gold-300">量子电路</h3>
          <p className="font-mono text-xs text-ink-300">
            H<sup>⊗3</sup> · single-shot measurement
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs tracking-widest text-ink-300">第</span>
          <span className="mx-1 font-display text-2xl text-gold-200">{step === 0 ? "—" : step}</span>
          <span className="text-xs tracking-widest text-ink-300">爻</span>
          <p className="text-[11px] tracking-[0.25em] text-ink-400">/ 共 6 爻</p>
        </div>
      </div>

      <CircuitSVG size="compact" result={result} measuring={measuring} />

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
        {(["c0", "c1", "c2"] as const).map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-md border border-ink-700/50 bg-ink-900/60 px-3 py-2"
          >
            <span className="text-ink-300">{label}</span>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.span
                  key={result[i]}
                  initial={{ opacity: 0, scale: 0.7, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={
                    result[i] === "1" ? "font-bold text-quantum-300" : "font-bold text-cinnabar-400"
                  }
                >
                  |{result[i]}⟩
                </motion.span>
              ) : (
                <motion.span
                  key="superposition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-quantum-300"
                >
                  |+⟩
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-quantum-700/30 bg-quantum-900/20 px-3 py-2 font-mono text-[11px] text-quantum-200">
        {result ? (
          <>
            <span className="text-ink-300">|ψ⟩ → </span>
            <span className="text-gold-200">|{result}⟩</span>
            <span className="text-ink-400"> （波函数已坍缩）</span>
          </>
        ) : measuring ? (
          <span className="shimmer-text">正在测量 · 波函数即将坍缩 ...</span>
        ) : (
          <>
            <span className="text-ink-300">|ψ⟩ = </span>
            (1/√8) ∑<sub>k=0</sub><sup>7</sup> |k⟩
            <span className="text-ink-400"> （八态等概率叠加）</span>
          </>
        )}
      </div>
    </div>
  );
}
