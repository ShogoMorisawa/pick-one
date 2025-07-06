import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer"; // サーバー用クライアント
import type { Question } from "@/lib/types";
import CreateQuestionForm from "./CreateQuestionForm";
import QuestionActions from "./QuestionActions";

type AdminPageProps = {
  searchParams: {
    secret?: string;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // 1. 秘密のパスワードをチェック
  const secretKey = process.env.ADMIN_SECRET_KEY;
  if (searchParams.secret !== secretKey) {
    // パスワードが違う、または無い場合はトップページにリダイレクト
    redirect("/");
  }

  // 2. Supabaseから全質問を取得
  const supabase = await createClient();
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .order("publish_at", { ascending: false });

  if (error) {
    return (
      <p className="text-center text-red-500">
        エラーが発生しました: {error.message}
      </p>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">管理者ページ</h1>

      <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">新しい質問を作成</h2>
        <CreateQuestionForm />
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">既存の質問一覧</h2>
        <ul className="space-y-4">
          {questions.map((q: Question) => {
            const editUrl = `/admin/edit/${q.id}?secret=${secretKey}`;
            return (
              <li key={q.id} className="p-4 border rounded-md bg-gray-50">
                <p className="font-bold text-lg">{q.question_text}</p>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p>
                    A: {q.choice_a_text} ({q.choice_a_count}票)
                  </p>
                  <p>
                    B: {q.choice_b_text} ({q.choice_b_count}票)
                  </p>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500">
                      <strong>公開日時:</strong>
                      {q.publish_at
                        ? new Date(q.publish_at).toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "即時公開済み"}
                    </p>
                  </div>
                </div>
                <QuestionActions questionId={q.id} editUrl={editUrl} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
