import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHexagram, listAllHexagrams } from "@/lib/hexagrams";
import { parseTrigrams, trigramPairLabel } from "@/lib/trigrams";
import { fullAnalysis } from "@/lib/analysis";
import { HexagramCard } from "@/components/HexagramCard";
import { StructureAnalysis } from "@/components/StructureAnalysis";
import { DerivedHexagrams } from "@/components/DerivedHexagrams";

type Params = Promise<{ binary: string }>;

export function generateStaticParams() {
  return listAllHexagrams().map(({ binary }) => ({ binary }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { binary } = await params;
  if (!/^[01]{6}$/.test(binary)) return { title: "卦象" };
  try {
    const h = getHexagram(binary);
    return {
      title: `第 ${h.num} 卦 · ${h.name}（${h.pinyin}）`,
      description: `${h.name}卦：${h.judgment}`,
    };
  } catch {
    return { title: "卦象" };
  }
}

export default async function HexagramPage({ params }: { params: Params }) {
  const { binary } = await params;
  if (!/^[01]{6}$/.test(binary)) notFound();
  let h;
  try {
    h = getHexagram(binary);
  } catch {
    notFound();
  }
  if (!h) notFound();
  const trig = parseTrigrams(binary);
  const ana = fullAnalysis(binary);
  const huHex = getHexagram(ana.huGua);
  const cuoHex = getHexagram(ana.cuoGua);
  const zongHex = getHexagram(ana.zongGua);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-10 md:py-14">
      <Link href="/index-64" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-gold-300">
        <span>←</span>
        <span>返回索引</span>
      </Link>

      <header className="text-center">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold-400">
          NO.{h.num} · {h.pinyin.toUpperCase()}
        </p>
        <h1 className="mt-3 font-display text-5xl text-gold-100 md:text-6xl">
          {h.symbol} {h.name}
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          {trigramPairLabel(binary)}{h.name} · 上 {trig.upper.name} {trig.upper.symbol} · 下 {trig.lower.name} {trig.lower.symbol}
        </p>
      </header>

      <HexagramCard
        binary={binary}
        hex={h}
        lower={trig.lower}
        upper={trig.upper}
        variant="plain"
        animate={false}
      />

      <section>
        <h2 className="mb-3 font-display text-xl text-gold-200">爻位结构</h2>
        <StructureAnalysis analysis={ana} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-gold-200">衍生卦</h2>
        <DerivedHexagrams
          hu={{ binary: ana.huGua, hex: huHex }}
          cuo={{ binary: ana.cuoGua, hex: cuoHex }}
          zong={{ binary: ana.zongGua, hex: zongHex }}
        />
      </section>

      <div className="flex justify-center pt-4">
        <Link href="/" className="btn-primary">为这件事起一卦</Link>
      </div>
    </div>
  );
}
