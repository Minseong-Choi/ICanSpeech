// src/components/Modal/PurposeSelectionModal.tsx
import React from 'react';
import styles from './PurposeSelectionModal.module.css';

interface PurposeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const PurposeSelectionModal: React.FC<PurposeSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  userName 
}) => {
  if (!isOpen) return null;

  const handlePresentationClick = () => {
    window.location.href = '/practice/presentation';
  };

  const handleInterviewClick = () => {
    window.location.href = '/practice/interview';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>🎯 연습 목적을 선택해주세요</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.greeting}>
            {userName}님, 어떤 종류의 스피치를 연습하고 싶으신가요?
          </p>

          <div className={styles.optionsContainer}>
            <div 
              className={styles.optionCard}
              onClick={handlePresentationClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePresentationClick();
                }
              }}
            >
              <div className={styles.optionIcon}>📊</div>
              <h3 className={styles.optionTitle}>프레젠테이션</h3>
              <p className={styles.optionDescription}>
                회의, 발표, 강연 등<br />
                청중 앞에서 하는 발표 연습
              </p>
              <div className={styles.optionFeatures}>
                <span className={styles.feature}>• 시각 자료 활용법</span>
                <span className={styles.feature}>• 청중과의 소통</span>
                <span className={styles.feature}>• 논리적 구성</span>
              </div>
              <div className={styles.optionButton}>
                시작하기 →
              </div>
            </div>

            <div 
              className={styles.optionCard}
              onClick={handleInterviewClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleInterviewClick();
                }
              }}
            >
              <div className={styles.optionIcon}>🤝</div>
              <h3 className={styles.optionTitle}>면접</h3>
              <p className={styles.optionDescription}>
                취업 면접, 입학 면접 등<br />
                대화형 질의응답 연습
              </p>
              <div className={styles.optionFeatures}>
                <span className={styles.feature}>• 자기소개 연습</span>
                <span className={styles.feature}>• 질문 대응 능력</span>
                <span className={styles.feature}>• 비언어적 표현</span>
              </div>
              <div className={styles.optionButton}>
                시작하기 →
              </div>
            </div>
          </div>

          <div className={styles.helpText}>
            <p>💡 <strong>팁:</strong> 목적에 따라 AI가 다른 기준으로 분석해드립니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurposeSelectionModal;