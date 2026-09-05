'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart2View, { WritingPart2Item, countWords } from './WritingPart2View';
import { buildWritingPart2GeminiPrompt } from '@/utils/geminiPrompts';

export interface WritingPart2PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingPart2ResultsViewProps {
  userAnswers: Record<number, any>;
  targetQuestions: WritingPart2Item[];
  clubName: string;
  onRetake?: () => void;
}

function WritingPart2ResultsView({
  userAnswers,
  targetQuestions,
  clubName,
}: WritingPart2ResultsViewProps) {
  const [copied, setCopied] = useState(false);

  const cleanClub = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const clubText = cleanClub.toLowerCase().startsWith('the ')
    ? cleanClub
    : `the ${cleanClub}`;
  const instructionSubtitle = `You are a new member of ${clubText}. Fill in the form. Write in sentences. Use 20–30 words. Recommended time: 7 minutes.`;

  const handleCopyForGemini = () => {
    const q = targetQuestions[0] || { questionText: '', sampleAnswer: '' };
    const text = buildWritingPart2GeminiPrompt({
      clubName: cleanClub,
      instruction: instructionSubtitle,
      questionText: q.questionText,
      userAnswer: userAnswers[0] || '',
      sampleAnswer: q.sampleAnswer || '',
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
        subtitle={instructionSubtitle}
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

        <div className="space-y-4 text-left">
          {targetQuestions.map((q, idx) => {
            const userAns = userAnswers[idx] || '';
            const displaySample = q.sampleAnswer;

            return (
              <div
                key={idx}
                className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs"
              >
                {/* Question prompt */}
                <div className="flex items-start gap-2 text-[14px]">
                  <p className="font-normal text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>
                </div>

                {/* User Answer */}
                <div className="space-y-1 text-[14px]">
                  <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
                  <p className={`font-normal p-3 rounded-xl border text-[14px] ${
                    userAns
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-red-50/60 border-red-200 text-red-700'
                  }`}>
                    {userAns || <span className="italic text-slate-400">(Bỏ trống)</span>}
                  </p>
                </div>

                {/* Model Sample Answer */}
                {displaySample && (
                  <div className="text-[14px]">
                    <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                      <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                        <span>Bài mẫu tham khảo</span>
                      </span>
                      <p className="font-normal text-emerald-950 whitespace-pre-line">{displaySample}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DetailedAnswersCard>
    </div>
  );
}

export default function WritingPart2Practice({
  testIndex = 0,
  onExit,
}: WritingPart2PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  // Transform scrapedData writing questions2 into structured WritingPart2Item lists
  const allTestQuestions: WritingPart2Item[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      const qObj = testObj.questions2 || {};
      const aObj = testObj.questions2_answer || {};

      return [
        {
          id: `${tKey}_q2`,
          questionText: qObj.question2 || `Tell me about your interest in ${testObj.club_name || 'this club'}.`,
          sampleAnswer: aObj.question2 || '',
        },
      ];
    });
  }, [rawWritingTests, testKeys]);

  const singleTestQuestions = allTestQuestions[safeTestIndex] || [];
  const allQuestionsFlat = useMemo(() => allTestQuestions.flat(), [allTestQuestions]);

  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 2 – Short text writing"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={420} // 7 mins for Writing Part 2
      subQuestionsPerSet={1}
      pointsPerSubQuestion={10} // Total max score 10 for Part 2
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        return wc >= 20 && wc <= 30;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const currentQuestions = allTestQuestions[activeIdx] || allTestQuestions[0] || [];
        const currentQuestion = currentQuestions[0] || { id: 'q2', questionText: 'Prompt', sampleAnswer: '' };
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        return (
          <WritingPart2View
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestionIndex] || ''}
            clubName={activeClubName}
            onAnswer={(val) => onAnswer(currentQuestionIndex, val)}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers, onRetake }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <WritingPart2ResultsView
            userAnswers={userAnswers}
            targetQuestions={targetQuestions}
            clubName={activeClubName}
            onRetake={onRetake}
          />
        );
      }}
    />
  );
}
