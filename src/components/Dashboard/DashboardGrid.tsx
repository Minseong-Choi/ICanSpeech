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
        <SpeechPracticeCard user={user} />
      </div>

      {/* 독립적인 예시영상 카드 - ㄴ자 좌하단 빈 공간에 위치 */}
      <div className={styles.exampleVideoArea}>
        <ExampleVideoCard user={user} />
      </div>

      {/* 우상단 마이페이지 카드 */}
      <div className={styles.myPageArea}>
        <MyPageCard user={user} />
      </div>

      {/* 우하단 응원메시지 카드 */}
      <div className={styles.supportMessageArea}>
        <SupportMessageCard user={user} />
      </div>
    </div>
  );
};

export default DashboardGrid;