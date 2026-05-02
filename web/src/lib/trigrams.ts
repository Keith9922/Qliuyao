/**
 * 八卦象意 —— 三爻卦数据。
 *
 * 二进制约定：从下到上 3 位，'1' = 阳爻 ⚊，'0' = 阴爻 ⚋。
 *   乾 ☰ 三阳     "111"
 *   坤 ☷ 三阴     "000"
 *   震 ☳ 一阳在下  "100"
 *   坎 ☵ 一阳居中  "010"
 *   艮 ☶ 一阳在上  "001"
 *   巽 ☴ 一阴在下  "011"
 *   离 ☲ 一阴居中  "101"
 *   兑 ☱ 一阴在上  "110"
 */

export interface Trigram {
  name: string;
  symbol: string;
  element: string;
  attribute: string;
  family: string;
  body: string;
  animal: string;
  season: string;
  direction: string;
  associations: string;
}

export const TRIGRAMS: Record<string, Trigram> = {
  "111": {
    name: "乾",
    symbol: "☰",
    element: "天",
    attribute: "健",
    family: "父",
    body: "首",
    animal: "马",
    season: "晚秋初冬",
    direction: "西北",
    associations: "君主、首脑、刚健、领导、天空、决断、果敢、纯阳、玉、金",
  },
  "000": {
    name: "坤",
    symbol: "☷",
    element: "地",
    attribute: "顺",
    family: "母",
    body: "腹",
    animal: "牛",
    season: "晚夏初秋",
    direction: "西南",
    associations: "母亲、大众、柔顺、承载、土地、孕育、包容、纯阴、布、釜",
  },
  "100": {
    name: "震",
    symbol: "☳",
    element: "雷",
    attribute: "动",
    family: "长男",
    body: "足",
    animal: "龙",
    season: "春",
    direction: "东",
    associations: "震动、奋起、惊蛰、长子、大涂、决躁、苍筤竹、萑苇、行动开始",
  },
  "010": {
    name: "坎",
    symbol: "☵",
    element: "水",
    attribute: "陷",
    family: "中男",
    body: "耳",
    animal: "豕",
    season: "冬",
    direction: "北",
    associations: "险难、深陷、水流、智谋、忧患、月、隐伏、矫輮、弓轮",
  },
  "001": {
    name: "艮",
    symbol: "☶",
    element: "山",
    attribute: "止",
    family: "少男",
    body: "手",
    animal: "狗",
    season: "晚冬初春",
    direction: "东北",
    associations: "停止、稳重、山岳、门阙、果蓏、小石、阍寺、坚守、笃实",
  },
  "011": {
    name: "巽",
    symbol: "☴",
    element: "风",
    attribute: "入",
    family: "长女",
    body: "股",
    animal: "鸡",
    season: "晚春初夏",
    direction: "东南",
    associations: "风、木、入侵、谦逊、不果、进退、绳直、工、白、长",
  },
  "101": {
    name: "离",
    symbol: "☲",
    element: "火",
    attribute: "丽",
    family: "中女",
    body: "目",
    animal: "雉",
    season: "夏",
    direction: "南",
    associations: "光明、附丽、文明、太阳、电、甲胄、戈兵、干燥、华美",
  },
  "110": {
    name: "兑",
    symbol: "☱",
    element: "泽",
    attribute: "悦",
    family: "少女",
    body: "口",
    animal: "羊",
    season: "秋",
    direction: "西",
    associations: "喜悦、口舌、泽、巫师、毁折、附决、刚卤、妾、羊",
  },
};

/**
 * 把 6 位卦串拆成下卦和上卦（自下而上看）。
 *   binary[0..2] = 初/二/三爻 = 下卦
 *   binary[3..5] = 四/五/上爻 = 上卦
 */
export function parseTrigrams(binary: string): { lower: Trigram; upper: Trigram } {
  if (binary.length !== 6 || ![...binary].every((c) => c === "0" || c === "1")) {
    throw new Error(`非法卦串：${binary}`);
  }
  const lowerKey = binary.slice(0, 3);
  const upperKey = binary.slice(3, 6);
  return { lower: TRIGRAMS[lowerKey], upper: TRIGRAMS[upperKey] };
}

/** "上X下Y"格式的卦象标识，例如『水雷屯』。 */
export function trigramPairLabel(binary: string): string {
  const { lower, upper } = parseTrigrams(binary);
  return `${upper.element}${lower.element}`;
}
