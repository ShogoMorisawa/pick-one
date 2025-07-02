"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions, Question } from "@/lib/questions";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const getTodayDateString = () => {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().split("T")[0];
};

export default function ResultPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [vote, setVote] = useState<"optionA" | "optionB" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const todayId = "2025-07-02";
    const savedVote = localStorage.getItem(`vote_${todayId}`) as
      | "optionA"
      | "optionB"
      | null;
    const currentQuestion = questions.find((q) => q.id === todayId);

    if (!savedVote || !currentQuestion) {
      router.push("/");
      return;
    }

    setVote(savedVote);
    setQuestion(currentQuestion);
  }, [router]);

  const handleResetVote = () => {
    if (question) {
      localStorage.removeItem(`vote_${question.id}`);
      router.push("/");
    }
  };

  if (!question || !vote) {
    return null;
  }

  // --- ▼ここからが新しいロジック▼ ---
  // 1. 合計投票数とパーセンテージを計算する
  const totalVotes = question.optionACount + question.optionBCount;
  const optionAPercentage =
    totalVotes > 0 ? Math.round((question.optionACount / totalVotes) * 100) : 0;
  const optionBPercentage = 100 - optionAPercentage; // 合計が100%になるように調整

  // 2. グラフのデータを、自分の投票(100%)から全体の投票数に差し替える
  const chartData = {
    labels: [question.optionA, question.optionB],
    datasets: [
      {
        data: [question.optionACount, question.optionBCount], // ★変更点
        backgroundColor: ["#f97316", "#fb923c"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg shadow-orange-400/10 border border-orange-400/10 p-6 sm:p-8 w-full text-center">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
          投票結果
        </h2>
        <p className="text-gray-600 mb-6">
          あなたは「
          <span className="font-bold text-orange-500">
            {vote === "optionA" ? question.optionA : question.optionB}
          </span>
          」に投票しました
        </p>

        <div className="relative w-full max-w-[250px] mx-auto mb-6 aspect-square">
          <Pie data={chartData} options={chartOptions} />
        </div>

        {/* 3. パーセンテージ表示用のコンポーネントを追加 */}
        <div className="w-full max-w-xs mx-auto space-y-3 text-left">
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="font-semibold text-gray-700">
              {question.optionA}
            </span>
            <span className="font-bold text-orange-600 text-lg">
              {optionAPercentage}%
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="font-semibold text-gray-700">
              {question.optionB}
            </span>
            <span className="font-bold text-orange-600 text-lg">
              {optionBPercentage}%
            </span>
          </div>
        </div>

        {/* 4. 合計票数を表示 */}
        <p className="text-sm text-gray-500 mt-6 mb-6">
          合計 {totalVotes.toLocaleString()} 票
        </p>

        <button
          onClick={handleResetVote}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-300 transition-all"
        >
          もう一度投票する
        </button>
      </div>
    </div>
  );
}
