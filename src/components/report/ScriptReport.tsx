"use client";

type Props = {
  videoUrl: string;
  transcript: string;
};

export default function ScriptReport({ videoUrl, transcript }: Props) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      <video src={videoUrl} controls style={{ width: "100%", borderRadius: 8 }} />
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: 16,
          borderRadius: 8,
          height: 200,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontSize: 14,
          fontFamily: "inherit",
        }}
      >
        {transcript}
      </div>
    </div>
  );
}
