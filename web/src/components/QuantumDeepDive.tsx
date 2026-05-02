"use client";

import { useEffect, useMemo, useState } from "react";
import { castOneYao, classifyYao, type YaoName } from "@/lib/quantum";
import { CircuitSVG } from "./CircuitSVG";

/**
 * 量子电路科普组件：
 *  - 大尺寸 SVG 电路图，配合实时坍缩动画
 *  - 8 种本征态的概率柱状图
 *  - 一个"实测分布"实验：跑 N 次现场展示卡方分布
 */
export function QuantumDeepDive() {
  return (
    <div className="mt-10 space-y-6">
      <CircuitDemo />
      <ProbabilityTable />
      <BatchExperiment />
    </div>
  );
}

type DemoResult = { bits: string; ones: number; name: YaoName };

function CircuitDemo() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);

  const measure = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    const y = castOneYao(0);
    setResult({ bits: y.bitstring, ones: y.ones, name: y.name });
    setRunning(false);
  };

  return (
    <div className="scroll-card-elevated p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div>
          <CircuitSVG size="wide" measuring={running} result={result?.bits ?? null} />
          <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs md:grid-cols-4">
            <KV k="电路深度" v="depth = 2" />
            <KV k="量子比特" v="3 qubits" />
            <KV k="叠加态数" v="2³ = 8" />
            <KV k="单态概率" v="1/8 ≈ 12.5%" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-md border border-quantum-700/30 bg-quantum-900/30 p-4">
            <p className="font-display text-sm text-quantum-200">|ψ⟩ 在测量前</p>
            <p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-ink-200">
              (|0⟩+|1⟩)/√2<br />⊗ (|0⟩+|1⟩)/√2<br />⊗ (|0⟩+|1⟩)/√2
            </p>
            <p className="mt-2 text-[11px] text-ink-300">
              展开后是 8 项等幅叠加：
              |000⟩ + |001⟩ + |010⟩ + |011⟩ + |100⟩ + |101⟩ + |110⟩ + |111⟩
              （未归一化）。
            </p>
          </div>

          {result ? (
            <div className="rounded-md border border-gold-500/30 bg-gold-700/10 p-4">
              <p className="font-display text-sm text-gold-200">坍缩到</p>
              <p className="mt-1 font-mono text-2xl text-gold-100">|{result.bits}⟩</p>
              <p className="mt-1 text-[11px] text-ink-300">
                数 1 的个数 = {result.ones} → <span className="text-cinnabar-400 font-display">{result.name}</span>
              </p>
            </div>
          ) : running ? (
            <div className="rounded-md border border-quantum-500/40 bg-quantum-700/15 p-4 text-center">
              <p className="shimmer-text font-display text-sm">正在测量 ...</p>
            </div>
          ) : (
            <div className="rounded-md border border-ink-600 bg-ink-900/40 p-4 text-center text-[11px] text-ink-400">
              点击下方按钮，运行一次测量
            </div>
          )}

          <button onClick={measure} disabled={running} className="btn-primary text-sm">
            {running ? "测量中..." : "▶ 运行电路（单 shot）"}
          </button>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-ink-700/60 bg-ink-900/40 px-3 py-2">
      <p className="text-[10px] tracking-widest text-ink-400">{k}</p>
      <p className="mt-0.5 text-gold-200">{v}</p>
    </div>
  );
}

const STATE_LABELS = ["000", "001", "010", "011", "100", "101", "110", "111"];

