"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { label: "ネットワーク", value: "network" },
  { label: "データベース", value: "database" },
  { label: "セキュリティ", value: "security" },
];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(5);

  const startQuiz = () => {
    if (!selectedCategory) return;
    router.push(`/questions?category=${selectedCategory}&limit=${limit}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "12px",
          width: "340px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1>基本情報対策アプリ</h1>
        <p style={{ color: "#888", fontSize: "14px" }}>
          分野と問題数を選択してください
        </p>

        {/* 分野選択 */}
        <div style={{ marginTop: "24px" }}>
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: selectedCategory === c.value ? "#0070f3" : "#fff",
                color: selectedCategory === c.value ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 問題数選択 */}
        <p style={{ marginTop: "16px", fontSize: "14px", color: "#888" }}>
          挑戦する問題数
        </p>

        <div style={{ margin: "12px 0" }}>
          {[3, 5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => setLimit(n)}
              style={{
                margin: "0 6px",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: limit === n ? "#22c55e" : "#fff",
                color: limit === n ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {n}問
            </button>
          ))}
        </div>

        <button
          onClick={startQuiz}
          disabled={!selectedCategory}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: selectedCategory ? "#22c55e" : "#ccc",
            color: "#fff",
            cursor: selectedCategory ? "pointer" : "not-allowed",
            marginTop: "16px",
          }}
        >
          問題開始 ▶︎
        </button>

        {/* 学習履歴ボタン */}
        <button
          onClick={() => router.push("/history")}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          📊 学習履歴を見る
        </button>

        {/* 🔥 追加：間違えた問題を復習 */}
        <button
          onClick={() => router.push("/review")}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "12px",
            borderRadius: "6px",
            border: "1px solid #f87171",
            background: "#fff",
            color: "#f87171",
            cursor: "pointer",
          }}
        >
          ❌ 間違えた問題を復習
        </button>
      </div>
    </div>
  );
}
