import { Suspense } from "react";
import ResultView from "./ResultView";
import CommentSection from "./CommentSection";
import { createClient } from "@/lib/supabaseServer";
import { redirect, notFound } from "next/navigation";

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
