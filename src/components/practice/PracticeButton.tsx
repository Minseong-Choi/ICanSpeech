"use client";

import { useRouter } from "next/navigation";
import { IoIosAddCircleOutline } from "react-icons/io";

interface PracticeButtonProps {
  text: string;
  route?: string;
}

export default function PracticeButton({ text, route }: PracticeButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (route) router.push(route);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "113%",
        height: "180px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "16px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.25)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.25)";
      }}
    >
      {/* 배경 장식 요소 */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: "80px",
          height: "80px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      
      {/* 아이콘 배경 */}
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IoIosAddCircleOutline size={32} color="white" />
      </div>
      
      <span 
        style={{ 
          fontSize: "18px", 
          whiteSpace: "pre-line",
          fontWeight: "600",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          lineHeight: "1.4",
          flex: 1,
        }}
      >
        {text}
      </span>
      
      {/* 하단 액센트 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255, 255, 255, 0.3)",
        }}
      />
    </button>
  );
}