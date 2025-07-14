"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MdFileUpload, MdDelete } from "react-icons/md";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), { ssr: false });

type Props = {
  text?: string;
};

export default function UploadMaterial({ text = "자료 추가하기" }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
  };

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDelete = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setNumPages(0);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div style={{ width: "100%" }}>
      {!pdfUrl ? (
        <label
          htmlFor="pdfInput"
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
            ref={inputRef}
            id="pdfInput"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
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

          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={handleLoadSuccess}
              loading={<div>PDF 불러오는 중...</div>}
              error={<div style={{ color: "red" }}>PDF 로딩 실패</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
              ))}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
