"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadHistory, clearHistory, type HistoryEntry } from "@/lib/history";
import { HexagramGlyph } from "./HexagramGlyph";
import { Close } from "./Icon";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 历史抽屉：从右侧滑出，展示过去 30 次卦象。
 *
 * 父组件（HistoryFab）控制打开/关闭，本组件只负责渲染。
 * dynamic import 时只在第一次打开后才加载。
 */
export function HistoryDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (open) setItems(loadHistory());
  }, [open]);

  const onClear = () => {
    if (confirm("确认清空所有历史？此操作不可撤销。")) {
      clearHistory();
      setItems([]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(92vw,420px)] flex-col border-l border-ink-700/50 bg-ink-950/95 backdrop-blur-md"
          >
            <header className="flex items-center justify-between border-b border-ink-700/50 px-5 py-4">
              <div>
                <p className="font-display text-base text-gold-200">我的卦签集</p>
                <p className="text-[11px] text-ink-300">仅保存在你的浏览器本地</p>
              </div>
              <button
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-md border border-ink-700 text-gold-200 transition hover:bg-ink-800"
                aria-label="关闭历史抽屉"
                type="button"
              >
                <Close size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center text-sm text-ink-300">
                  <div>
                    <span className="text-3xl text-ink-500">☷</span>
                    <p className="mt-3">还没有卦签</p>
                    <p className="mt-1 text-[12px] text-ink-400">起一卦后会自动保存到这里</p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li key={it.id}>
                      <Link
                        href={`/index-64/${it.benBinary}`}
                        onClick={onClose}
                        className="flex items-start gap-3 rounded-md border border-ink-700/50 bg-ink-900/40 p-3 transition hover:border-gold-500/30"
                      >
                        <HexagramGlyph binary={it.benBinary} size="sm" changing={it.moving} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-sm text-ink-100">{it.question}</p>
                          <p className="mt-1 text-xs text-gold-300">
                            {it.benSymbol} {it.benName}
                            {it.bianName && (
                              <>
                                <span className="mx-1.5 text-ink-400">→</span>
                                {it.bianName}
                              </>
                            )}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-ink-400">
                            {new Date(it.castAt).toLocaleString("zh-CN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {it.moving.length > 0 && (
                              <span className="ml-2 text-cinnabar-400">
                                动 {it.moving.map((i) => i + 1).join(",")} 爻
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-ink-700/50 px-5 py-3">
                <button
                  onClick={onClear}
                  type="button"
                  className="text-xs text-cinnabar-400 hover:text-cinnabar-300"
                >
                  清空历史
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
