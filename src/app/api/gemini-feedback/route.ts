import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { transcript } = await request.json();

  if (!transcript) {
    return NextResponse.json({ message: 'Transcript is missing.' }, { status: 400 });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  console.log(geminiApiKey, "gggggggggggg");

  if (!geminiApiKey) {
    console.error("Server-side Gemini API Key is missing.");
    return NextResponse.json({ message: "서버에 Gemini APIㅋㅋㅋㅋㅋㅋㅋ 키가 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });

    const prompt = `${transcript}
      위 STT 텍스트는 제가 진행한 발표의 스크립트입니다. 이 스크립트를 바탕으로 다음 각 항목에 대해 구체적이고 건설적인 피드백과 개선 조언을 제공해 주세요.

      1.  **불필요한 어구 및 반복 (Filler Words & Repetition):**
          * 발표의 흐름을 방해하거나 의미 없이 반복되는 어구 (예: "음...", "아...", "그러니까...", "뭐랄까...", "사실은...")가 눈에 띄게 많았습니까?
          * 동일한 단어, 구문, 아이디어가 불필요하게 자주 반복되어 지루함을 유발하거나 설득력을 떨어뜨리지는 않았습니까? (핵심 메시지 강조를 위한 의도적인 반복은 제외)
          * 이러한 요소들이 발표의 전문성이나 명확성을 해쳤습니까?
          
      2.  **내용 (Content):**
          * 주제와 관련된 정보가 정확하고 충분히 제공되었습니까?
          * 주장의 근거가 명확하고 설득력이 있었습니까?
          * 내용의 깊이와 폭은 적절했습니까? 청중의 수준에 잘 맞았습니까?
          * 새롭거나 흥미로운 관점이 제시되었습니까?
          * 부족하거나 보충이 필요한 내용은 없었습니까?

      3.  **구성 (Structure & Organization):**
          * 발표의 서론, 본론, 결론이 명확하게 구분되고 효과적으로 연결되었습니까?
          * 정보의 흐름이 논리적이고 이해하기 쉬웠습니까? (예: 시간 순서, 문제-해결, 비교-대조 등)
          * 각 섹션 또는 단락 간의 전환이 자연스러웠습니까?
          * 청중이 내용을 따라가기 쉽게 안내하는 요소(예: 목차, 요약, 다음 내용 예고)가 충분했습니까?

      4.  **어조 (Tone):**
          * 발표 목적(정보 전달, 설득, 동기 부여 등)에 적절한 어조를 유지했습니까?
          * 자신감, 전문성, 열정 등이 느껴집니까?
          * 너무 딱딱하거나, 너무 가볍거나, 불필요하게 공격적이거나 수동적인 어조는 없었습니까?
          * 청중과의 소통을 위한 친근하고 공감할 수 있는 어조가 나타났습니까?

      5.  **내용 전달력 (Overall Delivery of Message):**
          * 발표의 핵심 메시지(들)가 청중에게 명확하고 효과적으로 전달되었습니까?
          * 발표자가 전달하고자 하는 의도와 감정이 스크립트를 통해 잘 느껴집니까?
          * 이 스크립트만으로도 발표의 내용과 중요성을 충분히 이해할 수 있습니까?
          * 전반적으로 이 발표 스크립트가 청중의 흥미를 유발하고 몰입을 유지시킬 수 있을 것이라고 생각하십니까?

      각 항목에 대해 장점과 함께 구체적인 개선 방안을 제시해 주시면 감사하겠습니다.`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();
    console.log("Generated feedback:", feedback);

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error calling Gemini API from API Route:", errorMessage);
    return NextResponse.json({ message: "음성 피드백 생성 중 오류가 발생했습니다.", error: errorMessage }, { status: 500 });
  }
}
