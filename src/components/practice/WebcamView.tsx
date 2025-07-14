"use client";

import { useEffect, useRef } from "react";

type Props = {
  onStreamReady?: (stream: MediaStream) => void;
};

export default function WebcamView({ onStreamReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // 부모 컴포넌트로 stream 전달
        if (onStreamReady) {
          onStreamReady(stream);
        }

      } catch (error) {
        console.error("웹캠 접근 실패:", error);
      }
    };

    getWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{
        width: "100%",
        height: 400,
        backgroundColor: "#000",
        borderRadius: 8,
        objectFit: "cover",
      }}
    />
  );
}
