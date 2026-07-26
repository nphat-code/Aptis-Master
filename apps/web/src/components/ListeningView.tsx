'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface ListeningViewProps {
  onBackToHome?: () => void;
}

export default function ListeningView({ onBackToHome }: ListeningViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Information gathering' },
    { id: 'part2', label: 'Part 2 – Monologue matching' },
    { id: 'part3', label: 'Part 3 – Dialogue opinion' },
    { id: 'part4', label: 'Part 4 – Academic lecture' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Listening',
      subtitle: 'Hoàn thành tất cả 4 Part nghe liên tục trong 30 phút để đánh giá khả năng phản xạ nghe.',
      badge: 'Full Part',
      testCount: 25,
    },
    part1: {
      title: 'Part 1 – Information gathering',
      subtitle: '25 bộ đề luyện tập (Thông báo ngắn & Tin nhắn thoại)',
      badge: 'Part 1',
      testCount: 25,
    },
    part2: {
      title: 'Part 2 – Monologue matching',
      subtitle: '20 bộ đề luyện tập (Ghép thông tin người nói)',
      badge: 'Part 2',
      testCount: 20,
    },
    part3: {
      title: 'Part 3 – Dialogue opinion',
      subtitle: '18 bộ đề luyện tập (Hội thoại quan điểm & thái độ)',
      badge: 'Part 3',
      testCount: 18,
    },
    part4: {
      title: 'Part 4 – Academic lecture',
      subtitle: '15 bộ đề luyện tập (Bài giảng ngắn & Bài nói chuyên đề)',
      badge: 'Part 4',
      testCount: 15,
    },
  };

  const tipsContent = (
    <>
      <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Đối với bài thi Aptis Listening, bạn được phép nghe lại đoạn băng. Hãy tận dụng lượt nghe 1 để nắm ý chính và lượt nghe 2 để xác nhận từ khóa quyết định.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 1</span>
          Thông tin ngắn & Số liệu
        </h4>
        <p className="text-xs font-medium text-slate-700">Đọc trước câu hỏi và dự đoán dạng thông tin cần nghe (giờ, số điện thoại, tên đường, lý do).</p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 2 & 3</span>
          Quan điểm & Thái độ
        </h4>
        <p className="text-xs font-medium text-slate-700">Chú ý các từ nối đồng ý/bác bỏ như: However, Actually, In fact, I agree, I am not sure about that...</p>
      </div>
    </>
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
      tipsTitle="Mẹo thi Aptis Listening"
      tipsContent={tipsContent}
    />
  );
}
