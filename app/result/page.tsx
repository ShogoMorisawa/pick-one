import { Suspense } from "react";
import ResultView from "./ResultView";
import CommentSection from "./CommentSection";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import type { Metadata } from "next"; // Metadata型をインポート

type ResultPageProps = {
  searchParams: { id?: string };
};

// ↓ この関数がメタデータを生成する要！
export async function generateMetadata({
  searchParams,
}: ResultPageProps): Promise<Metadata> {
  const questionId = searchParams.id;
  if (!questionId) {
    return { title: "結果" };
  }

  // サイトのURLを環境変数から取得（後で設定）
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const supabase = createClient();
  const { data: question } = await supabase
    .from("questions")
    .select("question_text")
    .eq("id", questionId)
    .single();

  const title = question ? `「${question.question_text}」の結果` : "結果";
  const description = "みんなはどっちに投票した？結果を見てみよう！";
  // OGP画像のURLは、必ずサイトのドメインから始まる絶対パスにする
  const ogImage = `${siteUrl}/og/${questionId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const questionId = searchParams.id;

  if (!questionId) {
    redirect("/");
  }

  const supabase = createClient();
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .single();

  if (error || !question) {
    redirect("/");
  }

  return (
    <Suspense fallback={<div className="text-center p-8">読み込み中...</div>}>
      <ResultView question={question} />
      <CommentSection questionId={question.id} />
    </Suspense>
  );
}
