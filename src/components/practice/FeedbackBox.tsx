"use client";

export default function FeedbackBox() {
  return (
    <div
      style={{
        marginTop: 40,
        padding: 20,
        backgroundColor: "#ffffff", 
        borderRadius: 8,
        border: "1px solid #c6d5f4",
        color: "#1a237e", // 짙은 파랑 글자색
      }}
    >
      <h3 style={{ marginBottom: 12 }}>개선사항</h3>
      <ul style={{ paddingLeft: 20, margin: 0 }}>
        <li> 말의 속도가 일정해졌어요</li>
        <li> 제스처가 자연스러워졌어요</li>
      </ul>
    </div>
  );
}