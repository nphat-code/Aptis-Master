'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

import scrapedData from '@/data/scraped_data.json';
import ListeningPart1Practice from './listening/ListeningPart1Practice';

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
      subtitle: `${totalTestSets} bộ đề luyện tập (Bài giảng ngắn & Bài nói chuyên đề)`,
      badge: 'P.4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <>
      <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Listening Aptis sẽ dễ hơn rất nhiều nếu bạn chia nhỏ việc học theo từng nhóm câu hỏi thay vì luyện đề một cách dàn trải. Tập trung bắt từ khóa chính và rèn luyện phản xạ theo từng phần sẽ giúp bạn tối ưu điểm số.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Câu 1–13</span>
          Part 1 – Nhận biết thông tin (Phần dễ lấy điểm nhất)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Mẹo luyện tập hiệu quả:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học đầy đủ các câu hỏi trong bộ tài liệu.</li>
          <li>Luyện nhiều lần để ghi nhớ các đáp án thường gặp.</li>
          <li>Khi luyện tập, tập trung nhận diện nhanh đáp án phù hợp thay vì mất quá nhiều thời gian phân tích.</li>
          <li>Đầu tư thời gian cho phần này sẽ giúp bạn tích lũy được tối đa điểm ngay từ đầu bài thi.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Câu 14</span>
          Part 2 – Monologue matching (Phần khó nhất)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Chú ý đáp án gây nhiễu & thứ tự người nói:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Thường có 6 đáp án với 2 đáp án gây nhiễu. Thứ tự người nói có thể thay đổi nên không ghi nhớ vẹt vị trí A, B, C, D.</li>
          <li>Học kỹ nội dung của từng đoạn hội thoại trong tài liệu.</li>
          <li>Ghi nhớ đáp án đi kèm để hiểu cách phân biệt các lựa chọn.</li>
          <li>Khi luyện tập, chú ý nội dung thay vì chỉ dựa vào thứ tự người nói. Đây là phần cần dành nhiều thời gian nhất.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Câu 15</span>
          Part 3 – Dialogue opinion (Tương đối dễ học)
        </h4>
        <p className="text-xs font-semibold text-slate-500">So với câu 14, phần này nhẹ hơn vì số lượng câu hỏi ít hơn:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học đầy đủ các dạng câu hỏi trong kho đề.</li>
          <li>Luyện theo phương pháp nhanh nếu muốn rút ngắn thời gian ôn tập.</li>
          <li>Khi đã quen, hãy học theo phương pháp đầy đủ để ghi nhớ chắc chắn hơn.</li>
          <li>Luyện tập đều đặn sẽ giúp bạn xử lý phần này rất nhanh khi làm bài.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Câu 16–17</span>
          Part 4 – Academic lecture (Dễ lấy điểm)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Hình thành phản xạ chọn đáp án:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học kỹ các đáp án trong bộ tài liệu.</li>
          <li>Luyện nhiều lần để tăng tốc độ nhận diện.</li>
          <li>Mục tiêu là khi nhìn thấy dạng câu hỏi, bạn có thể nhanh chóng xác định được đáp án phù hợp.</li>
          <li>Nếu luyện đủ số lượng câu hỏi, bạn sẽ hình thành phản xạ rất tốt ở hai câu này.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#24085A] text-white text-xs px-2.5 py-0.5 rounded-md">Khuyên dùng</span>
          Thứ tự ôn tập Listening hiệu quả nhất
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Hoàn thành <strong>Câu 1–13</strong> (Part 1).</li>
          <li>Dành nhiều thời gian cho <strong>Câu 14</strong> (Part 2 - Phần khó nhất).</li>
          <li>Ôn tập <strong>Câu 15</strong> (Part 3).</li>
          <li>Kết thúc với <strong>Câu 16 và 17</strong> (Part 4).</li>
        </ol>
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
            subtitle: '🎧 Word recognition (13 câu) • 8 phút',
            badge: 'P.1',
          };
        }
        if (partId === 'part2') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 2`,
            subtitle: '🎧 Matching information (4 người nói) • 5 phút',
            badge: 'P.2',
          };
        }
        if (partId === 'part3') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 3`,
            subtitle: '🎧 Short conversations (Hội thoại Nam & Nữ) • 5 phút',
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
        return null;
      }}
    />
  );
}
