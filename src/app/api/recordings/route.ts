import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: Request) {
  console.log('POST /api/recordings: Request received.');
  try {
    const session = await getServerSession(authOptions);
    console.log('POST /api/recordings: Session checked.');

    if (!session?.user?.email) {
      console.error('POST /api/recordings: Unauthorized access attempt.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('POST /api/recordings: Parsing FormData...');
    const formData = await request.formData();
    console.log('POST /api/recordings: FormData parsed.');
    const projectId = formData.get('projectId') as string;
    const videoFile = formData.get('video') as File;

    if (!projectId || !videoFile) {
      console.error('POST /api/recordings: Missing projectId or videoFile.');
      return NextResponse.json({ error: 'Project ID and video file are required' }, { status: 400 });
    }
    console.log(`POST /api/recordings: Project ID: ${projectId}, Video File: ${videoFile.name}`);

    const mongoose = await connectDB();
    console.log('POST /api/recordings: Database connected.');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }

    console.log('POST /api/recordings: Reading video file into buffer...');
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    console.log(`POST /api/recordings: Buffer created, size: ${buffer.length} bytes.`);
    const filename = `${new ObjectId().toHexString()}-${videoFile.name}`;
    const videoPath = path.join(process.cwd(), 'public/videos', filename);
    
    console.log(`POST /api/recordings: Writing file to ${videoPath}...`);
    await writeFile(videoPath, buffer);
    console.log('POST /api/recordings: File written successfully.');

    const audioPath = videoPath.replace(path.extname(videoPath), '.mp3');

    console.log('Attempting to convert video to audio...');
    console.log(`Video path: ${videoPath}`);
    console.log(`Audio path: ${audioPath}`);

    try {
      // 1️⃣ ffmpeg: webm → mp3 변환
      await execPromise(`ffmpeg -y -i "${videoPath}" -vn -acodec libmp3lame -ar 44100 -ac 2 "${audioPath}"`);
      console.log('ffmpeg conversion successful.');
    } catch (error) {
      console.error('ffmpeg conversion failed. Full error object:', error);
      throw new Error('Failed to convert video to audio.');
    }

    let transcript = '';
    try {
      // 2️⃣ Whisper Python 스크립트 실행 (가상 환경 사용)
      //const pythonExecutable = path.join(process.cwd(), 'whisper-env/bin/python');
      const pythonExecutable = path.join(process.cwd(), 'whisper-env', 'Scripts', 'python.exe');
      const whisperScript = path.join(process.cwd(), 'whisper_stt.py');
      const { stdout } = await execPromise(`"${pythonExecutable}" "${whisperScript}" "${audioPath}"`,{encoding: 'utf8'});
      
      // JSON 출력을 파싱
      const result = JSON.parse(stdout);
      transcript = result.text;

      if (!transcript) {
        console.warn('Whisper returned an empty transcript.');
      }
      
    } catch (error) {
      const execError = error as { stderr?: string; message: string };
      // Python 스크립트의 stderr에 JSON 오류가 담겨 있을 수 있음
      console.error('Whisper script execution failed:', execError.stderr || execError.message);
      throw new Error('Failed to transcribe audio.');
    }

    const videoUrl = `/videos/${filename}`;

    const newRecording = {
      practiceId: new ObjectId(projectId),
      userEmail: session.user.email,
      videoUrl,
      transcript,
      createdAt: new Date(),
    };

    const result = await db.collection('recordings').insertOne(newRecording);

    if (!result.acknowledged) {
      throw new Error('Failed to insert recording');
    }

    // 필요 시 mp3 파일 삭제 (디버깅을 위해 임시 주석 처리)
    // fs.unlink(audioPath, () => null);

    return NextResponse.json({ message: 'Recording saved successfully', recordingId: result.insertedId });
  } catch (error) {
    console.error('Failed to save recording:', error);
    return NextResponse.json({ error: 'Failed to save recording' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('id');

    if (!recordingId) {
      return NextResponse.json({ error: 'Recording ID is required' }, { status: 400 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }

    const recording = await db.collection('recordings').findOne({
      _id: new ObjectId(recordingId.replace(/-/g, '')),
      userEmail: session.user.email,
    });

    if (!recording) {
      return NextResponse.json({ error: 'Recording not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ recording });
  } catch (error) {
    console.error('Failed to fetch recording:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recording' },
      { status: 500 }
    );
  }
}
