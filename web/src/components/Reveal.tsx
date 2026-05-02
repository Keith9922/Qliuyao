"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * 滚动揭示包装：进入视口时浮现 + 上移。
 * 使用 framer-motion 的 viewport.once 避免反复触发。
 */
interface Props {
  children: ReactNode;
  delay?: number;
  /** 偏移距离（默认 16px） */
  y?: number;
  className?: string;
  /** 用于 staggered children */
  index?: number;
}

export function Reveal({ children, delay = 0, y = 16, className, index }: Props) {
  const reduce = useReducedMotion();
  const computedDelay = delay + (index ?? 0) * 0.08;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ delay: computedDelay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
