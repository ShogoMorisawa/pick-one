import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  // サイトのURLを取得 (フォントの読み込みに使う)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // クエリパラメータからテキスト情報を取得
  const { searchParams } = new URL(request.url);
  const questionText = searchParams.get("questionText");
  const choiceA = searchParams.get("choiceA");
  const choiceB = searchParams.get("choiceB");

  // ローカルフォントの読み込み
  const fontRegular = fetch(
    new URL(`${siteUrl}/fonts/NotoSansJP-Regular.otf`)
  ).then((res) => res.arrayBuffer());
  const fontBold = fetch(new URL(`${siteUrl}/fonts/NotoSansJP-Bold.otf`)).then(
    (res) => res.arrayBuffer()
  );
  const fontBlack = fetch(
    new URL(`${siteUrl}/fonts/NotoSansJP-Black.otf`)
  ).then((res) => res.arrayBuffer());
  const [fontDataRegular, fontDataBold, fontDataBlack] = await Promise.all([
    fontRegular,
    fontBold,
    fontBlack,
  ]);

  // もしテキストがなければ、デフォルトのOGP画像を返す
  if (!questionText || !choiceA || !choiceB) {
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
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            backgroundImage:
              "linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#f97316",
              letterSpacing: "0.1em",
            }}
          >
            PICK-ONE
          </div>
          <div
            style={{ marginTop: "20px", fontSize: "28px", color: "#94a3b8" }}
          >
            究極の2択で盛り上がろう
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Noto Sans JP",
            data: fontDataRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: fontDataBold,
            weight: 700,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: fontDataBlack,
            weight: 900,
            style: "normal",
          },
        ],
      }
    );
  }

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
          backgroundImage: "linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)",
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
            {questionText}
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
              {choiceA}
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
              {choiceB}
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
          data: fontDataRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: fontDataBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: fontDataBlack,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );
}
