'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Image from 'next/image';

interface UserStats {
  totalPractices: number;
  averageScore: number;
  thisWeekPractices: number;
  totalHours: number;
  bestCategory: string;
  streak: number;
}

interface Practice {
  id: string;
  title: string;
  type: 'interview' | 'presentation';
  score: number;
  date: string;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats] = useState<UserStats>({
    totalPractices: 12,
    averageScore: 85,
    thisWeekPractices: 3,
    totalHours: 24,
    bestCategory: '면접',
    streak: 7
  });
  const [recentPractices] = useState<Practice[]>([
    { id: '1', title: '기술 면접 연습', type: 'interview', score: 88, date: '2025-01-10' },
    { id: '2', title: '프로젝트 발표', type: 'presentation', score: 92, date: '2025-01-08' },
    { id: '3', title: '자기소개 연습', type: 'interview', score: 78, date: '2025-01-05' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // 실제 데이터 로딩 시뮬레이션
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>마이페이지를 불러오는 중...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const displayName = session.user?.name || '사용자';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div style={{
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      minHeight: "100vh",
      paddingTop: "80px",
      position: "relative"
    }}>
      <Header user={session.user} />
      
      {/* 배경 패턴 */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 111, 97, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>

      {/* 메인 컨테이너 */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 24px",
        position: "relative",
        zIndex: 2
      }}>
        {/* 페이지 헤더 */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            padding: "8px 20px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <span style={{ fontSize: "1.2rem" }}>👤</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              마이페이지
            </span>
          </div>
          
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 12px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            {displayName}님의 프로필
          </h1>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            당신의 스피치 성장 여정을 확인하세요
          </p>
        </div>

        {/* 프로필 카드 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          marginBottom: "32px",
          textAlign: "center"
        }}>
          {/* 프로필 이미지 */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px"
          }}>
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={displayName}
                width={120}
                height={120}
                style={{
                  borderRadius: "50%",
                  border: "4px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }}
              />
            ) : (
              <div style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
                border: "4px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
              }}>
                {userInitial}
              </div>
            )}
          </div>
          
          <h2 style={{
            color: "#ffffff",
            fontSize: "1.8rem",
            fontWeight: "600",
            margin: "0 0 8px 0"
          }}>
            {displayName}님
          </h2>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "1rem",
            margin: "0 0 24px 0"
          }}>
            {session.user?.email}
          </p>
          
          {/* 연속 연습 배지 */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
            borderRadius: "20px",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "600"
          }}>
            🔥 {stats.streak}일 연속 연습 중!
          </div>
        </div>

        {/* 통계 그리드 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "32px"
        }}>
          {[
            { label: "총 연습 횟수", value: stats.totalPractices, suffix: "회", color: "#60a5fa", icon: "🎯" },
            { label: "평균 점수", value: stats.averageScore, suffix: "점", color: "#34d399", icon: "⭐" },
            { label: "이번 주 연습", value: stats.thisWeekPractices, suffix: "회", color: "#fbbf24", icon: "📅" },
            { label: "총 연습 시간", value: stats.totalHours, suffix: "시간", color: "#a78bfa", icon: "⏰" }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "24px",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                fontSize: "2rem",
                marginBottom: "12px"
              }}>
                {stat.icon}
              </div>
              <div style={{
                color: stat.color,
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                {stat.value}{stat.suffix}
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 최근 연습 기록 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
        }}>
          <h3 style={{
            color: "#ffffff",
            fontSize: "1.4rem",
            fontWeight: "600",
            margin: "0 0 24px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📊 최근 연습 기록
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            {recentPractices.map((practice) => (
              <div
                key={practice.id}
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.2rem" }}>
                    {practice.type === 'interview' ? '🎯' : '🎤'}
                  </span>
                  <div>
                    <div style={{
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: "500",
                      marginBottom: "4px"
                    }}>
                      {practice.title}
                    </div>
                    <div style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.85rem"
                    }}>
                      {new Date(practice.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  color: practice.score >= 80 ? "#34d399" : practice.score >= 60 ? "#fbbf24" : "#f87171",
                  fontSize: "1.1rem",
                  fontWeight: "600"
                }}>
                  {practice.score}점
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}