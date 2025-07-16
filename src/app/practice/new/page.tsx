// app/practice/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Layout/Header';
import BackButton from '@/components/UI/BackButton';

export default function NewPracticePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    materials: '',
    targetCount: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title) {
      alert('연습 유형과 제목을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/practices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          description: formData.description,
          targetCount: formData.targetCount
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // 디버깅용
        
        // 다양한 응답 구조에 대응
        const practiceId = data.practice?._id || data.practice?.id || data.id || data._id;
        
        if (practiceId) {
          // 생성된 프로젝트의 연습 페이지로 이동
          const targetUrl = `/practice/${formData.type}/${practiceId}`;
          console.log('Navigating to:', targetUrl); // 디버깅용
          router.push(targetUrl);
        } else {
          console.error('Practice ID not found in response:', data);
          alert('프로젝트는 생성되었지만 페이지 이동에 실패했습니다.');
          // 대시보드로 이동
          router.push('/dashboard');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        alert(`프로젝트 생성에 실패했습니다: ${errorData?.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Failed to create practice:', error);
      alert('프로젝트 생성 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* BackButton */}
      <div style={{
        position: "absolute",
        left: "24px",
        top: "96px",
        zIndex: 10
      }}>
        <BackButton />
      </div>
      
      {/* 메인 컨테이너 */}
      <div style={{
        maxWidth: "800px",
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
            <span style={{ fontSize: "1.2rem" }}>✨</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              New Project
            </span>
          </div>
          
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 12px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            ✨ 새 프로젝트 만들기
          </h1>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            면접이나 프레젠테이션 연습을 위한 새 프로젝트를 생성하세요
          </p>
        </div>

        {/* 폼 카드 */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
        }}>
          <form onSubmit={handleSubmit}>
            {/* 연습 유형 선택 */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "16px",
                display: "block"
              }}>
                연습 유형 *
              </label>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px"
              }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'interview' })}
                  style={{
                    background: formData.type === 'interview' 
                      ? "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: formData.type === 'interview'
                      ? "1px solid #3498db"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    color: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    if (formData.type !== 'interview') {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.type !== 'interview') {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💼</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                    면접 연습
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    모의 면접을 통한 실전 대비
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'presentation' })}
                  style={{
                    background: formData.type === 'presentation' 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: formData.type === 'presentation'
                      ? "1px solid #667eea"
                      : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    color: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    if (formData.type !== 'presentation') {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.type !== 'presentation') {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🎤</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>
                    프레젠테이션
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    발표 실력 향상을 위한 연습
                  </div>
                </button>
              </div>
            </div>

            {/* 프로젝트 제목 */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "12px",
                display: "block"
              }}>
                프로젝트 제목 *
              </label>
              <input
                type="text"
                placeholder="예: 네이버 면접 준비, 졸업 논문 발표"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* 설명 */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "12px",
                display: "block"
              }}>
                설명
              </label>
              <textarea
                placeholder="이 프로젝트의 목적이나 목표를 간단히 설명해주세요."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  resize: "vertical",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* 목표 연습 횟수 */}
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "12px",
                display: "block"
              }}>
                목표 연습 횟수
              </label>
              <select
                value={formData.targetCount}
                onChange={(e) => setFormData({ ...formData, targetCount: Number(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box"
                }}
              >
                {[1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40].map((count) => (
                  <option key={count} value={count} style={{ background: "#2c3e50" }}>
                    {count}회
                  </option>
                ))}
              </select>
            </div>

            {/* 액션 버튼 */}
            <div style={{
              display: "flex",
              gap: "16px",
              justifyContent: "flex-end"
            }}>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  }
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading || !formData.type || !formData.title}
                style={{
                  padding: "12px 32px",
                  background: (loading || !formData.type || !formData.title)
                    ? "rgba(255, 255, 255, 0.2)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: (loading || !formData.type || !formData.title) ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: (loading || !formData.type || !formData.title) 
                    ? "none" 
                    : "0 4px 12px rgba(102, 126, 234, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  if (!loading && formData.type && formData.title) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && formData.type && formData.title) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                  }
                }}
              >
                {loading && (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid #ffffff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                )}
                {loading ? '생성 중...' : '프로젝트 생성'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 로딩 애니메이션 스타일 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        select option {
          background: #2c3e50;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}