"use client";

import { useEffect, useState } from "react";
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
  const [vote, setVote] = useState<string | null>(null);

  useEffect(() => {
    const savedVote = localStorage.getItem(`vote_${question.id}`);
    setVote(savedVote);
  }, [question.id]);

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

  const handleShare = () => {
    // localStorageから投票結果を取得
    const savedVote = localStorage.getItem(`vote_${question.id}`);
    const votedChoiceText =
      savedVote === "choice_a_count"
        ? question.choice_a_text
        : question.choice_b_text;

    // シェアするテキストを動的に作成
    const shareText = `「${question.question_text}」の投票、\n私は「${votedChoiceText}」に投票しました！\n\n#pickone #投票アプリ \nあなたはどっち？`;

    // 現在のページのURLを取得
    const shareUrl = window.location.href;

    // Twitterの投稿画面を開くURLを生成
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;

    // 新しいウィンドウで開く
    window.open(twitterIntentUrl, "_blank", "width=600,height=400");
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
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-x-2 px-6 py-3 bg-black text-white rounded-lg font-semibold shadow-sm hover:bg-gray-800 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <path d="m7 11 2-2-2-2" />
              <path d="M11 13h4" />
            </svg>
            結果をXでシェアする
          </button>
        </div>
      </div>
    </div>
  );
}
