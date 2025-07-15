"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ScriptReport from "../../../../../components/report/ScriptReport";
import AIReport from "../../../../../components/report/AIReport";
import { useSession } from 'next-auth/react';
import Header from '@/components/Layout/Header';
import MotionReport from "../../../../../components/report/MotionReport";

export default function InterviewReportPage() {
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
            const fetchedTranscript = data.recording.transcript || "텍스트 변환에 실패했습니다.";
            setTranscript(fetchedTranscript);

            // Call server-side API for feedback if transcript is available and not an error message
            if (fetchedTranscript && !fetchedTranscript.includes("실패했습니다")) {
              fetch("/api/gemini-feedback", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript: fetchedTranscript }),
              })
                .then((response) => {
                  if (!response.ok) {
                    console.error(`API request failed with status ${response.status}`);
                    return response.text().then((text) => {
                      throw new Error(`API error: Status ${response.status}, Body: ${text}`);
                    });
                  }
                  return response.json();
                })
                .then((data) => {
                  if (data.feedback) {
                    setFeedback(data.feedback.split('\n').filter(Boolean));
                  } else {
                    console.error("Unexpected API response structure:", data);
                    setFeedback(["피드백을 가져오는 데 실패했습니다. 응답 형식이 예상과 다릅니다."]);
                  }
                })
                .catch((error) => {
                  console.error("Error calling feedback API:", error);
                  setFeedback([`피드백 API 호출 중 오류가 발생했습니다: ${error.message}`]);
                });
            } else {
              setFeedback(["STT 텍스트를 가져올 수 없거나 오류가 발생했습니다."]);
            }
          }
        });
    }
  }, [recordingId, transcript]); 

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
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <ScriptReport videoUrl={videoUrl} transcript={transcript} />
      <AIReport feedback={feedback} />
      <MotionReport videoUrl={videoUrl}/>
    </div>
    </div>
  );
}
