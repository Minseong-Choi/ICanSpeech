"use client";

export default function ScriptView() {
  return (
    <div
      style={{
        width: "50%",
        height: 400,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontWeight: "bold" }}>발표 스크립트</h3>
      <p>이곳에 발표할 내용을 미리 써놓거나 업로드한 스크립트가 보입니다.</p>
    </div>
  );
}