function ProbabilityTable() {
  return (
    <div className="scroll-card p-6">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-gold-200">8 种本征态的理论概率</h3>
          <p className="text-[11px] text-ink-300">
            H⊗H⊗H 后每个本征态振幅 1/√8，测量概率均为 1/8 ≈ 12.5%
          </p>
        </div>
        <span className="font-mono text-xs text-quantum-300">|ψ⟩ = (1/√8) Σ |k⟩</span>
      </header>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {STATE_LABELS.map((s, i) => {
          const meta = classifyYao(i, 0);
          const isChange = meta.isChanging;
          return (
            <div key={s} className="rounded-md border border-ink-700/60 bg-ink-900/40 p-3 text-center">
              <p className="font-mono text-xs text-ink-200">|{s}⟩</p>
              <div className="my-2 mx-auto h-12 w-3 rounded-full bg-gradient-to-t from-quantum-700 to-quantum-300" />
              <p className="text-[10px] text-ink-400">12.5%</p>
              <p className={`mt-1 font-display text-[11px] ${isChange ? "text-cinnabar-400" : "text-gold-300"}`}>
                {meta.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Rule label="老阳" prob="1/8 = 12.5%" desc="3 个 1 → 阳爻 ⚊（变阴）" tone="cinnabar" />
        <Rule label="少阴" prob="3/8 = 37.5%" desc="2 个 1 → 阴爻 ⚋" tone="gold" />
        <Rule label="少阳" prob="3/8 = 37.5%" desc="1 个 1 → 阳爻 ⚊" tone="gold" />
        <Rule label="老阴" prob="1/8 = 12.5%" desc="0 个 1 → 阴爻 ⚋（变阳）" tone="cinnabar" />
      </div>
    </div>
  );
}

function Rule({
  label,
  prob,
  desc,
  tone,
}: {
  label: string;
  prob: string;
  desc: string;
  tone: "gold" | "cinnabar";
}) {
  const c = tone === "gold" ? "border-gold-500/30 text-gold-200" : "border-cinnabar-500/30 text-cinnabar-400";
  return (
    <div className={`rounded-md border ${c} bg-ink-900/40 p-2.5`}>
      <p className="font-display text-sm">{label}</p>
      <p className="font-mono text-[11px] text-ink-200">{prob}</p>
      <p className="text-[10px] text-ink-400">{desc}</p>
    </div>
  );
}

function BatchExperiment() {
  const [shots, setShots] = useState(1000);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState<number[] | null>(null);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      const c = new Array(8).fill(0);
      for (let i = 0; i < shots; i++) {
        // 直接读 bitstring → 整数；castOneYao 内部已用同一 RNG 池
        const y = castOneYao(0);
        c[parseInt(y.bitstring, 2)]++;
      }
      setCounts(c);
      setRunning(false);
    }, 30);
  };

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const max = useMemo(() => (counts ? Math.max(...counts) : 1), [counts]);
  const expected = shots / 8;
  const chiSquared = useMemo(() => {
    if (!counts) return null;
    return counts.reduce((acc, c) => acc + Math.pow(c - expected, 2) / expected, 0);
  }, [counts, expected]);

  return (
    <div className="scroll-card p-6">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-gold-200">实测分布 · 跑给你看</h3>
          <p className="text-[11px] text-ink-300">
            点击运行，浏览器现场跑 N 次电路。卡方临界值 χ²₀.₀₅,df=7 = 14.07，越小越接近均匀。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={shots}
            onChange={(e) => setShots(parseInt(e.target.value))}
            className="rounded-md border border-ink-600 bg-ink-900/60 px-2 py-1 text-xs text-ink-200"
          >
            {[100, 1000, 10000, 50000].map((n) => (
              <option key={n} value={n}>{n.toLocaleString()} shots</option>
            ))}
          </select>
          <button onClick={run} disabled={running} className="btn-ghost text-xs">
            {running ? "运行中..." : "运行"}
          </button>
        </div>
      </header>

      {counts && (
        <>
          <div className="grid grid-cols-8 items-end gap-1.5 h-44">
            {counts.map((c, i) => {
              const pct = (c / shots) * 100;
              const h = (c / max) * 100;
              return (
                <div key={i} className="flex h-full flex-col items-center justify-end">
                  <span className="mb-1 font-mono text-[10px] text-ink-300">{pct.toFixed(1)}%</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-quantum-700 to-quantum-300"
                    style={{ height: `${h}%` }}
                  />
                  <span className="mt-1 font-mono text-[10px] text-ink-300">|{STATE_LABELS[i]}⟩</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KV k="样本数" v={shots.toLocaleString()} />
            <KV k="期望/态" v={expected.toFixed(1)} />
            <KV k="卡方 χ²" v={chiSquared !== null ? chiSquared.toFixed(2) : "—"} />
            <KV k="结论" v={chiSquared !== null && chiSquared < 14.07 ? "✓ 均匀" : "✗ 偏离"} />
          </div>
        </>
      )}
    </div>
  );
}
