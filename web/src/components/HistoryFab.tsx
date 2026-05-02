"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Scroll } from "./Icon";

/**
 * 悬浮按钮 + 按需加载抽屉。
 *
 * 不打开抽屉时，所有 framer-motion / drawer 代码都在另一个 chunk 里，
 * 不影响 about / disclaimer / index-64 等静态页的首屏体积。
 */

const HistoryDrawer = dynamic(() => import("./HistoryDrawer").then((m) => m.HistoryDrawer), {
  ssr: false,
});

export function HistoryFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-gold-500/30 bg-ink-950/85 text-gold-200 shadow-glow-gold backdrop-blur transition hover:border-gold-300/60 md:bottom-10 md:right-8"
        aria-label="打开历史卦签"
        type="button"
      >
        <Scroll size={20} />
      </button>
      {open && <HistoryDrawer open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
