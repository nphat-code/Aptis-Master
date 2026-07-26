import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aptis Kỳ Tích — Luyện thi Aptis & Thi thử miễn phí',
  description: 'Luyện thi Aptis với format làm bài mô phỏng đề thi thật, AI chấm bài nhận kết quả ngay.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
