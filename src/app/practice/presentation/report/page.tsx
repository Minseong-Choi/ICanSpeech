import ScriptReport from "../../../../components/report/ScriptReport";
import AIReport from "../../../../components/report/AIReport";

export default function ReportPage({ params }: { params: { id: string } }) {
  const videoUrl = "/videos/sample.webm"; // 추후 props로 전달
  const transcript = "안녕하세요. 오늘은 AI 피드백 리포트를 소개하겠습니다.";
  const feedback = [
    "말 속도는 적절합니다.",
    "눈을 자주 아래로 내립니다.",
    "핵심 키워드 'AI'가 3번 빠졌습니다.",
  ];

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <ScriptReport videoUrl={videoUrl} transcript={transcript} />
      <AIReport feedback={feedback} />
    </div>
  );
}
