"use client";

import PracticeButton from "./PracticeButton";
import UploadRecord from "./UploadRecord";
import TakeCard from "./TakeCard";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation"; // useParams 추가

export type Recording = {
  _id: string;
  createdAt: string;
  // 다른 필드들...
};

type Props = {
  takes: number[];
  recordings: Recording[];
  type: "presentation" | "interview";
  onUploadClick: () => void;
};

export default function TakeList({ takes, recordings, type, onUploadClick }: Props) {
  const router = useRouter();
  const params = useParams(); // useParams 사용
  const { id } = params; // id 추출

  const handleCardClick = (recordingId: string) => {
    router.push(`/practice/${type}/${id}/report?recordingId=${recordingId}`);
  };

  const practiceText =
    type === "presentation" ? "발표 연습하기" : "면접 연습하기";
  const uploadText =
    type === "presentation"
      ? "발표 영상 업로드하기"
      : "면접 영상 업로드하기";

  // recordRoute를 동적으로 구성
  const recordRoute = `/practice/${type}/${id}/record`;

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
        <PracticeButton text={practiceText} route={recordRoute} />
        <UploadRecord text={uploadText} type={type} onClick={onUploadClick} />
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
          .map((take, index) => {
            const recording = recordings.slice().reverse()[index]; 
            return (
              <TakeCard
                key={recording?._id || index}
                index={take}
                date={recording?.createdAt}
                onClick={() => handleCardClick(recording?._id)}
              />
            );
          })}
      </div>
    </div>
  );
}
