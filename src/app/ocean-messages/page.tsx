'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import Header from '@/components/Layout/Header';
import styles from './page.module.css';

interface Message {
  id: string;
  content: string;
  author?: string;
  type: 'encouragement' | 'tip' | 'quote';
  position: { x: number; y: number };
}

const sampleMessages: Message[] = [
  {
    id: '1',
    content: '당신의 목소리에는 세상을 바꿀 힘이 있습니다. 자신감을 가지세요!',
    author: '익명의 응원자',
    type: 'encouragement',
    position: { x: 20, y: 30 }
  },
  {
    id: '2',
    content: '스피치할 때는 청중과 눈을 마주치세요. 3초 룰을 기억하세요.',
    type: 'tip',
    position: { x: 70, y: 50 }
  },
  {
    id: '3',
    content: '"말하는 것이 두렵다면, 그것은 당신에게 중요한 것이기 때문입니다." - 브레네 브라운',
    type: 'quote',
    position: { x: 45, y: 20 }
  },
  {
    id: '4',
    content: '실수를 두려워하지 마세요. 완벽한 스피치보다 진정성 있는 스피치가 더 감동적입니다.',
    author: '스피치 코치',
    type: 'encouragement',
    position: { x: 80, y: 70 }
  },
  {
    id: '5',
    content: '손동작을 활용하세요. 자연스러운 제스처는 말의 힘을 2배로 만듭니다.',
    type: 'tip',
    position: { x: 15, y: 80 }
  }
];

export default function OceanMessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [bottles, setBottles] = useState<Message[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    setBottles(sampleMessages);
  }, []);

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const closeMessage = () => {
    setSelectedMessage(null);
  };

  const getBottleIcon = (type: Message['type']) => {
    switch (type) {
      case 'encouragement': return '💌';
      case 'tip': return '💡';
      case 'quote': return '📜';
      default: return '🍾';
    }
  };

  return (
    <div className={styles.container}>
      {/* 🎬 배경 영상 */}
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/ocean.mp4" type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>

      <Header user={session?.user} />

      <main className={styles.main}>
        <div className={styles.oceanContainer}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>🌊 바다에서 온 응원 메시지</h1>
            <p className={styles.subtitle}>
              떠다니는 유리병을 클릭해서 따뜻한 메시지를 확인해보세요
            </p>
          </div>

          <div className={styles.oceanArea}>
            {bottles.map((message) => (
              <div
                key={message.id}
                className={styles.messageBottle}
                style={{
                  left: `${message.position.x}%`,
                  top: `${message.position.y}%`
                }}
                onClick={() => openMessage(message)}
              >
                <div className={styles.bottleIcon}>
                  {getBottleIcon(message.type)}
                </div>
                <div className={styles.bottleRipple}></div>
              </div>
            ))}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>💌</span>
              <span>응원 메시지</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>💡</span>
              <span>스피치 팁</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendIcon}>📜</span>
              <span>명언</span>
            </div>
          </div>
        </div>

        {selectedMessage && (
          <div className={styles.messageModal} onClick={closeMessage}>
            <div className={styles.messageCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.messageHeader}>
                <div className={styles.messageType}>
                  {getBottleIcon(selectedMessage.type)}
                  <span>
                    {selectedMessage.type === 'encouragement' && '응원 메시지'}
                    {selectedMessage.type === 'tip' && '스피치 팁'}
                    {selectedMessage.type === 'quote' && '명언'}
                  </span>
                </div>
                <button onClick={closeMessage} className={styles.closeBtn}>
                  ✕
                </button>
              </div>
              <div className={styles.messageContent}>
                <p>{selectedMessage.content}</p>
                {selectedMessage.author && (
                  <div className={styles.messageAuthor}>
                    - {selectedMessage.author}
                  </div>
                )}
              </div>
              <div className={styles.messageActions}>
                <button className={styles.likeBtn}>❤️ 좋아요</button>
                <button className={styles.shareBtn}>📤 공유하기</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.addMessageSection}>
          <h2>✍️ 나만의 응원 메시지 남기기</h2>
          <p>다른 사용자들을 위한 따뜻한 메시지를 바다에 띄워보세요</p>
          <button className={styles.addMessageBtn}>
            📝 메시지 작성하기
          </button>
        </div>
      </main>
    </div>
  );
}
