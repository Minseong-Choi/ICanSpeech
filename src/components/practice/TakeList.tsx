"use client";

import PracticeButton from "./PracticeButton";
import UploadMaterial from "./UploadMaterial";
import TakeCard from "./TakeCard";

type Props = {
  takes: number[]; // 예: [1, 2, 3]
  type: 'interview' | 'presentation';
  onUploadClick?: () => void;
};

export default function CardList({ takes, type, onUploadClick }: Props) {
  const recordRoute = `./${type}/record`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "flex-start",
        marginTop: 20,
        overflowX: "auto",
        paddingBottom: 8,
      }}
    >
      <PracticeButton text="발표 연습하기" route={recordRoute} />
      <UploadMaterial text="발표 자료 업로드하기" onClick={onUploadClick} />

      {takes
        .slice()
        .reverse()
        .map((takeNumber, i) => (
          <div key={takeNumber} style={{ marginLeft: i === 0 ? 50 : 0 }}>
            <TakeCard index={takeNumber} />
          </div>
        ))}
    </div>
  );
}
