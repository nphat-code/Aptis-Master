'use client';

import React from 'react';
import scrapedData from '../../../../scraped_data.json';
import BasePracticeExam from './exam/BasePracticeExam';
import QuestionInstructionHeader from './exam/QuestionInstructionHeader';
import DetailedAnswersCard, { AnswerDiffBadge } from './exam/DetailedAnswersCard';

interface Question {
  questionStart: string;
  answerOptions: string[];
  questionEnd: string;
  correctAnswer: string;
  translation?: string;
}

interface ReadingPart1PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ReadingPart1Practice({
  testIndex = 0,
  onExit,
}: ReadingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawQuestionsList = (scrapedData?.reading?.question1 || []) as Question[][];
  const totalSets = rawQuestionsList.length;

  const singleTestQuestions: Question[] = rawQuestionsList[testIndex % totalSets] || rawQuestionsList[0] || [];
  const allQuestionsList: Question[] = isAllPractice
    ? (rawQuestionsList.flat() as Question[])
    : singleTestQuestions;

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 1 – Gap Fill"
      testIndex={testIndex}
      totalSets={totalSets}
      defaultTimeSeconds={360}
      subQuestionsPerSet={5}
      pointsPerSubQuestion={1}
      isAnswerCorrect={(idx, val) => val === allQuestionsList[idx]?.correctAnswer}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : (testIndex % totalSets);
        const testQuestionsData: Question[] = rawQuestionsList[activeIdx] || rawQuestionsList[0] || [];

        return (
          <>
            <QuestionInstructionHeader>
              Choose the word that fits in the gap.
            </QuestionInstructionHeader>

            <div className="space-y-4 text-[14px] font-normal text-slate-800 leading-relaxed">
              {testQuestionsData.map((q, idx) => {
                const answerKey = isAllPractice ? (currentQuestionIndex * 5 + idx) : idx;
                const selectedValue = userAnswers[answerKey] || '';
                const isAnswerChecked = isReviewMode || showExplanation;
                const isUserCorr = selectedValue === q.correctAnswer;

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{q.questionStart}</span>

                      <select
                        disabled={isReviewMode}
                        value={selectedValue}
                        onChange={(e) => onAnswer(answerKey, e.target.value)}
                        className={`mx-1 px-3 py-1 text-[14px] appearance-auto min-w-[130px] rounded-md transition-all font-normal ${
                          isAnswerChecked
                            ? isUserCorr
                              ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 cursor-pointer'
                              : selectedValue
                              ? 'border-2 border-red-400 bg-red-50 text-red-700 cursor-pointer'
                              : 'border border-slate-300 bg-slate-50 text-slate-600 cursor-pointer'
                            : 'bg-white border border-slate-300 cursor-pointer text-slate-800 focus:outline-none focus:ring-2 focus:border-[#24085A] focus:ring-[#24085A]/20 hover:border-slate-400'
                        }`}
                      >
                        <option value=""></option>
                        {q.answerOptions.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <span>{q.questionEnd}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-4 animate-in fade-in duration-300 text-left">
                <h3 className="text-lg font-bold text-slate-900">
                  Đáp án
                </h3>

                <div className="space-y-3">
                  {testQuestionsData.map((q, idx) => {
                    const answerKey = isAllPractice ? (currentQuestionIndex * 5 + idx) : idx;
                    const userAns = userAnswers[answerKey] || '';
                    const isCorr = userAns === q.correctAnswer;

                    return (
                      <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2.5 text-left">
                        <div className="text-base font-normal text-slate-900 flex items-start gap-2">
                          <span className="text-slate-500 font-normal">{idx + 1}.</span>
                          <p className="italic font-normal text-slate-800 leading-relaxed">
                            {q.questionStart}
                            <span className="font-medium not-italic text-slate-900 underline underline-offset-4 decoration-emerald-500 px-1">{q.correctAnswer}</span>
                            {q.questionEnd}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 pl-6 pt-1">
                          {!isCorr && (
                            <span className="bg-red-50 text-red-600 border border-red-300/80 px-3.5 py-1 rounded-lg text-[14px] font-normal inline-flex items-center gap-1.5 shadow-2xs">
                              <span className="w-4 h-4 rounded-full border border-red-300 bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">⊗</span>
                              <span className="line-through">{userAns || '—'}</span>
                            </span>
                          )}

                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-300/80 px-3.5 py-1 rounded-lg text-[14px] font-normal inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-4 h-4 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>{q.correctAnswer}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
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
