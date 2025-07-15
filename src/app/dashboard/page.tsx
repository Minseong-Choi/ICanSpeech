'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Layout/Header';
import WelcomeSection from '@/components/Dashboard/WelcomeSection';
import DashboardGrid from '@/components/Dashboard/DashboardGrid';
//import LoadingSpinner from '@/components/UI/LoadingSpinner';
import styles from './page.module.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  const handleScroll = () => {
    if (mainRef.current) {
      const scrollTop = mainRef.current.scrollTop;
      setIsScrolled(scrollTop > 20);
    }
  };

  useEffect(() => {
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => {
        mainElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // 인증 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 로딩 중
  if (status === 'loading') {
    return (
      <div style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>대시보드를 불러오는 중...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Header user={session.user} />
      
      {/* 배경 패턴 */}
      <div className={styles.backgroundPattern}></div>
      
      <main className={styles.main} ref={mainRef}>
        <div className={`${styles.welcomeSection} ${isScrolled ? styles.welcomeSectionScrolled : ''}`}>
          <WelcomeSection user={session.user} />
        </div>
        <DashboardGrid user={session.user} />
      </main>
    </div>
  );
}