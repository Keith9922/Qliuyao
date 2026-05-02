import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * 动态 favicon —— 太极 + 量子轨道融合的极简版本。
 * 64×64 输出，浏览器下采样到 32 / 16 仍可辨。
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #15110a 0%, #3d2c14 100%)",
          borderRadius: 8,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#edc44e"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <g strokeWidth="0.7" opacity="0.55">
            <ellipse cx="12" cy="12" rx="11" ry="4.2" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" />
          </g>
          <circle cx="12" cy="12" r="6.6" />
          <path d="M 12 5.4 A 3.3 3.3 0 0 1 12 12 A 3.3 3.3 0 0 0 12 18.6" />
          <circle cx="12" cy="8.7" r="0.85" fill="#edc44e" stroke="none" />
          <circle cx="12" cy="15.3" r="0.85" fill="#edc44e" stroke="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
