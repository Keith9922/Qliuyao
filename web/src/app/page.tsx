import Link from "next/link";
import { DivinationFlow } from "@/components/DivinationFlow";
import { Atom, Taiji, Alert, Book, Sparkles, Flask, Grid, Globe } from "@/components/Icon";

export default function HomePage() {
  return (
    <div className="relative">
      <BackgroundDecor />
      <Hero />
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <DisclaimerBanner />
        <DivinationFlow />
      </section>
      <FeatureGrid />
    </div>
  );
}

function Hero() {
  return (
    <header className="relative mx-auto max-w-6xl px-5 pb-10 pt-12 md:pt-20 md:pb-14">
      <div className="text-center">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold-400 md:text-xs">
          QUANTUM · LIUYAO · 量子六爻
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight tracking-wider text-gold-100 md:text-7xl">
          把铜钱换成<span className="text-quantum-gradient">量子比特</span>
          <br className="hidden md:block" />
          让 AI 替你<span className="text-gold-gradient">解卦</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink-200 md:text-base">
          一个量子计算与《周易》的跨界实验。
          每爻独立一次三比特 H 门叠加 + 单 shot 测量，
          配合彖传 / 大象传 / 互错综卦 / 当位应承 完整经学知识库，
          用 AI 给你一段白话推演。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-[13px]">
          <Link
            href="/quantum"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-quantum-500/40 bg-quantum-900/40 px-4 py-2 text-quantum-200 transition hover:border-quantum-300/60"
          >
            <Atom size={14} />
            <span>量子电路怎么跑</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-gold-500/40 bg-ink-900/40 px-4 py-2 text-gold-200 transition hover:border-gold-300/60"
          >
            <Taiji size={14} />
            <span>项目缘起</span>
          </Link>
          <Link
            href="/disclaimer"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-cinnabar-500/40 bg-cinnabar-700/15 px-4 py-2 text-cinnabar-300 transition hover:border-cinnabar-400/60"
          >
            <Alert size={14} />
            <span>免责声明</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function DisclaimerBanner() {
  return (
    <div className="mx-auto mb-6 max-w-3xl">
      <div className="flex items-start gap-3 rounded-md border border-cinnabar-500/30 bg-cinnabar-700/10 px-4 py-3 text-[13px] leading-relaxed text-ink-200">
        <span className="mt-0.5 shrink-0 text-cinnabar-400">
          <Alert size={16} />
        </span>
        <p>
          <span className="font-display text-cinnabar-300">提示</span>
          ：本项目内容仅供娱乐与文化反思，
          <strong className="text-gold-200">不作为人生重大节点的决策依据</strong>。
          完整说明见
          <Link href="/disclaimer" className="ml-1 text-gold-300 underline-offset-2 hover:underline">
            《免责声明》
          </Link>
          。
        </p>
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[600px] overflow-hidden">
      {/* 八卦图轮廓 */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold-500/10 animate-rotate-slow" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-2 border-dashed border-gold-500/5" />
      <div className="absolute -left-32 top-40 h-72 w-72 rounded-full border border-quantum-500/10 animate-rotate-slow" style={{ animationDirection: "reverse" }} />

      {/* 量子比特光点 */}
      <div className="absolute right-1/4 top-32 h-2 w-2 rounded-full bg-quantum-300 shadow-glow-quantum animate-pulse-soft" />
      <div className="absolute left-1/3 top-64 h-1.5 w-1.5 rounded-full bg-gold-300 shadow-glow-gold animate-pulse-soft" style={{ animationDelay: "1s" }} />
    </div>
  );
}

function FeatureGrid() {
  const features = [
    {
      Icon: Atom,
      title: "真量子电路",
      desc: "pyqpanda3 三比特 Hadamard 叠加，每爻独立电路实例 + 单 shot 测量。Web 端用 crypto API 等价复刻同一份数学。",
      tag: "QUANTUM",
      tone: "quantum" as const,
    },
    {
      Icon: Book,
      title: "完整经学知识库",
      desc: "64 卦卦辞 + 384 爻爻辞 + 64 彖传 + 64 大象传 + 互错综衍生卦 + 八卦象意，全部进入 AI prompt。",
      tag: "CLASSICS",
      tone: "gold" as const,
    },
    {
      Icon: Sparkles,
      title: "AI 结构化解卦",
      desc: "DeepSeek + 强结构化 prompt：辨象 → 取辞 → 观结构 → 看动向 → 参互错综 → 综合，每步引用原文。",
      tag: "DEEPSEEK",
      tone: "gold" as const,
    },
    {
      Icon: Flask,
      title: "可证伪",
      desc: "10000 次卡方检验：χ² ≈ 4.4，p ≈ 0.73。8 种本征态分布与均匀分布无显著差异 —— 分布完美。",
      tag: "TESTABLE",
      tone: "quantum" as const,
    },
    {
      Icon: Grid,
      title: "卦象解析可视化",
      desc: "当位、中正、有应、敌应、承乘 —— 三千年的爻位术语，做成一组直观的位结构图。初学者也能看懂。",
      tag: "ANALYSIS",
      tone: "gold" as const,
    },
    {
      Icon: Globe,
      title: "前后端完整",
      desc: "Next.js + Edge Runtime + 流式 SSE，部署在 Vercel。开箱即用，无需本地配置 Python 与 conda。",
      tag: "WEB",
      tone: "quantum" as const,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="text-center">
        <p className="font-display text-[11px] tracking-[0.4em] text-gold-400">FEATURES</p>
        <h2 className="mt-2 font-display text-2xl text-gold-200 md:text-3xl">
          为什么这个项目和别的占卜小工具不一样
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const tone =
            f.tone === "quantum"
              ? "border-quantum-500/30 text-quantum-300"
              : "border-gold-500/30 text-gold-300";
          return (
            <article
              key={f.title}
              className="scroll-card group relative overflow-hidden p-5 transition hover:border-gold-400/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-md border ${tone} bg-ink-900/50`}>
                  <f.Icon size={22} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.3em] text-ink-400">{f.tag}</span>
              </div>
              <h3 className="font-display text-base text-gold-200">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-200">{f.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
