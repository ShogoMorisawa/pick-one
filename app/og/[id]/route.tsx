import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const runtime = "edge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, context: any) {
  const { params } = context;

  const font400 = fetch(
    "https://fonts.gstatic.com/s/notosansjp/v60/-F62fjtqLzI2JPCgQBnw7HFowA8.otf"
  ).then((res) => res.arrayBuffer());
  const font700 = fetch(
    "https://fonts.gstatic.com/s/notosansjp/v60/-F6pfjtqLzI2JPCgQBnw7HFyzsd-A4Q2doCvI60.otf"
  ).then((res) => res.arrayBuffer());
  const font900 = fetch(
    "https://fonts.gstatic.com/s/notosansjp/v60/-F6pfjtqLzI2JPCgQBnw7HFyztt9A4Q2doCvI60.otf"
  ).then((res) => res.arrayBuffer());

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase environment variables are not set");
      return new Response("Supabase environment variables are not set", {
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const questionId = Number(params.id);
    if (isNaN(questionId)) {
      notFound();
    }

    const { data: question } = await supabase
      .from("questions")
      .select("question_text, choice_a_text, choice_b_text")
      .eq("id", questionId)
      .single();

    if (!question) {
      return new Response("Question Not found", { status: 404 });
    }

    console.log("Fetched question data:", JSON.stringify(question));

    const fontData400 = await font400;
    const fontData700 = await font700;
    const fontData900 = await font900;

    console.log("Font data loaded successfully.");

    return new ImageResponse(
      (
        <div
          style={{
            fontFamily: '"Noto Sans JP"',
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f8fafc",
            backgroundImage:
              "linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#f97316",
              letterSpacing: "0.1em",
            }}
          >
            PICK-ONE
          </div>
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
          <div style={{ fontSize: "28px", color: "#94a3b8" }}>
            あなたならどっちを選ぶ？
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Noto Sans JP",
            data: fontData400,
            weight: 400,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: fontData700,
            weight: 700,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: fontData900,
            weight: 900,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error(`OGP Image Error: ${e.message}`);
      console.error(e.stack);
      return new Response(`Failed to generate image: ${e.message}`, {
        status: 500,
      });
    }
    console.error("An unexpected error occurred in OGP generation:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
