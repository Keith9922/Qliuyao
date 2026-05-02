import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "项目背景 · About",
  description:
    "1703 年的圣彼得堡。莱布尼茨刚发明二进制几年，激动得停不下来——直到他收到了从中国寄来的那封回信。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-16">
      <header className="text-center">
        <p className="font-display text-[11px] tracking-[0.5em] text-gold-400">ABOUT · 项目背景</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-gold-100 md:text-5xl">
          一封 322 年前的信
          <br />
          <span className="text-gold-gradient">和一段量子电路</span>
        </h1>
      </header>

      <div className="prose-custom mx-auto mt-12 max-w-2xl space-y-6">
        <section>
          <h2>1703 · 莱布尼茨的「上帝算术」</h2>
          <p>
            莱布尼茨刚发明二进制几年，激动得停不下来。他写信给在中国的传教士白晋分享。
            白晋的回信让他愣住——附图是邵雍的「伏羲六十四卦次序图」：
          </p>
          <pre className="my-3 overflow-x-auto rounded-md border border-ink-700 bg-ink-900/60 p-3 font-mono text-[11px] leading-relaxed text-gold-200 sm:p-4 sm:text-xs">
{`☷ 000 坤   ☶ 001 艮   ☵ 010 坎   ☴ 011 巽
☳ 100 震   ☲ 101 离   ☱ 110 兑   ☰ 111 乾`}
          </pre>
          <blockquote>
            「中国人在不知道它是二进制的情况下，完美地使用了它三千年。」
          </blockquote>
        </section>

        <section>
          <h2>2026 · 量子比特</h2>
          <p>
            莱布尼茨的 0 和 1 有了新的载体。
            不再是写在纸上的笔画，而是 (|0⟩+|1⟩)/√2 这种<strong>叠加态</strong>。
          </p>
          <pre className="my-3 overflow-x-auto rounded-md border border-ink-700 bg-ink-900/60 p-3 font-mono text-[11px] leading-relaxed text-gold-200 sm:p-4 sm:text-xs">
{`邵雍 (1011)  →  莱布尼茨 (1703)  →  量子比特
   阴阳爻        二进制 0/1          |0⟩ + |1⟩`}
          </pre>
        </section>

        <section>
          <h2>薛定谔的卦</h2>
          <p>
            <em>物理学家</em>：测量之前，3 个量子比特处在 8 种状态的叠加。
            <br />
            <em>易学家</em>：天数变化，未起之时，吉凶皆藏。
          </p>
          <p>
            <strong>这两句话在数学上是同一句话。</strong>测量瞬间——
            易学叫「动爻」，量子叫「波函数坍缩」——具体的爻象出现了。
          </p>
        </section>
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <Link href="/" className="btn-primary">起一卦试试</Link>
        <Link href="/quantum" className="btn-ghost">看量子电路</Link>
      </div>

      <blockquote className="mt-12 text-center font-display text-base italic text-gold-300">
        「卦在被观测之前，是叠加的；
        <br />被观测之后，是已经发生的。
        <br />中间的一刻，叫做『动』。」
      </blockquote>
    </div>
  );
}
