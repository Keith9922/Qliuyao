"use client";

import { motion } from "framer-motion";
import { HexagramGlyph } from "./HexagramGlyph";
import type { Hexagram } from "@/lib/hexagrams";

interface Props {
  hu: { binary: string; hex: Hexagram };
  cuo: { binary: string; hex: Hexagram };
  zong: { binary: string; hex: Hexagram };
}

const META = {
  hu: {
    title: "互卦",
    subtitle: "揭示内部结构",
    desc: "取本卦 2、3、4 爻为新下卦，3、4、5 爻为新上卦。展示卦象内部潜藏的逻辑。",
    color: "from-gold-700/20 to-gold-900/20 border-gold-500/30",
  },
  cuo: {
    title: "错卦",
    subtitle: "揭示对立面",
    desc: "六爻全部阴阳反转。是这个卦的「影子」——展示同一情境的对立面。",
    color: "from-quantum-700/20 to-quantum-900/20 border-quantum-500/30",
  },
  zong: {
    title: "综卦",
    subtitle: "揭示换视角",
    desc: "六爻自下而上倒过来读。换一个观察者位置看同一件事。",
    color: "from-cinnabar-700/20 to-cinnabar-900/20 border-cinnabar-500/30",
  },
} as const;

export function DerivedHexagrams({ hu, cuo, zong }: Props) {
  const items: Array<{ key: keyof typeof META; data: { binary: string; hex: Hexagram } }> = [
    { key: "hu", data: hu },
    { key: "cuo", data: cuo },
    { key: "zong", data: zong },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(({ key, data }, i) => {
        const m = META[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`scroll-card flex flex-col gap-3 border bg-gradient-to-br p-4 ${m.color}`}
          >
            <header className="flex items-baseline justify-between">
              <div>
                <span className="font-display text-base text-gold-200">{m.title}</span>
                <span className="ml-2 text-xs text-ink-300">{m.subtitle}</span>
              </div>
              <span className="font-mono text-[10px] text-ink-400">No.{data.hex.num}</span>
            </header>

            <div className="flex items-center gap-3">
              <HexagramGlyph binary={data.binary} size="sm" />
              <div>
                <p className="font-display text-2xl text-gold-100">
                  {data.hex.symbol} {data.hex.name}
                </p>
                <p className="text-[11px] italic text-ink-300">{data.hex.pinyin}</p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-ink-300">{m.desc}</p>

            <div className="rounded-md border border-ink-700/50 bg-ink-900/40 px-2.5 py-2">
              <p className="font-serif text-xs leading-relaxed text-ink-200 line-clamp-3">
                {data.hex.judgment}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
