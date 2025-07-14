"use client";

interface TakeCardProps {
  index: number;           // 몇 번째 연습인지 (1, 2, 3, ...)
  date?: string;           // 날짜 (선택)
  onClick?: () => void;    // 클릭 시 이동
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "날짜 정보 없음";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function TakeCard({ index, date, onClick }: TakeCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        width: 150,
        height: 400,
        backgroundColor: "#fff",
        cursor: onClick ? "pointer" : "default",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        transition: "all 0.2s ease-in-out",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "16px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
        {index}번째 연습
      </h3>
      <p style={{ fontSize: "13px", color: "#666" }}>
        {formatDate(date)}
      </p>
    </div>
  );
}
