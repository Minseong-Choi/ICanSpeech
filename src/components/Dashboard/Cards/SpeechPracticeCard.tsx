// components/Dashboard/Cards/SpeechPracticeCard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './SpeechPracticeCard.module.css';

interface Practice {
  _id: string;
  title: string;
  type: 'interview' | 'presentation';
  createdAt: string;
  lastRecordingDate?: string;
  recordingCount?: number;
}

export default function SpeechPracticeCard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handlePracticeClick = (practiceId: string, type:string) => {
    router.push(`/practice/${type}/${practiceId}`);
  };

  const handleDelete = async (e: React.MouseEvent, practiceId: string) => {
    e.stopPropagation(); // 부모 요소로의 이벤트 전파를 막습니다.

    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까? 관련된 모든 녹화 기록도 함께 삭제됩니다.')) {
      try {
        const response = await fetch(`/api/practices?id=${practiceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // 상태를 업데이트하여 UI에서 프로젝트를 제거합니다.
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

  const handleCreateNew = () => {
    // 새 프로젝트 생성을 위한 모달이나 페이지로 이동
    router.push('/practice/new');
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>🎯</div>
        <h2 className={styles.title}>스피치 연습하기</h2>
      </div>
      
      <p className={styles.description}>
        최민성님, 웹캠 촬영이나 영상 업로드로 스피치를 연습하고 AI 분석을 받아보세요.
      </p>

      <div className={styles.quote}>
        &ldquo;자신감 있는 목소리로 세상과 소통하세요&rdquo;
      </div>

      {/* 기존 프로젝트 목록 */}
      <div className={styles.practiceList}>
        <h3 className={styles.listTitle}>내 프로젝트</h3>
        
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : practices.length > 0 ? (
          <ul className={styles.practices}>
            {practices.slice(0, 5).map((practice) => (
              <li 
                key={practice._id} 
                className={styles.practiceItem}
              >
                <div className={styles.practiceInfo} onClick={() => handlePracticeClick(practice._id, practice.type)}>
                  <div className={styles.practiceHeader}>
                    <span className={styles.practiceType}>
                      {practice.type === 'interview' ? '🎤 면접' : '📊 프레젠테이션'}
                    </span>
                    <span className={styles.practiceDate}>
                      {formatDate(practice.lastRecordingDate || practice.createdAt)}
                    </span>
                  </div>
                  <h4 className={styles.practiceTitle}>{practice.title}</h4>
                  {practice.recordingCount !== undefined && (
                    <span className={styles.recordingCount}>
                      녹화 {practice.recordingCount}개
                    </span>
                  )}
                </div>
                <div className={styles.practiceActions}>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(e, practice._id)}
                  >
                    삭제
                  </button>
                  <div className={styles.practiceArrow}>→</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <p>아직 생성된 프로젝트가 없습니다.</p>
            <p>새 프로젝트를 만들어 연습을 시작해보세요!</p>
          </div>
        )}
        
        {practices.length > 5 && (
          <button 
            className={styles.viewAllButton}
            onClick={() => router.push('/practices')}
          >
            모든 프로젝트 보기
          </button>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{practices.length}</span>
          <span className={styles.statLabel}>총 프로젝트</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>8.5</span>
          <span className={styles.statLabel}>평균 점수</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>이번 주</span>
        </div>
      </div>

      <button className={styles.startButton} onClick={handleCreateNew}>
        새 프로젝트 생성하기 →
      </button>
    </div>
  );
}
