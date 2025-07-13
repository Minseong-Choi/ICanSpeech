import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

// MongoDB 클라이언트 생성
const client = new MongoClient(process.env.MONGODB_URI!);

export const authOptions: AuthOptions = {
  // MongoDB 어댑터 설정 (세션과 계정 정보 저장용)
  adapter: MongoDBAdapter(client),
  
  // 인증 제공자 설정
  providers: [
    // 이메일/비밀번호 로그인
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: '이메일', 
          type: 'email',
          placeholder: 'user@example.com'
        },
        password: { 
          label: '비밀번호', 
          type: 'password' 
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('나 인증제공자인데 이메일과 비밀번호를 입력해라.');
        }

        try {
          // 데이터베이스 연결
          await connectDB();
          
          // 사용자 찾기
          const user = await User.findOne<IUser>({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            throw new Error('등록되지 않은 이메일입니다.');
          }

          // 비밀번호 확인
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isValidPassword) {
            throw new Error('비밀번호가 올바르지 않습니다.');
          }

          // 로그인 성공 - 사용자 정보 반환
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('로그인 오류:', error);
          throw error;
        }
      }
    })
  ],

  // 세션 설정
  session: {
    strategy: 'jwt', // JWT 사용
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // JWT 설정
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // 콜백 함수들
  callbacks: {
    // JWT 토큰 생성/업데이트 시 호출
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // 세션 정보 반환 시 호출
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // 커스텀 페이지 설정
  pages: {
    signIn: '/login', // 커스텀 로그인 페이지
    // signUp: '/register', // 커스텀 회원가입 페이지 (나중에 추가)
  },

  // 보안 설정
  secret: process.env.NEXTAUTH_SECRET,
  
  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
