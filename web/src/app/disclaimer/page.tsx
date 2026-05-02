import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/Icon";

export const metadata: Metadata = {
  title: "免责声明",
  description:
    "量子六爻是一个量子计算与易经的跨界文化实验，仅供娱乐与反思。本页详细说明产品边界、AI 解卦的局限、以及哪些事不应该交给一个卦来决定。",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-16">
      <header className="text-center">
        <p className="font-display text-[11px] tracking-[0.5em] text-cinnabar-400">
          DISCLAIMER · 免责声明
        </p>
        <h1 className="mt-4 font-display text-4xl text-gold-100 md:text-5xl">
          请先读完，再起卦
        </h1>
      </header>

      <div className="mt-10 scroll-card-elevated stamp-border p-7 md:p-10">
        <div className="mb-6 rounded-md border border-cinnabar-500/40 bg-cinnabar-700/20 px-5 py-4">
          <p className="flex items-center gap-2 font-display text-base text-cinnabar-300">
            <Alert size={18} />
            <span>重要提示</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-100">
            <strong>本项目内容仅供娱乐与文化体验，仅作为反思视角参考，
              不作为人生重大关键节点的决策依据。</strong>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            涉及健康、医疗、金钱、投资、法律、婚姻、安全、生命等重要决定，请咨询持牌专业人士；
            涉及紧急或心理危机，请联系所在地的应急服务或专业心理援助热线。
          </p>
        </div>

        <div className="prose-custom space-y-4">
          <section>
            <h2>1. 这是一个跨界文化实验</h2>
            <p>
              量子六爻把传统六爻卦法的「三铜钱」换成了三比特 Hadamard 量子电路，
              再用 AI（DeepSeek）配合《周易》经文与十翼传注做一段白话推演。
              它的初衷是：
            </p>
            <ul>
              <li>把量子计算的随机过程做一次有意思的可视化；</li>
              <li>提供一个接触易经原典文本的入口；</li>
              <li>每天来一签，作为一种<em>反思工具</em>，借经文外部视角想想自己的事。</li>
            </ul>
          </section>

          <section>
            <h2>2. 量子电路的边界</h2>
            <p>
              电路的数学模型是真的 —— 三比特 H 门叠加 + 单 shot 测量，得到 8 种本征态等概率分布。
              但这里的随机源来自 PRNG（伪随机数生成器），不是物理量子真随机。
              要拿到「物理意义上的真随机」，得把电路提交到本源云的悟源超导真机。
            </p>
            <p>
              <strong>所以「卦象本身」并不是被某种神秘力量挑出来的</strong> ——
              它就是一段算法均匀采样的结果。
            </p>
          </section>

          <section>
            <h2>3. AI 解卦是文本引申，不是预言</h2>
            <p>
              AI 的输出基于<strong>《周易》经文 + 彖传 + 大象传 + 八卦象意 + 朱子断卦法</strong>
              的结构化推理。它会引用原文，再结合你的问题给出可能的反思方向。
            </p>
            <p>
              这本质上是一个<em>有约束的语言模型生成</em>。它不能：
            </p>
            <ul>
              <li>预测具体的事件、时间、人名、数字；</li>
              <li>替你做决定；</li>
              <li>诊断疾病、推荐用药、给出投资标的；</li>
              <li>判断是非对错的法律问题。</li>
            </ul>
          </section>

          <section>
            <h2>4. 哪些事不应该交给一个卦</h2>
            <ul>
              <li>是否做某项医疗手术、是否服用某种药物；</li>
              <li>是否进行某项投资或借贷；</li>
              <li>是否结婚、离婚、生育；</li>
              <li>是否签署具有法律效力的合同；</li>
              <li>涉及他人生命、安全、财产、名誉的决定。</li>
            </ul>
            <p>对这些事，<strong>请寻找经过训练的专业人士</strong>，不要把一段算法的输出当作答案。</p>
          </section>

          <section>
            <h2>5. 数据与隐私</h2>
            <p>
              你输入的问题会作为 prompt 一部分发送给 AI 接口（默认 DeepSeek），用于生成解读。
              本站不会持久化保存你的提问记录；但请避免输入<strong>身份证号、银行账号、密码、商业秘密</strong>
              等敏感信息。
            </p>
          </section>

          <section>
            <h2>6. 项目性质</h2>
            <p>
              本项目使用 MIT License 开源（<a href="https://github.com/Keith9922/Qliuyao" target="_blank" rel="noopener noreferrer">GitHub</a>）。
              作者不对任何使用者基于本项目输出做出的行为或决策负任何法律责任。
            </p>
          </section>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink-200">如果以上你都看过、并理解了：</p>
        <Link href="/" className="btn-primary">我明白了，去起一卦</Link>
        <p className="mt-2 text-[11px] text-ink-400">祝你卦象有趣，反思有得。</p>
      </div>
    </div>
  );
}
