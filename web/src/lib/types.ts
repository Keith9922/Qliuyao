/**
 * 跨前后端共享的契约类型。
 *
 * /api/divine 的响应 + /api/interpret 的请求都引用这里的类型，
 * 保证前后端一致变更。
 */

import type { Yao } from "./quantum";
import type { Hexagram } from "./hexagrams";
import type { Trigram } from "./trigrams";
import type { FullAnalysis } from "./analysis";

export interface HexagramSnapshot {
  binary: string;
  hex: Hexagram;
  analysis: FullAnalysis;
  lower: Trigram;
  upper: Trigram;
  /** 例如「水雷」 */
  label: string;
}

export interface DerivedHexagramSnapshot {
  binary: string;
  hex: Hexagram;
}

export interface DivineResult {
  /** ISO 时间戳，亦作为 history id */
  castAt: string;
  yaos: Yao[];
  ben: HexagramSnapshot;
  /** 无变爻时为 null */
  bian: HexagramSnapshot | null;
  derived: {
    hu: DerivedHexagramSnapshot;
    cuo: DerivedHexagramSnapshot;
    zong: DerivedHexagramSnapshot;
  };
  /** 动爻爻位（0..5） */
  moving: number[];
  rule: string;
}

export interface InterpretRequest {
  question: string;
  yaos: Yao[];
  benBin: string;
  bianBin: string;
}
