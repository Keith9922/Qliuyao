import type { Metadata } from "next";
import Link from "next/link";
import { QuantumDeepDive } from "@/components/QuantumDeepDive";

export const metadata: Metadata = {
  title: "量子电路 · 起卦背后的物理",
  description:
    "三比特 Hadamard 门叠加 + 单 shot 测量。每爻的概率分布与传统三铜钱卦法完全一致：1/8 老阳、3/8 少阴、3/8 少阳、1/8 老阴。",
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
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-200 md:text-base">
          为什么 3 个量子比特的 H 门 + 单 shot 测量，跟扔 3 枚铜钱在概率分布上完全一致？
          这一页把它从数学到电路到爻象，画给你看。
        </p>
      </header>

      <QuantumDeepDive />

      <section className="prose-custom mx-auto mt-16 max-w-2xl">
        <h2>这是「真量子电路」吗？</h2>
        <p>
          数学上是。pyqpanda3 的 <code>CPUQVM</code>（量子虚拟机）严格按照量子力学的态矢演化和 Born 法则计算概率，
          每一步都不是「假装」——叠加、纠缠、坍缩在数学结构上都是真的。
          Web 端我们用 <code>crypto.getRandomValues</code> 直接采样均匀分布，结果和 CPUQVM
          数学等价（因为 H<sup>⊗3</sup> 后的态本来就是 8 个本征态的等幅叠加，测量分布就是均匀的）。
        </p>
        <p>
          <strong>区别只在熵源</strong>：CPUQVM 和 crypto API 都是 PRNG（伪随机数）。
          要拿「物理真随机」，得把电路提交到本源云的悟源超导真机
          （<code>pyqpanda3.qcloud</code>），那里测量结果来自真实的量子坍缩，是物理意义上的真随机。
        </p>
        <p>
          这两条路，<em>测量结果的统计分布完全相同</em>。区别在于：「这一次结果到底是不是从一个不可预测的物理过程取出来的。」
        </p>

        <h2>为什么不直接 <code>Math.random() % 8</code>？</h2>
        <p>
          其实数学上等价。但我们想保留电路这层抽象，因为它告诉你两件事：
        </p>
        <ol>
          <li>结果不是「一个随机数」，而是<strong>三个量子比特的联合测量</strong>，每比特测得 1 还是 0 是各自独立的事件。</li>
          <li>映射规则（数 1 的个数）让概率从 1/8、3/8、3/8、1/8 自然分布——这跟铜钱卦法的「3 正、2 正 1 反、1 正 2 反、3 反」完全对应。</li>
        </ol>

        <h2>分布到底准不准？</h2>
        <p>
          原始项目带了 <code>verify_quantum.py</code>，跑 10000 shot 做卡方检验。
          实测 χ² ≈ 4.42（自由度 7，p ≈ 0.73）——意思是「假设分布是均匀的，看到这么大或更大偏离的概率有 73%」。
          说人话：完美。
        </p>

        <h2>为什么要保留这一层抽象？</h2>
        <p>
          这是项目的核心隐喻——
          <strong>测量之前的叠加状态对应「天数变化、未起之时」</strong>，
          <strong>测量瞬间对应「动爻」</strong>。
          物理学家说「波函数坍缩」，易学家说「卦由心动」。
          这两句话在数学上是同一句话。
        </p>
        <p>
          这就是项目的全部哲学。如果你只想看一个酷炫的占卜小工具，
          <Link href="/">回到首页起卦</Link>就够了。
          如果你想把易经经文当成一个有 3000 年的反思工具来用，欢迎慢慢读 64 卦的卦辞。
        </p>
      </section>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Link href="/" className="btn-primary">起一卦试试</Link>
        <Link href="/about" className="btn-ghost">项目背景</Link>
      </div>
    </div>
  );
}
