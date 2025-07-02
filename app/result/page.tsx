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

  const chartData = {
    labels: [question.optionA, question.optionB],
    datasets: [
      {
        data: [vote === "optionA" ? 100 : 0, vote === "optionB" ? 100 : 0],
        backgroundColor: ["#f97316", "#fb923c"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  // グラフのオプションを更新
  const chartOptions = {
    responsive: true, // コンテナのサイズに追従させる
    maintainAspectRatio: false, // ★変更点1: アスペクト比を維持せず、親要素に完全にフィットさせる
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
          あなたが選んだのは...
        </h2>
        <p className="text-2xl sm:text-3xl font-bold text-orange-500 mb-6">
          「{vote === "optionA" ? question.optionA : question.optionB}」
        </p>

        {/* ★変更点2: グラフを囲うdivに `relative` と `aspect-square` を追加 */}
        <div className="relative w-full max-w-[250px] mx-auto mb-6 aspect-square">
          <Pie data={chartData} options={chartOptions} />
        </div>

        <p className="text-gray-600 mb-6">投票ありがとう！</p>

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
