"use client";

import { useState, useEffect } from "react";
import { questions, Question } from "@/lib/questions";

// --- ヘルパー関数 ---
// 今日の日付を 'YYYY-MM-DD' 形式の文字列で取得
const getTodayDateString = () => {
  const today = new Date();
  // JSTに補正 (UTC+9)
  today.setHours(today.getHours() + 9);
  return today.toISOString().split("T")[0];
};

export default function Home() {
  const [todayQuestion, setTodayQuestion] = useState<Question | null>(null);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);

  // コンポーネントのマウント時に質問と投票履歴をセット
  useEffect(() => {
    // 2025-07-02の質問を強制的に表示（テスト用）
    // 本番では getTodayDateString() を使う
    const questionIdForToday = "2025-07-02";
    // const questionIdForToday = getTodayDateString();

    const question = questions.find((q) => q.id === questionIdForToday);
    setTodayQuestion(question || null);

    if (question) {
      const savedVote = localStorage.getItem(`vote_${question.id}`);
      if (savedVote) {
        setVotedOption(savedVote);
        setIsVoted(true);
      }
    }
  }, []);

  // 投票処理
  const handleVote = (option: "optionA" | "optionB") => {
    if (isVoted || !todayQuestion) return;

    setVotedOption(option);
    setIsVoted(true);
    localStorage.setItem(`vote_${todayQuestion.id}`, option);
  };

  // 投票ボタンのスタイルを動的に変更するための関数
  const getButtonClass = (option: "optionA" | "optionB") => {
    const baseClass =
      "w-full p-5 rounded-xl text-lg font-semibold text-white transition-all duration-300 ease-in-out shadow-lg transform";

    if (!isVoted) {
      return `${baseClass} bg-orange-400 hover:bg-orange-500 hover:-translate-y-1 hover:shadow-xl active:scale-95`;
    }

    if (votedOption === option) {
      return `${baseClass} bg-orange-500 scale-105 shadow-2xl ring-4 ring-white/50`;
    } else {
      return `${baseClass} bg-gray-300 text-gray-600 scale-95 opacity-70`;
    }
  };

  return (
    <div className="flex flex-col h-full w-full flex-grow justify-center items-center max-w-lg mx-auto px-4">
      {!todayQuestion ? (
        // 質問がない場合の表示
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold">今日の質問は準備中です。</h2>
          <p className="mt-2">また明日、のぞきに来てね！</p>
        </div>
      ) : (
        // 質問がある場合の表示
        <div className="bg-white rounded-2xl shadow-lg shadow-orange-400/10 border border-orange-400/10 p-6 sm:p-8">
          {/* 日付 */}
          <div className="flex justify-center mb-6">
            <div className="inline-block bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-semibold px-5 py-2 rounded-full text-sm border border-orange-400/20">
              {new Date(todayQuestion.id).toLocaleDateString("ja-JP", {
                month: "numeric",
                day: "numeric",
              })}
              のどっち？
            </div>
          </div>

          {/* 質問文 */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-tight mb-8">
            {todayQuestion.text}
          </h2>

          {/* 投票ボタン */}
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

          {/* 注意書き */}
          <p className="text-center text-gray-500 text-sm font-medium">
            {isVoted ? "投票ありがとう！" : "※1人1回まで投票できます"}
          </p>
        </div>
      )}
    </div>
  );
}
