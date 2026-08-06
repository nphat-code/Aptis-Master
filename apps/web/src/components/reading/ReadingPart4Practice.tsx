'use client';

import React from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard, { AnswerDiffBadge } from '../exam/DetailedAnswersCard';
import ReadingPart4View, { Question4Item } from './ReadingPart4View';

interface ReadingPart4PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ReadingPart4Practice({
  testIndex = 0,
  onExit,
}: ReadingPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawPassagesList: string[][] = scrapedData?.reading?.question4?.question4Text || [];
  const rawQuestionsList: Question4Item[][] = (scrapedData?.reading?.question4 as any)?.question4Content || [];
  const topicMap: Record<string, string> = scrapedData?.reading?.question4?.question4Topic1 || {};

  const totalSets = Math.min(rawPassagesList.length, rawQuestionsList.length);
  const safeTestIndex = isAllPractice ? 0 : (testIndex % totalSets);

  const singleQuestions = rawQuestionsList[safeTestIndex] || [];
  const allQuestionsFlat = rawQuestionsList.flat();
  const currentTopicKey = `topic${safeTestIndex + 1}`;
  const topicTitle = topicMap[currentTopicKey] || '';

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 4 – Opinion matching"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={topicTitle}
      defaultTimeSeconds={420}
      subQuestionsPerSet={7}
      pointsPerSubQuestion={16 / 7}
      isAnswerCorrect={(idx, val) => {
        const targetQ = isAllPractice ? allQuestionsFlat[idx] : singleQuestions[idx];
        return val === targetQ?.answer;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const currentPassages = rawPassagesList[activeSetIndex] || [];
        const currentQuestions = rawQuestionsList[activeSetIndex] || [];
        const baseKey = isAllPractice ? currentQuestionIndex * 7 : 0;

        return (
          <ReadingPart4View
            passages={currentPassages}
            questions={currentQuestions}
            userAnswers={userAnswers}
            baseAnswerKey={baseKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => (
        <DetailedAnswersCard
          title="Chi tiết bài làm"
          subtitle="Read the texts and then answer the questions below."
        >
          {(isAllPractice ? allQuestionsFlat : singleQuestions).map((qItem, idx) => {
            const userAns = userAnswers[idx] || '';
            const isCorr = userAns === qItem.answer;

            return (
              <div key={idx} className="space-y-2 text-left pb-3 border-b border-slate-200/60 last:border-b-0 last:pb-0">
                <div className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                  <span className="text-[#24085A] font-bold">{idx + 1}.</span>
                  <p className="text-slate-800">{qItem.question}</p>
                </div>

                <div className="pl-6 pt-1">
                  <AnswerDiffBadge
                    userAnswer={userAns}
                    correctAnswer={qItem.answer}
                    isCorrect={isCorr}
                  />
                </div>
              </div>
            );
          })}
        </DetailedAnswersCard>
      )}
    />
  );
}
