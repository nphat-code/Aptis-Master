'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard, { AnswerDiffBadge } from '../exam/DetailedAnswersCard';
import ListeningPart1View, { Question13Item } from './ListeningPart1View';

export interface ListeningPart1PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ListeningPart1Practice({
  testIndex = 0,
  onExit,
}: ListeningPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const testKeys = Object.keys(rawListeningTests); // ['test1', 'test2', ..., 'test15']
  const totalSets = testKeys.length || 15;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const rawQuestionsList: Question13Item[][] = useMemo(() => {
    return testKeys.map((tKey) => rawListeningTests[tKey]?.q1_13 || []);
  }, [rawListeningTests, testKeys]);

  const singleTestQuestions: Question13Item[] = rawQuestionsList[safeTestIndex] || [];
  const allQuestionsFlat: Question13Item[] = useMemo(() => rawQuestionsList.flat(), [rawQuestionsList]);

  return (
    <BasePracticeExam
      moduleName="Listening"
      partTitle="Part 1 – Word Recognition"
      testIndex={testIndex}
      totalSets={totalSets}
      defaultTimeSeconds={480} // 8 mins
      subQuestionsPerSet={13}
      pointsPerSubQuestion={1}
      instructionsText={
        <>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            Click on the PLAY button to listen to each recording.
          </p>

          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            You can listen to each recording TWO TIMES ONLY.
          </p>

          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            You have 8 minutes to complete this part.
          </p>

          <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </>
      }
      isAnswerCorrect={(idx, val) => {
        const targetQ = isAllPractice ? allQuestionsFlat[idx] : singleTestQuestions[idx];
        return val === targetQ?.correctAnswer;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const testQuestionsData: Question13Item[] = rawQuestionsList[activeSetIndex] || singleTestQuestions;
        const baseAnswerKey = isAllPractice ? currentQuestionIndex * 13 : 0;

        return (
          <ListeningPart1View
            questions={testQuestionsData}
            userAnswers={userAnswers}
            baseAnswerKey={baseAnswerKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const activeQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;

        return (
          <DetailedAnswersCard
            title="Chi tiết bài làm Listening Part 1"
            subtitle="Thông tin ghi nhận (13 thông báo ngắn & tin nhắn thoại)."
          >
            <div className="space-y-4 text-left">
              {activeQuestions.map((q, idx) => {
                const userAns = userAnswers[idx] || '';
                const isCorr = userAns === q.correctAnswer;
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </p>
                    <AnswerDiffBadge userAnswer={userAns || 'Chưa chọn'} correctAnswer={q.correctAnswer} isCorrect={isCorr} />
                    {q.transcript && (
                      <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100 mt-2">
                        &ldquo;{q.transcript}&rdquo;
                      </p>
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
