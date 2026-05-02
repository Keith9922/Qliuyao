import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "项目背景 · About",
  description: "1703 年的圣彼得堡。莱布尼茨刚发明二进制几年，激动得停不下来——直到他收到了从北京寄来的那封回信。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-16">
      <header className="text-center">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold-400">
          ABOUT · 项目背景
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-gold-100 md:text-5xl">
          一封 322 年前的信
          <br />
          <span className="text-gold-gradient">和一段量子电路</span>
        </h1>
      </header>

      <div className="prose-custom mx-auto mt-10 max-w-2xl space-y-5">
        <section>
          <h2>1703 年的圣彼得堡</h2>
          <p>
            戈特弗里德·莱布尼茨刚发明二进制几年，激动得停不下来——
            只用 0 和 1 两个符号居然能表达所有数字。他写信给在中国的法国传教士白晋，
            分享这个「上帝的算术」。
          </p>
          <blockquote>「您来晚了 4000 多年。」</blockquote>
          <p>白晋的回信让他愣了。附信附上了一张图：邵雍的「伏羲六十四卦次序图」。</p>
          <pre className="my-3 overflow-x-auto rounded-md border border-ink-700 bg-ink-900/60 p-4 font-mono text-xs leading-loose text-gold-200">
{`☷  000   坤
☶  001   艮
☵  010   坎
☴  011   巽
☳  100   震
☲  101   离
☱  110   兑
☰  111   乾`}
          </pre>
          <p>莱布尼茨当场被击中。他后来在《二进制算术的解释》里写：</p>
          <blockquote>
            「这是我所见过的最完美的二进制系统。中国人在不知道它是二进制的情况下，
            完美地使用了它三千年。」
          </blockquote>
        </section>

        <section>
          <h2>322 年后</h2>
          <p>二进制有了新的载体——<strong>量子比特</strong>。</p>
          <p>
            莱布尼茨的 0 和 1 不再是写在纸上的笔画，
            而是 (|0⟩+|1⟩)/√2 这种<strong>叠加态</strong>，
            是测量瞬间会「坍缩」成 0 或 1 的物理事件。
          </p>
          <p>这个项目把这个故事画完一整圈：</p>
          <pre className="my-3 overflow-x-auto rounded-md border border-ink-700 bg-ink-900/60 p-3 font-mono text-[11px] leading-relaxed text-gold-200 sm:p-4 sm:text-xs">
{`邵雍 (1011)  →  莱布尼茨 (1703)  →  量子比特 (今天)
   阴阳爻        二进制 0/1        |0⟩ + |1⟩`}
          </pre>
        </section>

        <section>
          <h2>薛定谔的卦</h2>
          <p>
            <em>物理学家说</em>：「测量之前，那 3 个量子比特处在 8 种状态的叠加。」
          </p>
          <p>
            <em>易学家说</em>：「天数变化，未起之时，吉凶皆藏。」
          </p>
          <p>
            <strong>这两句话在数学上是同一句话。</strong>
          </p>
          <p>
            测量发生的那一瞬间——传统易学叫「动爻」，量子力学叫「波函数坍缩」——
            一个具体的爻象出现了。然后再来 5 次，凑齐六爻，一卦成形。
          </p>
          <p>这就是这个项目的全部哲学。</p>
        </section>

        <section>
          <h2>这个网站是怎么做出来的</h2>
          <p>
            原版是个 Python CLI 项目，用本源量子的 pyqpanda3 SDK 跑量子电路。
            网页版在这里做了几件事：
          </p>
          <ol>
            <li>用 TypeScript 重写了量子电路与起爻逻辑（数学等价，crypto API 采样均匀分布）；</li>
            <li>把 64 卦经文 + 384 爻爻辞 + 64 彖传 + 64 大象传完整移植；</li>
            <li>把当位 / 中正 / 应位 / 承乘做成了可视化卡片；</li>
            <li>用 Vercel Edge Runtime + 流式 SSE 调用 DeepSeek，让解卦逐字出现；</li>
            <li>整套部署在 Vercel，开箱即用，无需本地配置 Python。</li>
          </ol>
        </section>

        <section>
          <h2>致敬</h2>
          <ul>
            <li><strong>《周易》</strong> —— 公元前 11 世纪。本项目使用通行本经文，含卦辞、爻辞、彖传、大象传，公共领域。</li>
            <li><strong>邵雍 (1011–1077)</strong> —— 「伏羲六十四卦次序图」作者。</li>
            <li><strong>戈特弗里德·莱布尼茨 (1646–1716)</strong> —— 二进制发明人。</li>
            <li><strong>本源量子（OriginQ）</strong> —— pyqpanda3 SDK。</li>
            <li><strong>DeepSeek</strong> —— V4 模型 API。</li>
            <li><strong>朱熹《周易本义》</strong> —— 主要参考的经学注本。</li>
          </ul>
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
      <p className="mt-2 text-center text-[10px] tracking-widest text-ink-400">
        — 这个项目想说的话
      </p>
    </div>
  );
}
