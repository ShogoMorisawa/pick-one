"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions, Question } from "@/lib/questions";

export default function Home() {
  const router = useRouter();
  const [todayQuestion, setTodayQuestion] = useState<Question | null>(null);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // コンポーネントのマウント時に投票履歴を確認し、必要ならリダイレクト
  useEffect(() => {
    setIsLoading(true);
    const questionIdForToday = getTodayDateString();
    const question = questions.find((q) => q.id === questionIdForToday);

    if (question) {
      const savedVote = localStorage.getItem(`vote_${question.id}`);
      if (savedVote) {
        router.push("/result");
      } else {
        setTodayQuestion(question);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // (handleVote, getTodayDateString, getButtonClassは変更なし)
  const handleVote = (option: "optionA" | "optionB") => {
    if (isVoted || !todayQuestion) return;
    setVotedOption(option);
    setIsVoted(true);
    localStorage.setItem(`vote_${todayQuestion.id}`, option);
    setTimeout(() => {
      router.push("/result");
    }, 300);
  };

  const getTodayDateString = (): string => {
    const today: Date = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().split("T")[0];
  };

  const getButtonClass = (option: "optionA" | "optionB"): string => {
    const baseClass: string =
      "w-full p-5 rounded-xl text-lg font-semibold text-white transition-all duration-300 ease-in-out shadow-lg transform";
    if (!isVoted)
      return `${baseClass} bg-orange-400 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-xl active:scale-95`;
    if (votedOption === option)
      return `${baseClass} bg-orange-500 scale-105 shadow-2xl ring-4 ring-white/50`;
    return `${baseClass} bg-gray-300 text-gray-600 scale-95 opacity-70`;
  };

  if (isLoading) {
    return null;
  }

  return (
    // pt-20を削除し、レイアウトは親(main)に任せる
    <div className="w-full max-w-lg mx-auto">
      {!todayQuestion ? (
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold">今日の質問は準備中です。</h2>
          <p className="mt-2">また明日、のぞきに来てね！</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-400/10 border border-orange-400/10 p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-semibold px-5 py-2 rounded-full text-sm border border-orange-400/20">
              {new Date(todayQuestion.id).toLocaleDateString("ja-JP", {
                month: "numeric",
                day: "numeric",
              })}
              のどっち？
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-tight mb-8">
            {todayQuestion.text}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
            <button
              onClick={() => handleVote("optionA")}
              disabled={isVoted}
              className={getButtonClass("optionA")}
            >
              {todayQuestion.optionA}
            </button>
            <button
              onClick={() => handleVote("optionB")}
              disabled={isVoted}
              className={getButtonClass("optionB")}
            >
              {todayQuestion.optionB}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm font-medium">
            {isVoted ? "結果ページに移動します..." : "※1人1回まで投票できます"}
          </p>
        </div>
      )}
    </div>
  );
}
