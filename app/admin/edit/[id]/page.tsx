import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import EditForm from "./EditForm"; // ← 次に作成するフォームコンポーネント

type EditPageProps = {
  params: { id: string };
  searchParams: { secret?: string };
};

export default async function EditPage({
  params,
  searchParams,
}: EditPageProps) {
  // 秘密のパスワードをチェック
  if (searchParams.secret !== process.env.ADMIN_SECRET_KEY) {
    redirect("/");
  }

  // 編集対象の質問データを取得
  const supabase = createClient();
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !question) {
    return <p className="p-8 text-center">該当する質問が見つかりません。</p>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">質問を編集する</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <EditForm question={question} />
      </div>
    </div>
  );
}
