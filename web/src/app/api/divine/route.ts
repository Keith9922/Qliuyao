import { NextResponse } from "next/server";
import { castSixYaos, yaosToBinary, changingIndices, zhuZiRule } from "@/lib/quantum";
import { getHexagram } from "@/lib/hexagrams";
import { fullAnalysis } from "@/lib/analysis";
import { parseTrigrams, trigramPairLabel } from "@/lib/trigrams";

export const runtime = "edge";

/**
 * POST /api/divine
 *
 * 在服务端做一次量子电路模拟（数学上等价于 H⊗H⊗H + 单 shot 测量），
 * 返回完整的本卦/变卦/衍生卦/分析结果。
 *
 * 我们故意把摇卦放在服务端：crypto API 在服务端有更稳定的熵源；
 * 同时 UI 端可以拿到一份完整的"卦象档案"做后续展示，省得反复算。
 */
export async function POST() {
  const yaos = castSixYaos();
  const { ben, bian } = yaosToBinary(yaos);
  const moving = changingIndices(yaos);

  const benHex = getHexagram(ben);
  const benAnalysis = fullAnalysis(ben);
  const benTrigrams = parseTrigrams(ben);

  const hasChange = moving.length > 0;
  const bianHex = hasChange ? getHexagram(bian) : null;
  const bianAnalysis = hasChange ? fullAnalysis(bian) : null;
  const bianTrigrams = hasChange ? parseTrigrams(bian) : null;

  // 衍生卦
  const huHex = getHexagram(benAnalysis.huGua);
  const cuoHex = getHexagram(benAnalysis.cuoGua);
  const zongHex = getHexagram(benAnalysis.zongGua);

  return NextResponse.json({
    castAt: new Date().toISOString(),
    yaos: yaos.map((y) => ({
      index: y.index,
      bitstring: y.bitstring,
      ones: y.ones,
      name: y.name,
      isYang: y.isYang,
      isChanging: y.isChanging,
    })),
    ben: {
      binary: ben,
      hex: benHex,
      analysis: benAnalysis,
      lower: benTrigrams.lower,
      upper: benTrigrams.upper,
      label: trigramPairLabel(ben),
    },
    bian: hasChange
      ? {
          binary: bian,
          hex: bianHex,
          analysis: bianAnalysis,
          lower: bianTrigrams!.lower,
          upper: bianTrigrams!.upper,
          label: trigramPairLabel(bian),
        }
      : null,
    derived: {
      hu: { binary: benAnalysis.huGua, hex: huHex },
      cuo: { binary: benAnalysis.cuoGua, hex: cuoHex },
      zong: { binary: benAnalysis.zongGua, hex: zongHex },
    },
    moving,
    rule: zhuZiRule(moving.length, ben),
  });
}
