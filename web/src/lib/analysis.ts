/**
 * 卦象分析工具 —— 衍生卦计算 + 爻位结构分析（纯函数）。
 */

/** 爻位的"阴阳属性"：奇数位（1/3/5）= 阳位；偶数位（2/4/6）= 阴位。 */
export const POSITION_IS_YANG = [true, false, true, false, true, false] as const;
/** 爻位汉字名（自下而上）：初、二、三、四、五、上。 */
export const POSITION_NAME = ["初", "二", "三", "四", "五", "上"] as const;

/** 互卦：取 2、3、4 爻为新下卦，3、4、5 爻为新上卦。 */
export function huGua(binary: string): string {
  const newLower = binary[1] + binary[2] + binary[3];
  const newUpper = binary[2] + binary[3] + binary[4];
  return newLower + newUpper;
}

/** 错卦：每一爻阴阳反转。 */
export function cuoGua(binary: string): string {
  return [...binary].map((c) => (c === "1" ? "0" : "1")).join("");
}

/** 综卦：六爻自下而上倒过来读。 */
export function zongGua(binary: string): string {
  return binary.split("").reverse().join("");
}

/** 生成"九X"/"六X"形式的爻位标号。 */
export function lineLabel(idx: number, isYang: boolean): string {
  if (idx === 0) return isYang ? "初九" : "初六";
  if (idx === 5) return isYang ? "上九" : "上六";
  return `${isYang ? "九" : "六"}${POSITION_NAME[idx]}`;
}

export interface PositionAnalysis {
  index: number;
  label: string;
  isYang: boolean;
  positionIsYang: boolean;
  /** 当位：阳爻在阳位 / 阴爻在阴位 */
  dangWei: boolean;
  /** 中位：二爻、五爻 */
  zhongWei: boolean;
  /** 中正之位：中位且当位 */
  zhongZheng: boolean;
}

export function positionAnalysis(binary: string): PositionAnalysis[] {
  const out: PositionAnalysis[] = [];
  for (let i = 0; i < 6; i++) {
    const isYang = binary[i] === "1";
    const posYang = POSITION_IS_YANG[i];
    const dangWei = isYang === posYang;
    const zhongWei = i === 1 || i === 4;
    out.push({
      index: i,
      label: lineLabel(i, isYang),
      isYang,
      positionIsYang: posYang,
      dangWei,
      zhongWei,
      zhongZheng: zhongWei && dangWei,
    });
  }
  return out;
}

export interface CorrespondenceAnalysis {
  pair: [number, number];
  labels: [string, string];
  /** 有应（阴阳相对）/ 敌应（同性相斥） */
  relation: "有应" | "敌应";
  description: string;
}

export function correspondenceAnalysis(binary: string): CorrespondenceAnalysis[] {
  const pairs: [number, number][] = [
    [0, 3],
    [1, 4],
    [2, 5],
  ];
  return pairs.map(([lo, hi]) => {
    const a = binary[lo];
    const b = binary[hi];
    const relation = a !== b ? "有应" : "敌应";
    const description = a !== b ? "阴阳相对，相通" : "同性相斥";
    return {
      pair: [lo, hi],
      labels: [lineLabel(lo, a === "1"), lineLabel(hi, b === "1")],
      relation,
      description,
    };
  });
}

export interface NeighborAnalysis {
  pair: [number, number];
  labels: [string, string];
  /** 承（阴在阳下，顺）/ 乘（阴在阳上，逆）/ 比（同性） */
  relation: "承" | "乘" | "比";
  description: string;
}

export function neighborAnalysis(binary: string): NeighborAnalysis[] {
  const out: NeighborAnalysis[] = [];
  for (let i = 0; i < 5; i++) {
    const below = binary[i];
    const above = binary[i + 1];
    let relation: "承" | "乘" | "比";
    let description: string;
    if (below === "0" && above === "1") {
      relation = "承";
      description = "柔承刚，顺";
    } else if (below === "1" && above === "0") {
      relation = "乘";
      description = "柔乘刚，逆";
    } else {
      relation = "比";
      description = "同性相邻";
    }
    out.push({
      pair: [i, i + 1],
      labels: [lineLabel(i, below === "1"), lineLabel(i + 1, above === "1")],
      relation,
      description,
    });
  }
  return out;
}

export interface FullAnalysis {
  binary: string;
  huGua: string;
  cuoGua: string;
  zongGua: string;
  positions: PositionAnalysis[];
  correspondences: CorrespondenceAnalysis[];
  neighbors: NeighborAnalysis[];
}

export function fullAnalysis(binary: string): FullAnalysis {
  return {
    binary,
    huGua: huGua(binary),
    cuoGua: cuoGua(binary),
    zongGua: zongGua(binary),
    positions: positionAnalysis(binary),
    correspondences: correspondenceAnalysis(binary),
    neighbors: neighborAnalysis(binary),
  };
}
