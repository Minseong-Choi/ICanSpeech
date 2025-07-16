'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Layout/Header';

interface VideoExample {
  id: string;
  title: string;
  speaker: string;
  category: 'presentation' | 'interview' | 'public-speaking' | 'ted-talk';
  duration: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  keyPoints: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const videoExamples: VideoExample[] = [
  {
    id: '1',
    title: '면접 전 이 영상이 떴다면 축하드립니다 알고리즘이 이끌어 준 면접 대비 필수 영상! (꼭 준비할 것, 반드시 피할 것)',
    speaker: 'AND 앤드',
    category: 'interview',
    duration: '4:40',
    description: '면접과 발표에서 인상적인 첫인상을 남기는 자기소개 기법을 배워보세요.',
    thumbnailUrl: 'https://i.ytimg.com/vi/QVI3kIS_Tek/hq720.jpg?sqp=-…BACGAY4AUAB&rs=AOn4CLCEuJU7AJs69E0TCIlDuX8Zu-fwYQ',
    videoUrl: 'https://www.youtube.com/watch?v=QVI3kIS_Tek',
    keyPoints: ['명확한 구조', '핵심 경험 강조', '자신감 있는 톤', '적절한 시간 배분'],
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'TED 강연: 위대한 리더들의 행동법',
    speaker: 'Simon Sinek',
    category: 'ted-talk',
    duration: '18:35',
    description: '세계적인 TED 강연자 사이먼 시넥의 리더십에 관한 명강연을 통해 발표 기법을 학습하세요.',
    thumbnailUrl: 'https://img.youtube.com/vi/qp0HIF3SfI4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/qp0HIF3SfI4',
    keyPoints: ['Why로 시작하기', '스토리텔링', '청중과의 소통', '강력한 메시지'],
    difficulty: 'advanced'
  },
  {
    id: '3',
    title: '프레젠테이션 스킬 향상법',
    speaker: '커뮤니케이션 전문가',
    category: 'presentation',
    duration: '12:35',
    description: '직장에서 성공적인 비즈니스 프레젠테이션을 위한 필수 요소들을 학습하세요.',
    thumbnailUrl: 'https://img.youtube.com/vi/Iwpi1Lm6dFo/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Iwpi1Lm6dFo',
    keyPoints: ['논리적 구성', '시각적 자료 활용', '시간 관리', '질의응답 대처'],
    difficulty: 'intermediate'
  },
  {
    id: '4',
    title: '면접에서 자신감 있게 말하는 법',
    speaker: '캐치TV',
    category: 'interview',
    duration: '6:44',
    description: '어려운 질문과 압박 상황에서도 침착하게 답변하는 면접 전략을 익혀보세요.',
    thumbnailUrl: 'https://i.ytimg.com/vi/23POxxdoclw/hq720.jpg?sqp=-…BACGAY4AUAB&rs=AOn4CLBo2jndAFfDceO8m3DFwud_jVBuAA',
    videoUrl: 'https://www.youtube.com/watch?v=23POxxdoclw',
    keyPoints: ['감정 조절', '논리적 사고', 'STAR 기법', '자신감 유지'],
    difficulty: 'advanced'
  },
  {
    id: '5',
    title: '내 목소리를 찾아주는 복식호흡 발성법',
    speaker: '흥버튼HEUNGBURTON',
    category: 'public-speaking',
    duration: '20:15',
    description: '명확하고 매력적인 목소리로 청중의 마음을 사로잡는 발성 기법을 배워보세요.',
    thumbnailUrl: 'https://i.ytimg.com/vi/LfNlxzbZLcc/hq720.jpg?sqp=-…GUgUChCMA8=&rs=AOn4CLD6c4JuUOsVcAzz2bt7Rc8pO5BtjQ',
    videoUrl: '	https://www.youtube.com/watch?v=LfNlxzbZLcc',
    keyPoints: ['복식호흡', '발음 연습', '톤 조절', '말의 속도'],
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'TED: 보디랭귀지가 말하는 것',
    speaker: 'Amy Cuddy',
    category: 'ted-talk',
    duration: '21:03',
    description: '세계적으로 유명한 TED 강연을 통해 자신감 있는 보디랭귀지와 발표 기법을 학습하세요.',
    thumbnailUrl: 'https://img.youtube.com/vi/Ks-_Mh1QhMc/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Ks-_Mh1QhMc',
    keyPoints: ['파워 포즈', '보디랭귀지', '자신감 구축', '프레즌스'],
    difficulty: 'advanced'
  },
  {
    id: '7',
    title: '스티브 잡스의 프레젠테이션 비법',
    speaker: '마케팅 전문가',
    category: 'presentation',
    duration: '11:47',
    description: '애플 창립자 스티브 잡스의 전설적인 프레젠테이션 기법을 분석하고 배워보세요.',
    thumbnailUrl: 'https://img.youtube.com/vi/VQKMoT-6XSg/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/VQKMoT-6XSg',
    keyPoints: ['스토리텔링', '간결한 메시지', '감정적 연결', '반복과 강조'],
    difficulty: 'advanced'
  },
  {
    id: '8',
    title: '(ko)시대와 세대를 넘어 소통 잘하는 기술',
    speaker: '이호선 숭실사이버대학교 교수',
    category: 'public-speaking',
    duration: '14:32',
    description: '일상과 직장에서 효과적으로 소통하는 방법과 설득력 있는 말하기 기술을 익혀보세요.',
    thumbnailUrl: 'https://i.ytimg.com/vi/xDF93wL-v4A/hq720.jpg?sqp=-…BACGAY4AUAB&rs=AOn4CLCA4pXUnO2Qx-eSz9JxDsrF8guSVA',
    videoUrl: 'https://www.youtube.com/watch?v=xDF93wL-v4A',
    keyPoints: ['경청 기술', '공감대 형성', '명확한 전달', '피드백 활용'],
    difficulty: 'intermediate'
  }
];

const categoryLabels = {
  'presentation': '발표',
  'interview': '면접',
  'public-speaking': '연설',
  'ted-talk': 'TED'
};

const categoryColors = {
  'presentation': '#667eea',
  'interview': '#3498db', 
  'public-speaking': '#2ecc71',
  'ted-talk': '#e74c3c'
};

const difficultyLabels = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급'
};

