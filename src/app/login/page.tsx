'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // 자동 리디렉션 비활성화
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // 로그인 성공 - 대시보드로 이동
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 (추후 구현)`);
    // TODO: 소셜 로그인 구현
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.content}>
          {/* 로고 섹션 */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🎤</div>
            <div className={styles.logoText}>아이캔 스피치</div>
          </div>
          
          {/* 서브타이틀 */}
          <div className={styles.subtitle}>
            자신감 있는 스피치, 연습부터<br />
            분석까지 한.번.에.
          </div>
          
          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            <button 
              type="submit" 
              className={styles.loginBtn}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '🎤 로그인하기'}
            </button>
          </form>

          {/* 구분선 */}
          <div className={styles.divider}>
            <span>또는</span>
          </div>

          {/* 소셜 로그인 */}
          <div className={styles.socialLogin}>
            <button 
              className={styles.socialBtn}
              onClick={() => handleSocialLogin('Google')}
            >
              <span>G</span>
              <span>Google</span>
            </button>
            <button 
              className={styles.socialBtn}
              onClick={() => handleSocialLogin('Naver')}
            >
              <span>N</span>
              <span>Naver</span>
            </button>
          </div>

          {/* 하단 링크 */}
          <div className={styles.links}>
            <Link href="/register" className={styles.link}>회원가입</Link>
            <span className={styles.separator}>|</span>
            <Link href="/forgot-password" className={styles.link}>비밀번호 찾기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}