"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Question } from "@/types/question";
import styles from "@/styles/QuestionPage.module.css";

export default function ReviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
    setQuestions(stored);
  }, []);

  if (questions.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.question}>復習する問題がありません 🎉</h2>

        <button
          onClick={() => router.push("/")}
          className={styles.button}
          style={{ marginTop: "24px" }}
        >
          トップへ戻る
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];
  const choices = question.choices.split("\n");
  const correctIndex = question.answer - 1;

  const handleAnswer = () => {
    if (selected === null) return;
    setShowAnswer(true);
  };

  const handleNext = () => {
    const isCorrect = selected === correctIndex;

    let updated = questions;

    // ✅ 正解なら削除
    if (isCorrect) {
      updated = questions.filter((q) => q.id !== question.id);

      localStorage.setItem("wrongQuestions", JSON.stringify(updated));

      if (updated.length === 0) {
        alert("復習完了！");
        router.push("/");
        return;
      }

      setQuestions(updated);
    }

    // 🔥 ここが超重要
    setCurrentIndex((prev) => {
      if (prev + 1 >= updated.length) {
        return 0; // 最後なら最初に戻る（好みで変更可）
      }
      return prev + 1;
    });

    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <div className={styles.card}>
      <p className={styles.category}>
        復習モード（{currentIndex + 1}/{questions.length}）
      </p>

      <h2 className={styles.question}>
        Q{currentIndex + 1}. {question.title}
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
            onClick={handleAnswer}
            disabled={selected === null}
            className={styles.button}
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
            onClick={() => {
              if (confirm("復習を途中終了しますか？")) {
                router.push("/");
              }
            }}
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
            dangerouslySetInnerHTML={{
              __html: question.explanation,
            }}
          />

          <button onClick={handleNext} className={styles.button}>
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}
