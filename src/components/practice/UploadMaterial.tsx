"use client";

import { useState, useRef } from "react";

export default function UploadMaterial() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      
      // 기존 URL이 있다면 해제
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      // 새로운 URL 생성
      const newUrl = URL.createObjectURL(file);
      setPdfUrl(newUrl);
    } else {
      alert("PDF 파일만 업로드할 수 있습니다.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfFile(null);
    setPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 16,
        color: "#333"
      }}>
        발표 자료 업로드
      </h3>
      
      {/* 파일 업로드 영역 */}
      <div style={{ marginBottom: 16 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        
        {!pdfFile ? (
          <div
            onClick={handleUploadClick}
            style={{
              border: "2px dashed #ccc",
              borderRadius: 8,
              padding: 24,
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#225AB4";
              e.currentTarget.style.backgroundColor = "#f0f4ff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.backgroundColor = "#f9f9f9";
            }}
          >
            <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              📄 PDF 파일을 클릭하여 업로드하세요
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>
              지원 형식: PDF
            </div>
          </div>
        ) : (
          <div style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#f9f9f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📄</span>
              <span style={{ fontSize: 14, fontWeight: "500" }}>
                {pdfFile.name}
              </span>
              <span style={{ fontSize: 12, color: "#666" }}>
                ({Math.round(pdfFile.size / 1024)} KB)
              </span>
            </div>
            <button
              onClick={handleRemoveFile}
              style={{
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* PDF 뷰어 */}
      {pdfUrl && (
        <div style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#fff"
        }}>
          <div style={{
            padding: 12,
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
            fontSize: 14,
            fontWeight: "500"
          }}>
            PDF 미리보기
          </div>
          <iframe
            src={pdfUrl}
            style={{
              width: "100%",
              height: 400,
              border: "none"
            }}
            title="PDF 뷰어"
          />
        </div>
      )}
    </div>
  );
}