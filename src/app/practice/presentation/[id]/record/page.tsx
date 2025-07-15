"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useSearchParams 대신 useParams 사용
import WebcamView from "../../../../../components/practice/WebcamView"; 
import ScriptView from "../../../../../components/practice/ScriptView"; 
import UploadMaterial from "../../../../../components/practice/UploadMaterial"; 
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function PresentationRecordPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams(); 
  const { id: projectId } = params;
  console.log("PresentationRecordPage - Project ID:", projectId); // projectId 확인

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        // 실제 리포트 페이지로 이동 (저장된 recordingId 사용)
        router.push(`/practice/presentation/${projectId}/report?recordingId=${data.recordingId}`);
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
        paddingTop: 80, // 헤더 높이만큼 위쪽 공간 확보
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Header user={session?.user ?? null} />

      {/* 본문: 왼쪽 (웹캠 + 버튼) / 오른쪽 (스크립트) */}
      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {/* 왼쪽: 웹캠 + 버튼 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 화면 표시 */}
          {previewUrl ? (
            <video
              src={previewUrl}
              controls
              style={{
                width: "100%",
                height: 400,
                borderRadius: 8,
                backgroundColor: "#000",
              }}
            />
          ) : isCameraOn ? (
            <WebcamView onStreamReady={setStream} />
          ) : (
            <div
              style={{
                width: "100%",
                height: 400,
                backgroundColor: "#000",
                borderRadius: 8,
              }}
            />
          )}

           {/* 카메라 ON/OFF 버튼 (녹화 완료 후에는 숨김) */}
           {!previewUrl && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={toggleCamera}
                disabled={isRecording}
                style={{
                  backgroundColor: isCameraOn ? "#4caf50" : "#999",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: isRecording ? "not-allowed" : "pointer",
                  opacity: isRecording ? 0.5 : 1,
                }}
              >
                {isCameraOn ? "카메라 끄기" : "카메라 켜기"}
              </button>
            </div>
          )}

          {/* 하단 버튼: 녹화 / 다시 찍기 / 저장 */}
          <div style={{ display: "flex", justifyContent: previewUrl ? "space-between" : "center", gap: 12 }}>
            {previewUrl ? (
              <>
                <button
                  onClick={handleRetake}
                  style={{
                    backgroundColor: "#999",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  ↺ 다시 찍기
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#225AB4",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  저장 후 분석하기 →
                </button>
              </>
            ) : (
              <button
                onClick={handleRecordClick}
                style={{
                  padding: "12px 24px",
                  fontSize: 16,
                  fontWeight: "bold",
                  backgroundColor: isRecording ? "#555" : "#e63946",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {isRecording ? "■ 녹화 중지" : "⏺ 녹화 시작"}
              </button>
            )}
          </div>
        </div>

        {/* 오른쪽: 자료 업로드 + 스크립트 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#ffffff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          }}
        >
          <UploadMaterial />
          <ScriptView />
        </div>
      </div>
    </div>
  );
}
