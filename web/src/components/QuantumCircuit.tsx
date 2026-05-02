"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  /** 当前是哪一爻（1..6），0 表示尚未开始 */
  step: number;
  /** 当前爻的测量结果 "010" 之类，未测量时为 null */
  result: string | null;
  /** 是否在测量中 */
  measuring: boolean;
}

/**
 * 量子电路示意图：三比特 H 门 + 测量。
 *
 *   q0 ─── H ───┤M├──→ c0
 *   q1 ─── H ───┤M├──→ c1
 *   q2 ─── H ───┤M├──→ c2
 *
 * 配合 step + result + measuring 状态绘制不同高亮。
 */
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
          <span className="mx-1 font-display text-2xl text-gold-200">
            {step === 0 ? "—" : step}
          </span>
          <span className="text-xs tracking-widest text-ink-300">爻</span>
          <p className="text-[10px] tracking-[0.25em] text-ink-400">/ 共 6 爻</p>
        </div>
      </div>

      <CircuitSVG measuring={measuring} result={result} active={step > 0} />

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
        {["c0", "c1", "c2"].map((label, i) => (
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
                    result[i] === "1"
                      ? "font-bold text-quantum-300"
                      : "font-bold text-cinnabar-400"
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

function CircuitSVG({
  measuring,
  result,
  active,
}: {
  measuring: boolean;
  result: string | null;
  active: boolean;
}) {
  const W = 480;
  const H = 180;
  const lanes = [40, 90, 140];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="qwire-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475bff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#92aeff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#475bff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="qgate-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252fc0" />
          <stop offset="100%" stopColor="#141968" />
        </linearGradient>
        <filter id="qglow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 三条量子比特线 */}
      {lanes.map((y, i) => (
        <g key={i}>
          {/* 标签 q0/q1/q2 */}
          <text
            x={10}
            y={y + 5}
            fill="#ece5d4"
            fontFamily="JetBrains Mono"
            fontSize="14"
          >
            q<tspan baselineShift="sub" fontSize="9">{i}</tspan>
          </text>
          <text
            x={10}
            y={y + 22}
            fill="#a07e3c"
            fontFamily="JetBrains Mono"
            fontSize="9"
          >
            |0⟩
          </text>
          {/* 主线 */}
          <line
            x1={48}
            y1={y}
            x2={W - 48}
            y2={y}
            stroke="url(#qwire-grad)"
            strokeWidth="2"
          />
        </g>
      ))}

      {/* H 门 */}
      {lanes.map((y, i) => (
        <g key={`h-${i}`} transform={`translate(140, ${y})`}>
          <motion.rect
            x={-24}
            y={-22}
            width={48}
            height={44}
            rx={4}
            fill="url(#qgate-grad)"
            stroke="#92aeff"
            strokeWidth="1.5"
            filter={active && !result ? "url(#qglow)" : undefined}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          />
          <text
            x={0}
            y={6}
            fill="#dee9ff"
            textAnchor="middle"
            fontFamily="JetBrains Mono"
            fontSize="20"
            fontWeight="600"
          >
            H
          </text>
        </g>
      ))}

      {/* 测量门 */}
      {lanes.map((y, i) => {
        const measured = !!result;
        const collapsedBit = result?.[i];
        return (
          <g key={`m-${i}`} transform={`translate(340, ${y})`}>
            <motion.rect
              x={-24}
              y={-22}
              width={48}
              height={44}
              rx={4}
              fill={measured ? "#3d2c14" : "#1c2390"}
              stroke={measured ? "#edc44e" : "#92aeff"}
              strokeWidth="1.5"
              filter={measuring ? "url(#qglow)" : undefined}
              animate={
                measuring
                  ? { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 1.2, repeat: measuring ? Infinity : 0 }}
            />
            <text
              x={0}
              y={6}
              fill={measured ? "#edc44e" : "#dee9ff"}
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontSize="14"
              fontWeight="600"
            >
              {measured && collapsedBit ? collapsedBit : "M"}
            </text>
          </g>
        );
      })}

      {/* 经典寄存器线（双线） */}
      {lanes.map((y, i) => (
        <g key={`c-${i}`}>
          <line
            x1={364}
            y1={y - 1.5}
            x2={W - 14}
            y2={y - 1.5}
            stroke={result ? "#edc44e" : "#5a401a"}
            strokeWidth="1"
          />
          <line
            x1={364}
            y1={y + 1.5}
            x2={W - 14}
            y2={y + 1.5}
            stroke={result ? "#edc44e" : "#5a401a"}
            strokeWidth="1"
          />
          <text
            x={W - 8}
            y={y + 4}
            fill={result ? "#edc44e" : "#a07e3c"}
            fontFamily="JetBrains Mono"
            fontSize="11"
            textAnchor="end"
          >
            c<tspan baselineShift="sub" fontSize="8">{i}</tspan>
          </text>
        </g>
      ))}

      {/* 标注 */}
      <text x={140} y={170} fill="#a07e3c" fontFamily="Noto Serif SC" fontSize="11" textAnchor="middle">
        Hadamard 门
      </text>
      <text x={340} y={170} fill="#a07e3c" fontFamily="Noto Serif SC" fontSize="11" textAnchor="middle">
        测量
      </text>
    </svg>
  );
}
