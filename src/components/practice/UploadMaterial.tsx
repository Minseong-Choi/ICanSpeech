"use client";

import { MdFileUpload } from "react-icons/md";

type Props = {
  onClick?: () => void;
  text?: string; // 페이지마다 다르게 쓸 수 있도록
};

export default function UploadMaterial({ onClick, text = "자료 추가하기" }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 200,
        height: 400,
        borderRadius: 12,
        border: "1px solid lightgray",
        backgroundColor: "#F4F6FE",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        color: "#999",
      }}
    >
      <MdFileUpload size={32} style={{ marginBottom: 8 }} />
      <span style={{ fontSize: 13, textAlign: "center" }}>{text}</span>
    </div>
  );
}
