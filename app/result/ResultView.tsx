"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartDataCustomTypesPerDataset,
} from "chart.js";
import type { Question } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

type ResultViewProps = {
  question: Question;
};

export default function ResultView({ question }: ResultViewProps) {
  const router = useRouter();
  const [vote] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`vote_${question.id}`);
    }
    return null;
  });

  const handleResetVote = async () => {
    if (!vote) return;

    const { error } = await supabase.rpc("decrement_vote", {
      question_id: question.id,
      field_name: vote,
    });

    if (error) {
      console.error("Error decrementing vote:", error);
      alert("エラーが発生しました。もう一度お試しください。");
      return;
    }

    localStorage.removeItem(`vote_${question.id}`);
    router.push("/");
  };

  const totalVotes: number = question.choice_a_count + question.choice_b_count;
  const optionAPercentage: number =
    totalVotes > 0
      ? Math.round((question.choice_a_count / totalVotes) * 100)
      : 0;
  const optionBPercentage: number =
    totalVotes > 0
      ? Math.round((question.choice_b_count / totalVotes) * 100)
      : 0;

  const chartData: ChartData = {
    labels: [question.choice_a_text, question.choice_b_text],
    datasets: [
      {
        data: [question.choice_a_count, question.choice_b_count],
        backgroundColor: ["#f97316", "#fb923c"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
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

  const yourVoteText =
    vote === "choice_a_count" ? question.choice_a_text : question.choice_b_text;

  if (!vote) {
    return (
      <div className="text-center text-gray-600 p-8">
        <h2 className="text-xl font-semibold">投票情報が見つかりません</h2>
        <p className="mt-2">トップページからもう一度お試しください。</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-orange-500 transition-all"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg shadow-orange-400/10 border border-orange-400/10 p-6 sm:p-8 w-full text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-tight mb-4">
          {question.question_text}
        </h2>
        <p className="text-gray-600 mb-6">
          あなたは「
          <span className="font-bold text-orange-500">{yourVoteText}</span>
          」に投票しました
        </p>

        <div className="relative w-full max-w-[250px] mx-auto mb-6 aspect-square">
          <Pie
            data={chartData as ChartDataCustomTypesPerDataset<"pie">}
            options={chartOptions as ChartOptions<"pie">}
          />
        </div>

        <div className="w-full max-w-xs mx-auto space-y-3 text-left">
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="font-semibold text-gray-700">
              {question.choice_a_text}
            </span>
            <span className="font-bold text-orange-600 text-lg">
              {optionAPercentage}%
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span className="font-semibold text-gray-700">
              {question.choice_b_text}
            </span>
            <span className="font-bold text-orange-600 text-lg">
              {optionBPercentage}%
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 mb-6">
          合計 {totalVotes.toLocaleString()} 票
        </p>

        <button
          onClick={handleResetVote}
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-300 transition-all"
        >
          もう一度投票し直す
        </button>
      </div>
    </div>
  );
}
