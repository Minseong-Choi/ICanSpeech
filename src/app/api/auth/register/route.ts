// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const { name, email, password, confirmPassword } = await request.json();

    // 입력값 검증
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: '모든 필드를 입력해주세요.'
      }, { status: 400 });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      }, { status: 400 });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: '비밀번호는 6자 이상이어야 합니다.'
      }, { status: 400 });
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      }, { status: 400 });
    }

    // 데이터베이스 연결
    await connectDB();

    // 이메일 중복 확인
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      }, { status: 409 });
    }

    // 비밀번호 암호화
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 새 사용자 생성
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await newUser.save();

    // 성공 응답 (비밀번호 제외)
    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);

    // Mongoose 검증 오류 처리
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: '입력값이 올바르지 않습니다.',
        errors: error.message
      }, { status: 400 });
    }

    // 서버 오류
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }, { status: 500 });
  }
}