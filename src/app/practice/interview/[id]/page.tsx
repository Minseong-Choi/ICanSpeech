"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "../../../../components/UI/BackButton";
import CardList from "../../../../components/practice/TakeList";
//import FeedbackBox from "../../../components/FeedbackBox";

export default function InterviewPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<{ title: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/practices/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProject(data.practice);
        });
    }
  }, [id]);

  const takes = [1, 2, 3, 4, 5];

  const handleUploadClick = () => {
    console.log("면접 자료 업로드하기");
    // 나중에 파일 업로드 처리할 수 있음
  };

  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
    <div
    style={{
        position: "relative",
        height: 40,
        marginBottom: 16,
    }}
    >
    {/* 왼쪽 BackButton */}
    <div style={{ position: "absolute", left: 0, top: 0 }}>
        <BackButton />
    </div>

    {/* 가운데 제목 */}
    <h1
        style={{
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        margin: 0,
        }}
        >
        {project ? project.title : "Loading..."}
    </h1>
    </div>

      <CardList
        takes={takes}
        type="interview"
        onUploadClick={handleUploadClick}
      />
      발표 속도가 안정적이에요! 시선 처리가 훨씬 좋아졌어요.
    </div>
      //<FeedbackBox feedback="발표 속도가 안정적이에요! 시선 처리가 훨씬 좋아졌어요." />
  );
}
