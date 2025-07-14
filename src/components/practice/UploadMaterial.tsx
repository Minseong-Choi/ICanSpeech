"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MdFileUpload, MdDelete, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

// SSR 비활성화
const Document = dynamic(() => import("react-pdf").then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then(mod => mod.Page), { ssr: false });

type Props = {
  text?: string;
};

export default function UploadMaterial({ text = "자료 추가하기" }: Props) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfUrl(url);
      setCurrentPage(1); // 첫 페이지로 초기화
    }
  };

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDelete = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(null);
    setPdfUrl(null);
    setNumPages(0);
    setCurrentPage(1);
  };

  const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, numPages));

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div style={{ width: "100%" }}>
      {!pdfUrl ? (
        <div
          onClick={() => document.getElementById("pdfInput")?.click()}
          style={{
            width: "100%",
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
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            border: "1px solid lightgray",
            backgroundColor: "#fff",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleDelete}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MdDelete size={16} />
            삭제
          </button>

          <div style={{ height: 400, overflow: "auto" }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={handleLoadSuccess}
              loading={<div>PDF 불러오는 중...</div>}
              error={<div style={{ color: "red" }}>PDF 로딩 실패</div>}
            >
              <Page pageNumber={currentPage} width={600} />
            </Document>
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={goToPrev}
              disabled={currentPage <= 1}
              style={{
                backgroundColor: "#ddd",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <MdNavigateBefore size={20} />
            </button>

            <span>
              {currentPage} / {numPages}
            </span>

            <button
              onClick={goToNext}
              disabled={currentPage >= numPages}
              style={{
                backgroundColor: "#ddd",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <MdNavigateNext size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
