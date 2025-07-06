import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import ResultView from "./ResultView";
import CommentSection from "./CommentSection";

type ResultPageProps = {
  searchParams: {
    id?: string;
  };
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  if (!searchParams.id) {
    redirect("/");
  }

  const supabase = createClient();
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", searchParams.id)
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
