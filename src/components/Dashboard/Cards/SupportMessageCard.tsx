// src/components/Dashboard/Cards/SupportMessageCard.tsx
'use client';

import { User } from 'next-auth';
import DashboardCard from '../DashboardCard';
import styles from './SupportMessageCard.module.css';

interface SupportMessageCardProps {
  user: User;
}

export default function SupportMessageCard({ user }: SupportMessageCardProps) {
  return (
    <DashboardCard
      className={styles.supportMessageCard}
      href="/ocean-messages"
      color="#00b894"
    >
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon}>💌</div>
          <h3 className={styles.cardTitle}>응원메시지 보러가기</h3>
        </div>
        
        <p className={styles.cardDescription}>
          바다에 떠다니는 유리병 속 따뜻한 응원 메시지를 확인해보세요
        </p>
        
        <div className={styles.messagePreview}>
          <div className={styles.bottleIcon}>🍾</div>
          <span className={styles.messageCount}>새로운 메시지 3개</span>
        </div>
      </div>
    </DashboardCard>
  );
}