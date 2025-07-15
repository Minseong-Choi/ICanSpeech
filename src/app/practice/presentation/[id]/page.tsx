"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "../../../../components/UI/BackButton";
import CardList, { Recording } from "../../../../components/practice/TakeList";
import { useSession } from 'next-auth/react'; 
import Header from '@/components/Layout/Header';
//import FeedbackBox from "../../../components/FeedbackBox";

export default function PresentationPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<{ title: string; recordingCount: number; recordings: Recording[] } | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (id) {
      fetch(`/api/practices/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProject(data.practice);
        });
    }
  }, [id]);

  const takes = project ? Array.from({ length: project.recordingCount }, (_, i) => i + 1) : [];

  const handleUploadClick = () => {
    console.log("발표 자료 업로드하기");
    // 나중에 파일 업로드 처리
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f6fa",
        padding: 24,
        minHeight: "100vh",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* 헤더: 뒤로가기 + 제목 */}
      <div
        style={{
          paddingTop: 80, 
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Header user={session?.user} />
        <h1
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {project ? project.title : "Loading..."}
        </h1>
        <div style={{ width: 40 }} /> {/* 오른쪽 균형 맞춤 */}
      </div>

      {/* 녹화 및 업로드 카드 리스트 */}
      <CardList
        takes={takes}
        recordings={project?.recordings || []}
        type="presentation"
        onUploadClick={handleUploadClick}
      />

      {/* 피드백 박스 */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 16,
          fontSize: 14,
          color: "#333",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        발표 속도가 안정적이에요! 시선 처리가 훨씬 좋아졌어요.
      </div>
    </div>
  );
}
