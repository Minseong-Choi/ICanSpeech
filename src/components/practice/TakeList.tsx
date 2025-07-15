"use client";

import PracticeButton from "./PracticeButton";
import UploadRecord from "./UploadRecord";
//import TakeCard from "./TakeCard";
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
  recordings: Recording[]; // recordings state will be managed internally now
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
        gap: 24,
      }}
    >
      {/* 왼쪽: 버튼 2개 (세로 배치) */}
      <div
        style={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <PracticeButton text={practiceText} route={recordRoute} />
        <UploadRecord text={uploadText} type={type} onClick={onUploadClick} />
      </div>

      {/* 오른쪽: 테이크 카드들 */}
      <div
        style={{
          width: "70%",
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
                  {/* 업데이트된 테이크 카드 디자인 */}
                  <div
                    onClick={() => handleCardClick(recording._id)}
                    style={{
                      width: "160px",
                      height: "320px",
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    {/* 상단 accent 라인 */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      }}
                    />
                    
                    {/* 카드 헤더 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {take}
                      </div>
                      
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          background: "#f7fafc",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontWeight: "500",
                        }}
                      >
                        완료
                      </span>
                    </div>
                    
                    {/* 메인 콘텐츠 */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 5V19L19 12L8 5Z"
                            fill="#667eea"
                          />
                        </svg>
                      </div>
                      
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#2d3748",
                          margin: "0 0 4px 0",
                        }}
                      >
                        연습 {take}
                      </h4>
                      
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#718096",
                          margin: 0,
                        }}
                      >
                        {recording?.createdAt ? new Date(recording.createdAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '날짜 없음'}
                      </p>
                    </div>
                    
                    {/* 하단 액션 영역 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: "12px",
                        borderTop: "1px solid rgba(226, 232, 240, 0.5)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#667eea",
                          fontWeight: "500",
                        }}
                      >
                        결과 보기
                      </span>
                    </div>
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(recording._id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      lineHeight: '1',
                      transition: 'all 0.2s ease',
                      opacity: 0.8,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                // 플레이스홀더 카드도 업데이트
                <div 
                  key={index} 
                  style={{ 
                    width: "160px", 
                    height: "320px", 
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "2px dashed rgba(113, 128, 150, 0.3)", 
                    borderRadius: "16px", 
                    display: "flex", 
                    flexDirection: "column",
                    justifyContent: "center", 
                    alignItems: "center",
                    color: "#718096",
                    fontSize: "14px",
                    fontWeight: "500",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(113, 128, 150, 0.1)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ fontSize: "18px", color: "#a0aec0" }}>📹</span>
                  </div>
                  <div>{take}번째 연습</div>
                  <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>녹화 없음</div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}