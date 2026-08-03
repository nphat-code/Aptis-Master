'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface SpeakingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function SpeakingView({ onBackToHome, onExamStateChange, data }: SpeakingViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Personal info' },
    { id: 'part2', label: 'Part 2 – Describe picture' },
    { id: 'part3', label: 'Part 3 – Compare pictures' },
    { id: 'part4', label: 'Part 4 – Personal experience' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Speaking',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: 20,
    },
    part1: {
      title: 'Part 1 – Personal information',
      subtitle: '15 bộ đề luyện tập (Trả lời 3 câu hỏi cá nhân • 30s/câu)',
      badge: 'Part 1',
      testCount: 15,
    },
    part2: {
      title: 'Part 2 – Describe, express opinion',
      subtitle: '15 bộ đề luyện tập (Miêu tả tranh & Bày tỏ quan điểm • 45s/câu)',
      badge: 'Part 2',
      testCount: 15,
    },
    part3: {
      title: 'Part 3 – Describe, compare & provide reasons',
      subtitle: '12 bộ đề luyện tập (So sánh 2 bức tranh • 45s/câu)',
      badge: 'Part 3',
      testCount: 12,
    },
    part4: {
      title: 'Part 4 – Discuss personal experience & opinion',
      subtitle: '10 bộ đề luyện tập (Trả lời 3 câu hỏi sâu • 2 phút nói liên tục)',
      badge: 'Part 4',
      testCount: 10,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      <div className="bg-[#4edea3]/10 p-5 rounded-2xl border border-[#4edea3]/30 text-[#dae2fd] space-y-1.5 shadow-inner">
        <p className="font-medium text-xs sm:text-sm leading-relaxed">
          🗣️ <strong className="text-[#4edea3]">Chiến thuật Speaking Aptis 2026:</strong> Duy trì tốc độ nói vừa phải, phát âm chuẩn ngữ điệu. Tránh ngập ngừng quá 3 giây và áp dụng công thức <strong className="text-white">PREP (Point - Reason - Example - Point)</strong> để mở rộng ý.
        </p>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 1, 2 & 3</span>
          Personal Info & Photo Description
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Miêu tả tổng quan bức tranh (In the foreground, In the background, On the left/right).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>So sánh điểm tương đồng và khác biệt giữa 2 bức tranh trong 45 giây.</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="speaking"
      skillTitle="Phần thi Speaking"
      skillDescription="Luyện nói theo format bài thi Aptis Speaking. Thực hành miêu tả bức tranh, so sánh và bày tỏ quan điểm cá nhân."
      durationText="12 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Speaking"
      tipsContent={tipsContent}
    />
  );
}
