import { Suspense } from "react";
import ResultView from "./ResultView";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">読み込み中...</div>}>
      <ResultView />
    </Suspense>
  );
}
