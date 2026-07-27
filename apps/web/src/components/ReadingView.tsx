'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import ReadingPart1Practice from './ReadingPart1Practice';
import ReadingPart23Practice from './ReadingPart23Practice';
import ReadingPart4Practice from './ReadingPart4Practice';
import ReadingPart5Practice from './ReadingPart5Practice';
import ReadingFullPractice from './ReadingFullPractice';
import scrapedData from '../../../../scraped_data.json';

interface ReadingViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function ReadingView({ onBackToHome, data }: ReadingViewProps) {
  const part1TotalCount = scrapedData?.reading?.question1?.length || 48;
  const part23TotalSets = scrapedData?.reading?.question2?.questionSets?.length || 39;
  const part23TotalCount = part23TotalSets;
  const part4TotalCount = scrapedData?.reading?.question4?.question4Text?.length || 14;
  const part5TotalCount = Object.keys(scrapedData?.reading?.question5?.paragraph_question5 || {}).length || 11;
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
      subtitle: `${fullTotalCount} bộ đề luyện tập hoàn chỉnh`,
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
    <>
      <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Reading là một trong những kỹ năng dễ cải thiện nhất trong bài thi Aptis nếu bạn biết cách học đúng trọng tâm. Thay vì làm thật nhiều đề, hãy chia nhỏ từng Part để ôn luyện và ghi nhớ theo hệ thống.
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 1</span>
          Sentence comprehension
        </h4>
        <p className="text-xs font-semibold text-slate-500">Học đầy đủ kho câu hỏi (Phần dễ lấy điểm nhất)</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học đầy đủ các câu hỏi trong kho đề.</li>
          <li>Làm đi làm lại nhiều lần để ghi nhớ.</li>
          <li>Khi luyện, cố gắng nhìn câu hỏi là nhận ra đáp án thay vì đọc lại từ đầu.</li>
          <li>Mục tiêu là tạo phản xạ nhanh khi gặp những dạng câu hỏi quen thuộc.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 2</span>
          Text cohesion (Sắp xếp đoạn văn)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Tiếp tục học theo kho câu hỏi</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học đầy đủ các câu hỏi trong kho.</li>
          <li>Luyện nhiều lần để ghi nhớ đáp án.</li>
          <li>Chú ý những câu dễ nhầm để tránh lặp lại lỗi.</li>
          <li>Việc luyện tập thường xuyên sẽ giúp bạn tăng tốc độ xử lý khi làm bài.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 3</span>
          Luyện nhận diện đáp án
        </h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học kỹ từng câu hỏi và ghi nhớ cách tìm đáp án.</li>
          <li>Làm lại nhiều lần để tạo phản xạ.</li>
          <li>Đừng chỉ ghi nhớ đáp án, hãy hiểu vì sao đáp án đó đúng để áp dụng khi gặp câu hỏi tương tự.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 4</span>
          Opinion matching
        </h4>
        <p className="text-xs font-semibold text-slate-500">Không quá khó nếu ôn tập đầy đủ</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học đầy đủ các câu hỏi trong kho đề.</li>
          <li>Luyện nhiều lần để ghi nhớ cách làm bài.</li>
          <li>Chú ý những câu có nội dung dễ gây nhầm lẫn.</li>
        </ul>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 5</span>
          Long reading
        </h4>
        <p className="text-xs font-semibold text-slate-500">Học theo Keyword (Part khó nhất)</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Học theo keyword chính thay vì cố học thuộc cả đoạn văn.</li>
          <li>Ghi nhớ ý chính của từng bài thay vì học thuộc từng câu.</li>
          <li>Cách học này sẽ giúp bạn xử lý câu hỏi nhanh hơn khi gặp đoạn văn tương tự.</li>
        </ul>
      </div>
    </>
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
