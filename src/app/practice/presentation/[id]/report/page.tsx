"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import Header from '@/components/Layout/Header';
import ScriptReport from "../../../../../components/report/ScriptReport";
import AIReport from "../../../../../components/report/AIReport";

export default function PresentationReportPage() {
  const searchParams = useSearchParams();
  const recordingId = searchParams.get("recordingId");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const { data: session } = useSession();

  useEffect(() => {
    if (recordingId) {
      setLoadingStage("녹화 데이터를 불러오는 중...");
      fetch(`/api/recordings?id=${recordingId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.recording) {
            setVideoUrl(data.recording.videoUrl);
            const fetchedTranscript = data.recording.transcript || "텍스트 변환에 실패했습니다.";
            setTranscript(fetchedTranscript);
            setIsLoadingData(false);

            if (fetchedTranscript && !fetchedTranscript.includes("실패했습니다")) {
              setIsLoadingFeedback(true);
              setLoadingStage("AI가 발표를 분석하는 중...");
              
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
                  setLoadingStage("분석 결과를 정리하는 중...");
                  setTimeout(() => {
                    if (data.feedback) {
                      setFeedback(data.feedback.split('\n').filter(Boolean));
                    } else {
                      console.error("Unexpected API response structure:", data);
                      setFeedback(["피드백을 가져오는 데 실패했습니다. 응답 형식이 예상과 다릅니다."]);
                    }
                    setIsLoadingFeedback(false);
                    setLoadingStage("");
                  }, 1000);
                })
                .catch((error) => {
                  console.error("Error calling feedback API:", error);
                  setFeedback([`피드백 API 호출 중 오류가 발생했습니다: ${error.message}`]);
                  setIsLoadingFeedback(false);
                  setLoadingStage("");
                });
            } else {
              setFeedback(["STT 텍스트를 가져올 수 없거나 오류가 발생했습니다."]);
              setIsLoadingFeedback(false);
              setLoadingStage("");
            }
          }
        })
        .catch((error) => {
          console.error("Error loading recording:", error);
          setIsLoadingData(false);
          setLoadingStage("");
        });
    }
  }, [recordingId]); 

  if (isLoadingData || !videoUrl) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        position: "relative"
      }}>
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

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          zIndex: 2,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          
          <div>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: "0 0 8px 0",
              color: "#ffffff"
            }}>
              분석 결과 준비 중
            </h2>
            <p style={{
              fontSize: "1rem",
              fontWeight: "400",
              margin: 0,
              color: "rgba(255, 255, 255, 0.8)"
            }}>
              {loadingStage || "녹화 데이터를 불러오는 중..."}
            </p>
          </div>
          
          <div style={{
            width: "100%",
            height: "4px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "2px",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              borderRadius: "2px",
              animation: "loading 2s ease-in-out infinite"
            }}></div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
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

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 24px",
        position: "relative",
        zIndex: 2
      }}>
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

        {isLoadingFeedback && (
          <div style={{
            background: "rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(102, 126, 234, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderTop: "3px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              flexShrink: 0
            }}></div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: "600",
                margin: "0 0 4px 0"
              }}>
                🧠 AI 분석 진행 중
              </h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                margin: 0
              }}>
                {loadingStage || "발표 내용을 분석하고 있습니다. 잠시만 기다려주세요..."}
              </p>
            </div>
            
            <div style={{
              width: "100px",
              height: "6px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "3px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.7))",
                borderRadius: "3px",
                animation: "loading 2s ease-in-out infinite"
              }}></div>
            </div>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px"
        }}>
          <ScriptReport videoUrl={videoUrl} transcript={transcript} />
          <AIReport feedback={feedback} isLoading={isLoadingFeedback} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
