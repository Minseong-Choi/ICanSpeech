"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CardList, { Recording } from "../../../../components/practice/TakeList";
import { useSession } from 'next-auth/react'; 
import Header from '@/components/Layout/Header';

export default function PresentationPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<{ title: string; recordingCount: number;  targetCount?: number; recordings: Recording[] } | null>(null);
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
    console.log("발표 자료 업로드하기");
    // 나중에 파일 업로드 처리
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
            <span style={{ fontSize: "1.2rem" }}>🎤</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              발표 연습
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
            완벽한 발표를 위한 체계적인 연습 과정
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
          
          {(project?.recordings && project.recordings.length > 0) ? (
            <CardList
              takes={takes}
              recordings={project?.recordings || []}
              type="presentation"
              onUploadClick={handleUploadClick}
            />
          ) : (
            /* 연습 영상이 없을 때 표시되는 안내 */
            <div style={{
              textAlign: "center",
              padding: "40px 20px"
            }}>
              <div style={{
                fontSize: "4rem",
                marginBottom: "20px",
                opacity: 0.6
              }}>
                🎤
              </div>
              <h3 style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "12px"
              }}>
                첫 번째 발표 연습을 시작해보세요!
              </h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                lineHeight: "1.6",
                marginBottom: "32px",
                maxWidth: "500px",
                margin: "0 auto 32px auto"
              }}>
                아직 연습 영상이 없습니다. 아래 버튼을 클릭해서 첫 번째 발표 연습을 시작하고 AI 피드백을 받아보세요.
              </p>
              
              <button
                onClick={() => window.location.href = `/practice/presentation/${id}/record`}
                style={{
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
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
                🎥 첫 연습 시작하기
              </button>
            </div>
          )}
        </div>

        {/* 발표 가이드 섹션 (연습 영상이 없을 때만 표시) */}
        {(!project?.recordings || project.recordings.length === 0) && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "32px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            marginBottom: "32px"
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
              📚 발표 연습 가이드
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}>
              {[
                {
                  icon: "📝",
                  title: "1. 스크립트 준비",
                  description: "발표할 내용을 미리 정리하고 핵심 포인트를 명확히 하세요."
                },
                {
                  icon: "🎥",
                  title: "2. 연습 녹화",
                  description: "카메라 앞에서 실제 발표하듯이 연습하고 녹화해보세요."
                },
                {
                  icon: "🧠",
                  title: "3. AI 분석",
                  description: "AI가 발표 내용, 속도, 발음 등을 종합적으로 분석해드립니다."
                },
                {
                  icon: "📈",
                  title: "4. 실력 향상",
                  description: "피드백을 바탕으로 부족한 부분을 개선하고 반복 연습하세요."
                }
              ].map((step, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    fontSize: "2rem",
                    marginBottom: "12px"
                  }}>
                    {step.icon}
                  </div>
                  <h4 style={{
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 8px 0"
                  }}>
                    {step.title}
                  </h4>
                  <p style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    margin: 0
                  }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 발표 팁 섹션 (연습 영상이 없을 때만 표시) */}
        {(!project?.recordings || project.recordings.length === 0) && (
          <div style={{
            background: "rgba(102, 126, 234, 0.15)",
            border: "1px solid rgba(102, 126, 234, 0.3)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px"
          }}>
            <h4 style={{
              color: "#667eea",
              fontSize: "1.2rem",
              fontWeight: "600",
              margin: "0 0 16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              💡 성공적인 발표를 위한 팁
            </h4>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px"
            }}>
              <div>
                <ul style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  margin: 0,
                  paddingLeft: "20px"
                }}>
                  <li>명확하고 자신감 있는 목소리로 발표하기</li>
                  <li>청중과 적절한 아이컨택 유지하기</li>
                  <li>핵심 메시지를 반복해서 강조하기</li>
                </ul>
              </div>
              <div>
                <ul style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  margin: 0,
                  paddingLeft: "20px"
                }}>
                  <li>적절한 제스처로 내용 보강하기</li>
                  <li>말의 속도와 크기 조절하기</li>
                  <li>시간 배분을 고려한 구성하기</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI 분석 결과 카드 (연습 영상이 있을 때만 표시) */}
        {(project?.recordings && project.recordings.length > 0) && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            marginBottom: "32px",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* 상단 액센트 라인 */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
            }}></div>
            
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px"
            }}>
              {/* AI 아이콘 */}
              <div style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
              }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L13.09 6.26L17 4L16.74 8.74L21 7.27L19.23 11.38L24 12L19.23 12.62L21 16.73L16.74 15.26L17 20L13.09 17.74L12 22L10.91 17.74L7 20L7.26 15.26L3 16.73L4.77 12.62L0 12L4.77 11.38L3 7.27L7.26 8.74L7 4L10.91 6.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </div>
              
              {/* 콘텐츠 */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <h3 style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#ffffff",
                    margin: 0
                  }}>
                    🧠 AI 분석 결과
                  </h3>
                  <span style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontWeight: "500",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}>
                    방금 전
                  </span>
                </div>
                
                <p style={{
                  fontSize: "1rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: 0,
                  lineHeight: "1.6",
                  fontWeight: "400"
                }}>
                  발표 속도가 안정적이에요! 시선 처리가 훨씬 좋아졌어요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 추가 액션 버튼들 */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap"
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
              boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
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
            📄 발표 자료 업로드
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
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
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
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
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
            🎯 맞춤 연습 추천
          </button>
        </div>
      </div>
    </div>
  );
}