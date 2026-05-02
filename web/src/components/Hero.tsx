"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Atom, Alert, Taiji, TaijiSeal } from "./Icon";

/**
 * 首页英雄区。克制路线：
 *
 *   - 中央太极印章一次性入场（缩放+淡入）
 *   - 背后一层极淡的暖色辉光，不重复呼吸
 *   - 没有粒子、没有罗盘、没有干涉条纹
 *   - 标题与 CTA 错峰浮入
 */
export function Hero() {
  const reduce = useReducedMotion();
  return (
    <header className="relative overflow-hidden pb-12 pt-14 md:pb-20 md:pt-24">
      <Backdrop />
      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <Seal />
          </motion.div>

          <motion.p
            initial={reduce ? false : { y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="font-display text-[11px] tracking-[0.5em] text-gold-400 md:text-xs"
          >
            QUANTUM · LIUYAO · 量子六爻
          </motion.p>

          <motion.h1
            initial={reduce ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.65 }}
            className="mt-3 font-display text-5xl leading-[1.05] tracking-wider text-gold-100 md:text-7xl"
          >
            <span className="block">把铜钱换成<span className="text-quantum-gradient">量子比特</span></span>
            <span className="mt-2 block text-3xl text-gold-200 md:mt-3 md:text-5xl">
              让 AI 替你<span className="text-gold-gradient">解卦</span>
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.65 }}
            className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink-200 md:text-base"
          >
            一个量子计算与《周易》的跨界实验。量子电路摇出六爻，
            配合彖传 / 大象传 / 互错综 完整经学知识库，
            AI 给你一段白话推演。
          </motion.p>

          <motion.div
            initial={reduce ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.78, duration: 0.65 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-[13px]"
          >
            <Link href="/quantum" className="hero-chip hero-chip-quantum">
              <Atom size={14} />
              <span>量子电路</span>
            </Link>
            <Link href="/about" className="hero-chip hero-chip-gold">
              <Taiji size={14} />
              <span>项目缘起</span>
            </Link>
            <Link href="/disclaimer" className="hero-chip hero-chip-cinnabar">
              <Alert size={14} />
              <span>免责声明</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/**
 * 中央印章 —— 一层极淡的暖色辉光 + 太极图。无脉动、无旋转。
 */
function Seal() {
  return (
    <div className="relative grid h-28 w-28 place-items-center md:h-32 md:w-32">
      <span
        aria-hidden
        className="absolute -inset-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(237,196,78,0.18) 0%, rgba(237,196,78,0) 65%)",
        }}
      />
      <div className="relative grid h-full w-full place-items-center text-gold-200">
        <TaijiSeal size={112} />
      </div>
    </div>
  );
}

/**
 * 背景：一层极淡的金色径向晕染，把内容区从纯黑底中托起来。
 * 不动、不闪、不显眼。
 */
function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(196,133,29,0.07) 0%, rgba(196,133,29,0) 70%)",
      }}
    />
  );
}
