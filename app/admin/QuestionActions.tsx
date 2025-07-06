"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type QuestionActionsProps = {
  questionId: number;
  editUrl: string;
};

export default function QuestionActions({
  questionId,
  editUrl,
}: QuestionActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "この質問を本当に削除しますか？この操作は元に戻せません。"
    );

    if (!isConfirmed) {
      return;
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      alert(`エラーが発生しました: ${error.message}`);
    } else {
      alert("質問が削除されました。");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-x-4 mt-4">
      <Link
        href={editUrl}
        className="px-4 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        編集
      </Link>
      <button
        onClick={handleDelete}
        className="px-4 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
      >
        削除
      </button>
    </div>
  );
}
