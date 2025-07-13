"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
    >
      <IoMdArrowRoundBack size={35} />
    </button>
  );
}
