import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, Noto_Sans_SC, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HistoryFab } from "@/components/HistoryFab";

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qliuyao.vercel.app"),
  title: {
    default: "量子六爻 · Quantum Liuyao",
    template: "%s · 量子六爻",
  },
  description:
    "把铜钱换成量子比特，让 AI 替你解卦。基于本源量子 pyqpanda3 的 H 门叠加 + 单 shot 测量起卦，DeepSeek V4 Pro 配合《周易》经学知识库做白话解读。",
  keywords: [
    "易经",
    "周易",
    "六爻",
    "量子计算",
    "量子卜卦",
    "Quantum",
    "I-Ching",
    "Liuyao",
    "Hadamard",
    "DeepSeek",
    "AI 解卦",
  ],
  authors: [{ name: "Qliuyao" }],
  openGraph: {
    title: "量子六爻 · Quantum Liuyao",
    description: "量子比特摇出六爻 · AI 配合经学解卦",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "量子六爻",
    description: "量子比特摇出六爻 · AI 配合经学解卦",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0a07",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">跳到主内容</a>
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <HistoryFab />
      </body>
    </html>
  );
}
