// app/api/practices/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/route';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }
    
    // 사용자의 프로젝트 목록 조회
    const practices = await db
      .collection('practices')
      .aggregate([
        {
          $match: { userEmail: session.user.email }
        },
        {
          // recordings 컬렉션과 조인하여 녹화 개수와 최신 녹화 날짜 가져오기
          $lookup: {
            from: 'recordings',
            localField: '_id',
            foreignField: 'practiceId',
            as: 'recordings'
          }
        },
        {
          $addFields: {
            recordingCount: { $size: '$recordings' },
            lastRecordingDate: {
              $max: '$recordings.createdAt'
            }
          }
        },
        {
          // recordings 배열은 응답에서 제외
          $project: {
            recordings: 0
          }
        },
        {
          // 최신순 정렬
          $sort: { 
            lastRecordingDate: -1,
            createdAt: -1 
          }
        }
      ])
      .toArray();

    return NextResponse.json({ practices });
  } catch (error) {
    console.error('Failed to fetch practices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, description, materials, targetCount } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }
    
    const practice = {
      userEmail: session.user.email,
      type,
      title,
      description: description || '',
      materials: materials || [],
      targetCount: targetCount || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('practices').insertOne(practice);

    return NextResponse.json({
      practice: {
        _id: result.insertedId,
        ...practice
      }
    });
  } catch (error) {
    console.error('Failed to create practice:', error);
    return NextResponse.json(
      { error: 'Failed to create practice' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }

    const result = await db.collection('practices').deleteOne({
      _id: new ObjectId(id),
      userEmail: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Practice not found or user not authorized' }, { status: 404 });
    }

    // 관련된 녹화(recordings)도 삭제
    await db.collection('recordings').deleteMany({
      practiceId: new ObjectId(id),
    });

    return NextResponse.json({ message: 'Practice deleted successfully' });
  } catch (error) {
    console.error('Failed to delete practice:', error);
    return NextResponse.json(
      { error: 'Failed to delete practice' },
      { status: 500 }
    );
  }
}
