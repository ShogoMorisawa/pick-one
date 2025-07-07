import { ImageResponse } from "next/og";

// このルートはEdge Runtimeで動作します
export const runtime = "edge";

// 画像のサイズを設定
export const size = {
  width: 1200,
  height: 630,
};

// 画像のContent-Typeを設定
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          backgroundImage: "linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)",
        }}
      >
        <div
          style={{
            fontSize: "100px",
            fontWeight: "bold",
            color: "#f97316",
            letterSpacing: "0.1em",
          }}
        >
          PICK-ONE
        </div>
        <div style={{ marginTop: "20px", fontSize: "36px", color: "#94a3b8" }}>
          究極の2択で盛り上がろう
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
