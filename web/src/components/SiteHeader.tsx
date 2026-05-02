"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Taiji, Menu, Close } from "./Icon";

const NAV = [
  { href: "/", label: "起卦", desc: "Cast" },
  { href: "/quantum", label: "量子电路", desc: "Circuit" },
  { href: "/index-64", label: "六十四卦", desc: "I-Ching" },
  { href: "/about", label: "项目背景", desc: "About" },
  { href: "/disclaimer", label: "声明", desc: "Notice" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/50 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="量子六爻 · 回到首页">
          <span className="grid h-11 w-11 place-items-center rounded-md border border-gold-500/30 bg-gradient-to-br from-cinnabar-700/40 to-cinnabar-800/40 text-gold-200 transition group-hover:border-gold-400/60 group-hover:shadow-glow-gold">
            <Taiji size={22} />
          </span>
          <span>
            <span className="block font-display text-xl font-semibold tracking-wider text-gold-200">
              量子六爻
            </span>
            <span className="block text-[11px] tracking-[0.3em] text-ink-300">
              QUANTUM · LIUYAO
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "group relative rounded-md px-4 py-2 font-display text-sm transition-colors",
                  active
                    ? "text-gold-200"
                    : "text-ink-200 hover:text-gold-200"
                )}
              >
                <span>{n.label}</span>
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
          aria-expanded={open}
          className="md:hidden grid h-11 w-11 place-items-center rounded-md border border-ink-700 text-gold-200 transition hover:border-gold-500/40"
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          {open ? <Close size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-700/50 bg-ink-950/95 px-5 py-3 md:hidden">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2.5 text-sm",
                  active ? "bg-ink-800/60 text-gold-200" : "text-ink-200"
                )}
              >
                <span className="font-display">{n.label}</span>
                <span className="text-[10px] tracking-widest text-ink-400">{n.desc}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
