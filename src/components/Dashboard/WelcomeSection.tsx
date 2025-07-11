'use client';

import { User } from 'next-auth';
import styles from './WelcomeSection.module.css';

interface WelcomeSectionProps {
  user: User;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const displayName = user?.name || '사용자';
  
  // 시간대별 인사말
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후에요';
    return '좋은 저녁이에요';
  };

  return (
    <section className={styles.welcomeSection}>
      <h2 className={styles.welcomeTitle}>
        {getGreeting()}, {displayName}님! 👋
      </h2>
      <p className={styles.welcomeDesc}>
        오늘도 자신감 넘치는 스피치 연습을 시작해보세요
      </p>
      {user?.email && (
        <p className={styles.userInfo}>
          📧 {user.email}
        </p>
      )}
    </section>
  );
}