const difficultyColors = {
  'beginner': '#2ecc71',
  'intermediate': '#f39c12',
  'advanced': '#e74c3c'
};

export default function ExamplesPage() {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoExample | null>(null);

  const filteredVideos = videoExamples.filter(video => {
    return (selectedCategory === 'all' || video.category === selectedCategory) &&
           (selectedDifficulty === 'all' || video.difficulty === selectedDifficulty);
  });

  const openVideoModal = (video: VideoExample) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
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

      {/* 메인 컨테이너 */}
      <div style={{
        maxWidth: "1400px",
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
            <span style={{ fontSize: "1.2rem" }}>📹</span>
            <span style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              Speech Examples
            </span>
          </div>
          
          <h1 style={{
            color: "#ffffff",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 12px 0",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
          }}>
            📹 전문가 스피치 예시
          </h1>
          
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400"
          }}>
            전문가들의 스피치를 분석하고 학습하여 실력을 향상시켜보세요
          </p>
        </div>

        {/* 필터 섹션 */}
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
            display: "flex",
            gap: "24px",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            {/* 카테고리 필터 */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block"
              }}>
                카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.9rem"
                }}
              >
                <option value="all">전체</option>
                <option value="presentation">발표</option>
                <option value="interview">면접</option>
                <option value="public-speaking">연설</option>
                <option value="ted-talk">TED</option>
              </select>
            </div>

            {/* 난이도 필터 */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block"
              }}>
                난이도
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.9rem"
                }}
              >
                <option value="all">전체</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>

            {/* 결과 개수 */}
            <div style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              {filteredVideos.length}개의 영상
            </div>
          </div>
        </div>

        {/* 비디오 그리드 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "24px"
        }}>
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "20px",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onClick={() => openVideoModal(video)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
              }}
            >
              {/* 썸네일 */}
              <div style={{
                width: "100%",
                height: "180px",
                borderRadius: "12px",
                marginBottom: "16px",
                overflow: "hidden",
                position: "relative",
                background: "#000"
              }}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                
                {/* 재생 버튼 오버레이 */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  transition: "all 0.3s ease"
                }}>
                  ▶️
                </div>
                
                {/* 재생 시간 */}
                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  background: "rgba(0, 0, 0, 0.8)",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}>
                  {video.duration}
                </div>
              </div>

              {/* 카테고리 & 난이도 */}
              <div style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px"
              }}>
                <span style={{
                  background: categoryColors[video.category],
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                  fontWeight: "600"
                }}>
                  {categoryLabels[video.category]}
                </span>
                <span style={{
                  background: difficultyColors[video.difficulty],
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.7rem",
                  fontWeight: "600"
                }}>
                  {difficultyLabels[video.difficulty]}
                </span>
              </div>

              {/* 제목 */}
              <h3 style={{
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
                margin: "0 0 8px 0",
                lineHeight: "1.3"
              }}>
                {video.title}
              </h3>

              {/* 강연자 */}
              <p style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.9rem",
                margin: "0 0 12px 0"
              }}>
                강연자: {video.speaker}
              </p>

              {/* 설명 */}
              <p style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                margin: "0 0 16px 0"
              }}>
                {video.description}
              </p>

              {/* 핵심 포인트 */}
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px"
              }}>
                {video.keyPoints.slice(0, 3).map((point, index) => (
                  <span
                    key={index}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.9)",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: "500"
                    }}
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 비디오 모달 */}
      {selectedVideo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={closeVideoModal}
        >
          <div
            style={{
              background: "rgba(30, 40, 50, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              width: "100%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 24px 0 24px"
            }}>
              <h2 style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: 0
              }}>
                {selectedVideo.title}
              </h2>
              <button
                onClick={closeVideoModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "8px"
                }}
              >
                ✕
              </button>
            </div>

            {/* 비디오 영역 */}
            <div style={{ padding: "24px" }}>
              <div style={{
                width: "100%",
                height: "400px",
                borderRadius: "12px",
                marginBottom: "20px",
                overflow: "hidden"
              }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    borderRadius: "12px"
                  }}
                />
              </div>

              {/* 비디오 정보 */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}>
                <div>
                  <h4 style={{
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "12px"
                  }}>
                    영상 정보
                  </h4>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0 0 8px 0" }}>
                    <strong>강연자:</strong> {selectedVideo.speaker}
                  </p>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0 0 8px 0" }}>
                    <strong>재생시간:</strong> {selectedVideo.duration}
                  </p>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: "0 0 12px 0" }}>
                    {selectedVideo.description}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "12px"
                  }}>
                    학습 포인트
                  </h4>
                  <ul style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                    paddingLeft: "20px",
                    margin: 0
                  }}>
                    {selectedVideo.keyPoints.map((point, index) => (
                      <li key={index} style={{ marginBottom: "4px" }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}