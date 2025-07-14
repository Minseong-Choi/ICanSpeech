"use client";

import PracticeButton from "./PracticeButton";
import UploadRecord from "./UploadRecord";
import TakeCard from "./TakeCard";
import { useRouter } from "next/navigation";

type Props = {
  takes: number[];
};

export default function TakeList({ takes }: Props) {
  const router = useRouter();

  const handleCardClick = (takeNumber: number) => {
    router.push(`/practice/presentation/report?page=${takeNumber}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 20,
      }}
    >
      {/* 왼쪽: 버튼 2개 */}
      <div
        style={{
          width: "46%",
          display: "flex",
          flexDirection: "row",
          gap: 16,
        }}
      >
        <PracticeButton text="발표 연습하기" route="./presentation/record" />
        <UploadRecord text="발표 영상 업로드하기" />
      </div>

      {/* 오른쪽: 테이크 카드들 */}
      <div
        style={{
          width: "46%",
          display: "flex",
          flexDirection: "row",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {takes
          .slice()
          .reverse()
          .map((takeNumber) => (
            <TakeCard
              key={takeNumber}
              index={takeNumber}
              onClick={() => handleCardClick(takeNumber)} // 👈 클릭 핸들러 전달
            />
          ))}
      </div>
    </div>
  );
}
