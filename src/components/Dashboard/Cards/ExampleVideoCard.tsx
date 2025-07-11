// src/components/Dashboard/Cards/ExampleVideoCard.tsx
import React from 'react';
import { User } from 'next-auth';
import DashboardCard from '../DashboardCard';
import styles from './ExampleVideoCard.module.css';

interface ExampleVideoCardProps {
  user: User;
}

const ExampleVideoCard: React.FC<ExampleVideoCardProps> = ({ user }) => {
  const handleWatchExamples = () => {
    // 예시 영상 페이지로 이동
    window.location.href = '/examples';
  };

  return (
    <DashboardCard className={styles.exampleVideoCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardIcon}>
          <span>📹</span>
        </div>
        <h3 className={styles.cardTitle}>예시영상</h3>
        <p className={styles.cardDescription}>
          {user.name}님, 좋은 스피치 예시를 보고 배워보세요
        </p>
        <button 
          className={styles.watchButton}
          onClick={handleWatchExamples}
        >
          보러가기
        </button>
      </div>
    </DashboardCard>
  );
};

export default ExampleVideoCard;