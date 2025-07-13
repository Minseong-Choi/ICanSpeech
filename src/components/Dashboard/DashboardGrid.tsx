// src/components/Dashboard/DashboardGrid.tsx
import React from 'react';
import { User } from 'next-auth';
import SpeechPracticeCard from './Cards/SpeechPracticeCard';
import MyPageCard from './Cards/MyPageCard';
import SupportMessageCard from './Cards/SupportMessageCard';
import ExampleVideoCard from './Cards/ExampleVideoCard';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  user: User;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ user }) => {
  return (
    <div className={styles.dashboardGrid}>
      {/* ㄴ자 형태의 스피치 연습 카드 컴포넌트 사용 */}
      <div className={styles.speechPracticeArea}>
        <SpeechPracticeCard />
      </div>

      <div className={styles.myPageArea}>
        <MyPageCard user={user} />
      </div>

      <div className={styles.supportMessageArea}>
        <SupportMessageCard user={user} />
      </div>

      <div className={styles.exampleVideoArea}>
        <ExampleVideoCard />
      </div>
    </div>
  );
};

export default DashboardGrid;
