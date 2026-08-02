'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import ReadingPart1Practice from './reading/ReadingPart1Practice';
import ReadingPart23Practice from './reading/ReadingPart23Practice';
import ReadingPart4Practice from './reading/ReadingPart4Practice';
import ReadingPart5Practice from './reading/ReadingPart5Practice';
import ReadingFullPractice from './reading/ReadingFullPractice';
import scrapedData from '@/data/scraped_data.json';

interface ReadingViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function ReadingView({ onBackToHome, data }: ReadingViewProps) {
  const part1TotalCount = (scrapedData as any)?.reading?.question1?.length || 48;
  const part23TotalSets = (scrapedData as any)?.reading?.question2?.questionSets?.length || 39;
  const part23TotalCount = part23TotalSets;
  const part4TotalCount = (scrapedData as any)?.reading?.question4?.question4Content?.length || 14;
  const part5TotalCount = (scrapedData as any)?.reading?.question5?.paragraph_question5?.length || 11;
  const fullTotalCount = Object.keys((scrapedData as any)?.reading_tests || {}).length || 14;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Sentence comprehension' },
    { id: 'part23', label: 'Part 2 + 3 – Text cohesion' },
    { id: 'part4', label: 'Part 4 – Opinion matching' },
    { id: 'part5', label: 'Part 5 – Long reading' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Reading',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: fullTotalCount,
    },
    part1: {
      title: 'Part 1 – Sentence comprehension',
      subtitle: `${part1TotalCount} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: part1TotalCount,
    },
    part23: {
      title: 'Part 2 + 3 – Text cohesion',
      subtitle: `${part23TotalCount} bộ đề luyện tập`,
      badge: 'Part 2+3',
      testCount: part23TotalCount,
    },
    part4: {
      title: 'Part 4 – Opinion matching',
      subtitle: `${part4TotalCount} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: part4TotalCount,
    },
    part5: {
      title: 'Part 5 – Long reading',
      subtitle: `${part5TotalCount} bộ đề luyện tập`,
      badge: 'Part 5',
      testCount: part5TotalCount,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      <div className="bg-[#4edea3]/10 p-5 rounded-2xl border border-[#4edea3]/30 text-[#dae2fd] space-y-1.5 shadow-inner">
        <p className="font-medium text-xs sm:text-sm leading-relaxed">
          💡 <strong className="text-[#4edea3]">Chiến thuật Reading Aptis 2026:</strong> Reading là một trong những kỹ năng dễ cải thiện điểm số nhất nếu biết làm theo trọng tâm. Thay vì làm đề dàn trải, hãy chia nhỏ từng Part để luyện phản xạ và nhớ theo dạng bài.
        </p>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 1</span>
          Sentence comprehension
        </h4>
        <p className="text-xs font-semibold text-[#4edea3]">Học đầy đủ kho câu hỏi (Phần dễ tích lũy điểm tối đa)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Học đầy đủ các câu hỏi có trong kho đề luyện tập.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Làm đi làm lại nhiều lần để tạo phản xạ nhận diện đáp án ngay lập tức.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Khi luyện, cố gắng vừa nhìn câu hỏi là nhận ra đáp án thay vì phải đọc hiểu từ đầu.</span></li>
        </ul>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 2</span>
          Text cohesion (Sắp xếp đoạn văn)
        </h4>
        <p className="text-xs font-semibold text-[#4edea3]">Luyện kỹ thuật liên kết từ và ngữ cảnh</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Học theo kho câu hỏi và ghi nhớ các cặp từ nối logic (However, Therefore, In addition).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Chú ý những câu dễ gây nhầm lẫn để không bị mất điểm đáng tiếc.</span></li>
        </ul>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 3, 4 & 5</span>
          Opinion matching & Long reading
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Hiểu rõ bản chất lý do đáp án đúng thay vì chỉ học thuộc lòng vẹt.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Độ dài văn bản dài yêu cầu kỹ năng Skimming (đọc lướt lấy ý chính) và Scanning (tìm từ khóa cụ thể).</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="reading"
      skillTitle="Phần thi Reading"
      skillDescription="Luyện đọc hiểu theo format bài thi Aptis Reading. Làm quen với các dạng câu hỏi và nâng cao kỹ năng đọc nhanh."
      durationText="30 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part23', 'part4', 'part5']}
      tipsTitle="Mẹo học Reading Aptis"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') {
          return null;
        }
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: `Làm liên tục ${part1TotalCount} đề — không giới hạn giờ`,
            totalCount: part1TotalCount,
          };
        }
        if (partId === 'part23') {
          return {
            title: 'Luyện tất cả đề Part 2+3',
            subtitle: `Làm liên tục ${part23TotalSets} bài đọc — không giới hạn giờ`,
            totalCount: part23TotalSets,
          };
        }
        if (partId === 'part4') {
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: `Làm liên tục ${part4TotalCount} đề (4 bài đọc) — không giới hạn giờ`,
            totalCount: part4TotalCount,
          };
        }
        if (partId === 'part5') {
          return {
            title: 'Luyện tất cả đề Part 5',
            subtitle: `Làm liên tục ${part5TotalCount} bài đọc dài — không giới hạn giờ`,
            totalCount: part5TotalCount,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        if (partId === 'full') {
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}`,
            subtitle: '📖 Đầy đủ 5 Part (29 câu) • 35 phút',
            badge: 'Full Part',
          };
        }
        if (partId === 'part1') {
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr} - Reading Part 1`,
            subtitle: '📖 Điền từ vào đoạn văn (5 câu) • 6 phút',
            badge: 'Part 1',
          };
        }
        if (partId === 'part23') {
          const rawHeaders: Record<string, string> = scrapedData?.reading?.question2?.questheader1 || {};
          const topicTitle = rawHeaders[`question2Content_${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            subtitle: '📖 1 bài đọc (5 câu) • 7 phút',
            badge: 'Part 2+3',
          };
        }
        if (partId === 'part4') {
          const topicMap: Record<string, string> = scrapedData?.reading?.question4?.question4Topic1 || {};
          const topicTitle = topicMap[`topic${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            subtitle: '📖 4 đoạn văn (7 câu) • 7 phút',
            badge: 'Part 4',
          };
        }
        if (partId === 'part5') {
          const topicMap: Record<string, string> = scrapedData?.reading?.question5?.topic_name || {};
          const topicTitle = topicMap[`topic_${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            subtitle: '📖 1 bài đọc dài (7 đoạn văn) • 15 phút',
            badge: 'Part 5',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'full') {
          return <ReadingFullPractice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part1') {
          return <ReadingPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part23') {
          return <ReadingPart23Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <ReadingPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part5') {
          return <ReadingPart5Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
