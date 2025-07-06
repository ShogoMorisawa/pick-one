"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { supabase } from "@/lib/supabaseClient";
import type { Question } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

export const dynamic = "force-dynamic";

export default function ResultView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [vote, setVote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const questionId = searchParams.get("id");
    if (!questionId) {
      router.push("/");
      return;
    }

    const savedVote = localStorage.getItem(`vote_${questionId}`);
    if (!savedVote) {
      router.push("/");
      return;
    }
    setVote(savedVote);

    const fetchQuestion = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (error || !data) {
        console.error("Error fetching question:", error);
        router.push("/");
        return;
      }

      setQuestion(data);
      setIsLoading(false);
    };

    fetchQuestion();
  }, [searchParams, router]);

  const handleResetVote = async () => {
    if (!question || !vote) return;

    const { error } = await supabase.rpc("decrement_vote", {
      question_id: question.id,
      field_name: vote,
    });

    if (error) {
      console.error("Error incrementing vote:", error);
      alert("エラーが発生しました。もう一度お試しください。");
      return;
    }

    localStorage.removeItem(`vote_${question.id}`);
    router.push("/");
  };

  if (isLoading || !question) {
    return (
      <div className="text-center text-gray-600">
        <h2 className="text-xl font-semibold">結果を読み込んでいます...</h2>
      </div>
    );
  }

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
      <div className="w-full max-w-lg mx-auto px-4 pb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-10">
          みんなのコメント
        </h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <li className="bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
            🍞 パン派！手軽で片手で食べられるから忙しい朝に助かってる。
          </li>
          <li className="bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
            🍙 ごはん派。味噌汁とセットで食べたい気分になります。
          </li>
          <li className="bg-orange-50 border border-dashed border-orange-200 rounded-lg p-4 text-gray-500 italic text-center">
            ※ここにみんなのコメントが表示されます。
          </li>
        </ul>
      </div>

      {/* コメント投稿フォーム */}
      <form
        // onSubmit={handleCommentSubmit}
        className="mt-8 w-full max-w-lg mx-auto px-4"
      >
        <textarea
          className="w-full border border-orange-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
          rows={3}
          placeholder="あなたのコメントを入力してください"
          // value={comment}
          // onChange={(e) => setComment(e.target.value)}
        />
        <div className="mt-3 text-right">
          <button
            type="submit"
            className="bg-orange-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-orange-500 transition"
          >
            コメントを送る
          </button>
        </div>
      </form>
    </div>
  );
}
