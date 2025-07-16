'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import BackButton from "../UI/BackButton";

import { signOut } from 'next-auth/react';
import { User } from 'next-auth';
import Image from 'next/image';

interface HeaderProps {
  user: User | null;
}

export default function Header( {user} : HeaderProps ) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    });
  };

  const displayName = user?.name || '사용자';
  const userInitial = displayName.charAt(0).toUpperCase();


  return (
    <header className={styles.header}>
      <div style={{ position: "absolute", left: 16, top: 16 }}>
        <BackButton />
      </div>
      <div className={styles.container}>
        <div className={styles.leftGroup}>
          <Link href="/dashboard" className={styles.logo} style={{ position: "absolute", left: 130 }}>
            <div className={styles.logoIcon}>🎤</div>
            <h1 className={styles.logoText}>아이캔 스피치</h1>
          </Link>
        </div>
        {/* <Link href="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>🎤</div>
          <h1 className={styles.logoText} >아이 캔 스피치</h1>
        </Link> */}

        <nav className={styles.navigation}>
          <Link href="/dashboard" className={styles.navLink}>
            대시보드
          </Link>
          {/* <Link href="/practice" className={styles.navLink}>
            연습하기
          </Link> */}
          <Link href="/mypage" className={styles.navLink}>
            마이페이지
          </Link>
          <Link href="/ocean-messages" className={styles.navLink}>
            응원메시지
          </Link>
        </nav>

        <div className={styles.userSection} style={{ position: "absolute", right: 100 }}>
          <div className={styles.userProfile}>
            {user?.image ? (
              <Image
              src={user.image}
              alt={displayName}
              width={48}
              height={48}
              className={styles.userAvatar}
              priority
            />
            ) : (
              <div className={styles.userAvatar}>
                {userInitial}
              </div>
            )}
            <span className={styles.userName}>{displayName}님</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
