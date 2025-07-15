"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  const handleClick = () => {
    if (fromPage === 'new') {
      router.push('/dashboard');
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        outline: "none",
        borderRadius: "12px",
        padding: "8px",
        cursor: "pointer",
        color: "#ffffff",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        marginTop:"-8px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1)";
      }}
    >
      <IoMdArrowRoundBack size={24} />
    </button>
  );
}