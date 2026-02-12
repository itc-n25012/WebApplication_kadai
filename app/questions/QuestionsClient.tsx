"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/QuestionPage.module.css";
import { client } from "@/lib/microcms";
import type { Question } from "@/types/question";

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 10;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // ✅ 学習履歴保存
  useEffect(() => {
    if (!finished) return;
    if (isReviewMode) return;

    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");

    history.push({
      date: new Date().toLocaleDateString("ja-JP"),
      time: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category,
      total: questions.length,
      correct: correctCount,
      mode: "normal",
    });

    localStorage.setItem("studyHistory", JSON.stringify(history));
  }, [finished, category, correctCount, questions.length, isReviewMode]);
  // ✅ 問題取得
  useEffect(() => {
    if (!category) return;

    const fetchQuestions = async () => {
      const data = await client.getList<Question>({
        endpoint: "questions",
        queries: {
          filters: `category[equals]${category}`,
          limit: 100,
        },
      });

      const shuffled = [...data.contents].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, limit));
      setLoading(false);
    };

    fetchQuestions();
  }, [category, limit]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>読み込み中...</p>;
  }

  // ===== 最終結果画面 =====
  if (finished) {
    // ===== 復習完了画面 =====
    if (isReviewMode) {
      return (
        <div className={styles.card}>
          <h2 className={styles.question}>復習完了 🎉</h2>

          <p style={{ textAlign: "center", fontSize: "16px" }}>
            間違えた問題の復習が完了しました！
          </p>

          <button
            className={styles.button}
            onClick={() => router.push("/")}
            style={{ marginTop: "24px" }}
          >
            トップへ戻る
          </button>
        </div>
      );
    }

    // ===== 通常の結果画面 =====
    return (
      <div className={styles.card}>
        <h2 className={styles.question}>結果発表 🎉</h2>

        <p style={{ textAlign: "center", fontSize: "18px" }}>
          {questions.length}問中 {correctCount}問 正解
        </p>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {wrongQuestions.length > 0 && (
            <button
              className={styles.button}
              onClick={() => {
                setQuestions(wrongQuestions);
                setWrongQuestions([]);
                setCurrent(0);
                setSelected(null);
                setShowAnswer(false);
                setCorrectCount(0);
                setFinished(false);
                setIsReviewMode(true);
              }}
            >
              間違えを復習
            </button>
          )}

          <button
            className={styles.button}
            style={{ background: "#999" }}
            onClick={() => router.push("/")}
          >
            トップへ戻る
          </button>
        </div>
      </div>
    );
  }

  const question = questions[current];
  if (!question) {
    return <p style={{ textAlign: "center" }}>問題がありません</p>;
  }

  const choices = question.choices.split("\n");
  const correctIndex = question.answer - 1;

  const handleAnswer = () => {
    if (selected === correctIndex) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, question]);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const handleExit = () => {
    if (confirm("途中終了しますか？")) {
      router.push("/");
    }
  };

  return (
    <div className={styles.card}>
      <p className={styles.category}>
        分野：{category}
        {isReviewMode && "（復習）"}（{current + 1}/{questions.length}）
      </p>

      <h2 className={styles.question}>
        Q{current + 1}. {question.title}
      </h2>

      <div
        className={styles.question}
        dangerouslySetInnerHTML={{ __html: question.question }}
      />

      <ul className={styles.choices}>
        {choices.map((choice, index) => {
          let className = styles.choice;

          if (showAnswer) {
            if (index === correctIndex) {
              className = `${styles.choice} ${styles.correctChoice}`;
            } else if (index === selected) {
              className = `${styles.choice} ${styles.wrongChoice}`;
            }
          }

          return (
            <li key={index} className={className}>
              <label>
                <input
                  type="radio"
                  name="choice"
                  disabled={showAnswer}
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                />
                {choice}
              </label>
            </li>
          );
        })}
      </ul>

      {!showAnswer && (
        <>
          <button
            className={styles.button}
            onClick={handleAnswer}
            disabled={selected === null}
          >
            解答する
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "14px",
              color: "#888",
              cursor: "pointer",
            }}
            onClick={handleExit}
          >
            トップへ戻る
          </p>
        </>
      )}

      {showAnswer && (
        <div className={styles.result}>
          <p
            className={
              selected === correctIndex ? styles.correct : styles.wrong
            }
          >
            {selected === correctIndex ? "正解！🎉" : "不正解 😢"}
          </p>

          <div
            className={styles.explanation}
            dangerouslySetInnerHTML={{ __html: question.explanation }}
          />

          <button className={styles.button} onClick={handleNext}>
            {current + 1 === questions.length ? "結果を見る" : "次の問題へ"}
          </button>
        </div>
      )}
    </div>
  );
}
