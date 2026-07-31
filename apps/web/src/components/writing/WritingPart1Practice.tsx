'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart1View, { WritingPart1Item, countWords } from './WritingPart1View';

export interface WritingPart1PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

export default function WritingPart1Practice({
  testIndex = 0,
  onExit,
}: WritingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  // Transform scrapedData writing questions1 into structured WritingPart1Item lists
  const allTestQuestions: WritingPart1Item[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      const qObj = testObj.questions1 || {};
      const aObj = testObj.questions1_answer || {};

      return [1, 2, 3, 4, 5].map((num) => {
        const qKey = `question1_${num}`;
        const aKey = `question1_${num}_answer`;
        return {
          id: `${tKey}_q1_${num}`,
          questionNum: num,
          questionText: qObj[qKey] || `Question ${num}`,
          sampleAnswer: aObj[aKey] || '',
        };
      });
    });
  }, [rawWritingTests, testKeys]);

  const singleTestQuestions = allTestQuestions[safeTestIndex] || [];
  const allQuestionsFlat = useMemo(() => allTestQuestions.flat(), [allTestQuestions]);

  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 1 – Short answers"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={360} // 6 mins for Writing Part 1
      subQuestionsPerSet={5}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        return wc >= 1 && wc <= 5;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const currentQuestions = allTestQuestions[activeIdx] || allTestQuestions[0] || [];
        const baseAnswerKey = isAllPractice ? currentQuestionIndex * 5 : 0;
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        return (
          <WritingPart1View
            questions={currentQuestions}
            userAnswers={userAnswers}
            baseAnswerKey={baseAnswerKey}
            clubName={activeClubName}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <DetailedAnswersCard
            title="Chi tiết bài làm"
            subtitle={`You are joining a ${activeClubName}. Fill out the form. Write short answers (1-5 words) for each message.`}
          >
            <div className="space-y-4 text-left">
              {targetQuestions.map((q, idx) => {
                const userAns = userAnswers[idx] || '';
                const wc = countWords(userAns);
                const isValid = wc >= 1 && wc <= 5;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 border text-left space-y-3 transition-all ${
                      isValid
                        ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                        : 'bg-[#fef2f2] border-[#fecaca]'
                    }`}
                  >
                    {/* Question prompt */}
                    <div className="flex items-start gap-2 text-[14px]">
                      <span className="font-normal text-slate-800">{idx + 1}.</span>
                      <p className="font-normal text-slate-900 leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    {/* User Answer & Status */}
                    <div className="pl-6 space-y-1.5 text-[14px]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600">Bài làm của bạn:</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          isValid
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : 'bg-red-200/80 text-red-900'
                        }`}>
                          {isValid ? `✓ ${wc} từ (Hợp lệ)` : wc === 0 ? '✗ Chưa trả lời' : `✗ ${wc} từ (Vượt quá 5 từ)`}
                        </span>
                      </div>
                      <p className={`font-normal p-3 rounded-xl border text-[14px] ${
                        isValid
                          ? 'bg-white/80 border-emerald-300 text-emerald-900'
                          : 'bg-white/80 border-red-300 text-red-900'
                      }`}>
                        {userAns ? `"${userAns}"` : <span className="italic text-slate-400">(Bỏ trống)</span>}
                      </p>
                    </div>

                    {/* Model Sample Answer */}
                    {q.sampleAnswer && (
                      <div className="pl-6 pt-1 text-[14px]">
                        <span className="text-xs font-bold text-slate-600 block mb-1">
                          💡 Gợi ý bài mẫu (Sample Answer):
                        </span>
                        <div className="p-3 bg-white/90 border border-slate-200/90 rounded-xl text-slate-800 font-medium italic">
                          &ldquo;{q.sampleAnswer}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DetailedAnswersCard>
        );
      }}
    />
  );
}
