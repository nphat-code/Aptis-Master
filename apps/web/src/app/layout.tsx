import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AptisMaster — Chinh Phục Chứng Chỉ Aptis ESOL 2026',
  description: 'Luyện tập hiệu quả với kho đề thi cập nhật nhất, công nghệ chấm AI thông minh giúp bạn đạt B2/C1 trong thời gian ngắn nhất.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-[#faf8f5] text-[#141413] font-sans antialiased selection:bg-[#fef3c7] selection:text-[#162544] overflow-x-hidden custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
