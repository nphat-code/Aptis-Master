'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface GrammarViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function GrammarView({ onBackToHome, data }: GrammarViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Grammar sentence fill' },
    { id: 'part2', label: 'Part 2 – Vocabulary matching' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part Grammar & Vocabulary',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: 30,
    },
    part1: {
      title: 'Part 1 – Grammar sentence fill',
      subtitle: '25 bộ đề luyện tập (Trắc nghiệm ngữ pháp 25 câu)',
      badge: 'Part 1',
      testCount: 25,
    },
    part2: {
      title: 'Part 2 – Vocabulary matching',
      subtitle: '20 bộ đề luyện tập (Ghép nghĩa từ vựng, từ đồng nghĩa, từ kết hợp)',
      badge: 'Part 2',
      testCount: 20,
    },
  };

  const tipsContent = (
    <>
      <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Phần Grammar & Vocabulary là nền tảng cốt lõi giúp bạn đạt điểm cao ở cả 4 kỹ năng. Hãy ôn luyện theo cụm từ (Collocations) và cấu trúc thì.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Grammar</span>
          Chủ điểm ngữ pháp thường gặp
        </h4>
        <p className="text-xs font-medium text-slate-700">Các thì quá khứ hoàn thành/tiếp diễn, câu điều kiện loại 1-2-3, mệnh đề quan hệ rút gọn, động từ nguyên mẫu có to / V-ing, câu bị động.</p>
      </div>
    </>
  );

  return (
    <SkillPracticeView
      skillId="grammar"
      skillTitle="Phần thi Grammar & Vocabulary"
      skillDescription="Luyện ngữ pháp và từ vựng Aptis. Củng cố kiến thức ngữ pháp trọng tâm và mở rộng vốn từ vựng đồng nghĩa, collocations."
      durationText="25 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      tipsTitle="Mẹo thi Grammar & Vocabulary"
      tipsContent={tipsContent}
    />
  );
}
