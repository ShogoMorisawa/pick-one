"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient"; // クライアント用のSupabaseをインポート
import type { Comment } from "@/lib/types";

// Propsの型を number に修正
type CommentSectionProps = {
  questionId: number;
};

export default function CommentSection({ questionId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // コメントを取得する
  useEffect(() => {
    const fetchComments = async () => {
      setIsCommentsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("question_id", questionId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } else {
        setComments(data);
      }
      setIsCommentsLoading(false);
    };

    fetchComments();
  }, [questionId]);

  // コメントを投稿する
  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({ comment_text: newComment, question_id: questionId })
      .select()
      .single();

    if (error) {
      console.error("Error submitting comment:", error);
      alert("コメントの送信に失敗しました。");
    } else {
      setComments([data, ...comments]);
      setNewComment("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-8 pt-8">
      <div className="bg-white rounded-2xl shadow-lg shadow-orange-400/10 border border-orange-400/10 p-6 sm:p-8 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          みんなのコメント
        </h3>
        {/* コメント表示と投稿フォーム */}
        <div className="space-y-4">
          {isCommentsLoading ? (
            <p className="text-gray-500">コメントを読み込んでいます...</p>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <p className="whitespace-pre-wrap text-sm">
                  {comment.comment_text}
                </p>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {new Date(comment.created_at).toLocaleString("ja-JP")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">
              まだコメントはありません。
            </p>
          )}
        </div>
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            className="w-full border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            rows={2}
            placeholder="コメントを追加..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="mt-2 text-right">
            <button
              type="submit"
              className="bg-orange-400 text-white font-semibold px-4 py-1.5 rounded-md hover:bg-orange-500 transition text-sm disabled:bg-gray-300"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
