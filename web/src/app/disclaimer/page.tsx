import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/Icon";

export const metadata: Metadata = {
  title: "免责声明",
  description:
    "量子六爻是量子计算 + 易经的跨界文化实验，仅供娱乐与反思参考，不作为人生重大节点的决策依据。",
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
        <div className="mb-6 flex items-start gap-3 rounded-md border border-cinnabar-500/40 bg-cinnabar-700/20 px-5 py-4">
          <span className="mt-1 shrink-0 text-cinnabar-300">
            <Alert size={20} />
          </span>
          <p className="font-serif text-sm leading-relaxed text-ink-100">
            <strong className="font-display text-cinnabar-300">本项目内容仅供娱乐与反思。</strong>
            涉及健康 / 投资 / 法律 / 婚姻 / 安全 等重要决定，请咨询持牌专业人士。
          </p>
        </div>

        <div className="prose-custom space-y-5">
          <section>
            <h2>这是什么</h2>
            <p>
              一个跨界实验：把传统铜钱卦法的随机源换成<strong>三比特 Hadamard 量子电路</strong>，
              再用 AI 配合周易经文 + 十翼传注做白话推演。
              用它当作一个反思工具——给生活里某件没想清楚的事，换一个外部视角。
            </p>
          </section>

          <section>
            <h2>它能做什么 / 不能做什么</h2>
            <p>AI 输出基于经文做<strong>有约束的语言生成</strong>，有边界：</p>
            <ul>
              <li>✓ 引用卦辞 / 爻辞 / 彖传 / 大象传，给出反思方向</li>
              <li>✗ 预测具体事件 / 时间 / 人名 / 数字</li>
              <li>✗ 替你做医疗、投资、法律、婚姻等决定</li>
              <li>✗ 替代专业咨询</li>
            </ul>
          </section>

          <section>
            <h2>关于「真随机」</h2>
            <p>
              电路的数学是真量子力学。但底层熵源是 PRNG——要拿物理真随机得提交真机。
              所以「卦象」不是被神秘力量挑出来的，是均匀采样的结果。
            </p>
          </section>

          <section>
            <h2>数据 / License</h2>
            <p>
              你的提问会作为 prompt 发送给 AI 接口生成解读，本站不持久化保存。
              请勿输入<strong>身份证号 / 银行账号 / 密码 / 商业秘密</strong>等敏感信息。
              MIT License · <a href="https://github.com/Keith9922/Qliuyao" target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>
          </section>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <Link href="/" className="btn-primary">我明白了，去起一卦</Link>
      </div>
    </div>
  );
}
