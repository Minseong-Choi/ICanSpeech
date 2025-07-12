// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // MongoDB 연결 테스트
    await connectDB();
    
    // User 컬렉션에서 사용자 수 조회 (테스트용)
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공!',
      data: {
        userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '데이터베이스 연결 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 });
  }
}