"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Question {
  id: string;
  question_text: string;
  choice_a_text: string;
  choice_b_text: string;
  choice_a_count: number;
  choice_b_count: number;
}

export default function Home() {
  const router = useRouter();
  const [todayQuestion, setTodayQuestion] = useState<Question | null>(null);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();

      // JSTの今日の0時と翌日の0時をUTCで表現
      const startOfDayJST = new Date(Date.UTC(year, month, date, -9, 0, 0));
      const endOfDayJST = new Date(Date.UTC(year, month, date + 1, -9, 0, 0));

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .gte("publish_at", startOfDayJST.toISOString())
        .lt("publish_at", endOfDayJST.toISOString())
        .order("publish_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching question:", error);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const question = data[0];
        const savedVote = localStorage.getItem(`vote_${question.id}`);
        if (savedVote) {
          router.push("/result");
        } else {
          setTodayQuestion(question);
        }
      }
      setIsLoading(false);
    };

    fetchQuestion();
  }, [router]);

  const handleVote = async (option: "choice_a_count" | "choice_b_count") => {
    if (isVoted || !todayQuestion) return;
    setVotedOption(option);
    setIsVoted(true);
    localStorage.setItem(`vote_${todayQuestion.id}`, option);

    const { error } = await supabase.rpc("increment_vote", {
      question_id: todayQuestion.id,
      field_name: option,
    });

    if (error) {
      console.error("Error incrementing vote:", error);
      // エラーが発生した場合、投票状態をリセットするなどのフォールバック処理を検討
      setIsVoted(false);
      setVotedOption(null);
      localStorage.removeItem(`vote_${todayQuestion.id}`);
      return;
    }

    setTimeout(() => {
      router.push("/result");
    }, 300);
  };

  const getButtonClass = (
    option: "choice_a_count" | "choice_b_count"
  ): string => {
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
              今日のどっち？
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-tight mb-8">
            {todayQuestion.question_text}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
            <button
              onClick={() => handleVote("choice_a_count")}
              disabled={isVoted}
              className={getButtonClass("choice_a_count")}
            >
              {todayQuestion.choice_a_text}
            </button>
            <button
              onClick={() => handleVote("choice_b_count")}
              disabled={isVoted}
              className={getButtonClass("choice_b_count")}
            >
              {todayQuestion.choice_b_text}
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
