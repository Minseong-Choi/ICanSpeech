"use client";

import { useRef } from "react";
import { MdFileUpload } from "react-icons/md";
import { useRouter, useParams } from "next/navigation"; // useParams도 import

type Props = {
  text?: string;
  type: "presentation" | "interview";
  onClick: () => void;
};

export default function UploadRecord({ text = "발표 영상 업로드하기", type }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // id 추출

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("type", type); // type 정보도 함께 전달
      formData.append("id", id.toString()); // id 정보도 함께 전달

      try {
        // Assuming an API endpoint exists to handle video upload and report generation
        // This endpoint should return a report ID or a redirect URL
        const response = await fetch("/api/upload-and-generate-report", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Handle error response from the server
          console.error("Failed to upload video or generate report:", response.statusText);
          // Optionally, show an error message to the user
          alert("영상 업로드 및 리포트 생성에 실패했습니다.");
          return;
        }

        const result = await response.json();
        // Assuming the API returns { reportId: "some-report-id" }
        if (result.reportId) {
          // Assuming the reportId can be used as recordingId for the report page
          router.push(`/practice/${type}/${id}/report?recordingId=${result.reportId}`);
        } else {
          // Handle cases where reportId is not returned
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
          border: "1px dashed #aaa",
          borderRadius: 12,
          width: "50%",
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
