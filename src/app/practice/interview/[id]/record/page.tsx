"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WebcamView from "../../../../../components/practice/WebcamView"; 
//import ScriptView from "../../../../../components/practice/ScriptView"; 
//import UploadMaterial from "../../../../../components/practice/UploadMaterial"; 
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function InterviewRecordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams(); 
  const { id: projectId } = params;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [interviewNotes, setInterviewNotes] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // 면접 질문 예시
  const commonInterviewQuestions = [
    "자기소개를 해주세요.",
    "우리 회사에 지원한 이유는 무엇인가요?",
    "본인의 장점과 단점은 무엇인가요?",
    "5년 후 본인의 모습은 어떨 것 같나요?",
    "가장 큰 성취는 무엇인가요?",
    "팀워크를 발휘한 경험이 있나요?",
    "압박 상황에서 어떻게 대처하시나요?",
    "이 직무에 대한 이해도는 어느 정도인가요?",
    "왜 이 분야를 선택했나요?",
    "마지막으로 하고 싶은 말이 있나요?",
    "실패했던 경험과 그로부터 배운 점은?",
    "동료와 갈등이 생겼을 때 어떻게 해결하나요?",
    "리더십을 발휘한 경험이 있나요?",
    "새로운 환경에 적응하는 방법은?",
    "업무 우선순위를 정하는 기준은?",
    "스트레스를 관리하는 본인만의 방법은?",
    "창의적인 문제해결 경험이 있나요?",
    "시간 관리는 어떻게 하시나요?",
    "완벽주의 성향이 있나요?",
    "다양성과 포용성에 대한 생각은?"
  ];

  // 랜덤 질문 생성 함수
  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * commonInterviewQuestions.length);
    setCurrentQuestionIndex(randomIndex);
    setSelectedQuestion(commonInterviewQuestions[randomIndex]);
  };

  // 컴포넌트 마운트 시 첫 번째 랜덤 질문 설정
  useState(() => {
    getRandomQuestion();
  });

  const handleRecordClick = async () => {
    let activeStream = stream;

    if (!activeStream) {
      try {
        activeStream = isCameraOn 
        ? await navigator.mediaDevices.getUserMedia({ video: true, audio: true }) 
        : await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(activeStream);
      } catch {
        alert("오디오 또는 비디오 장치를 사용할 수 없습니다.");
        return;
      }
    }

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      recordedChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(activeStream, { mimeType: "video/webm" });

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setStream(null);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const toggleCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    const newState = !isCameraOn;
    setIsCameraOn(newState);

    if (newState) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(newStream);
      } catch{
        alert("내장 카메라 또는 마이크 접근에 실패했습니다.");
        setIsCameraOn(false);
      }
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setIsCameraOn(true);
  };

  const handleSave = async () => {
    if (!previewUrl || !projectId) {
      alert("projectId가 없거나 녹화 영상이 없습니다.");
      return;
    }

    setIsProcessing(true);

    try {
      const blob = await fetch(previewUrl).then((res) => res.blob());
      const videoFile = new File([blob], "recorded-video.webm", { type: "video/webm" });

      // 1단계: 비디오 파일 업로드 및 녹화 레코드 생성
      const formData = new FormData();
      formData.append("projectId", projectId as string);
      formData.append("video", videoFile);

      console.log("1단계: 면접 영상 업로드 중...");
      const uploadResponse = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`영상 저장 실패: ${errorData.error}`);
      }

      const uploadData = await uploadResponse.json();
      const recordingId = uploadData.recordingId;

      console.log("2단계: 면접 답변 STT 처리 중...", recordingId);
      
      // 2단계: STT 처리
      const sttFormData = new FormData();
      sttFormData.append("video", videoFile);
      sttFormData.append("recordingId", recordingId);

      const sttResponse = await fetch("/api/stt", {
        method: "POST",
        body: sttFormData,
      });

      if (!sttResponse.ok) {
        const sttError = await sttResponse.json();
        console.error("STT 실패:", sttError);
      } else {
        const sttData = await sttResponse.json();
        console.log("STT 완료:", sttData.transcript);

        // 3단계: Gemini 면접 피드백 생성
        if (sttData.transcript && sttData.transcript.trim()) {
          console.log("3단계: 면접 평가 생성 중...");
          
          try {
            const geminiResponse = await fetch("/api/gemini-feedback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ transcript: sttData.transcript }),
            });

            if (geminiResponse.ok) {
              const geminiData = await geminiResponse.json();
              console.log("면접 평가 완료:", geminiData.feedback);
            } else {
              console.error("면접 평가 생성 실패");
            }
          } catch (geminiError) {
            console.error("Gemini API 호출 실패:", geminiError);
          }
        }
      }

      // 4단계: 면접 결과 페이지로 이동
      console.log("4단계: 면접 결과 페이지로 이동");
      alert("면접 녹화 및 분석이 완료되었습니다!");
      router.push(`/practice/interview/${projectId}/report?recordingId=${recordingId}`);

    } catch (error) {
      console.error("처리 실패:", error);
      alert(error instanceof Error ? error.message : "면접 영상 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      minHeight: "100vh",
      paddingTop: "80px",
      position: "relative"
    }}>
      <Header user={session?.user ?? null} />
      
      {/* 면접용 배경 패턴 */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 25% 25%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(155, 89, 182, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(46, 204, 113, 0.08) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>

      {/* 메인 컨테이너 */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "32px 24px",
        position: "relative",
        zIndex: 2
      }}>
        {/* 제목 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            padding: "8px 20px",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <span style={{ fontSize: "1.2rem" }}>💼</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Interview Practice
            </span>
          </div>
          
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 12px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            💼 면접 연습 및 녹화
          </h1>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            모의 면접을 진행하고 AI 면접관의 상세한 피드백을 받아보세요
          </p>
        </div>

        {/* 본문 */}
        <div style={{ display: "flex", gap: "32px", alignItems: "start" }}>
          {/* 왼쪽: 웹캠 (헤더에 가려지지 않도록 스티키) */}
          <div style={{ 
            flex: "1.2",
            position: "sticky",
            top: "96px", // 헤더(80px) + 여백(16px)
            alignSelf: "flex-start",
            zIndex: 10
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <h3 style={{ 
                  fontSize: "1.3rem", 
                  fontWeight: "600", 
                  color: "#ffffff",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🎥 면접 화면
                </h3>
                
                {/* 카메라 ON/OFF 버튼 */}
                {!previewUrl && (
                  <button
                    onClick={toggleCamera}
                    disabled={isRecording}
                    style={{
                      background: isCameraOn 
                        ? "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)" 
                        : "rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      fontWeight: "500",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: isRecording ? "not-allowed" : "pointer",
                      opacity: isRecording ? 0.5 : 1,
                      fontSize: "0.9rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isCameraOn ? "📷 카메라 끄기" : "📷 카메라 켜기"}
                  </button>
                )}
              </div>

              {/* 비디오 화면 */}
              {previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  style={{
                    width: "100%",
                    height: "400px",
                    borderRadius: "12px",
                    backgroundColor: "#000",
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                />
              ) : isCameraOn ? (
                <div style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <WebcamView onStreamReady={setStream} />
                </div>
              ) : (
                <div style={{
                  width: "100%",
                  height: "400px",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed rgba(255, 255, 255, 0.3)"
                }}>
                  <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.6)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "8px" }}>📷</div>
                    <div style={{ fontSize: "1rem", fontWeight: "500" }}>카메라가 꺼져 있습니다</div>
                  </div>
                </div>
              )}

              {/* 녹화 컨트롤 버튼 */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "12px",
                marginTop: "20px"
              }}>
                {previewUrl ? (
                  <>
                    <button
                      onClick={handleRetake}
                      disabled={isProcessing}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        fontWeight: "600",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        fontSize: "0.9rem",
                        opacity: isProcessing ? 0.5 : 1,
                        transition: "all 0.3s ease"
                      }}
                    >
                      ↺ 다시 녹화
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isProcessing}
                      style={{
                        background: isProcessing 
                          ? "rgba(255, 255, 255, 0.2)" 
                          : "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                        color: "#ffffff",
                        fontWeight: "600",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.3s ease",
                        boxShadow: isProcessing ? "none" : "0 4px 12px rgba(52, 152, 219, 0.3)"
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <div style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            borderTop: "2px solid #ffffff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                          }}></div>
                          면접 분석 중...
                        </>
                      ) : (
                        <>
                          🎯 면접 분석 시작 →
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRecordClick}
                    style={{
                      padding: "16px 32px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      background: isRecording 
                        ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" 
                        : "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(231, 76, 60, 0.3)"
                    }}
                  >
                    {isRecording ? "⏹ 면접 완료" : "⏺ 면접 시작"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 면접 질문 + 메모 */}
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* 면접 질문 랜덤 선택 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <h3 style={{ 
                  fontSize: "1.3rem", 
                  fontWeight: "600", 
                  color: "#ffffff",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  🎯 오늘의 면접 질문
                </h3>
                
                <button
                  onClick={getRandomQuestion}
                  style={{
                    background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(155, 89, 182, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #8e44ad 0%, #732d91 100%)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  🔄 새 질문
                </button>
              </div>

              <div style={{
                background: "rgba(52, 152, 219, 0.2)",
                border: "1px solid rgba(52, 152, 219, 0.3)",
                borderRadius: "12px",
                padding: "20px",
                position: "relative"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <div style={{
                    background: "#3498db",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    Q
                  </div>
                  <span style={{
                    color: "#3498db",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}>
                    질문 #{currentQuestionIndex + 1}
                  </span>
                </div>
                
                <p style={{
                  color: "#ffffff",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                  margin: 0,
                  fontWeight: "500"
                }}>
                  &ldquo;{selectedQuestion}&rdquo;
                </p>

                {/* 질문 카테고리 표시 */}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgba(52, 152, 219, 0.3)",
                  color: "#ffffff",
                  fontSize: "0.7rem",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontWeight: "500"
                }}>
                  {currentQuestionIndex < 5 ? "기본" : 
                   currentQuestionIndex < 10 ? "역량" : 
                   currentQuestionIndex < 15 ? "경험" : "심화"}
                </div>
              </div>

              {/* 질문 힌트 */}
              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(155, 89, 182, 0.15)",
                border: "1px solid rgba(155, 89, 182, 0.3)",
                borderRadius: "8px"
              }}>
                <div style={{
                  color: "#9b59b6",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  marginBottom: "4px"
                }}>
                  💡 답변 포인트:
                </div>
                <div style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.8rem",
                  lineHeight: "1.4"
                }}>
                  {currentQuestionIndex < 5 ? "간결하고 명확하게 핵심을 전달하세요" : 
                   currentQuestionIndex < 10 ? "구체적인 경험과 결과를 포함하세요" :
                   currentQuestionIndex < 15 ? "STAR 기법을 활용해 체계적으로 설명하세요" : 
                   "본인의 가치관과 비전을 연결지어 답변하세요"}
                </div>
              </div>
            </div>

            {/* 면접 메모 */}
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "24px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              flex: 1
            }}>
              <h3 style={{ 
                fontSize: "1.3rem", 
                fontWeight: "600", 
                color: "#ffffff",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                📝 답변 메모
              </h3>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="답변하기 전 핵심 포인트를 메모해보세요..."
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "16px",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3498db";
                  e.target.style.boxShadow = "0 0 0 3px rgba(52, 152, 219, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <div style={{ 
                marginTop: "8px", 
                fontSize: "0.75rem", 
                color: "rgba(255, 255, 255, 0.6)",
                textAlign: "right"
              }}>
                {interviewNotes.length} 글자
              </div>
            </div>

            {/* 면접 팁 */}
            <div style={{
              background: "rgba(46, 204, 113, 0.15)",
              border: "1px solid rgba(46, 204, 113, 0.3)",
              borderRadius: "16px",
              padding: "20px"
            }}>
              <h4 style={{
                color: "#2ecc71",
                fontSize: "1.1rem",
                fontWeight: "600",
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                💡 면접 팁
              </h4>
              <ul style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                margin: 0,
                paddingLeft: "20px"
              }}>
                <li>카메라를 직시하며 자신감 있게 답변하세요</li>
                <li>STAR 기법(상황-과제-행동-결과)을 활용하세요</li>
                <li>구체적인 경험과 수치를 포함하세요</li>
                <li>2-3분 내외로 간결하게 답변하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 애니메이션 스타일 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}