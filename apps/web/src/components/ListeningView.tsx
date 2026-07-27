'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

import scrapedData from '@/data/scraped_data.json';
import ListeningPart1Practice from './listening/ListeningPart1Practice';

interface ListeningViewProps {
  onBackToHome?: () => void;
}

export default function ListeningView({ onBackToHome }: ListeningViewProps) {
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const totalTestSets = Object.keys(rawListeningTests).length || 15;

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
      subtitle: `Hoàn thành tất cả 4 Part nghe liên tục trong ${totalTestSets} bộ đề thi Listening hoàn chỉnh.`,
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Information gathering',
      subtitle: `${totalTestSets} bộ đề luyện tập (Thông báo ngắn & Tin nhắn thoại)`,
      badge: 'Part 1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Monologue matching',
      subtitle: `${totalTestSets} bộ đề luyện tập (Ghép thông tin người nói)`,
      badge: 'Part 2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Dialogue opinion',
      subtitle: `${totalTestSets} bộ đề luyện tập (Hội thoại quan điểm & thái độ)`,
      badge: 'Part 3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Academic lecture',
      subtitle: `${totalTestSets} bộ đề luyện tập (Bài giảng ngắn & Bài nói chuyên đề)`,
      badge: 'Part 4',
      testCount: totalTestSets,
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
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      tipsTitle="Mẹo thi Aptis Listening"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 1 — không giới hạn giờ`,
            totalCount: totalTestSets,
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
            subtitle: '🎧 Thông tin ngắn (13 câu) • 13 phút',
            badge: 'Part 1',
          };
        }
        if (partId === 'part2') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 2`,
            subtitle: '🎧 Monologue matching (4 người nói) • 5 phút',
            badge: 'Part 2',
          };
        }
        if (partId === 'part3') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 3`,
            subtitle: '🎧 Dialogue opinion (Hội thoại Nam & Nữ) • 5 phút',
            badge: 'Part 3',
          };
        }
        if (partId === 'part4') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 4`,
            subtitle: '🎧 Academic lecture (2 bài giảng) • 7 phút',
            badge: 'Part 4',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'part1') {
          return <ListeningPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
