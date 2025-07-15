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
            // TODO: 실제 feedback 데이터 설정
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
    return <div>로딩 중...</div>;
  }

  return (
      <div
        style={{
          padding: 24,
          paddingTop: 80, 
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          gap: 24,
        }}
      > 
        <Header user={session?.user ?? null} />

        {/* 본문 리포트 */}
        <div style={{ display: "flex", gap: 24 }}>
          <ScriptReport videoUrl={videoUrl} transcript={transcript} />
          <AIReport feedback={feedback} />
        </div>
      </div>
    );
}
