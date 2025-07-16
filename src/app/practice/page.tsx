// pages/practices/index.tsx (또는 app/practices/page.tsx - Next.js 13+ app directory 사용 시)
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Layout/Header';

interface Practice {
  _id: string;
  title: string;
  type: 'interview' | 'presentation';
  createdAt: string;
  lastRecordingDate?: string;
  recordingCount?: number;
}

export default function PracticesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'type'>('recent');

  useEffect(() => {
    if (session?.user) {
      fetchPractices();
    }
  }, [session]);

  const fetchPractices = async () => {
    try {
      const response = await fetch('/api/practices');
      if (response.ok) {
        const data = await response.json();
        setPractices(data.practices);
      }
    } catch (error) {
      console.error('Failed to fetch practices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeClick = (practiceId: string, type: string) => {
    router.push(`/practice/${type}/${practiceId}`);
  };

  const handleDelete = async (e: React.MouseEvent, practiceId: string) => {
    e.stopPropagation();

    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까? 관련된 모든 녹화 기록도 함께 삭제됩니다.')) {
      try {
        const response = await fetch(`/api/practices?id=${practiceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPractices(practices.filter((p) => p._id !== practiceId));
          alert('프로젝트가 삭제되었습니다.');
        } else {
          const errorData = await response.json();
          alert(`삭제 실패: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Failed to delete practice:', error);
        alert('프로젝트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  const sortedPractices = [...practices].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastRecordingDate || b.createdAt).getTime() - 
               new Date(a.lastRecordingDate || a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

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
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "32px 24px",
        position: "relative",
        zIndex: 2
      }}>
        {/* 헤더 */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <button 
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            ← 돌아가기
          </button>
          
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
              padding: "6px 16px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
              <span style={{ fontSize: "1rem" }}>📋</span>
              <span style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.85rem",
                fontWeight: "500"
              }}>
                All Projects
              </span>
            </div>
            
            <h1 style={{
              color: "#ffffff",
              fontSize: "2.2rem",
              fontWeight: "700",
              margin: 0,
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
            }}>
              모든 프로젝트
            </h1>
          </div>
          
          <button 
            onClick={() => router.push('/practice/new')}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
            }}
          >
            ✨ 새 프로젝트 생성
          </button>
        </div>

        {/* 컨트롤 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "20px 24px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <label style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              정렬 기준:
            </label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'title' | 'type')}
              style={{
                padding: "8px 12px",
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                cursor: "pointer"
              }}
            >
              <option value="recent" style={{ background: "#2c3e50" }}>최근 활동순</option>
              <option value="title" style={{ background: "#2c3e50" }}>제목순</option>
              <option value="type" style={{ background: "#2c3e50" }}>유형순</option>
            </select>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(102, 126, 234, 0.2)",
              borderRadius: "20px",
              border: "1px solid rgba(102, 126, 234, 0.3)"
            }}>
              <span style={{ fontSize: "1rem" }}>📊</span>
              <span style={{
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "500"
              }}>
                총 {practices.length}개 프로젝트
              </span>
            </div>
          </div>
        </div>

        {/* 프로젝트 그리드 */}
        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px"
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
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                프로젝트를 불러오는 중...
              </p>
            </div>
          </div>
        ) : sortedPractices.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {sortedPractices.map((practice) => (
              <div 
                key={practice._id}
                onClick={() => handlePracticeClick(practice._id, practice.type)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "24px",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                }}
              >
                {/* 상단 액센트 라인 */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: practice.type === 'interview' 
                    ? "linear-gradient(90deg, #3498db 0%, #2980b9 100%)"
                    : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                }}></div>
                
                {/* 카드 헤더 */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    background: practice.type === 'interview' 
                      ? "rgba(52, 152, 219, 0.2)"
                      : "rgba(102, 126, 234, 0.2)",
                    borderRadius: "12px",
                    border: practice.type === 'interview' 
                      ? "1px solid rgba(52, 152, 219, 0.3)"
                      : "1px solid rgba(102, 126, 234, 0.3)"
                  }}>
                    <span style={{ fontSize: "1rem" }}>
                      {practice.type === 'interview' ? '💼' : '🎤'}
                    </span>
                    <span style={{
                      color: "#ffffff",
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {practice.type === 'interview' ? '면접' : '발표'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(e, practice._id)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(231, 76, 60, 0.2)",
                      border: "1px solid rgba(231, 76, 60, 0.3)",
                      color: "#e74c3c",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(231, 76, 60, 0.3)";
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(231, 76, 60, 0.2)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    ×
                  </button>
                </div>
                
                {/* 프로젝트 제목 */}
                <h3 style={{
                  color: "#ffffff",
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  lineHeight: "1.4"
                }}>
                  {practice.title}
                </h3>
                
                {/* 프로젝트 정보 */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.85rem"
                    }}>
                      생성일:
                    </span>
                    <span style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}>
                      {formatDate(practice.createdAt)}
                    </span>
                  </div>
                  
                  {practice.lastRecordingDate && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.85rem"
                      }}>
                        마지막 연습:
                      </span>
                      <span style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "0.85rem",
                        fontWeight: "500"
                      }}>
                        {formatDate(practice.lastRecordingDate)}
                      </span>
                    </div>
                  )}
                  
                  {practice.recordingCount !== undefined && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.85rem"
                      }}>
                        녹화 횟수:
                      </span>
                      <span style={{
                        color: practice.type === 'interview' ? "#3498db" : "#667eea",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {practice.recordingCount}개
                      </span>
                    </div>
                  )}
                </div>
                
                {/* 카드 푸터 */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <span style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "0.8rem"
                  }}>
                    {formatDate(practice.lastRecordingDate || practice.createdAt)}
                  </span>
                  <div style={{
                    color: practice.type === 'interview' ? "#3498db" : "#667eea",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    transform: "translateX(-4px)",
                    transition: "transform 0.3s ease"
                  }}>
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 빈 상태 */
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "40px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              maxWidth: "500px"
            }}>
              <div style={{
                fontSize: "4rem",
                marginBottom: "20px",
                opacity: 0.6
              }}>
                📝
              </div>
              <h2 style={{
                color: "#ffffff",
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "12px"
              }}>
                아직 생성된 프로젝트가 없습니다
              </h2>
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "24px"
              }}>
                새 프로젝트를 만들어 스피치 연습을 시작해보세요!
              </p>
              <button 
                onClick={() => router.push('/practice/new')}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "1.1rem",
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
                ✨ 새 프로젝트 생성하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        select option {
          background: #2c3e50;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}