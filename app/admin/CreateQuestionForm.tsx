"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CreateQuestionForm() {
  const [questionText, setQuestionText] = useState<string>("");
  const [choiceA, setChoiceA] = useState<string>("");
  const [choiceB, setChoiceB] = useState<string>("");
  const [publishAt, setPublishAt] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!questionText.trim() || !choiceA.trim() || !choiceB.trim()) {
      alert("すべてのフィールドを入力してください。");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("questions").insert({
      question_text: questionText,
      choice_a_text: choiceA,
      choice_b_text: choiceB,
      publish_at: publishAt || new Date().toISOString(),
    });

    if (error) {
      setMessage(`エラーが発生しました: ${error.message}`);
    } else {
      setMessage("質問が作成されました。");
      setQuestionText("");
      setChoiceA("");
      setChoiceB("");
      setPublishAt("");
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="questionText"
          className="block text-sm font-medium text-gray-700"
        >
          質問文
        </label>
        <textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          rows={2}
        />
      </div>
      <div>
        <label
          htmlFor="choiceA"
          className="block text-sm font-medium text-gray-700"
        >
          選択肢 A
        </label>
        <input
          type="text"
          id="choiceA"
          value={choiceA}
          onChange={(e) => setChoiceA(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div>
        <label
          htmlFor="choiceB"
          className="block text-sm font-medium text-gray-700"
        >
          選択肢 B
        </label>
        <input
          type="text"
          id="choiceB"
          value={choiceB}
          onChange={(e) => setChoiceB(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      <div>
        <label
          htmlFor="publishAt"
          className="block text-sm font-medium text-gray-700"
        >
          公開日時（任意）
        </label>
        <input
          type="datetime-local"
          id="publishAt"
          value={publishAt}
          onChange={(e) => setPublishAt(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          ※空欄のままだと、すぐに公開されます。
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "作成中..." : "作成する"}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </form>
  );
}
