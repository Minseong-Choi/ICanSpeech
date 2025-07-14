import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;

    if (!videoFile) {
      return NextResponse.json({ error: 'Video file is required' }, { status: 400 });
    }

    // 임시 파일로 저장 (OpenAI SDK는 파일 경로를 필요로 함)
    const tempFilePath = `/tmp/${videoFile.name}`;
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    await fs.promises.writeFile(tempFilePath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // 임시 파일 삭제
    await fs.promises.unlink(tempFilePath);

    return NextResponse.json({ transcript: transcription.text });
  } catch (error) {
    console.error('Failed to process STT:', error);
    return NextResponse.json(
      { error: 'Failed to process STT' },
      { status: 500 }
    );
  }
}
