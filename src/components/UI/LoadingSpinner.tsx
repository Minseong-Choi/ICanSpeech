'use client';

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ 
  message = '로딩 중...', 
  size = 'medium' 
}: LoadingSpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.spinnerInner}></div>
      </div>
      {message && (
        <p className={styles.message}>{message}</p>
      )}
    </div>
  );
}