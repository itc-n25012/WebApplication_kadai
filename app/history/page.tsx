"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type History = {
  date: string;
  time: string;
  category: string;
  total: number;
  correct: number;
  mode: "normal" | "review";
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<History[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [totalFilter, setTotalFilter] = useState<number | "all">("all");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    setHistory(data);
  }, []);

  // ===== 履歴クリア =====
  const clearHistory = () => {
    const ok = confirm(
      "学習履歴をすべて削除します。\nこの操作は取り消せませんが、よろしいですか？",
    );
    if (!ok) return;

    localStorage.removeItem("studyHistory");
    setHistory([]);
  };

  // ===== フィルタ後の履歴 =====
  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      if (categoryFilter !== "all" && h.category !== categoryFilter) {
        return false;
      }
      if (totalFilter !== "all" && h.total !== totalFilter) {
        return false;
      }
      return true;
    });
  }, [history, categoryFilter, totalFilter]);

  // ===== グラフ =====
  const chartData = {
    labels: filteredHistory.map((h) => `${h.date} ${h.time}`),
    datasets: [
      {
        label: "正答率 (%)",
        data: filteredHistory.map((h) =>
          Math.round((h.correct / h.total) * 100),
        ),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
    ],
  };

  const selectStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "140px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>📊 学習履歴</h2>

        {/* ===== フィルタ ===== */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="all">全分野</option>
            <option value="network">ネットワーク</option>
            <option value="database">データベース</option>
            <option value="security">セキュリティ</option>
          </select>

          <select
            value={totalFilter}
            onChange={(e) =>
              setTotalFilter(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            style={selectStyle}
          >
            <option value="all">全問題数</option>
            {[3, 5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}問
              </option>
            ))}
          </select>
        </div>

        {/* ===== グラフ ===== */}
        {filteredHistory.length > 0 ? (
          <div style={{ margin: "24px 0" }}>
            <Line data={chartData} />
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#888", marginTop: "24px" }}>
            条件に一致する学習履歴がありません
          </p>
        )}

        {/* ===== 履歴一覧 ===== */}
        {filteredHistory.map((h, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid #eee",
              padding: "12px 0",
            }}
          >
            <p>
              📅 {h.date} {h.time}
            </p>
            <p>分野：{h.category}</p>
            <p>
              正答率：
              {Math.round((h.correct / h.total) * 100)}%（{h.correct}/{h.total}
              ）
            </p>
            <p>モード：{h.mode === "review" ? "復習" : "通常"}</p>
          </div>
        ))}

        {/* ===== クリアボタン ===== */}
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              borderRadius: "6px",
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            🗑 学習履歴をクリア
          </button>
        )}

        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            background: "#0070f3",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          トップへ戻る
        </button>
      </div>
    </div>
  );
}
