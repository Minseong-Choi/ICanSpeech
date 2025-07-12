'use client';

import { signOut } from 'next-auth/react';
import { User } from 'next-auth';
import styles from './DashboardHeader.module.css';
import Image from 'next/image';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/login',
      redirect: true 
    });
  };

  // 사용자 이름 표시용
  const displayName = user?.name || '사용자';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* 로고 */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🎤</div>
          <h1 className={styles.logoText}>스피처</h1>
        </div>

        {/* 사용자 섹션 */}
        <div className={styles.userSection}>
          <div className={styles.userProfile}>
            {user?.image ? (
              <Image
              src={user.image}              // 외부 URL 혹은 /public 폴더 경로
              alt={displayName}
              width={48}                    // 본인의 디자인에 맞는 너비
              height={48}                   // 본인의 디자인에 맞는 높이
              className={styles.userAvatar}
              priority                      // LCP 이미지는 priority 옵션으로 즉시 로드 가능
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