"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPage = searchParams.get('from');

  const handleClick = () => {
    if (fromPage === 'new') {
      router.push('/dashboard');
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{ border: "none", background: "none", outline: "none" }}
    >
      <IoMdArrowRoundBack size={35} />
    </button>

  );
}
