import styles from "@/styles/QuestionCard.module.css";
import Link from "next/link";

export default function QuestionCard({ question }: any) {
  return (
    <div className={styles.card}>
      <h3>{question.title}</h3>
      <Link href={`/questions/${question.id}`}>問題を見る</Link>
    </div>
  );
}
