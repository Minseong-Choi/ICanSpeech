"use client";

import { useSearchParams } from "next/navigation";
import BackButton from "../../../../../components/UI/BackButton";
import ScriptReport from "../../../../../components/report/ScriptReport";
import AIReport from "../../../../../components/report/AIReport";
import { useEffect } from "react";
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function ReportPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { data: session, status } = useSession();

  const practiceId = params.id;
  const videoUrl = "/videos/sample.webm"; // TODO: practiceId + page로 영상 불러오기
  const transcript = "안녕하세요. 오늘은 AI 피드백 리포트를 소개하겠습니다.";
  const feedback = [
    "말 속도는 적절합니다.",
    "눈을 자주 아래로 내립니다.",
    "핵심 키워드 'AI'가 3번 빠졌습니다.",
  ];

  useEffect(() => {
    console.log("practiceId:", practiceId);
    console.log("current page:", page);
    // TODO: 여기에 practiceId, page 기반 fetch 추가 예정
  }, [practiceId, page]);

  return (
    <div
      style={{
        padding: 24,
        paddingTop: 80, 
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        gap: 24,
      }}
    >
      <Header user={session?.user} />


      {/* 본문 리포트 */}
      <div style={{ display: "flex", gap: 24 }}>
        <ScriptReport videoUrl={videoUrl} transcript={transcript} />
        <AIReport feedback={feedback} />
      </div>
    </div>
  );
}
