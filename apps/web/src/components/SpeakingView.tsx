'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface SpeakingViewProps {
  onBackToHome?: () => void;
}

export default function SpeakingView({ onBackToHome }: SpeakingViewProps) {
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
      subtitle: 'Hoàn thành 4 Part nói liên tục trong 12 phút dưới áp lực đếm ngược thời gian.',
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
    <>
      <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Duy trì tốc độ nói vừa phải, phát âm rõ ràng. Không ngập ngừng quá 3 giây và áp dụng công thức PREP (Point - Reason - Example - Point) để trả lời trôi chảy.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 2 & 3</span>
          Bí quyết miêu tả & so sánh bức tranh
        </h4>
        <p className="text-xs font-medium text-slate-700">Miêu tả bối cảnh tổng quan (In the foreground/background, On the left/right), cảm xúc nhân vật và sự tương đồng/khác biệt.</p>
      </div>
    </>
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
      defaultPartTab="part1"
      tipsTitle="Mẹo thi Aptis Speaking"
      tipsContent={tipsContent}
    />
  );
}
