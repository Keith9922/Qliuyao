"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Atom, Alert, TaijiSeal } from "./Icon";

/**
 * 首页英雄区。
 *
 * 主题氛围：
 *   - 中央太极印章缓慢自转，光晕呼吸（"叠加态"未坍缩）
 *   - 周身漂浮量子粒子（伪随机种子，固定渲染避免 SSR/CSR 抖动）
 *   - 后景柔光晕染 + 八卦罗盘水印
 *
 * 文字精简：1 句副标题，1 主 CTA。
 */
export function Hero() {
  return (
    <header className="relative overflow-hidden pb-12 pt-16 md:pb-20 md:pt-28">
      <Atmosphere />
      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <SealAnimated />
          </motion.div>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-[11px] tracking-[0.5em] text-gold-400 md:text-xs"
          >
            QUANTUM · LIUYAO · 量子六爻
          </motion.p>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-3 font-display text-5xl leading-[1.05] tracking-wider text-gold-100 md:text-7xl"
          >
            <span className="block">把铜钱换成</span>
            <span className="block">
              <span className="text-quantum-gradient">量子比特</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="mt-5 max-w-md font-serif text-[15px] leading-relaxed text-ink-200"
          >
            量子电路摇出六爻，AI 配合周易 · 十翼 给你一段白话推演。
          </motion.p>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-[13px]"
          >
            <Link href="/quantum" className="hero-chip hero-chip-quantum">
              <Atom size={14} />
              <span>量子电路</span>
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
 * 太极印章 + 双层光环呼吸 —— 像「叠加态待测量」的视觉表达。
 */
function SealAnimated() {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid h-28 w-28 place-items-center md:h-36 md:w-36">
      {/* 外层呼吸光晕 */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(237,196,78,0.35) 0%, rgba(237,196,78,0) 65%)",
        }}
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* 内层量子辉光 */}
      <motion.span
        aria-hidden
        className="absolute inset-3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(146,174,255,0.25) 0%, rgba(146,174,255,0) 65%)",
        }}
        animate={reduce ? undefined : { scale: [1.05, 1, 1.05], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* 太极印 —— 缓慢自转 */}
      <motion.div
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="relative grid h-full w-full place-items-center text-gold-200"
      >
        <TaijiSeal size={120} />
      </motion.div>
    </div>
  );
}

/**
 * 背景氛围：八卦罗盘 + 量子粒子云 + 干涉条纹。
 *
 * 粒子位置使用确定性的伪随机（基于 index），避免 hydration mismatch。
 */
function Atmosphere() {
  const reduce = useReducedMotion();
  const particles = useMemo(() => generateParticles(18), []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 八卦罗盘水印 */}
      <BaguaCompass />

      {/* 8 态干涉条纹 */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full opacity-[0.05]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="hero-interference" width="8" height="100" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="100" stroke="#92aeff" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#hero-interference)" />
      </svg>

      {/* 量子粒子 */}
      {!reduce &&
        particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + (i % 4),
              delay: (i * 0.3) % 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}

function BaguaCompass() {
  return (
    <svg
      aria-hidden
      className="absolute -right-32 -top-24 h-[480px] w-[480px] opacity-[0.06] md:opacity-[0.09]"
      viewBox="0 0 200 200"
    >
      <g stroke="#edc44e" strokeWidth="0.6" fill="none">
        <circle cx="100" cy="100" r="95" />
        <circle cx="100" cy="100" r="75" />
        <circle cx="100" cy="100" r="55" strokeDasharray="2 4" />
        {/* 八卦放射线 */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = 100 + Math.cos(angle) * 95;
          const y = 100 + Math.sin(angle) * 95;
          return <line key={i} x1="100" y1="100" x2={x} y2={y} />;
        })}
      </g>
    </svg>
  );
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
}

/**
 * 伪随机粒子生成器（确定性，避免 SSR/CSR mismatch）。
 * 使用 LCG 让序列稳定。
 */
function generateParticles(n: number): Particle[] {
  const colors = [
    "rgba(237,196,78,0.85)", // gold
    "rgba(146,174,255,0.85)", // quantum
    "rgba(224,125,101,0.6)", // cinnabar
  ];
  let seed = 42;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 0x100000000;
    return seed / 0x100000000;
  };
  return Array.from({ length: n }, (_, i) => ({
    x: 4 + next() * 92,
    y: 6 + next() * 86,
    size: 2 + Math.floor(next() * 3),
    color: colors[i % colors.length],
  }));
}
