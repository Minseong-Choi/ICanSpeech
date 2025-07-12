'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import WelcomeSection from '@/components/Dashboard/WelcomeSection';
import DashboardGrid from '@/components/Dashboard/DashboardGrid';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import styles from './page.module.css';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 인증 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 로딩 중
  if (status === 'loading') {
    return <LoadingSpinner message="대시보드를 불러오는 중..." />;
  }

  // 인증되지 않은 경우
  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <DashboardHeader user={session.user} />
      <main className={styles.main}>
        <WelcomeSection user={session.user} />
        <DashboardGrid user={session.user} />
      </main>
    </div>
  );
}