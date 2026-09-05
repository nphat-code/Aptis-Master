'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart4View, { WritingPart4Data, countWords, formatMainEmail } from './WritingPart4View';
import { buildWritingPart4GeminiPrompt } from '@/utils/geminiPrompts';

export interface WritingPart4PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingPart4ResultsViewProps {
  userAnswers: Record<number, any>;
  data: WritingPart4Data;
  clubName: string;
  onRetake?: () => void;
}

function WritingPart4ResultsView({
  userAnswers,
  data,
  clubName,
}: WritingPart4ResultsViewProps) {
  const [copied, setCopied] = useState(false);

  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const cleanClub = formattedClubName.toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an ') || cleanClub.startsWith('the '))
    ? cleanClub
    : `the ${formattedClubName}`;

  const cleanSample = (ans?: string) => {
    if (!ans) return '';
    return ans.replace(/<br\s*\/?>/gi, '\n').trim();
  };

  const handleCopyForGemini = () => {
    const text = buildWritingPart4GeminiPrompt({
      clubName: formattedClubName,
      mainEmail: data.mainEmail,
      userAnswer1: userAnswers[0] || '',
      sampleAnswer1: cleanSample(data.sampleAnswer1),
      userAnswer2: userAnswers[1] || '',
      sampleAnswer2: cleanSample(data.sampleAnswer2),
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Standard Answer Details Card */}
      <DetailedAnswersCard
        title="Đánh giá chi tiết từng câu"
        subtitle={`You are a member of ${clubText}. You have received this email from the club:`}
      >
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleCopyForGemini}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-purple-700 hover:to-indigo-700 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Đã sao chép vào Clipboard!' : 'Sao chép đề & bài làm để luyện cùng Gemini'}</span>
          </button>
        </div>

        <div className="space-y-6 text-left">
          {/* Main Email Display */}
          <p className="font-normal text-slate-800 text-[14px] leading-relaxed whitespace-pre-line">
            {formatMainEmail(data.mainEmail)}
          </p>

          {/* Task 1 Review */}
          <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
            <p className="font-bold text-slate-900 text-[14px]">
              Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.
            </p>
            <div className="space-y-1 text-[14px]">
              <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
              <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                userAnswers[0]
                  ? 'bg-slate-50 border-slate-200 text-slate-900'
                  : 'bg-red-50/60 border-red-200 text-red-700'
              }`}>
                {userAnswers[0] || <span className="italic text-slate-400">(Bỏ trống)</span>}
              </p>
            </div>
            {cleanSample(data.sampleAnswer1) && (
              <div className="text-[14px]">
                <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                  <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                    <span>Bài mẫu tham khảo</span>
                  </span>
                  <p className="font-normal text-emerald-950 whitespace-pre-line">{cleanSample(data.sampleAnswer1)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Task 2 Review */}
          <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
            <p className="font-bold text-slate-900 text-[14px]">
              Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.
            </p>
            <div className="space-y-1 text-[14px]">
              <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
              <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                userAnswers[1]
                  ? 'bg-slate-50 border-slate-200 text-slate-900'
                  : 'bg-red-50/60 border-red-200 text-red-700'
              }`}>
                {userAnswers[1] || <span className="italic text-slate-400">(Bỏ trống)</span>}
              </p>
            </div>
            {cleanSample(data.sampleAnswer2) && (
              <div className="text-[14px]">
                <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                  <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                    <span>Bài mẫu tham khảo</span>
                  </span>
                  <p className="font-normal text-emerald-950 whitespace-pre-line">{cleanSample(data.sampleAnswer2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DetailedAnswersCard>
    </div>
  );
}

export default function WritingPart4Practice({
  testIndex = 0,
  onExit,
}: WritingPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const allTestData: WritingPart4Data[] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      return {
        id: tKey,
        mainEmail: testObj.questions4_main || 'Dear member, please write your response.',
        task1Text: testObj.question4_1_text || 'Write a short email to your friend (about 50 words).',
        task2Text: testObj.question4_2_text || 'Write an email to the president of the club (about 120-150 words).',
        sampleAnswer1: testObj.question4_1_text_answer || '',
        sampleAnswer2: testObj.question4_2_text_answer || '',
      };
    });
  }, [rawWritingTests, testKeys]);

  const activeData = allTestData[safeTestIndex] || allTestData[0];
  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 4 – Formal and informal writing"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={1800}
      subQuestionsPerSet={2}
      pointsPerSubQuestion={5} // Total max score 10 for Part 4 (5 pts per email)
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        const subIdx = idx % 2;
        if (subIdx === 0) return wc >= 40 && wc <= 60;
        if (subIdx === 1) return wc >= 120 && wc <= 150;
        return false;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? Math.floor(currentQuestionIndex / 2) : safeTestIndex;
        const currentData = allTestData[activeIdx] || allTestData[0];
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        const setAnswers: Record<number, string> = {
          0: userAnswers[isAllPractice ? activeIdx * 2 : 0] || '',
          1: userAnswers[isAllPractice ? activeIdx * 2 + 1 : 1] || '',
        };

        return (
          <WritingPart4View
            data={currentData}
            userAnswers={setAnswers}
            clubName={activeClubName}
            onAnswer={(subIdx, val) => {
              const globalIdx = isAllPractice ? activeIdx * 2 + subIdx : subIdx;
              onAnswer(globalIdx, val);
            }}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers, onRetake }) => {
        const activeClubName = clubName || 'Club';

        return (
          <WritingPart4ResultsView
            userAnswers={userAnswers}
            data={activeData}
            clubName={activeClubName}
            onRetake={onRetake}
          />
        );
      }}
    />
  );
}
