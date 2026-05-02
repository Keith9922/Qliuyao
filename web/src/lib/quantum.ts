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
 * 我们使用 crypto API 提高熵质量（浏览器/Node 都内置）。
 */

export const YAO_NAMES = ["老阴", "少阳", "少阴", "老阳"] as const;
export type YaoName = (typeof YAO_NAMES)[number];

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
  /** 八种本征态测量后的真实概率振幅（用于可视化坍缩） */
  amplitudes?: number[];
}

/**
 * 生成 [0, 8) 的均匀整数。优先使用 crypto.getRandomValues，否则回退到 Math.random。
 *
 * 注意：这两种都是 PRNG，跟 pyqpanda3 CPUQVM 一样。要拿物理真随机得提交真机。
 * 数学分布完全一致。
 */
function uniformInt8(): number {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    // 拒绝采样防止取模偏置：256 = 8 * 32，所以 < 248 时直接 mod 8
    const buf = new Uint8Array(1);
    while (true) {
      globalThis.crypto.getRandomValues(buf);
      if (buf[0] < 248) return buf[0] % 8;
    }
  }
  return Math.floor(Math.random() * 8);
}

function classifyOnes(ones: number): { name: YaoName; isYang: boolean; isChanging: boolean } {
  if (ones === 3) return { name: "老阳", isYang: true, isChanging: true };
  if (ones === 2) return { name: "少阴", isYang: false, isChanging: false };
  if (ones === 1) return { name: "少阳", isYang: true, isChanging: false };
  return { name: "老阴", isYang: false, isChanging: true };
}

/**
 * 起一爻：模拟一次三比特 H 门 + 单 shot 测量。
 *
 * 等价于均匀地从 8 种本征态中选一个；按 bitstring 中 1 的个数映射阴阳/老少。
 * 这与传统三铜钱卦法的概率分布完全一致（1/8 老阳、3/8 少阴、3/8 少阳、1/8 老阴）。
 */
export function castOneYao(index: number): Yao {
  const value = uniformInt8(); // 0..7
  // 把 0..7 转成 3 位二进制（高位在左）
  const bitstring = value.toString(2).padStart(3, "0");
  const ones = bitstring.split("").filter((c) => c === "1").length;
  const meta = classifyOnes(ones);

  // 测量前的概率振幅：8 种本征态各为 1/√8（等幅）
  const amplitudes = Array(8).fill(1 / Math.sqrt(8));

  return {
    index,
    bitstring,
    ones,
    ...meta,
    amplitudes,
  };
}

/** 从初爻到上爻起六爻。 */
export function castSixYaos(): Yao[] {
  return Array.from({ length: 6 }, (_, i) => castOneYao(i));
}

/**
 * 把六爻列表转成本卦/变卦的 6 位二进制串。
 * 字符串第 0 位 = 初爻（最下），第 5 位 = 上爻（最上）。
 */
export function yaosToBinary(yaos: Yao[]): { ben: string; bian: string } {
  const ben = yaos.map((y) => (y.isYang ? "1" : "0")).join("");
  const bian = yaos
    .map((y) => {
      if (y.isChanging) return y.isYang ? "0" : "1";
      return y.isYang ? "1" : "0";
    })
    .join("");
  return { ben, bian };
}

export function changingIndices(yaos: Yao[]): number[] {
  return yaos.filter((y) => y.isChanging).map((y) => y.index);
}

/**
 * 朱子《易学启蒙·考变占法》断卦法：
 * 根据动爻数判断该看哪段经文。
 */
export function zhuZiRule(nMoving: number, benBin?: string): string {
  if (nMoving === 0) return "六爻皆静 → 应以本卦卦辞断之";
  if (nMoving === 1) return "一爻动 → 应以本卦该动爻爻辞为主断之";
  if (nMoving === 2) return "二爻动 → 应以本卦两动爻爻辞断之，以上爻为主";
  if (nMoving === 3) return "三爻动 → 本卦卦辞为贞、变卦卦辞为悔，二者参看";
  if (nMoving === 4) return "四爻动 → 应以变卦两不变爻爻辞断之，以下爻为主";
  if (nMoving === 5) return "五爻动 → 应以变卦不变爻爻辞断之";
  if (nMoving === 6) {
    if (benBin === "111111") return "六爻全动（乾卦）→ 取『用九：见群龙无首，吉』";
    if (benBin === "000000") return "六爻全动（坤卦）→ 取『用六：利永贞』";
    return "六爻全动 → 应以变卦卦辞断之";
  }
  return "";
}
