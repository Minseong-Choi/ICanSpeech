"use client";

type Props = {
  videoUrl: string;
  transcript: string;
};

export default function ScriptReport({ videoUrl, transcript }: Props) {
  const getTranscriptStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence
    };
  };

  const stats = getTranscriptStats(transcript);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      {/* 비디오 섹션 */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}>
        <h3 style={{
          color: "#ffffff",
          fontSize: "1.3rem",
          fontWeight: "600",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          🎥 면접 영상
        </h3>
        <video
          src={videoUrl}
          controls
          style={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            border: "2px solid rgba(255, 255, 255, 0.1)"
          }}
        />
      </div>

      {/* 음성 인식 통계 */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
      }}>
        <h3 style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          fontWeight: "600",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          📊 음성 분석 통계
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px"
        }}>
          <div style={{
            textAlign: "center",
            padding: "12px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              color: "#60a5fa",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "4px"
            }}>
              {stats.wordCount}
            </div>
            <div style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.8rem"
            }}>
              총 단어 수
            </div>
          </div>
          <div style={{
            textAlign: "center",
            padding: "12px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              color: "#34d399",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "4px"
            }}>
              {stats.sentenceCount}
            </div>
            <div style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.8rem"
            }}>
              문장 수
            </div>
          </div>
          <div style={{
            textAlign: "center",
            padding: "12px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{
              color: "#fbbf24",
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "4px"
            }}>
              {stats.avgWordsPerSentence}
            </div>
            <div style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.8rem"
            }}>
              평균 단어/문장
            </div>
          </div>
        </div>
      </div>

      {/* 스크립트 섹션 */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        flex: 1
      }}>
        <h3 style={{
          color: "#ffffff",
          fontSize: "1.3rem",
          fontWeight: "600",
          margin: "0 0 16px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          📝 음성 인식 결과
        </h3>
        <div style={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "12px",
          padding: "20px",
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          position: "relative"
        }}>
          {transcript && !transcript.includes("실패했습니다") ? (
            <div style={{
              color: "#e8f4f8",
              fontSize: "14px",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
              fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
            }}>
              {transcript}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "16px"
              }}>
                🎙️
              </div>
              <div style={{
                fontSize: "1rem",
                fontWeight: "500"
              }}>
                {transcript || "텍스트 변환 중..."}
              </div>
            </div>
          )}
          
          {/* 스크롤바 스타일 */}
          <style>{`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.3);
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}