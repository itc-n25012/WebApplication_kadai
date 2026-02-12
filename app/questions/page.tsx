import { Suspense } from "react";
import QuestionsClient from "./QuestionsClient";

export const dynamic = "force-dynamic"; // ← これが超重要

export default function Page() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>読み込み中...</p>}>
      <QuestionsClient />
    </Suspense>
  );
}
