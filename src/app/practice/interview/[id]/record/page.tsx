"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WebcamView from "../../../../../components/practice/WebcamView"; 
//import ScriptView from "../../../../../components/practice/ScriptView"; 
import UploadMaterial from "../../../../../components/practice/UploadMaterial"; 
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function PresentationRecordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams(); 
  const { id: projectId } = params;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

    const blob = await fetch(previewUrl).then((res) => res.blob());
    const videoFile = new File([blob], "recorded-video.webm", { type: "video/webm" });

    const formData = new FormData();
    formData.append("projectId", projectId as string);
    formData.append("video", videoFile);

    try {
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("녹화 영상이 성공적으로 저장되었습니다!");
        router.push(`/practice/interview/${projectId}/report?recordingId=${data.recordingId}`);
      } else {
        const errorData = await response.json();
        alert(`영상 저장 실패: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to save recording:", error);
      alert("영상 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        paddingTop: 80,
        paddingLeft: 32,
        paddingRight: 32,
        paddingBottom: 32,
        display: "flex",
        flexDirection: "column",
        gap: 32,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Header user={session?.user ?? null} />

      {/* 제목 */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: "700", 
          color: "#1e293b",
          marginBottom: 8
        }}>
          발표 연습 및 녹화
        </h1>
        <p style={{ 
          fontSize: 16, 
          color: "#64748b",
          margin: 0
        }}>
          발표를 연습하고 녹화하여 분석 결과를 확인하세요
        </p>
      </div>

      {/* 본문 */}
      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        {/* 왼쪽: 웹캠 + 스크립트 */}
        <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 카메라 영역 */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 16
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: "600", 
                color: "#1e293b",
                margin: 0
              }}>
                📹 녹화 화면
              </h3>
              
              {/* 카메라 ON/OFF 버튼 */}
              {!previewUrl && (
                <button
                  onClick={toggleCamera}
                  disabled={isRecording}
                  style={{
                    backgroundColor: isCameraOn ? "#10b981" : "#6b7280",
                    color: "#ffffff",
                    fontWeight: "500",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    cursor: isRecording ? "not-allowed" : "pointer",
                    opacity: isRecording ? 0.5 : 1,
                    fontSize: 14,
                    transition: "all 0.2s ease"
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
                  height: 400,
                  borderRadius: 12,
                  backgroundColor: "#000",
                  border: "2px solid #e2e8f0"
                }}
              />
            ) : isCameraOn ? (
              <div style={{ borderRadius: 12, overflow: "hidden" }}>
                <WebcamView onStreamReady={setStream} />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 400,
                  backgroundColor: "#374151",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #6b7280"
                }}
              >
                <div style={{ textAlign: "center", color: "#9ca3af" }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 16, fontWeight: "500" }}>카메라가 꺼져 있습니다</div>
                </div>
              </div>
            )}

            {/* 녹화 컨트롤 버튼 */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 12,
              marginTop: 20
            }}>
              {previewUrl ? (
                <>
                  <button
                    onClick={handleRetake}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "#ffffff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 24px",
                      cursor: "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
                  >
                    ↺ 다시 찍기
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#ffffff",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 24px",
                      cursor: "pointer",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                  >
                    💾 저장 후 분석하기 →
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRecordClick}
                  style={{
                    padding: "16px 32px",
                    fontSize: 16,
                    fontWeight: "600",
                    backgroundColor: isRecording ? "#ef4444" : "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = isRecording ? "#4b5563" : "#b91c1c";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = isRecording ? "#6b7280" : "#dc2626";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isRecording ? "⏹ 녹화 중지" : "⏺ 녹화 시작"}
                </button>
              )}
            </div>
          </div>

          
        </div>

        {/* 오른쪽: 발표 자료 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            overflowY: "auto"
          }}
        >
          <UploadMaterial />

          {/* 스크립트 작성 영역 */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ 
              fontSize: 18, 
              fontWeight: "600", 
              color: "#1e293b",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              📝 발표 스크립트
            </h3>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="발표할 내용을 작성하세요..."
              style={{
                width: "100%",
                minHeight: 200,
                padding: 16,
                fontSize: 14,
                lineHeight: 1.6,
                border: "2px solid #e2e8f0",
                borderRadius: 12,
                resize: "vertical",
                fontFamily: "inherit",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
              }}
            />
            <div style={{ 
              marginTop: 8, 
              fontSize: 12, 
              color: "#64748b",
              textAlign: "right"
            }}>
              {script.length} 글자
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}