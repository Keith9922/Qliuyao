import Link from "next/link";
import { Taiji } from "./Icon";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink-700/50 bg-ink-950/60">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md border border-gold-500/30 bg-gradient-to-br from-cinnabar-700/30 to-cinnabar-800/30 text-gold-200">
                <Taiji size={18} />
              </span>
              <span className="font-display text-lg text-gold-200">量子六爻</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-200">
              一个量子计算与易经的跨界小实验。
              用 H 门叠加摇出爻象，用经学知识库 + AI 给出反思视角。
              <span className="text-cinnabar-400"> 仅供娱乐参考，不作为人生重大节点的决策依据。</span>
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm tracking-widest text-gold-300">
              快速入口
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-ink-200 hover:text-gold-200">起一卦</Link></li>
              <li><Link href="/quantum" className="text-ink-200 hover:text-gold-200">量子电路原理</Link></li>
              <li><Link href="/index-64" className="text-ink-200 hover:text-gold-200">六十四卦索引</Link></li>
              <li><Link href="/about" className="text-ink-200 hover:text-gold-200">项目缘起</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm tracking-widest text-gold-300">
              资源
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Keith9922/Qliuyao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-200 hover:text-gold-200"
                >
                  GitHub 源码
                </a>
              </li>
              <li>
                <a
                  href="https://platform.deepseek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-200 hover:text-gold-200"
                >
                  DeepSeek 平台
                </a>
              </li>
              <li>
                <a
                  href="https://pypi.org/project/pyqpanda3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-200 hover:text-gold-200"
                >
                  pyqpanda3 SDK
                </a>
              </li>
              <li>
                <Link href="/disclaimer" className="text-cinnabar-400 hover:text-cinnabar-500">
                  免责声明
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-700/40 pt-6 text-xs text-ink-400 md:flex-row">
          <p>© {new Date().getFullYear()} 量子六爻 · MIT License</p>
          <p className="font-mono">
            邵雍 → 莱布尼茨 → 量子比特 · 三千年的二进制
          </p>
        </div>
      </div>
    </footer>
  );
}
