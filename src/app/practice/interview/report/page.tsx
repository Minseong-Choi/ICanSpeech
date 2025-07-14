"use client"; // 클라이언트 컴포넌트로 명시

import { useSearchParams } from "next/navigation"; // useParams 대신 useSearchParams 사용
import ScriptReport from "../../../../components/report/ScriptReport"; // 경로 수정
import AIReport from "../../../../components/report/AIReport"; // 경로 수정

export default function InterviewReportPage() { // 컴포넌트 이름 변경
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("video") || "/videos/sample.webm"; // videoUrl을 쿼리 파라미터에서 가져옴
  const reportId = searchParams.get("id"); // reportId를 쿼리 파라미터에서 가져옴

  const transcript = "안녕하세요. 오늘은 AI 피드백 리포트를 소개하겠습니다.";
  const feedback = [
    "말 속도는 적절합니다.",
    "눈을 자주 아래로 내립니다.",
    "핵심 키워드 'AI'가 3번 빠졌습니다.",
  ];
  console.log("ReportPage reportId:", reportId); // reportId 확인
  console.log("ReportPage videoUrl:", videoUrl); // videoUrl 확인

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <ScriptReport videoUrl={videoUrl} transcript={transcript} />
      <AIReport feedback={feedback} />
    </div>
  );
}
