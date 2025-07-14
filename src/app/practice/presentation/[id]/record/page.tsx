"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // useSearchParams 대신 useParams 사용
import BackButton from "../../../../../components/UI/BackButton"; // 경로 수정
import WebcamView from "../../../../../components/practice/WebcamView"; // 경로 수정
import ScriptView from "../../../../../components/practice/ScriptView"; // 경로 수정
import UploadMaterial from "../../../../../components/practice/UploadMaterial"; // 경로 수정

export default function PresentationRecordPage() {
  const router = useRouter();
  const params = useParams(); // useParams 사용
  const { id: projectId } = params; // id를 projectId로 구조 분해 할당

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
        activeStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setStream(activeStream);
      } catch (_err) {
        alert("오디오 장치를 사용할 수 없습니다.");
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
      } catch (_err) {
        alert("내장 카메라 또는 마이크 접근에 실패했습니다.");
        setIsCameraOn(false);
      }
    }
  };

  const handleSave = async () => {
    if (!previewUrl || !projectId) {
      alert("projectId가 없거나 녹화 영상이 없습니다.");
      return;
    }

    const blob = await fetch(previewUrl).then((res) => res.blob());
    const url = URL.createObjectURL(blob);

    // 👉 서버 대신 임시 리포트 페이지로 이동 (takeId 대신 temp 사용)
    router.push(`/practice/presentation/${projectId}/report?id=temp&video=${encodeURIComponent(url)}`);
  };

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* 상단: 뒤로가기 */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <BackButton />
      </div>

      {/* 본문: 왼쪽 (웹캠 + 버튼) / 오른쪽 (스크립트) */}
      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {/* 왼쪽: 웹캠 + 버튼 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {isCameraOn ? (
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

          {/* 카메라 토글 버튼 */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={toggleCamera}
              style={{
                backgroundColor: isCameraOn ? "#4caf50" : "#999",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              {isCameraOn ? "카메라 끄기" : "카메라 켜기"}
            </button>
          </div>

          {/* 녹화 버튼 */}
          <div style={{ display: "flex", justifyContent: "center" }}>
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
          </div>

          {/* 미리보기 영상 + 저장 버튼 */}
          {previewUrl && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>녹화된 영상</h3>
              <video
                src={previewUrl}
                controls
                style={{
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: "#000",
                }}
              />
              <button
                onClick={handleSave}
                style={{
                  marginTop: 12,
                  backgroundColor: "#225AB4",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                저장 후 분석하기 →
              </button>
            </div>
          )}
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
