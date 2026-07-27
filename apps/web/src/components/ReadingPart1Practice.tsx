'use client';

import React from 'react';
import scrapedData from '../../../../scraped_data.json';
import BasePracticeExam from './exam/BasePracticeExam';
import DetailedAnswersCard, { AnswerDiffBadge } from './exam/DetailedAnswersCard';
import ReadingPart1View, { Question1Item } from './reading/ReadingPart1View';

interface ReadingPart1PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ReadingPart1Practice({
  testIndex = 0,
  onExit,
}: ReadingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawQuestionsList = (scrapedData?.reading?.question1 || []) as Question1Item[][];
  const totalSets = rawQuestionsList.length;

  const singleTestQuestions: Question1Item[] = rawQuestionsList[testIndex % totalSets] || rawQuestionsList[0] || [];
  const allQuestionsList: Question1Item[] = isAllPractice
    ? (rawQuestionsList.flat() as Question1Item[])
    : singleTestQuestions;

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 1 – Gap Fill"
      testIndex={testIndex}
      totalSets={totalSets}
      defaultTimeSeconds={360}
      subQuestionsPerSet={5}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(idx, val) => val === allQuestionsList[idx]?.correctAnswer}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : (testIndex % totalSets);
        const testQuestionsData: Question1Item[] = rawQuestionsList[activeIdx] || rawQuestionsList[0] || [];
        const baseAnswerKey = isAllPractice ? currentQuestionIndex * 5 : 0;

        return (
          <ReadingPart1View
            questions={testQuestionsData}
            userAnswers={userAnswers}
            baseAnswerKey={baseAnswerKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => (
        <DetailedAnswersCard
          title="Chi tiết bài làm"
          subtitle="Choose the word that fits in the gap."
        >
          {allQuestionsList.map((q, idx) => {
            const userAns = userAnswers[idx] || '';
            const isCorr = userAns === q.correctAnswer;

            return (
              <div key={idx} className="flex flex-wrap items-center gap-2 text-[14px] font-normal text-slate-800 leading-relaxed">
                <span>{q.questionStart}</span>
                <AnswerDiffBadge
                  userAnswer={userAns}
                  correctAnswer={q.correctAnswer}
                  isCorrect={isCorr}
                />
                <span>{q.questionEnd}</span>
              </div>
            );
          })}
        </DetailedAnswersCard>
      )}
    />
  );
}
