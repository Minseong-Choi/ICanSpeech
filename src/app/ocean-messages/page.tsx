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
    content: '"처음부터 겁먹지 말자. 막상 가보면 아무것도 아닌 게 세상엔 참으로 많다."',
    author: '김연아',
    type: 'quote',
    position: { x: 70, y: 50 }
  },
  {
    id: '3',
    content: '"눈은 입보다 더 많은 말을 한다. 입으로만 말하지 말고 표정으로 말을 하라"',
    author: '유재석',
    type: 'quote',
    position: { x: 45, y: 20 }
  },
  {
    id: '4',
    content: '믿음은 생각이 되고, 생각은 말이되고, 말은 행동이 되고, 행동은 습관이 되고, 습관은 가치가 되고, 가치는 운명이 된다.',
    author: '마하트마 간디',
    type: 'encouragement',
    position: { x: 80, y: 70 }
  },
  {
    id: '5',
    content: '해가 뜨기 전 새벽이 가장 어두우니까 먼 훗날에 넌 지금의 널 절대로 잊지 마',
    author: 'BTS (tomorrow 가사 중)',
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

  const copyToClipboard = (message: Message) => {
    const textToCopy = `${message.content}\n\n- ${message.author ?? '익명'}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("메시지가 복사되었습니다! ✨"))
      .catch(() => alert("복사에 실패했습니다."));
  };

  // 새 메시지 작성 상태
  const [isWriting, setIsWriting] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newType, setNewType] = useState<Message["type"]>("encouragement");

  const addNewMessage = () => {
    if (!newContent.trim()) {
      alert("내용을 입력해 주세요!");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: newContent,
      author: newAuthor || "익명",
      type: newType,
      position: {
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
      },
    };

    setBottles((prev) => [...prev, newMessage]);
    setIsWriting(false);
    setNewContent("");
    setNewAuthor("");
    setNewType("encouragement");
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

      <Header user={session?.user ?? null} />

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
                  <img
                    src="/images/bottle.png"
                    alt="bottle"
                    className={styles.bottleImage}
                  />
                </div>
                <div className={styles.bottleRipple}></div>
              </div>
            ))}
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
                <button
                  className={styles.shareBtn}
                  onClick={() => copyToClipboard(selectedMessage)}
                >
                  📤 공유하기
                </button>
              </div>
            </div>
          </div>
        )}

        {isWriting && (
          <div className={styles.messageModal} onClick={() => setIsWriting(false)}>
            <div className={styles.messageCard} onClick={(e) => e.stopPropagation()}>
              <h3>📝 새로운 메시지 작성</h3>
              <textarea
                placeholder="응원 메시지를 입력해 주세요"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className={styles.textarea}
              />
              <input
                type="text"
                placeholder="작성자 이름 (선택)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className={styles.input}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as Message["type"])}
                className={styles.select}
              >
                <option value="encouragement">응원 메시지 💌</option>
                <option value="tip">스피치 팁 💡</option>
                <option value="quote">명언 📜</option>
              </select>
              <div className={styles.messageActions}>
                <button onClick={addNewMessage} className={styles.likeBtn}>저장하기</button>
                <button onClick={() => setIsWriting(false)} className={styles.shareBtn}>취소</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.addMessageSection}>
          <h2>✍️ 나만의 응원 메시지 남기기</h2>
          <p>다른 사용자들을 위한 따뜻한 메시지를 바다에 띄워보세요</p>
          <button className={styles.addMessageBtn} onClick={() => setIsWriting(true)}>
            📝 메시지 작성하기
          </button>
        </div>
      </main>
    </div>
  );
}
