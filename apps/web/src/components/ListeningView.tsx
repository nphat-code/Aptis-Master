'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

import scrapedData from '@/data/scraped_data.json';
import ListeningPart1Practice from './listening/ListeningPart1Practice';
import ListeningPart2Practice from './listening/ListeningPart2Practice';
import ListeningPart3Practice from './listening/ListeningPart3Practice';

interface ListeningViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function ListeningView({ onBackToHome, data }: ListeningViewProps) {
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const totalTestSets = Object.keys(rawListeningTests).length || 15;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'P.1 – Word recognition (Câu 1 - 13)' },
    { id: 'part2', label: 'P.2 – Matching information (Câu 14)' },
    { id: 'part3', label: 'P.3 – Short conversations (Câu 15)' },
    { id: 'part4', label: 'P.4 – Monologues (Câu 16 - 17)' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Listening',
      subtitle: `Hoàn thành tất cả 4 Part nghe liên tục trong ${totalTestSets} bộ đề thi Listening hoàn chỉnh.`,
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'P.1 – Word recognition (Câu 1 - 13)',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'P.1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'P.2 – Matching information (Câu 14)',
      subtitle: `${totalTestSets} bộ đề luyện tập (Ghép thông tin người nói)`,
      badge: 'P.2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'P.3 – Short conversations (Câu 15)',
      subtitle: `${totalTestSets} bộ đề luyện tập (Hội thoại quan điểm & thái độ)`,
      badge: 'P.3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'P.4 – Monologues (Câu 16 - 17)',
      subtitle: `${totalTestSets} bộ đề luyện tập (Bài phát biểu đơn)`,
      badge: 'P.4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-[14px]">
      <p className="font-semibold text-slate-800">Mẹo làm bài thi Aptis Listening đạt điểm cao:</p>
      <ul className="list-disc pl-5 space-y-2 text-slate-700">
        <li><strong>Part 1 (Word recognition):</strong> Tập trung đọc câu hỏi trước khi bấm nghe để xác định loại thông tin cần tìm (thời gian, giá tiền, địa điểm, hoạt động).</li>
        <li><strong>Part 2 (Matching information):</strong> Đọc lướt 6 lựa chọn ý kiến. Chú ý các từ đồng nghĩa và từ trái nghĩa người nói dùng để diễn đạt.</li>
        <li><strong>Part 3 (Short conversations):</strong> Lắng nghe thái độ, giọng điệu và từ nối (however, but, actually, agree) để xác định ý kiến của Man, Woman hay Both.</li>
        <li><strong>Part 4 (Monologues):</strong> Ghi chú từ khóa chính khi nghe bài phát biểu dài để trả lời 2 câu hỏi liên tiếp.</li>
      </ul>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="listening"
      skillTitle="Phần thi Listening"
      skillDescription="Luyện nghe theo format bài thi Aptis Listening. Rèn luyện phản xạ nghe bắt từ khóa và xác định thông tin chính xác."
      durationText="25-30 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 15h3v4H3v-4zm15 0h3v4h-3v-4z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="part1"
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      tipsTitle="Mẹo thi Aptis Listening"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          const totalP1 = (scrapedData as any).listening?.listening_question1_13?.length || 210;
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: `Làm liên tục ${totalP1} câu hỏi Part 1 — không giới hạn giờ`,
            totalCount: totalP1,
          };
        }
        if (partId === 'part2') {
          return {
            title: 'Luyện tất cả đề Part 2',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 2 — không giới hạn giờ`,
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part3') {
          const totalP3 = (scrapedData as any).listening?.listening_question15?.length || totalTestSets;
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: `Làm liên tục ${totalP3} bộ đề Part 3 — không giới hạn giờ`,
            totalCount: totalP3,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        if (partId === 'full') {
          return {
            title: `Đề ${testNumberStr} - Listening Full Part`,
            subtitle: '🎧 4 Parts (17 đoạn ghi âm) • 30 phút',
            badge: 'Full Part',
          };
        }
        if (partId === 'part1') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 1`,
            subtitle: '🎧 Word recognition (13 câu) • 8 phút',
            badge: 'P.1',
          };
        }
        if (partId === 'part2') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q14 = rawListeningTests[testKey]?.q14 || {};
          const topicRaw = q14.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 2`;

          return {
            title: titleText,
            subtitle: '🎧 Matching information (4 người nói) • 10 phút',
            badge: 'P.2',
          };
        }
        if (partId === 'part3') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q15 = rawListeningTests[testKey]?.q15 || {};
          const topicRaw = q15.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 3`;

          return {
            title: titleText,
            subtitle: '🎧 Short conversations (Hội thoại Nam & Nữ) • 10 phút',
            badge: 'P.3',
          };
        }
        if (partId === 'part4') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 4`,
            subtitle: '🎧 Monologues (2 bài giảng) • 7 phút',
            badge: 'P.4',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'part1') {
          return <ListeningPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <ListeningPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <ListeningPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
