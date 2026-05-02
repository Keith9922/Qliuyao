# 量子六爻 · Web

把 Python CLI 项目（[../README.md](../README.md)）移植成的网页版。

> 把铜钱换成量子比特 · 让 AI 替你解卦。

## 技术栈

- **Next.js 15** App Router + TypeScript（Edge Runtime）
- **Tailwind CSS** + Framer Motion 做古典 + 量子风格的视觉
- **DeepSeek API** 通过 SSE 流式返回解卦
- **TypeScript 复刻量子电路逻辑**（`src/lib/quantum.ts`），数学等价于 pyqpanda3 H⊗H⊗H + 单 shot 测量

## 目录结构

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              全局 layout（导航 / 页脚 / 历史抽屉）
│   │   ├── page.tsx                首页（起卦）
│   │   ├── quantum/                量子电路科普页
│   │   ├── about/                  项目缘起
│   │   ├── disclaimer/             免责声明
│   │   ├── index-64/               64 卦索引 + 64 个详情页（SSG）
│   │   ├── api/divine/             起卦 API（Edge Runtime）
│   │   ├── api/interpret/          AI 流式解卦 API（Edge Runtime + SSE）
│   │   ├── icon.tsx                动态 favicon
│   │   ├── opengraph-image.tsx     动态 OG 图
│   │   ├── sitemap.ts              动态 sitemap
│   │   ├── robots.ts               robots.txt
│   │   └── not-found.tsx           404
│   ├── components/
│   │   ├── DivinationFlow.tsx      起卦三阶段：提问 → 摇卦 → 出结果
│   │   ├── QuantumCircuit.tsx      量子电路示意图（小尺寸）
│   │   ├── QuantumDeepDive.tsx     量子电路科普：电路 + 概率表 + 卡方实验
│   │   ├── HexagramCard.tsx        卦象大卡（卦辞、彖、大象、爻辞）
│   │   ├── HexagramGlyph.tsx       卦象小图（爻线）
│   │   ├── StructureAnalysis.tsx   爻位/当位/中正/应位/承乘 可视化
│   │   ├── DerivedHexagrams.tsx    互卦 / 错卦 / 综卦 三视角
│   │   ├── Interpretation.tsx      AI 解卦四段流式渲染
│   │   ├── HistoryDrawer.tsx       本地卦签集（localStorage）
│   │   ├── SiteHeader.tsx / SiteFooter.tsx
│   └── lib/
│       ├── quantum.ts              量子电路模拟 + 朱子断卦法
│       ├── trigrams.ts             八卦象意
│       ├── analysis.ts             互错综 + 当位应承结构分析
│       ├── hexagrams.ts / .json    64 卦完整数据
│       ├── prompt.ts               AI 解卦 prompt 构造（移植自 Python 版 v2）
│       ├── history.ts              localStorage 历史
│       └── utils.ts                cn() 等小工具
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
├── vercel.json
└── README.md
```

## 本地开发

```bash
cd web
npm install
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API key

npm run dev
# 打开 http://localhost:3000
```

## 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKeith9922%2FQliuyao&root-directory=web&env=DEEPSEEK_API_KEY&envDescription=DeepSeek%20API%20Key%20for%20AI%20interpretation&envLink=https%3A%2F%2Fplatform.deepseek.com%2Fapi_keys)

### 手动部署

1. 在 Vercel 控制台 **New Project** → 导入这个仓库
2. **Root Directory** 设为 `web`
3. **Framework Preset** 自动识别为 Next.js
4. **Environment Variables** 添加：
   - `DEEPSEEK_API_KEY` = `sk-...`（必需）
   - `LLM_BASE_URL`（可选，默认 `https://api.deepseek.com/v1`）
   - `LLM_MODEL`（可选，默认 `deepseek-chat`）
5. **Deploy**

`vercel.json` 已预设 `regions: ["hkg1", "iad1"]` 让 Edge Function 同时跑在亚洲和北美。

### 切到其他 OpenAI 兼容服务

环境变量改一改即可：

```bash
LLM_BASE_URL=https://api.moonshot.cn/v1   # Kimi
LLM_MODEL=moonshot-v1-32k
DEEPSEEK_API_KEY=sk-...                   # 变量名保留
```

```bash
LLM_BASE_URL=http://localhost:11434/v1    # 本地 Ollama
LLM_MODEL=qwen2.5:7b
DEEPSEEK_API_KEY=ollama
```

## 量子电路移植说明

原版 `liuyao.py` 用 pyqpanda3 的 `CPUQVM` 跑 H⊗H⊗H + 单 shot 测量。
Web 端用 `crypto.getRandomValues` 直接采样均匀整数 [0,8)。

**这两条路在数学上完全等价**——因为 H⊗H⊗H 后的态是 8 个本征态的等幅叠加，
按 Born 法则测量的分布就是均匀的。两边的熵源都是 PRNG，不是物理真随机。
要拿物理真随机，得提交到本源云的悟源真机（pyqpanda3 的 `qcloud` 模块）。

数据见 `/quantum` 页面里的实测分布——10000 shot 卡方 χ² ≈ 4.4，
跟 Python 版的卡方检验输出一致。

## License

MIT，跟主项目一致。
