'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import scrapedData from '@/data/scraped_data.json';
import WritingPart1Practice from './writing/WritingPart1Practice';
import WritingPart2Practice from './writing/WritingPart2Practice';
import WritingPart3Practice from './writing/WritingPart3Practice';
import WritingPart4Practice from './writing/WritingPart4Practice';

interface WritingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function WritingView({ onBackToHome, onExamStateChange, data }: WritingViewProps) {
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const totalTestSets = Object.keys(rawWritingTests).length || 40;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Word-level writing' },
    { id: 'part2', label: 'Part 2 – Short text writing' },
    { id: 'part3', label: 'Part 3 – Three written responses to questions' },
    { id: 'part4', label: 'Part 4 – Formal and informal writing' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Writing',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Word-level writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Short text writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Three written responses to questions',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Formal and informal writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      <div className="bg-[#4edea3]/10 p-5 rounded-2xl border border-[#4edea3]/30 text-[#dae2fd] space-y-1.5 shadow-inner">
        <p className="font-medium text-xs sm:text-sm leading-relaxed">
          ✍️ <strong className="text-[#4edea3]">Chiến thuật Writing Aptis 2026:</strong> Writing gồm 4 phần, trong đó <strong className="text-white">Part 4 (Viết 2 Email)</strong> chiếm trọng số điểm lớn nhất. Hãy nắm chắc cấu trúc Email trang trọng (Formal) và thân mật (Informal).
        </p>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 1 & 2</span>
          Short answers & Personal info
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Part 1: Trả lời ngắn từ 1-5 từ. Viết đúng chính tả, ngữ pháp và nhớ viết hoa chữ cái đầu.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Part 2: Viết câu hoàn chỉnh từ 20-30 từ. Trả lời đúng trọng tâm câu hỏi.</span></li>
        </ul>
      </div>

      <div className="bg-[#0b1326]/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3 hover:border-[#4edea3]/30 transition-all shadow-md">
        <h4 className="font-extrabold text-white text-base flex items-center gap-3">
          <span className="bg-[#4edea3]/20 text-[#4edea3] text-xs px-3 py-1 rounded-full border border-[#4edea3]/30 font-extrabold">Part 3 & 4</span>
          Social room & Formal/Informal Emails
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-[#bbcabf] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Part 3: Trả lời 3 câu hỏi trong phòng chat (30-40 từ/câu). Dùng từ nối linh hoạt.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#4edea3] font-bold">✓</span><span>Part 4: Email người bạn (50 từ, văn phong Informal) và Email gửi quản lý (120-150 từ, văn phong Formal).</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="writing"
      skillTitle="Phần thi Writing"
      skillDescription="Luyện viết theo format bài thi Aptis Writing. Hoàn thành các task viết với thời gian giống bài thi thật.\nAI chấm bài và nhận band điểm Writing ngay sau khi làm bài."
      durationText="50 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Writing"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part2') {
          return {
            title: 'Luyện tất cả đề Part 2',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part3') {
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part4') {
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        const testKey = `test${testNum}`;
        const testObj = rawWritingTests[testKey] || {};
        const clubName = testObj.club_name || '';
        const cleanClub = clubName.replace(/^Topic:\s*/i, '').trim();
        const titleText = cleanClub ? `Đề ${testNumberStr} - ${cleanClub}` : `Đề ${testNumberStr} - Writing Part ${partId === 'full' ? 'Full Part' : partId.replace('part', '')}`;

        if (partId === 'full') {
          return {
            title: titleText,
            badge: 'Full Part',
            durationText: '50 phút',
          };
        }
        if (partId === 'part1') {
          return {
            title: titleText,
            badge: 'Part 1',
            durationText: '3 phút',
          };
        }
        if (partId === 'part2') {
          return {
            title: titleText,
            badge: 'Part 2',
            durationText: '7 phút',
          };
        }
        if (partId === 'part3') {
          return {
            title: titleText,
            badge: 'Part 3',
            durationText: '10 phút',
          };
        }
        if (partId === 'part4') {
          return {
            title: titleText,
            badge: 'Part 4',
            durationText: '30 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'part1') {
          return <WritingPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <WritingPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <WritingPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <WritingPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        return (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#CC1C01] flex items-center justify-center mx-auto text-xl font-bold">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tính năng Luyện tập Writing đang được hoàn thiện
            </h3>
            <p className="text-sm text-slate-600">
              Chế độ luyện tập cho phần này sẽ sớm ra mắt trong phiên bản tiếp theo.
            </p>
            <button
              type="button"
              onClick={onExit}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24085A] text-white text-sm font-semibold hover:bg-[#340b82] transition-colors cursor-pointer"
            >
              Quay lại danh sách bài tập
            </button>
          </div>
        );
      }}
    />
  );
}

