'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface GrammarViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function GrammarView({ onBackToHome, onExamStateChange, data }: GrammarViewProps) {
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
    <div className="space-y-4 text-sm font-sans">
      {/* Chiến thuật tổng quan */}
      <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border border-[#fde68a] text-[#78350f] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#92400e] text-xs sm:text-sm">
          <span>📚</span>
          <span>Chiến thuật Grammar & Vocabulary:</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Phần ngữ pháp và từ vựng là nền tảng cốt lõi giúp bạn nâng band điểm cả 4 kỹ năng. Hãy tập trung ôn theo cụm từ cố định (Collocations), từ đồng nghĩa và cấu trúc thì.
        </p>
      </div>

      {/* Grammar & Vocabulary */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-[#162544] text-base flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Grammar & Vocab</span>
            <span>Chủ điểm trọng tâm</span>
          </h4>
          <span className="text-[11px] font-bold text-[#2563eb] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            Nền tảng điểm số
          </span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span>Hệ thống thì hoàn thành & tiếp diễn, câu điều kiện loại 1-2-3, mệnh đề quan hệ rút gọn, câu bị động.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span>Học từ vựng theo cụm từ (Collocations), từ đồng nghĩa (Synonyms) để giải quyết nhanh bài thi Vocabulary.</span></li>
        </ul>
      </div>
    </div>
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
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Grammar & Vocabulary"
      tipsContent={tipsContent}
    />
  );
}
