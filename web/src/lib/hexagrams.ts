/**
 * 六十四卦数据 —— 卦辞 + 爻辞 + 彖传 + 大象传。
 *
 * 数据源：通行本《周易》经文，参朱熹《周易本义》。
 *
 * 编码约定：
 *   - 6 位字符串，'1' = 阳爻 ⚊，'0' = 阴爻 ⚋
 *   - 第 0 位 = 初爻（最下），第 5 位 = 上爻（最上）
 *   例：乾 "111111"；屯 "100010"（下震 100 上坎 010）
 */

import data from "./hexagrams.json";

export interface Hexagram {
  /** 1..64 */
  num: number;
  /** 卦名，如 "乾" "屯" "蒙" */
  name: string;
  /** 拼音注音，如 "qián" "zhūn" */
  pinyin: string;
  /** Unicode 卦符，如 "䷀" "䷂" */
  symbol: string;
  /** 卦辞 */
  judgment: string;
  /** 六爻爻辞，自下而上 */
  lines: string[];
  /** 彖传（孔子传，《十翼》之一） */
  tuan: string;
  /** 大象传（"君子以X" 修养格言） */
  daXiang: string;
  /** 用九/用六（仅乾、坤有） */
  extra?: string;
}

export const HEXAGRAMS = data as Record<string, Hexagram>;

export function getHexagram(binary: string): Hexagram {
  const h = HEXAGRAMS[binary];
  if (!h) throw new Error(`未找到卦象 ${binary}`);
  return h;
}

/** 64 卦的索引列表（按编号排序）—— 用于卦序索引页。 */
export function listAllHexagrams(): { binary: string; data: Hexagram }[] {
  return Object.entries(HEXAGRAMS)
    .map(([binary, data]) => ({ binary, data }))
    .sort((a, b) => a.data.num - b.data.num);
}
