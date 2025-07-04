"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions, Question } from "@/lib/questions";
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

ChartJS.register(ArcElement, Tooltip, Legend);

// 今日の日付を取得(yyyy-mm-dd)
const getTodayDateString = (): string => {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().split("T")[0];
};

export default function ResultPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [vote, setVote] = useState<"optionA" | "optionB" | null>(null);
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const todayId = getTodayDateString();
    // 投票履歴を取得
    const savedVote = localStorage.getItem(`vote_${todayId}`) as
      | "optionA"
      | "optionB"
      | null;
    // 質問を取得
    const currentQuestion = questions.find((q) => q.id === todayId);

    if (!savedVote || !currentQuestion) {
      router.push("/");
      return;
    }

    // 投票履歴をセット
    setVote(savedVote);
    // 質問をセット
    setQuestion(currentQuestion);
  }, [router]);

  const handleResetVote = () => {
    if (question) {
      // 投票履歴を削除
      localStorage.removeItem(`vote_${question.id}`);
      router.push("/");
    }
  };

  if (!question || !vote) {
    return null;
  }

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) {
      return;
    }
    alert("コメント機能はまだ実装されていません。");
    setComment("");
  };

  // 合計投票数とパーセンテージを計算する
  const totalVotes: number = question.optionACount + question.optionBCount;
  const optionAPercentage: number =
    totalVotes > 0 ? Math.round((question.optionACount / totalVotes) * 100) : 0;
  const optionBPercentage: number = 100 - optionAPercentage;

  // グラフのデータを、自分の投票(100%)から全体の投票数に差し替える
  const chartData: ChartData = {
    labels: [question.optionA, question.optionB],
    datasets: [
      {
        data: [question.optionACount, question.optionBCount],
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

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
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
          <Pie
            data={chartData as ChartDataCustomTypesPerDataset<"pie">}
            options={chartOptions as ChartOptions<"pie">}
          />
        </div>

        {/* パーセンテージ表示用のコンポーネント */}
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

        {/* 合計票数を表示 */}
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
      {/* コメントセクション */}
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
        onSubmit={handleCommentSubmit}
        className="mt-8 w-full max-w-lg mx-auto px-4"
      >
        <textarea
          className="w-full border border-orange-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
          rows={3}
          placeholder="あなたのコメントを入力してください"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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
