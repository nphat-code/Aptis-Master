'use client';

import React from 'react';
import scrapedData from '../../../../scraped_data.json';
import BasePracticeExam from './exam/BasePracticeExam';
import DetailedAnswersCard, { AnswerDiffBadge } from './exam/DetailedAnswersCard';
import ReadingPart5View from './reading/ReadingPart5View';

interface ReadingPart5PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ReadingPart5Practice({
  testIndex = 0,
  onExit,
}: ReadingPart5PracticeProps) {
  const isAllPractice = testIndex === -1;

  const rawQuestion5 = (scrapedData?.reading as any)?.question5 || {};
  const rawParagraphsObj: Record<string, string[]> = rawQuestion5.paragraph_question5 || {};
  const rawOptionsObj: Record<string, string[]> = rawQuestion5.options || {};
  const rawTopicMap: Record<string, string> = rawQuestion5.topic_name || {};

  const setKeys = Object.keys(rawParagraphsObj);
  const totalSets = setKeys.length || 11;
  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const getCorrectHeadingForSet = (setIdx: number, pIdx: number): string => {
    const opts = rawOptionsObj[`${setIdx}`] || [];
    return opts[pIdx + 1] || '';
  };

  const currentTopicKey = `topic_${safeTestIndex + 1}`;
  const topicTitle = rawTopicMap[currentTopicKey] || `Đề ${safeTestIndex + 1}`;

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 5 – Long reading"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={topicTitle}
      defaultTimeSeconds={900}
      subQuestionsPerSet={7}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(idx, val) => {
        if (isAllPractice) {
          const setIdx = Math.floor(idx / 7);
          const pIdx = idx % 7;
          return val === getCorrectHeadingForSet(setIdx, pIdx);
        } else {
          return val === getCorrectHeadingForSet(safeTestIndex, idx);
        }
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;

        const paragraphs = rawParagraphsObj[`${activeSetIndex}`] || [];
        const rawOptions = rawOptionsObj[`${activeSetIndex}`] || [];
        const baseKey = isAllPractice ? currentQuestionIndex * 7 : 0;

        return (
          <ReadingPart5View
            paragraphs={paragraphs}
            options={rawOptions}
            userAnswers={userAnswers}
            baseAnswerKey={baseKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const activeSetIndex = isAllPractice ? 0 : safeTestIndex;
        const paragraphs = rawParagraphsObj[`${activeSetIndex}`] || [];

        return (
          <DetailedAnswersCard
            title="Chi tiết bài làm"
            subtitle="Read the text below and choose the correct heading for each paragraph."
          >
            {paragraphs.map((pText, pIdx) => {
              const answerKey = isAllPractice ? pIdx : pIdx;
              const userAns = userAnswers[answerKey] || '';
              const correctAns = getCorrectHeadingForSet(activeSetIndex, pIdx);
              const isCorr = userAns === correctAns;

              return (
                <div
                  key={pIdx}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 text-left shadow-2xs"
                >
                  <div className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                    <span className="text-[#24085A] font-bold min-w-[30px]">
                      {pIdx + 1}.
                    </span>
                    <p className="text-slate-700 line-clamp-2 font-normal text-xs sm:text-sm">{pText}</p>
                  </div>

                  <div className="pl-0 sm:pl-8 pt-1">
                    <AnswerDiffBadge
                      userAnswer={userAns || 'Chưa chọn'}
                      correctAnswer={correctAns}
                      isCorrect={isCorr}
                    />
                  </div>
                </div>
              );
            })}
          </DetailedAnswersCard>
        );
      }}
    />
  );
}
