"use client";

import { useState } from "react";

export default function ScriptView() {
  const [script, setScript] = useState<string>();

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
        발표 스크립트
      </h3>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="발표 내용을 입력하세요"
        style={{
          width: "100%",
          height: 300,
          fontSize: 14,
          lineHeight: "1.6",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          fontFamily: "inherit",
          backgroundColor: "#fefefe",
        }}
      />
    </div>
  );
}
