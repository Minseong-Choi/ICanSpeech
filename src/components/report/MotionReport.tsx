'use client';

import { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

interface MotionEvent {
  type: string;
  start: number;
  end: number;
}

export default function MotionReport({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState<MotionEvent[]>([]);

  useEffect(() => {
    const detectMotions = async () => {
      const video = videoRef.current;
      if (!video) return;

      // 모델 초기화
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: 'singlepose-thunder', // 정확도 높은 모델 사용
        }
      );

      const motionLog: MotionEvent[] = [];
      const prevWristPos = { x: 0, y: 0, time: 0, exists: false };
      let currentEvent: MotionEvent | null = null;
      const THRESHOLD = 30;

      const analyze = async () => {
        if (!video || video.paused || video.ended) return;

        const poses = await detector.estimatePoses(video);
        if (poses.length > 0) {
          const keypoints = poses[0].keypoints;
          const wrist = keypoints[10]; // MoveNet 기준 right_wrist = 10번 인덱스

          if (wrist && wrist.score !== undefined && wrist.score > 0.4) {
            const dx = wrist.x - prevWristPos.x;
            const dy = wrist.y - prevWristPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const time = video.currentTime;

            if (prevWristPos.exists && dist > THRESHOLD) {
              if (!currentEvent) {
                currentEvent = { type: '손 흔들기', start: time, end: time };
              } else {
                currentEvent.end = time;
              }
            } else if (currentEvent) {
              motionLog.push(currentEvent);
              currentEvent = null;
            }

            prevWristPos.x = wrist.x;
            prevWristPos.y = wrist.y;
            prevWristPos.time = time;
            prevWristPos.exists = true;
          }
        }

        requestAnimationFrame(analyze);
      };

      video.play();
      analyze();

      video.onended = () => {
        if (currentEvent) motionLog.push(currentEvent);
        setEvents(motionLog);
      };
    };

    detectMotions();
  }, [videoUrl]);

  const format = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div style={{ flex: 1 }}>
      <h3>🕵️ 모션 감지 결과</h3>
      <div
        style={{
          border: '1px solid #ccc',
          flex: 1,
          borderRadius: 8,
          padding: 16,
          backgroundColor: '#fff',
          minHeight: 80,
        }}
      >
        {events.length === 0 ? (
          <p>감지된 모션이 없습니다.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {events.map((e, i) => (
              <li key={i}>
                {format(e.start)} ~ {format(e.end)} → {e.type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
