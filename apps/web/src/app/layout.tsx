import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
