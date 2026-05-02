import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-5 py-16 text-center">
      <div className="text-6xl text-gold-300 opacity-60">☷</div>
      <h1 className="font-display text-4xl text-gold-200">迷复，凶</h1>
      <p className="font-serif text-base text-ink-200">
        《复》卦上六爻辞说：「迷复，凶。」<br />
        走错了路就要回头——这个页面并不存在。
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">回到起卦</Link>
        <Link href="/index-64" className="btn-ghost">六十四卦索引</Link>
      </div>
    </div>
  );
}
