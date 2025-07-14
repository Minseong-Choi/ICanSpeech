"use server";

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 특정 practice 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const _id = params.id; // URL에서 practice ID 추출

    if (!_id) {
      return NextResponse.json({ error: 'Practice ID is required' }, { status: 400 });
    }

    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not found.');
    }
    
    // practice ID와 사용자 이메일을 사용하여 특정 practice 조회
    const practice = await db
      .collection('practices')
      .aggregate([
        {
          $match: { 
            _id: new ObjectId(_id), // ID로 필터링
            userEmail: session.user.email // 현재 사용자의 이메일로 필터링
          }
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
        }
      ])
      .toArray();

    if (practice.length === 0) {
      return NextResponse.json({ error: 'Practice not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ practice: practice[0] }); // 단일 practice 객체 반환
  } catch (error) {
    console.error('Failed to fetch practice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch practice' },
      { status: 500 }
    );
  }
}

// TODO: N번째 연습 데이터를 불러오는 로직은 이 파일 또는 별도의 API에서 처리해야 합니다.
// 현재는 practice의 기본 정보만 조회합니다.
