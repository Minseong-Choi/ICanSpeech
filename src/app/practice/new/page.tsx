// app/practice/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
//import { useSession } from 'next-auth/react';
import styles from './page.module.css';
import BackButton from '@/components/UI/BackButton';

export default function NewPracticePage() {
  const router = useRouter();
  //const { data: session } = useSession();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    materials: '',
    targetCount: 1
  });
  const [loading, setLoading] = useState(false);
  // Removed projectCreated state as BackButton now handles logic based on URL params

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
        // 생성된 프로젝트의 연습 페이지로 이동, 'from=new' 쿼리 파라미터 추가
        router.push(`/practice/${formData.type}?practiceId=${data.practice._id}&from=new`);
      } else {
        alert('프로젝트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to create practice:', error);
      alert('프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* BackButton now handles navigation logic based on URL params */}
      <BackButton />
      
      <div className={styles.content}>
        <h1 className={styles.title}>새 프로젝트 만들기</h1>
        <p className={styles.subtitle}>
          면접이나 프레젠테이션 연습을 위한 새 프로젝트를 생성하세요.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>연습 유형 *</label>
            <div className={styles.typeSelection}>
              <button
                type="button"
                className={`${styles.typeButton} ${formData.type === 'interview' ? styles.selected : ''}`}
                onClick={() => setFormData({ ...formData, type: 'interview' })}
              >
                <span className={styles.typeIcon}>🎤</span>
                <span className={styles.typeText}>면접 연습</span>
                <span className={styles.typeDesc}>모의 면접을 통한 실전 대비</span>
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${formData.type === 'presentation' ? styles.selected : ''}`}
                onClick={() => setFormData({ ...formData, type: 'presentation' })}
              >
                <span className={styles.typeIcon}>📊</span>
                <span className={styles.typeText}>프레젠테이션</span>
                <span className={styles.typeDesc}>발표 실력 향상을 위한 연습</span>
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>프로젝트 제목 *</label>
            <input
              id="title"
              type="text"
              className={styles.input}
              placeholder="예: 네이버 면접 준비, 졸업 논문 발표"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>설명</label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="이 프로젝트의 목적이나 목표를 간단히 설명해주세요."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="materials" className={styles.label}>
              목표 연습 횟수
            </label>
            <select
              id="targetCount"
              className={styles.input}
              value={formData.targetCount}
              onChange={(e) =>
                setFormData({ ...formData, targetCount: Number(e.target.value) })
              }
            >
              {[1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40].map((count) => (
                <option key={count} value={count}>
                  {count}회
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !formData.type || !formData.title}
            >
              {loading ? '생성 중...' : '프로젝트 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
