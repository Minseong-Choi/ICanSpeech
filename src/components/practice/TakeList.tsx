"use client";

import PracticeButton from "./PracticeButton";
import UploadRecord from "./UploadRecord";
import TakeCard from "./TakeCard";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react"; // React and useState, useEffect imports

export type Recording = {
  _id: string;
  createdAt: string;
  // 다른 필드들...
};

type Props = {
  takes: number[];
  // recordings: Recording[]; // recordings state will be managed internally now
  type: "presentation" | "interview";
  onUploadClick: () => void;
};

export default function TakeList({ takes, type, onUploadClick }: Props) {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string }; // Explicitly type id

  const [recordings, setRecordings] = useState<Recording[]>([]); // State for recordings

  // Fetch recordings when the component mounts or id changes
  useEffect(() => {
    if (id) {
      fetch(`/api/practices/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.practice && data.practice.recordings) {
            setRecordings(data.practice.recordings);
          }
        })
        .catch((error) => console.error("Error fetching recordings:", error));
    }
  }, [id]);

  const handleCardClick = (recordingId: string) => {
    router.push(`/practice/${type}/${id}/report?recordingId=${recordingId}`);
  };

  // Function to handle deletion of a recording
  const handleDelete = async (recordingId: string) => {
    if (!id || !recordingId) return;

    try {
      const response = await fetch(`/api/practices/${id}/recordings/${recordingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the state by removing the deleted recording
        setRecordings(prevRecordings => prevRecordings.filter(rec => rec._id !== recordingId));
        alert("연습이 삭제되었습니다."); // User feedback
      } else {
        console.error("Failed to delete recording:", response.statusText);
        alert("연습 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
      alert("연습 삭제 중 오류가 발생했습니다.");
    }
  };

  const practiceText =
    type === "presentation" ? "발표 연습하기" : "면접 연습하기";
  const uploadText =
    type === "presentation"
      ? "발표 영상 업로드하기"
      : "면접 영상 업로드하기";

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
            // Ensure recordings array is not empty and index is valid
            const recording = recordings.length > index ? recordings.slice().reverse()[index] : null;
            
            return (
              recording ? (
                <div key={recording._id} style={{ position: 'relative', display: 'inline-block' }}>
                  <TakeCard
                    index={take}
                    date={recording?.createdAt}
                    onClick={() => handleCardClick(recording._id)}
                    onDelete={() => handleDelete(recording._id)} // Pass the delete handler
                  />
                  {/* Delete button positioned absolutely */}
                  <button
                    onClick={() => handleDelete(recording._id)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      lineHeight: '1',
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                // Placeholder for takes without recordings
                <div key={index} style={{ width: 150, height: 400, border: "1px dashed #ccc", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {take}번째 연습 (녹화 없음)
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}
