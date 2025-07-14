"use client";

import { useRef } from "react";
import { MdFileUpload } from "react-icons/md";
import { useRouter } from "next/navigation";

type Props = {
  text?: string;
};

export default function UploadRecord({ text = "발표 영상 업로드하기" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // 예: temp id로 리포트로 이동
      router.push(`/practice/presentation/report/temp?video=${encodeURIComponent(url)}`);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          border: "1px dashed #aaa",
          borderRadius: 12,
          width: "100%",
          height: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#fefefe",
          color: "#777",
        }}
      >
        <MdFileUpload size={36} />
        <p style={{ marginTop: 8, fontSize: 14 }}>{text}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
}
