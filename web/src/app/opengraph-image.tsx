import { ImageResponse } from "next/og";

export const alt = "量子六爻 · 把铜钱换成量子比特，让 AI 替你解卦";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center top, #1a140d 0%, #0c0a07 100%)",
          color: "#ece5d4",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              border: "2px solid rgba(237,196,78,0.3)",
              background:
                "linear-gradient(135deg, rgba(124,38,24,0.4), rgba(86,24,17,0.4))",
              color: "#edc44e",
              fontSize: 64,
            }}
          >
            ☯
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 80, color: "#f4dd8a", letterSpacing: 6 }}>
              量子六爻
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#a07e3c",
                letterSpacing: 8,
                marginTop: 8,
              }}
            >
              QUANTUM · LIUYAO
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            color: "#ece5d4",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          把铜钱换成量子比特，让 AI 替你解卦
        </div>

        <div
          style={{
            fontSize: 20,
            color: "#7a5a25",
            marginTop: 60,
            display: "flex",
            gap: 24,
            fontFamily: "monospace",
          }}
        >
          <span>邵雍</span>
          <span style={{ color: "#3d2c14" }}>→</span>
          <span>莱布尼茨</span>
          <span style={{ color: "#3d2c14" }}>→</span>
          <span style={{ color: "#92aeff" }}>量子比特</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
