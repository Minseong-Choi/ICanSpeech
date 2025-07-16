"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardList, { Recording } from "../../../../components/practice/TakeList";
import Header from '@/components/Layout/Header';
import { useSession } from 'next-auth/react';

export default function InterviewPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<{ title: string; recordingCount: number; targetCount?: number; recordings: Recording[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (id) {
      fetch(`/api/practices/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProject(data.practice);
        })
        .catch((error) => {
          console.error("Error fetching practice:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const takes = project ? Array.from({ length: project.recordingCount }, (_, i) => i + 1) : [];

  const handleUploadClick = () => {
    console.log("면접 자료 업로드하기");
    // 나중에 파일 업로드 처리할 수 있음
  };

  if (isLoading) {
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
          <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>로딩 중...</p>
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

  return (
    <div style={{
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      minHeight: "100vh",
      paddingTop: "80px",
      position: "relative"
    }}>
      <Header user={session?.user ?? null} />
      
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
            <span style={{ fontSize: "1.2rem" }}>🎯</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              면접 연습
            </span>
          </div>
          
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 12px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            lineHeight: "1.2"
          }}>
            {project ? project.title : "프로젝트를 불러오는 중..."}
          </h1>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            당신의 면접 실력을 한 단계 업그레이드하세요
          </p>
        </div>

        {/* 진행 상황 카드 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          marginBottom: "32px"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "24px"
          }}>
            <div style={{
              textAlign: "center"
            }}>
              <div style={{
                color: "#60a5fa",
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                {project?.recordingCount || 0}
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                총 연습 횟수
              </div>
            </div>
            
            <div style={{
              textAlign: "center"
            }}>
              <div style={{
                color: "#34d399",
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                {project?.targetCount ?? '-'}
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                목표 녹화 횟수
              </div>
            </div>
            
            <div style={{
              textAlign: "center"
            }}>
              <div style={{
                color: "#fbbf24",
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
              {typeof project?.targetCount === 'number' && project?.recordings
                ? Math.round((project.recordings.length / project.targetCount) * 100)
                : 0}%
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                진행률
              </div>
            </div>
          </div>
        </div>

        {/* 카드 리스트 섹션 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "24px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          marginBottom: "32px"
        }}>
          <h2 style={{
            color: "#ffffff",
            fontSize: "1.4rem",
            fontWeight: "600",
            margin: "0 0 24px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🎬 연습 세션
          </h2>
          
          <CardList
            takes={takes}
            recordings={project?.recordings || []}
            type="interview"
            onUploadClick={handleUploadClick}
          />
        </div>

        {/* 피드백 메시지 */}
        <div style={{
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "12px"
          }}>
            🎉
          </div>
          <div style={{
            color: "#ffffff",
            fontSize: "1.2rem",
            fontWeight: "600",
            marginBottom: "8px"
          }}>
            훌륭한 진전이에요!
          </div>
          <div style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1rem",
            lineHeight: "1.6"
          }}>
            발표 속도가 안정적이에요! 시선 처리가 훨씬 좋아졌어요.
          </div>
        </div>

        {/* 추가 액션 버튼들 */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: "32px"
        }}>
          <button
            onClick={handleUploadClick}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(102, 126, 234, 0.3)";
            }}
          >
            📄 면접 자료 업로드
          </button>
          
          <button
            style={{
              padding: "12px 24px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📊 전체 분석 보기
          </button>
        </div>
      </div>
    </div>
  );
}