import Link from "next/link";
import { DivinationFlow } from "@/components/DivinationFlow";
import { Hero } from "@/components/Hero";
import { Atom, Sparkles, Flask, Grid } from "@/components/Icon";

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <DisclaimerBanner />
        <DivinationFlow />
      </section>
      <FeatureGrid />
    </div>
  );
}

function DisclaimerBanner() {
  return (
    <div className="mx-auto mb-6 max-w-3xl">
      <div className="flex items-start gap-3 rounded-md border border-cinnabar-500/30 bg-cinnabar-700/10 px-4 py-3 text-[13px] leading-relaxed text-ink-200">
        <span className="mt-0.5 text-cinnabar-400">仅供娱乐，</span>
        <p className="flex-1">
          <strong className="text-gold-200">不作为重大决策依据</strong>
          <Link href="/disclaimer" className="ml-2 text-gold-400/80 underline-offset-2 hover:text-gold-300 hover:underline">
            完整声明 →
          </Link>
        </p>
      </div>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    {
      Icon: Atom,
      title: "真量子电路",
      desc: "三比特 Hadamard 叠加 + 单 shot 测量，每爻独立。",
      tone: "quantum" as const,
    },
    {
      Icon: Sparkles,
      title: "AI 解卦",
      desc: "DeepSeek 配合彖传 / 大象传 / 互错综 + 朱子断卦法。",
      tone: "gold" as const,
    },
    {
      Icon: Grid,
      title: "结构可视化",
      desc: "当位、中正、应位、承乘 —— 三千年的爻位术语，看一眼就懂。",
      tone: "gold" as const,
    },
    {
      Icon: Flask,
      title: "可证伪",
      desc: "10000 次卡方实测分布 χ² ≈ 4.4，与均匀分布无显著差异。",
      tone: "quantum" as const,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="text-center">
        <p className="font-display text-[11px] tracking-[0.4em] text-gold-400">FEATURES</p>
        <h2 className="mt-2 font-display text-2xl text-gold-200 md:text-3xl">
          不只是占卜小工具
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const tone =
            f.tone === "quantum"
              ? "border-quantum-500/30 text-quantum-300"
              : "border-gold-500/30 text-gold-300";
          return (
            <article
              key={f.title}
              className="scroll-card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-glow-gold"
            >
              <span
                className={`mb-3 grid h-11 w-11 place-items-center rounded-md border ${tone} bg-ink-900/50 transition group-hover:scale-110`}
              >
                <f.Icon size={22} />
              </span>
              <h3 className="font-display text-base text-gold-200">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-200">{f.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
