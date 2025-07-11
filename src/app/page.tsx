'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 홈페이지 접근 시 로그인 페이지로 리디렉션
    // 실제로는 여기서 인증 상태를 확인하고 
    // 로그인되어 있으면 대시보드로, 아니면 로그인 페이지로 이동
    
    // 임시로 로그인 페이지로 이동
    router.push('/login');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 1rem'
        }}>
          🎤
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>스피처</h1>
        <p>페이지를 로딩중입니다...</p>
      </div>
    </div>
  );
}