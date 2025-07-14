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
        width: "100%",
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        padding: "20px",
        backgroundColor: "#225AB4",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <IoIosAddCircleOutline size={48} />
      <span style={{ fontSize: 20, whiteSpace: "pre-line" }}>{text}</span>
    </button>
  );
}
