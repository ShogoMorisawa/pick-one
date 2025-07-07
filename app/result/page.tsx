import { Suspense } from "react";
import ResultView from "./ResultView";
import CommentSection from "./CommentSection";
import { createClient } from "@/lib/supabaseServer";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any): Promise<Metadata> {
  const { searchParams } = props;
  const questionId = Number(searchParams?.id);

  if (isNaN(questionId)) {
    return { title: "結果" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = await createClient();

  const { data: question } = await supabase
    .from("questions")
    .select("question_text, choice_a_text, choice_b_text")
    .eq("id", questionId)
    .single();

  const title = question ? `「${question.question_text}」の結果` : "結果";
  const description = "みんなはどっちに投票した？結果を見てみよう！";

  let ogImage = `${siteUrl}/og`;
  if (question) {
    const params = new URLSearchParams();
    params.set("questionText", question.question_text);
    params.set("choiceA", question.choice_a_text);
    params.set("choiceB", question.choice_b_text);
    ogImage = `${siteUrl}/og?${params.toString()}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ResultPage(props: any) {
  const { searchParams } = props;
  const questionId = Number(searchParams?.id);

  if (isNaN(questionId)) {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", questionId)
    .single();

  if (error || !question) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="text-center p-8">読み込み中...</div>}>
      <ResultView question={question} />
      <CommentSection questionId={question.id} />
    </Suspense>
  );
}
