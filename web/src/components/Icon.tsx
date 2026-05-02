import type { ReactElement, SVGProps } from "react";

/**
 * 内联 SVG 图标集 —— 全项目唯一图标来源。
 *
 * 设计原则（来自 ui-ux-pro-max + frontend-design）：
 *   - SVG only，不用 emoji 当结构性图标
 *   - 一致的描边宽度（1.5）与圆角风格
 *   - 24×24 viewBox，currentColor 跟随父级文字色
 *
 * 引入新图标时：保持 stroke="currentColor" + 1.5px 描边 + 不要写死颜色。
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function makeIcon(displayName: string, render: (p: IconProps) => ReactElement) {
  function Icon({ size = 18, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...rest}
      >
        {render(rest)}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

/* ───────────── 基础导航 ───────────── */

export const ArrowRight = makeIcon("ArrowRight", () => (
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>
));

export const ArrowLeft = makeIcon("ArrowLeft", () => (
  <>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </>
));

export const Close = makeIcon("Close", () => (
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>
));

export const Menu = makeIcon("Menu", () => (
  <>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </>
));

/* ───────────── 项目语义图标 ───────────── */

/** 卷轴（历史抽屉） */
export const Scroll = makeIcon("Scroll", () => (
  <>
    <path d="M19 5v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
    <path d="M9 7h6" />
    <path d="M9 11h6" />
    <path d="M9 15h4" />
  </>
));

/** 复制 */
export const Copy = makeIcon("Copy", () => (
  <>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </>
));

/** ✓ */
export const Check = makeIcon("Check", () => <path d="m5 12 5 5L20 7" />);

/** 警告（用于免责） */
export const Alert = makeIcon("Alert", () => (
  <>
    <path d="M12 3 2 21h20L12 3Z" />
    <path d="M12 10v5" />
    <circle cx="12" cy="18" r="0.6" fill="currentColor" />
  </>
));

/** 量子 / 原子（轨道交叉） */
export const Atom = makeIcon("Atom", () => (
  <>
    <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
  </>
));

/** 太极（项目主标识） */
export const Taiji = makeIcon("Taiji", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="16.5" r="1" />
  </>
));

/** 书 / 经文 */
export const Book = makeIcon("Book", () => (
  <>
    <path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5Z" />
    <path d="M4 19a2 2 0 0 1 2-2h13" />
  </>
));

/** 闪电 / 摇卦动作 */
export const Spark = makeIcon("Spark", () => (
  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
));

/** 实验 / 烧瓶 */
export const Flask = makeIcon("Flask", () => (
  <>
    <path d="M9 3h6" />
    <path d="M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3" />
    <path d="M7.5 14h9" />
  </>
));

/** AI / 火花 */
export const Sparkles = makeIcon("Sparkles", () => (
  <>
    <path d="M11 3 13 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
    <path d="M19 14v4M17 16h4" />
  </>
));

/** 网格 / 64 卦索引 */
export const Grid = makeIcon("Grid", () => (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </>
));

/** 全球（Web） */
export const Globe = makeIcon("Globe", () => (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18Z" />
  </>
));

/** 播放（运行电路） */
export const Play = makeIcon("Play", () => (
  <path d="M7 5v14l12-7-12-7Z" fill="currentColor" stroke="none" />
));

/** 刷新 */
export const Refresh = makeIcon("Refresh", () => (
  <>
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
    <path d="M3 21v-5h5" />
  </>
));
