"use client";

type Props = {
  feedback: string[];
};

export default function AIReport({ feedback }: Props) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: 16 }}>🧠 AI 분석 결과</h3>
      <ul style={{ lineHeight: 1.6 }}>
        {feedback.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
