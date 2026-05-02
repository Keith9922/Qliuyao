"use client";

import { motion } from "framer-motion";
import { POSITION_NAME, type FullAnalysis } from "@/lib/analysis";
import { cn } from "@/lib/utils";

/**
 * 卦象解析面板：当位 / 中正 / 应位 / 承乘 一站式可视化。
 *
 * 把三千年来易学家用文字讲的爻位关系，做成可视化卡片。
 */
interface Props {
  analysis: FullAnalysis;
  changing?: number[];
}

export function StructureAnalysis({ analysis, changing = [] }: Props) {
  return (
    <div className="space-y-4">
      <PositionSection analysis={analysis} changing={changing} />
      <CorrespondenceSection analysis={analysis} />
      <NeighborSection analysis={analysis} />
    </div>
  );
}

function PositionSection({ analysis, changing = [] }: Props) {
  // 自上而下：上爻在顶
  const order = [...analysis.positions].slice().reverse();
  return (
    <div className="scroll-card p-5">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="font-display text-base text-gold-200">爻位 · 当位 · 中正</h4>
          <p className="text-[12px] text-ink-300">
            阳爻须居阳位（初/三/五），阴爻须居阴位（二/四/上）；二、五爻为中位
          </p>
        </div>
      </header>

      <div className="space-y-1.5">
        {order.map((p) => {
          const isChanging = changing.includes(p.index);
          return (
            <motion.div
              key={p.index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: (5 - p.index) * 0.05 }}
              className={cn(
                "grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 rounded-md border px-3 py-2 text-sm",
                p.zhongZheng
                  ? "border-gold-400/40 bg-gold-700/10"
                  : p.dangWei
                    ? "border-ink-600/60 bg-ink-900/40"
                    : "border-cinnabar-500/30 bg-cinnabar-700/5",
                isChanging && "ring-1 ring-cinnabar-500/40"
              )}
            >
              <span className="w-12 font-display text-sm text-gold-300">{p.label}</span>
              <span className="font-serif text-ink-200">
                <YaoMini isYang={p.isYang} small />
                <span className="ml-2 text-ink-300">在</span>
                <span className="ml-1 text-ink-200">
                  {POSITION_NAME[p.index]}{p.positionIsYang ? "（阳）" : "（阴）"}
                </span>
                <span className="ml-1 text-ink-300">位</span>
              </span>
              <Tag
                kind={p.dangWei ? "good" : "bad"}
                label={p.dangWei ? "当位" : "不当位"}
              />
              {p.zhongWei && (
                <Tag kind={p.zhongZheng ? "great" : "neutral"} label={p.zhongZheng ? "中正" : "中位"} />
              )}
              {!p.zhongWei && <span />}
              {isChanging ? (
                <Tag kind="warning" label="动爻" />
              ) : (
                <span />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CorrespondenceSection({ analysis }: { analysis: FullAnalysis }) {
  return (
    <div className="scroll-card p-5">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="font-display text-base text-gold-200">应位关系</h4>
          <p className="text-[12px] text-ink-300">
            初-四 / 二-五 / 三-上 三对：阴阳相对则有应（顺），同性则敌应（阻）
          </p>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-3">
        {analysis.correspondences.map((c, i) => {
          const lo = analysis.positions[c.pair[0]];
          const hi = analysis.positions[c.pair[1]];
          const good = c.relation === "有应";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-md border px-3 py-3 text-center",
                good
                  ? "border-gold-400/40 bg-gold-700/10"
                  : "border-ink-700/60 bg-ink-900/40"
              )}
            >
              <div className="mb-1 flex items-center justify-center gap-3 text-xs text-ink-300">
                <span>{c.labels[0]}</span>
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <line
                    x1="2"
                    y1="6"
                    x2="18"
                    y2="6"
                    stroke={good ? "#edc44e" : "#7a5a25"}
                    strokeWidth="1.5"
                    strokeDasharray={good ? "" : "2 2"}
                  />
                  <polygon
                    points="14,2 18,6 14,10"
                    fill={good ? "#edc44e" : "#7a5a25"}
                  />
                </svg>
                <span>{c.labels[1]}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-sm">
                <YaoMini isYang={lo.isYang} small />
                <span className="text-ink-400">/</span>
                <YaoMini isYang={hi.isYang} small />
              </div>
              <div className={cn("mt-1.5 text-xs font-display", good ? "text-gold-300" : "text-cinnabar-400")}>
                {c.relation}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-400">{c.description}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NeighborSection({ analysis }: { analysis: FullAnalysis }) {
  return (
    <div className="scroll-card p-5">
      <header className="mb-3">
        <h4 className="font-display text-base text-gold-200">承乘关系</h4>
        <p className="text-[11px] text-ink-300">
          相邻两爻：阴在阳下为承（柔顺），阴在阳上为乘（逆位），同性为比
        </p>
      </header>

      <div className="space-y-1.5">
        {[...analysis.neighbors].slice().reverse().map((n) => {
          const map = {
            承: { color: "border-gold-400/40 bg-gold-700/10", txt: "text-gold-300" },
            乘: { color: "border-cinnabar-500/30 bg-cinnabar-700/10", txt: "text-cinnabar-400" },
            比: { color: "border-ink-700/60 bg-ink-900/40", txt: "text-ink-300" },
          } as const;
          const m = map[n.relation];
          return (
            <div
              key={`${n.pair[0]}-${n.pair[1]}`}
              className={cn(
                "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
                m.color
              )}
            >
              <span className="font-display text-xs text-ink-200">
                {n.labels[1]} <span className="mx-1 text-ink-400">↑</span> {n.labels[0]}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn("font-display text-sm", m.txt)}>{n.relation}</span>
                <span className="text-[11px] text-ink-400">{n.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YaoMini({ isYang, small }: { isYang: boolean; small?: boolean }) {
  const w = small ? 28 : 40;
  const h = small ? 6 : 8;
  if (isYang) {
    return (
      <span
        className="inline-block rounded-sm bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500"
        style={{ width: w, height: h }}
      />
    );
  }
  const half = (w - 4) / 2;
  return (
    <span className="inline-flex items-center gap-1 align-middle" style={{ width: w }}>
      <span className="block rounded-sm bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: half, height: h }} />
      <span className="block rounded-sm bg-gradient-to-r from-gold-300 to-gold-500" style={{ width: half, height: h }} />
    </span>
  );
}

function Tag({ kind, label }: { kind: "good" | "great" | "bad" | "warning" | "neutral"; label: string }) {
  const map = {
    good: "border-gold-500/40 bg-gold-600/10 text-gold-200",
    great: "border-gold-300/60 bg-gold-500/15 text-gold-100 font-semibold",
    bad: "border-cinnabar-500/40 bg-cinnabar-700/15 text-cinnabar-400",
    warning: "border-cinnabar-400/40 bg-cinnabar-600/15 text-cinnabar-300",
    neutral: "border-ink-600/60 bg-ink-800/40 text-ink-200",
  };
  return (
    <span className={cn("rounded border px-2 py-0.5 font-display text-[10px] tracking-widest", map[kind])}>
      {label}
    </span>
  );
}
