// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: '스피처 - 스피치 분석 서비스',
  description: '자신감 있는 스피치, 연습부터 분석까지 한번에',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}