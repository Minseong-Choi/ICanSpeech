// src/components/Dashboard/DashboardGrid.tsx
import React from 'react';
import { User } from 'next-auth';
import MyPageCard from './Cards/MyPageCard';
import SupportMessageCard from './Cards/SupportMessageCard';
import ExampleVideoCard from './Cards/ExampleVideoCard';
import styles from './DashboardGrid.module.css';

interface DashboardGridProps {
  user: User;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ user }) => {
  const handleStartPractice = () => {
    console.log('스피치 연습 클릭됨!'); // 디버깅용
    window.location.href = '/practice';
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* ㄱ자 형태의 스피치 연습 카드 */}
      <div className={styles.lShapeSpeechCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>
            <span>🎤</span>
          </div>
          <h2 className={styles.cardTitle}>스피치 연습하기</h2>
        </div>

        <div className={styles.description}>
          <p>{user.name}님, 웹캠 촬영이나 영상 업로드로 스피치를 연습하고 AI 분석을 받아보세요</p>
        </div>

        <div className={styles.motivationQuote}>
          <blockquote>
            &ldquo;자신감 있는 목소리로 세상과 소통하세요&rdquo;
          </blockquote>
        </div>

        <div className={styles.practiceStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>총 연습</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>8.5</span>
            <span className={styles.statLabel}>평균 점수</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>이번 주</span>
          </div>
        </div>

        <button 
          className={styles.startButton}
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 이벤트와 충돌 방지
            handleStartPractice();
          }}
        >
          연습 시작하기
          <span className={styles.buttonIcon}>→</span>
        </button>
      </div>

      {/* 독립적인 예시영상 카드 - ㄱ자 좌하단 빈 공간에 위치 */}
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