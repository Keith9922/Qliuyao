"use client";

import { motion } from "framer-motion";
import { useId } from "react";

/**
 * 三比特 H 门 + 测量门量子电路 SVG。
 *
 * 单一可视化源 —— 起卦页与量子科普页都基于这个组件。
 * 通过 `size` 控制尺寸预设；`measuring` / `result` 驱动测量动画与坍缩。
 */

export type CircuitSize = "compact" | "wide";

interface Props {
  size?: CircuitSize;
  /** 当前测量结果，例如 "010"。null 表示尚未测量。 */
  result: string | null;
  /** 测量进行中（用于发光与脉冲） */
  measuring?: boolean;
  /** 顶部小标题；compact 不显示 */
  title?: string;
}

const PRESETS: Record<
  CircuitSize,
  {
    width: number;
    height: number;
    laneYs: [number, number, number];
    hadamardX: number;
    measureX: number;
    classicalEndX: number;
    showTitle: boolean;
    gateW: number;
    gateH: number;
    fontGate: number;
    labelFont: number;
  }
> = {
  compact: {
    width: 480,
    height: 180,
    laneYs: [40, 90, 140],
    hadamardX: 140,
    measureX: 340,
    classicalEndX: 440,
    showTitle: false,
    gateW: 48,
    gateH: 44,
    fontGate: 20,
    labelFont: 11,
  },
  wide: {
    width: 720,
    height: 220,
    laneYs: [60, 110, 160],
    hadamardX: 190,
    measureX: 440,
    classicalEndX: 690,
    showTitle: true,
    gateW: 60,
    gateH: 52,
    fontGate: 22,
    labelFont: 13,
  },
};

export function CircuitSVG({ size = "compact", result, measuring = false, title }: Props) {
  const cfg = PRESETS[size];
  const filterId = useId();
  const wireId = `${filterId}-wire`;
  const gateId = `${filterId}-gate`;
  const glowId = `${filterId}-glow`;

  return (
    <svg viewBox={`0 0 ${cfg.width} ${cfg.height}`} className="h-auto w-full" role="img" aria-label="量子电路图">
      <defs>
        <linearGradient id={wireId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475bff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#92aeff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#475bff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={gateId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252fc0" />
          <stop offset="100%" stopColor="#141968" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation={size === "wide" ? "4" : "3"} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {cfg.showTitle && (
        <text
          x={cfg.width / 2}
          y={20}
          fill="#a07e3c"
          fontFamily="JetBrains Mono"
          fontSize="10"
          textAnchor="middle"
          letterSpacing="3"
        >
          {title ?? "Quantum Circuit · H⊗H⊗H + Single-shot Measurement"}
        </text>
      )}

      {cfg.laneYs.map((y, i) => (
        <g key={`lane-${i}`}>
          <text x={size === "wide" ? 20 : 10} y={y + 5} fill="#ece5d4" fontFamily="JetBrains Mono" fontSize="14">
            q<tspan baselineShift="sub" fontSize="9">{i}</tspan>
          </text>
          <text
            x={size === "wide" ? 20 : 10}
            y={y + 22}
            fill="#a07e3c"
            fontFamily="JetBrains Mono"
            fontSize="9"
          >
            |0⟩
          </text>
          <line
            x1={size === "wide" ? 62 : 48}
            y1={y}
            x2={cfg.width - (size === "wide" ? 80 : 48)}
            y2={y}
            stroke={`url(#${wireId})`}
            strokeWidth="2"
          />
        </g>
      ))}

      {cfg.laneYs.map((y, i) => (
        <g key={`h-${i}`} transform={`translate(${cfg.hadamardX}, ${y})`}>
          <motion.rect
            x={-cfg.gateW / 2}
            y={-cfg.gateH / 2}
            width={cfg.gateW}
            height={cfg.gateH}
            rx={4}
            fill={`url(#${gateId})`}
            stroke="#92aeff"
            strokeWidth="1.5"
            filter={measuring && !result ? `url(#${glowId})` : undefined}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
          />
          <text
            x={0}
            y={6}
            fill="#dee9ff"
            textAnchor="middle"
            fontFamily="JetBrains Mono"
            fontSize={cfg.fontGate}
            fontWeight="600"
          >
            H
          </text>
        </g>
      ))}

      {cfg.laneYs.map((y, i) => {
        const measured = !!result;
        const bit = result?.[i];
        return (
          <g key={`m-${i}`} transform={`translate(${cfg.measureX}, ${y})`}>
            <motion.rect
              x={-cfg.gateW / 2}
              y={-cfg.gateH / 2}
              width={cfg.gateW}
              height={cfg.gateH}
              rx={4}
              fill={measured ? "#3d2c14" : "#1c2390"}
              stroke={measured ? "#edc44e" : "#92aeff"}
              strokeWidth="1.5"
              filter={measuring ? `url(#${glowId})` : undefined}
              animate={
                measuring
                  ? { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 1.2, repeat: measuring ? Infinity : 0 }}
            />
            <text
              x={0}
              y={size === "wide" ? 7 : 6}
              fill={measured ? "#edc44e" : "#dee9ff"}
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontSize={size === "wide" ? 20 : 14}
              fontWeight="600"
            >
              {measured && bit ? bit : "M"}
            </text>
          </g>
        );
      })}

      {cfg.laneYs.map((y, i) => (
        <g key={`c-${i}`}>
          <line
            x1={cfg.measureX + cfg.gateW / 2 + 4}
            y1={y - 2}
            x2={cfg.classicalEndX - 14}
            y2={y - 2}
            stroke={result ? "#edc44e" : "#5a401a"}
            strokeWidth="1.2"
          />
          <line
            x1={cfg.measureX + cfg.gateW / 2 + 4}
            y1={y + 2}
            x2={cfg.classicalEndX - 14}
            y2={y + 2}
            stroke={result ? "#edc44e" : "#5a401a"}
            strokeWidth="1.2"
          />
          <text
            x={cfg.classicalEndX - 6}
            y={y + 4}
            fill={result ? "#edc44e" : "#a07e3c"}
            fontFamily="JetBrains Mono"
            fontSize={size === "wide" ? 13 : 11}
            textAnchor="end"
          >
            c<tspan baselineShift="sub" fontSize="8">{i}</tspan>
          </text>
        </g>
      ))}

      <text
        x={cfg.hadamardX}
        y={cfg.height - 15}
        fill="#a07e3c"
        fontFamily="Noto Serif SC"
        fontSize={cfg.labelFont}
        textAnchor="middle"
      >
        Hadamard 门
      </text>
      <text
        x={cfg.measureX}
        y={cfg.height - 15}
        fill="#a07e3c"
        fontFamily="Noto Serif SC"
        fontSize={cfg.labelFont}
        textAnchor="middle"
      >
        测量门
      </text>
    </svg>
  );
}
