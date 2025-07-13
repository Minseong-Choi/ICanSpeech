"use client";

import BackButton from "../../../../components/UI/BackButton";
import WebcamView from "../../../../components/practice/WebcamView";
import ScriptView from "../../../../components/practice/ScriptView";
import UploadMaterial from "../../../../components/practice/UploadMaterial"

export default function InterviewRecordPage() {
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
      <div
        style={{
          display: "flex",
          gap: 24,
          flex: 1,
        }}
      >
        {/* 왼쪽: 웹캠 + 버튼 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <WebcamView />
          <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    style={{
                        padding: "12px 24px",
                        fontSize: 16,
                        fontWeight: "bold",
                        backgroundColor: "#e63946",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    ⏺ 녹화 시작
                </button>
          </div>
        </div>

        {/* 오른쪽: 스크립트 (길게) */}
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
          <UploadMaterial/>
          <ScriptView />
        </div>
      </div>
    </div>
  );
}
