import type { Metadata } from "next";
import Link from "next/link";
import { listAllHexagrams } from "@/lib/hexagrams";
import { parseTrigrams } from "@/lib/trigrams";
import { HexagramGlyph } from "@/components/HexagramGlyph";

export const metadata: Metadata = {
  title: "六十四卦索引 · I-Ching",
  description: "通行本《周易》六十四卦索引：卦辞、爻辞、彖传、大象传，按王弼通行本卦序排列。",
};

export default function IndexPage() {
  const hexagrams = listAllHexagrams();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <header className="text-center">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold-400">
          I-CHING · 六十四卦
        </p>
        <h1 className="mt-4 font-display text-4xl text-gold-100 md:text-5xl">
          六 · 十 · 四 · 卦
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-200">
          通行本《周易》卦序索引。点开每一卦，可以看到完整的卦辞、爻辞、彖传与大象传。
        </p>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {hexagrams.map(({ binary, data }) => {
          const { lower, upper } = parseTrigrams(binary);
          return (
            <Link
              key={binary}
              href={`/index-64/${binary}`}
              className="scroll-card group flex flex-col items-center gap-2 p-4 transition hover:border-gold-400/40 hover:scale-[1.02]"
            >
              <span className="font-mono text-[10px] text-ink-400">No.{data.num}</span>
              <HexagramGlyph binary={binary} size="sm" />
              <span className="font-display text-2xl text-gold-200">{data.symbol}</span>
              <span className="font-display text-base text-gold-100">{data.name}</span>
              <span className="text-[10px] italic text-ink-300">{data.pinyin}</span>
              <span className="text-[10px] text-ink-400">
                上{upper.name} 下{lower.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="btn-ghost">← 起卦</Link>
      </div>
    </div>
  );
}
