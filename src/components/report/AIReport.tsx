"use client";

type Props = {
  feedback: string[];
  isLoading?: boolean;
};

interface ParsedFeedback {
  category: string;
  icon: string;
  color: string;
  content: string;
  advice: string;
}

export default function AIReport({ feedback, isLoading = false }: Props) {
  
  const parseFeedback = (feedbackArray: string[]): ParsedFeedback[] => {
    const fullText = feedbackArray.join('\n');
    const sections = fullText.split(/\d+\.\s+\*\*/).filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;
      
      // 카테고리 추출
      const categoryMatch = lines[0].match(/^([^:*]+)(?:\*\*)?:/);
      const category = categoryMatch ? categoryMatch[1].trim() : `항목 ${index + 1}`;
      
      // 피드백과 조언 분리
      const feedbackLines: string[] = [];
      const adviceLines: string[] = [];
      let isAdviceSection = false;
      
      lines.forEach(line => {
        if (line.includes('개선 조언:') || line.includes('조언:')) {
          isAdviceSection = true;
          return;
        }
        if (line.includes('피드백:')) {
          return;
        }
        
        if (isAdviceSection) {
          adviceLines.push(line.replace(/^\*\s*/, '').trim());
        } else {
          feedbackLines.push(line.replace(/^\*\s*/, '').trim());
        }
      });
      
      // 카테고리별 아이콘과 색상 설정
      const getIconAndColor = (cat: string) => {
        if (cat.includes('불필요한 어구') || cat.includes('반복')) return { icon: '🗣️', color: '#60a5fa' };
        if (cat.includes('내용')) return { icon: '📋', color: '#34d399' };
        if (cat.includes('구성') || cat.includes('구조')) return { icon: '🏗️', color: '#fbbf24' };
        if (cat.includes('어조')) return { icon: '🎭', color: '#a78bfa' };
        if (cat.includes('전달력')) return { icon: '🎯', color: '#fb7185' };
        return { icon: '💡', color: '#64748b' };
      };
      
      const { icon, color } = getIconAndColor(category);
      
      return {
        category,
        icon,
        color,
        content: feedbackLines.join(' ').substring(0, 200) + (feedbackLines.join(' ').length > 200 ? '...' : ''),
        advice: adviceLines.join(' ').substring(0, 150) + (adviceLines.join(' ').length > 150 ? '...' : '')
      };
    }).filter(Boolean) as ParsedFeedback[];
  };

  const parsedFeedback = parseFeedback(feedback);

  if (isLoading) {
    return (
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "24px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid #667eea",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{
          color: "#ffffff",
          fontSize: "1.1rem",
          fontWeight: "500",
          margin: 0
        }}>
          AI 분석 중...
        </p>
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
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "24px",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      height: "fit-content"
    }}>
      <h3 style={{
        color: "#ffffff",
        fontSize: "1.3rem",
        fontWeight: "600",
        margin: "0 0 24px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        🧠 AI 분석 결과
      </h3>

      {parsedFeedback.length > 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {parsedFeedback.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* 헤더 */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px"
              }}>
                <span style={{
                  fontSize: "1.4rem",
                  flexShrink: 0
                }}>
                  {item.icon}
                </span>
                <h4 style={{
                  color: item.color,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  margin: 0,
                  flex: 1
                }}>
                  {item.category}
                </h4>
              </div>

              {/* 피드백 내용 */}
              {item.content && (
                <div style={{
                  marginBottom: "12px"
                }}>
                  <div style={{
                    color: "#e8f4f8",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
                  }}>
                    {item.content}
                  </div>
                </div>
              )}

              {/* 개선 조언 */}
              {item.advice && (
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  padding: "12px",
                  borderLeft: `3px solid ${item.color}`
                }}>
                  <div style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
                  }}>
                    💡 {item.advice}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "rgba(255, 255, 255, 0.6)"
        }}>
          <p>분석할 피드백이 없습니다.</p>
        </div>
      )}

      {/* 요약 통계 */}
      {parsedFeedback.length > 0 && (
        <div style={{
          marginTop: "24px",
          padding: "20px",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            textAlign: "center"
          }}>
            <div>
              <div style={{
                color: "#ffffff",
                fontSize: "1.8rem",
                fontWeight: "700",
                marginBottom: "4px"
              }}>
                {parsedFeedback.length}
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.9rem"
              }}>
                분석 항목
              </div>
            </div>
            <div>
              <div style={{
                color: "#4ade80",
                fontSize: "1.8rem",
                fontWeight: "700",
                marginBottom: "4px"
              }}>
                AI
              </div>
              <div style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.9rem"
              }}>
                분석 완료
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}