'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // 임시 로그아웃 처리
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>🎤</div>
          <h1 className={styles.logoText}>스피처</h1>
        </Link>

        <nav className={styles.navigation}>
          <Link href="/dashboard" className={styles.navLink}>
            대시보드
          </Link>
          <Link href="/practice" className={styles.navLink}>
            연습하기
          </Link>
          <Link href="/mypage" className={styles.navLink}>
            마이페이지
          </Link>
          <Link href="/ocean-messages" className={styles.navLink}>
            응원메시지
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>김</div>
            <span className={styles.userName}>김사용자님</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}