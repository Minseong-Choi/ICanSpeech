// src/components/Dashboard/Cards/MyPageCard.tsx
'use client';

import { User } from 'next-auth';
import DashboardCard from '../DashboardCard';
import styles from './MyPageCard.module.css';

interface MyPageCardProps {
  user: User;
}

export default function MyPageCard({ user }: MyPageCardProps) {
  // 임시 통계 데이터 (나중에 실제 데이터로 교체)
  const stats = {
    totalPractices: 12,
    averageScore: 85,
    thisWeekPractices: 3
  };

  return (
    <DashboardCard
      className={styles.myPageCard}
      href="/mypage"
      color="#fd79a8"
    >
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>👤</div>
          <h3 className={styles.cardTitle}>마이페이지</h3>
        </div>
        
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.name}님</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.totalPractices}</span>
            <span className={styles.statLabel}>총 연습</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.averageScore}</span>
            <span className={styles.statLabel}>평균 점수</span>
          </div>
        </div>
        
        <div className={styles.weeklyProgress}>
          <span className={styles.progressText}>
            이번 주 {stats.thisWeekPractices}회 연습
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}