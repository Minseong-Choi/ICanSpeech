// src/components/Dashboard/Cards/ExampleVideoCard.tsx
import React from 'react';
import styles from './ExampleVideoCard.module.css';

const ExampleVideoCard: React.FC = () => {
  const handleWatchExamples = () => {
    // 예시 영상 페이지로 이동
    window.location.href = '/examples';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <span>📹</span>
        </div>
        <h3 className={styles.cardTitle}>예시 영상 보러가기</h3>
      </div>
      <p className={styles.cardDescription}>
        전문가들의 스피치를 참고하여 발표 실력을 향상시켜 보세요.
      </p>
      <button 
        className={styles.watchButton}
        onClick={handleWatchExamples}
      >
        바로가기 →
      </button>
    </div>
  );
};

export default ExampleVideoCard;
