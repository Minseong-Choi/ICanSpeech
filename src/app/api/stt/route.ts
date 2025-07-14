import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prisma = new PrismaClient(); // Initialize PrismaClient

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const recordingId = formData.get('recordingId') as string; // Assuming recordingId is passed in formData

    if (!videoFile) {
      return NextResponse.json({ error: 'Video file is required' }, { status: 400 });
    }
    if (!recordingId) {
      return NextResponse.json({ error: 'Recording ID is required' }, { status: 400 });
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

    // Save the transcript to the database
    await prisma.recording.update({
      where: { id: recordingId },
      data: {
        transcript: transcription.text,
      },
    });

    return NextResponse.json({ transcript: transcription.text, message: 'Transcription saved successfully' });
  } catch (error) {
    console.error('Failed to process STT:', error);
    // Handle potential errors during DB update as well
    if (error instanceof Error && error.message.includes('Record not found')) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process STT or save transcript' },
      { status: 500 }
    );
  }
}
