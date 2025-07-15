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
    >    <div style={{ flex: 1 }}>
            <h3> 🧠 AI 분석 결과 </h3>
            <div
              style={{
                border: '1px solid #ccc',
                flex: 1,
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#fff',
                minHeight: 80,
              }}
            >
              <ul style={{ lineHeight: 1.6 }}>
                {feedback.map((item, idx) => (
                  <div key={idx}> {item}</div>
                ))}
              </ul>
            </div>
          </div>
    </div>
  );
}
