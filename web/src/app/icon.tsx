import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #15110a, #3d2c14)",
          color: "#edc44e",
          fontSize: 44,
          fontFamily: "serif",
          borderRadius: 8,
        }}
      >
        ☯
      </div>
    ),
    { ...size }
  );
}
