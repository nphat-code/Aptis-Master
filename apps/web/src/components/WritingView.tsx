'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface WritingViewProps {
  onBackToHome?: () => void;
}

export default function WritingView({ onBackToHome }: WritingViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Word completion' },
    { id: 'part2', label: 'Part 2 – Short response' },
    { id: 'part3', label: 'Part 3 – Club chat room' },
    { id: 'part4', label: 'Part 4 – Formal/Informal Email' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Writing',
      subtitle: 'Hoàn thành 4 Part viết liên tục trong 25 phút để đánh giá khả năng diễn đạt văn bản.',
      badge: 'Full Part',
      testCount: 20,
    },
    part1: {
      title: 'Part 1 – Word completion',
      subtitle: '15 bộ đề luyện tập (Điền câu trả lời ngắn 1-5 từ)',
      badge: 'Part 1',
      testCount: 15,
    },
    part2: {
      title: 'Part 2 – Short text response',
      subtitle: '15 bộ đề luyện tập (Viết câu trả lời 20-30 từ về bản thân)',
      badge: 'Part 2',
      testCount: 15,
    },
    part3: {
      title: 'Part 3 – Social network chat room',
      subtitle: '12 bộ đề luyện tập (Trả lời 3 tin nhắn trong câu lạc bộ 30-40 từ/câu)',
      badge: 'Part 3',
      testCount: 12,
    },
    part4: {
      title: 'Part 4 – Formal & Informal Email',
      subtitle: '10 bộ đề luyện tập (Viết 1 Email thân mật 50 từ & 1 Email trang trọng 120-150 từ)',
      badge: 'Part 4',
      testCount: 10,
    },
  };

  const tipsContent = (
    <>
      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Phần thi Writing yêu cầu phân biệt rõ văn phong Thân mật (Informal - dùng từ viết tắt, từ ngữ đời thường) và Trang trọng (Formal - từ ngữ lịch sự, cấu trúc ngữ pháp chuẩn xác).
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 4</span>
          Cấu trúc Email trang trọng (Formal Email)
        </h4>
        <p className="text-xs font-medium text-slate-700">Mở đầu: Dear Sir/Madam / Dear Mr. Smith. Nêu mục đích viết: I am writing to express my concern regarding... Thân bài: Giải thích chi tiết & đưa giải pháp. Kết bài: Yours sincerely / Yours faithfully.</p>
      </div>
    </>
  );

  return (
    <SkillPracticeView
      skillId="writing"
      skillTitle="Phần thi Writing"
      skillDescription="Luyện viết theo format bài thi Aptis Writing. Rèn luyện văn phong thân mật & trang trọng qua các dạng bài điền câu, nhắn tin và viết Email."
      durationText="25 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="part1"
      tipsTitle="Mẹo thi Aptis Writing"
      tipsContent={tipsContent}
    />
  );
}
