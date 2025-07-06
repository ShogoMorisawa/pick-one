import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import EditForm from "./EditForm";
import { notFound } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditPage(props: any) {
  const { params, searchParams } = props;
  const id = Number(params?.id);

  // IDが数字でない場合は404ページを表示
  if (isNaN(id)) {
    notFound();
  }

  // 秘密のパスワードをチェック
  if (searchParams.secret !== process.env.ADMIN_SECRET_KEY) {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id) // 数字に変換したidを使用
    .single();

  if (error || !question) {
    notFound(); // 質問が見つからない場合も404ページを表示
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
