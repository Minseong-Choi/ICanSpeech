"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ScriptReport from "../../../../../components/report/ScriptReport";
import AIReport from "../../../../../components/report/AIReport";
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function PresentationReportPage() {
  const searchParams = useSearchParams();
  const recordingId = searchParams.get("recordingId");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (recordingId) {
      fetch(`/api/recordings?id=${recordingId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.recording) {
            setVideoUrl(data.recording.videoUrl);
            setTranscript(data.recording.transcript || "텍스트 변환에 실패했습니다.");
            setFeedback([
              "말 속도는 적절합니다.",
              "눈을 자주 아래로 내립니다.",
              "핵심 키워드 'AI'가 3번 빠졌습니다.",
            ]);
          }
        });
    }
  }, [recordingId]);

  if (!videoUrl) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>로딩 중...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      minHeight: "100vh",
      paddingTop: "80px",
      position: "relative"
    }}>
      <Header user={session?.user ?? null} />
      
      {/* 배경 패턴 */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 111, 97, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>

      {/* 메인 컨테이너 */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 24px",
        position: "relative",
        zIndex: 2
      }}>
        {/* 페이지 타이틀 */}
        <div style={{
          marginBottom: "32px",
          textAlign: "center"
        }}>
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 8px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            🎯 발표 분석 결과
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            AI가 분석한 당신의 발표 퍼포먼스
          </p>
        </div>

        {/* 리포트 섹션 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px"
        }}>
          <ScriptReport videoUrl={videoUrl} transcript={transcript} />
          <AIReport feedback={feedback} />
        </div>
      </div>
    </div>
  );
}