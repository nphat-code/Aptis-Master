'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

import scrapedData from '@/data/scraped_data.json';
import ListeningPart1Practice from './listening/ListeningPart1Practice';
import ListeningPart2Practice from './listening/ListeningPart2Practice';
import ListeningPart3Practice from './listening/ListeningPart3Practice';
import ListeningPart4Practice from './listening/ListeningPart4Practice';
import ListeningFullPractice from './listening/ListeningFullPractice';

interface ListeningViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function ListeningView({ onBackToHome, onExamStateChange, data }: ListeningViewProps) {
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const totalTestSets = Object.keys(rawListeningTests).length || 15;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Information recognition' },
    { id: 'part2', label: 'Part 2 – Information matching' },
    { id: 'part3', label: 'Part 3 – Inference - discussion' },
    { id: 'part4', label: 'Part 4 – Inference - longer monologues' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Listening',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Information recognition',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Information matching',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Inference - discussion',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Inference - longer monologues',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      <div className="bg-[#4edea3]/10 p-5 rounded-2xl border border-[#4edea3]/30 text-[#dae2fd] space-y-1.5 shadow-inner">
        <p className="font-medium text-xs sm:text-sm leading-relaxed">
          🎧 <strong className="text-[#4edea3]">Chiến thuật Listening Aptis 2026:</strong> Listening sẽ dễ dàng hơn rất nhiều nếu bạn học theo từng nhóm câu hỏi thay vì luyện đề dàn trải. Tập trung bắt từ khóa chính (Keywords) và luyện phản xạ âm thanh liên tục.
        </p>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Câu 1–13</span>
          Part 1 – Nhận biết thông tin (Tích lũy tối đa điểm)
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Học đầy đủ các câu hỏi trong bộ tài liệu thi.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Luyện nghe phản xạ nhanh đáp án thay vì mất quá nhiều thời gian phân tích từ vựng.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Lưu ý số lần nghe tối đa là 2 lần cho mỗi audio.</span></li>
        </ul>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Câu 14–17</span>
          Part 2, 3 & 4 – Hội thoại & Độc thoại nâng cao
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Cảnh giác với các thông tin gây nhiễu (Distractors) trong đáp án.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Tận dụng thời gian chuẩn bị trước khi bấm Audio để đọc nhanh câu hỏi & phương án lựa chọn.</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="listening"
      skillTitle="Phần thi Listening"
      skillDescription="Luyện nghe theo format bài thi Aptis Listening. Làm quen với các dạng câu hỏi và luyện tập với audio giống bài thi thật. Mỗi đoạn audio chỉ được nghe tối đa 2 lần."
      durationText="25-30 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 15h3v4H3v-4zm15 0h3v4h-3v-4z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Listening"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          const totalP1 = (scrapedData as any).listening?.listening_question1_13?.length || 210;
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: '',
            totalCount: totalP1,
          };
        }
        if (partId === 'part2') {
          return {
            title: 'Luyện tất cả đề Part 2',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part3') {
          const totalP3 = (scrapedData as any).listening?.listening_question15?.length || totalTestSets;
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: '',
            totalCount: totalP3,
          };
        }
        if (partId === 'part4') {
          const totalP4 = (scrapedData as any).listening?.listening_question16_17?.length || totalTestSets;
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: '',
            totalCount: totalP4,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        if (partId === 'full') {
          return {
            title: `Đề ${testNumberStr} - Listening Full Part`,
            badge: 'Full Part',
            durationText: '40 phút',
          };
        }
        if (partId === 'part1') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 1`,
            badge: 'Part 1',
            durationText: '8 phút',
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
            badge: 'Part 2',
            durationText: '10 phút',
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
            badge: 'Part 3',
            durationText: '10 phút',
          };
        }
        if (partId === 'part4') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q16_17 = rawListeningTests[testKey]?.q16_17 || [];
          const firstMono = q16_17[0] || {};
          const topicRaw = firstMono.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 4`;

          return {
            title: titleText,
            badge: 'Part 4',
            durationText: '12 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'full') {
          return <ListeningFullPractice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part1') {
          return <ListeningPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <ListeningPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <ListeningPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <ListeningPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
