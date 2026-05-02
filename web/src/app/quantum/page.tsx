import type { Metadata } from "next";
import Link from "next/link";
import { QuantumDeepDive } from "@/components/QuantumDeepDive";

export const metadata: Metadata = {
  title: "量子电路 · 起卦背后的物理",
  description:
    "三比特 Hadamard 叠加 + 单 shot 测量。每爻概率分布与传统三铜钱卦法完全一致：1/8 老阳、3/8 少阴、3/8 少阳、1/8 老阴。",
};

export default function QuantumPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-16">
      <header className="text-center">
        <p className="font-display text-[11px] tracking-[0.5em] text-quantum-300">
          QUANTUM CIRCUIT · 量子电路
        </p>
        <h1 className="mt-4 font-display text-4xl text-gold-100 md:text-5xl">
          起一爻的物理
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-200 md:text-base">
          为什么 3 个量子比特的 H 门 + 单 shot 测量，和扔 3 枚铜钱概率完全一致？
        </p>
      </header>

      <QuantumDeepDive />

      <section className="prose-custom mx-auto mt-16 max-w-2xl">
        <h2>这是「真量子电路」吗？</h2>
        <p>
          数学上是。pyqpanda3 严格按量子力学的态矢演化和 Born 法则计算，
          叠加与坍缩都是真的。Web 端用 <code>crypto.getRandomValues</code> 直接采样均匀分布——
          因为 H<sup>⊗3</sup> 后就是 8 个本征态的等幅叠加，结果与上面数学等价。
        </p>
        <p>
          <strong>区别只在熵源</strong>：两边都是 PRNG。要拿物理真随机得提交本源云的悟源真机。
        </p>

        <h2>核心隐喻</h2>
        <p>
          物理学家说「波函数坍缩」，易学家说「卦由心动」——
          <em>测量发生的那一瞬间，未起 → 已起。</em>这是项目的全部哲学。
        </p>
      </section>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Link href="/" className="btn-primary">起一卦试试</Link>
        <Link href="/about" className="btn-ghost">项目背景</Link>
      </div>
    </div>
  );
}
