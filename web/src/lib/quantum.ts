/**
 * 量子六爻 —— TypeScript 端真量子电路模拟器。
 *
 * 数学上严格按量子力学定义模拟「Hadamard ⊗ Hadamard ⊗ Hadamard，再单 shot 测量」：
 *
 *   |ψ⟩ = H|0⟩ ⊗ H|0⟩ ⊗ H|0⟩
 *       = (|0⟩+|1⟩)/√2 ⊗ (|0⟩+|1⟩)/√2 ⊗ (|0⟩+|1⟩)/√2
 *       = (1/√8) Σ_{k=0..7} |k⟩
 *
 * 八个本征态等概率叠加。单 shot 测量后波函数坍缩到其中一个，每个概率均为 1/8。
 *
 * 这与 pyqpanda3 的 CPUQVM 在数学上完全一致；底层熵源都是 PRNG（要真随机得提交真机）。
 * 我们使用 crypto.getRandomValues 提高熵质量。
 */

export type YaoName = "老阴" | "少阳" | "少阴" | "老阳";

export interface Yao {
  /** 爻位：0 = 初爻（最下），5 = 上爻（最上） */
  index: number;
  /** 三比特测量结果，例如 "101" */
  bitstring: string;
  /** bitstring 中 1 的个数（0..3） */
  ones: number;
  /** 老阴/少阳/少阴/老阳 */
  name: YaoName;
  /** 当前是否为阳 */
  isYang: boolean;
  /** 是否为变爻（老阴/老阳） */
  isChanging: boolean;
}

/** 八种本征态等幅振幅 1/√8 —— 测量前的真态。仅作为讲解常量暴露。 */
export const HADAMARD3_AMPLITUDE = 1 / Math.sqrt(8);

/**
 * 拒绝采样：均匀生成 [0, 8)。
 *
 * 256 = 8 × 32，所以 [0, 248) 范围内 mod 8 是无偏的。
 * 期望循环次数 ≈ 1.032，实测拒绝率 < 4%。
 *
 * 单一采样和批量采样共用底层缓冲，避免单字节请求的开销。
 */
const POOL_SIZE = 32;
const pool = new Uint8Array(POOL_SIZE);
let poolCursor = POOL_SIZE; // 触发首次填充

function nextUniformInt8(): number {
  for (;;) {
    if (poolCursor >= POOL_SIZE) {
      if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
        globalThis.crypto.getRandomValues(pool);
      } else {
        for (let i = 0; i < POOL_SIZE; i++) pool[i] = (Math.random() * 256) & 0xff;
      }
      poolCursor = 0;
    }
    const byte = pool[poolCursor++];
    if (byte < 248) return byte & 0x07;
  }
}

/** 把 0..7 的 popcount 表（Hamming weight）—— 比 split/filter 快一个量级。 */
const POPCOUNT8 = [0, 1, 1, 2, 1, 2, 2, 3] as const;

export function classifyYao(value: number, index: number): Yao {
  const ones = POPCOUNT8[value & 0x07];
  const bitstring = (value & 0x07).toString(2).padStart(3, "0");

  if (ones === 3) return { index, bitstring, ones, name: "老阳", isYang: true, isChanging: true };
  if (ones === 2) return { index, bitstring, ones, name: "少阴", isYang: false, isChanging: false };
  if (ones === 1) return { index, bitstring, ones, name: "少阳", isYang: true, isChanging: false };
  return { index, bitstring, ones, name: "老阴", isYang: false, isChanging: true };
}

/** 起一爻：模拟一次 H⊗3 + 单 shot 测量。等概率取八种本征态中的一个。 */
export function castOneYao(index: number): Yao {
  return classifyYao(nextUniformInt8(), index);
}

/** 从初爻到上爻起六爻。 */
export function castSixYaos(): Yao[] {
  return Array.from({ length: 6 }, (_, i) => castOneYao(i));
}

/**
 * 把六爻列表转成本卦 / 变卦的 6 位二进制串。
 * 字符串第 0 位 = 初爻（最下），第 5 位 = 上爻（最上）。
 */
export function yaosToBinary(yaos: Yao[]): { ben: string; bian: string } {
  let ben = "";
  let bian = "";
  for (const y of yaos) {
    if (y.isYang) {
      ben += "1";
      bian += y.isChanging ? "0" : "1";
    } else {
      ben += "0";
      bian += y.isChanging ? "1" : "0";
    }
  }
  return { ben, bian };
}

export function changingIndices(yaos: Yao[]): number[] {
  return yaos.filter((y) => y.isChanging).map((y) => y.index);
}

/**
 * 朱子《易学启蒙·考变占法》断卦法：
 * 根据动爻数判断该看哪段经文。
 */
const RULE_BY_MOVING: readonly string[] = [
  "六爻皆静 → 应以本卦卦辞断之",
  "一爻动 → 应以本卦该动爻爻辞为主断之",
  "二爻动 → 应以本卦两动爻爻辞断之，以上爻为主",
  "三爻动 → 本卦卦辞为贞、变卦卦辞为悔，二者参看",
  "四爻动 → 应以变卦两不变爻爻辞断之，以下爻为主",
  "五爻动 → 应以变卦不变爻爻辞断之",
  "六爻全动 → 应以变卦卦辞断之",
];

export function zhuZiRule(nMoving: number, benBin?: string): string {
  if (nMoving < 0 || nMoving > 6) return "";
  if (nMoving === 6) {
    if (benBin === "111111") return "六爻全动（乾卦）→ 取『用九：见群龙无首，吉』";
    if (benBin === "000000") return "六爻全动（坤卦）→ 取『用六：利永贞』";
  }
  return RULE_BY_MOVING[nMoving];
}
