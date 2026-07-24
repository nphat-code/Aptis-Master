import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aptis Prep Master - Modern Exam Preparation & Simulation',
  description: 'Practice reading, listening, writing, and speaking for Aptis ESOL exams with realistic visual tests and auto-grading simulators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSans.className}>
      <body>{children}</body>
    </html>
  );
}
