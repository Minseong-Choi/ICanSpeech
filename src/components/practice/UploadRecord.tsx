"use client";

import { useRef } from "react";
import { MdFileUpload } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";

type Props = {
  text?: string;
  type: "presentation" | "interview";
  onClick: () => void;
};

export default function UploadRecord({ text = "발표 영상 업로드하기", type }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("type", type);
      formData.append("id", id.toString());

      try {
        const response = await fetch("/api/upload-and-generate-report", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to upload video or generate report:", response.statusText);
          alert("영상 업로드 및 리포트 생성에 실패했습니다.");
          return;
        }

        const result = await response.json();
        if (result.reportId) {
          router.push(`/practice/${type}/${id}/report?recordingId=${result.reportId}`);
        } else {
          console.error("Report ID not found in response:", result);
          alert("리포트 ID를 받지 못했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("Error during file upload or report generation:", error);
        alert("영상 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          border: "2px dashed rgba(113, 128, 150, 0.3)",
          borderRadius: "16px",
          width: "113%",
          height: "120px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          cursor: "pointer",
          color: "#4a5568",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.04)",
          padding: "24px",
          gap: "20px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "rgba(102, 126, 234, 0.4)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(113, 128, 150, 0.3)";
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.04)";
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        
        {/* 아이콘 배경 */}
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            flexShrink: 0,
          }}
        >
          <MdFileUpload size={26} color="#667eea" />
        </div>
        
        <div style={{ flex: 1 }}>
          <p 
            style={{ 
              margin: "0 0 4px 0", 
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "1.4",
              color: "#2d3748",
            }}
          >
            {text}
          </p>
          
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#718096",
            }}
          >
            클릭하여 파일 선택
          </p>
        </div>
        
        {/* 오른쪽 점선 */}
        <div
          style={{
            position: "absolute",
            right: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "2px",
            height: "36px",
            background: "repeating-linear-gradient(to bottom, #cbd5e0 0, #cbd5e0 4px, transparent 4px, transparent 8px)",
          }}
        />
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