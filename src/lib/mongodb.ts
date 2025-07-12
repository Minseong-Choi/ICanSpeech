import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI 환경변수가 설정되지 않았습니다.');
}

// 타입 정의
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 전역 객체에 타입 추가
declare global {
  var mongoose: MongooseCache | undefined;
}

/**
 * MongoDB 연결을 관리하는 전역 캐시
 * Next.js 개발 환경에서 hot reload 시 연결이 중복되는 것을 방지
 */
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  // 이미 연결되어 있다면 기존 연결 반환
  if (cached.conn) {
    return cached.conn;
  }

  // 연결 시도 중이 아니라면 새로운 연결 시작
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 연결 전까지 명령어 버퍼링 비활성화
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB에 성공적으로 연결되었습니다!');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB 연결 실패:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;