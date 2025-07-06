import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabaseServer";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();

    const { data: question } = await supabase
      .from("questions")
      .select("question_text, choice_a_text, choice_b_text")
      .eq("id", params.id)
      .single();

    if (!question) {
      return new Response("Not found", { status: 404 });
    }

    // --- ここからがデザインの変更箇所 ---
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between", // 上下に配置するために変更
            backgroundColor: "#f8fafc",
            backgroundImage:
              "linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)",
            fontFamily: '"Noto Sans JP", sans-serif',
            padding: "60px",
          }}
        >
          {/* ヘッダー: PICK-ONE */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#f97316",
              letterSpacing: "0.1em", // 文字間隔
            }}
          >
            PICK-ONE
          </div>

          {/* メインコンテンツ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 900,
                color: "#333",
                lineHeight: 1.4,
                marginBottom: "60px",
              }}
            >
              {question.question_text}
            </h1>
            <div style={{ display: "flex", gap: "40px", fontSize: "40px" }}>
              <div
                style={{
                  padding: "20px 40px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                }}
              >
                {question.choice_a_text}
              </div>
              <div
                style={{
                  padding: "20px 40px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  color: "#1e293b",
                  border: "2px solid #e2e8f0",
                }}
              >
                {question.choice_b_text}
              </div>
            </div>
          </div>

          {/* フッター */}
          <div style={{ fontSize: "28px", color: "#94a3b8" }}>
            あなたならどっちを選ぶ？
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    // 変更後
    if (e instanceof Error) {
      console.error(e.message);
      return new Response(`Failed to generate image: ${e.message}`, {
        status: 500,
      });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
