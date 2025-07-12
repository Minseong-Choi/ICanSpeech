"use client";

import BackButton from "../../../../components/BackButton";
import WebcamView from "../../../../components/WebcamView";
import ScriptView from "../../../../components/ScriptView";
import RecordButton from "../../../../components/RecordButton";

export default function PresentationRecordPage() {
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

      {/* 본문: 웹캠 + 스크립트 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <WebcamView />
        <ScriptView />
      </div>

      {/* 하단: 녹화 시작 버튼 */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <RecordButton />
      </div>
    </div>
  );
}
