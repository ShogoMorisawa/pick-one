"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Question } from "@/lib/types";

type EditFormProps = {
  question: Question;
};

export default function EditForm({ question }: EditFormProps) {
  // propsで受け取った質問データでstateを初期化
  const [questionText, setQuestionText] = useState(question.question_text);
  const [choiceA, setChoiceA] = useState(question.choice_a_text);
  const [choiceB, setChoiceB] = useState(question.choice_b_text);
  const [publishAt, setPublishAt] = useState(
    question.publish_at
      ? new Date(question.publish_at).toISOString().slice(0, 16)
      : ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase
      .from("questions")
      .update({
        question_text: questionText,
        choice_a_text: choiceA,
        choice_b_text: choiceB,
        publish_at: publishAt || new Date().toISOString(),
      })
      .eq("id", question.id);

    if (error) {
      setMessage(`更新エラー: ${error.message}`);
    } else {
      setMessage("質問が正常に更新されました！");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          質問文
        </label>
        <textarea
          id="question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          rows={3}
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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          ※空欄のままだと、更新時に即時公開されます。
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "更新中..." : "更新する"}
        </button>
        {message && <p className="text-sm">{message}</p>}
      </div>
    </form>
  );
}
