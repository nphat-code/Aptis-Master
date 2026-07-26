'use client';

import React from 'react';
import scrapedData from '../../../../scraped_data.json';
import ExamPracticeLayout from './exam/ExamPracticeLayout';

interface Question {
  questionStart: string;
  answerOptions: string[];
  questionEnd: string;
  correctAnswer: string;
  translation?: string;
}

interface ReadingPart1PracticeProps {
  testIndex: number; // 0-based index for tests
  onExit: () => void;
}

export default function ReadingPart1Practice({
  testIndex = 0,
  onExit,
}: ReadingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawQuestionsList = scrapedData?.reading?.question1 || [];
  const singleTestQuestions: Question[] = rawQuestionsList[testIndex % rawQuestionsList.length] || rawQuestionsList[0] || [];
  const allQuestionsList: Question[] = isAllPractice
    ? (rawQuestionsList.flat() as Question[])
    : singleTestQuestions;
  
  const partTitle = 'Part 1 – Gap Fill';

  return (
    <ExamPracticeLayout
      moduleName="Reading"
      partTitle={partTitle}
      testTitle={isAllPractice ? `Tất cả ${rawQuestionsList.length} đề Part 1` : `Đề ${testIndex + 1 < 10 ? '0' + (testIndex + 1) : testIndex + 1}`}
      totalQuestions={isAllPractice ? rawQuestionsList.length : 1}
      timeAllowedSeconds={isAllPractice ? 999999 : 360} // Unlimited for all practice, 6 mins for single test
      maxScore={allQuestionsList.length * 2} // 2 points per correct sub-question
      customTotalSubQuestions={isAllPractice ? 48 : singleTestQuestions.length}
      isAnswerCorrect={(idx, val) => val === allQuestionsList[idx]?.correctAnswer}
      initialStep={isAllPractice ? 'questions' : 'instructions'}
      unlimitedTime={isAllPractice}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : (testIndex % rawQuestionsList.length);
        const testQuestionsData: Question[] = rawQuestionsList[activeIdx] || rawQuestionsList[0] || [];

        return (
          <>
            {/* Question Instructions */}
            <div>
              <p className="text-[16px] font-bold text-slate-900 leading-snug">
                Choose the word that fits in the gap.
              </p>
            </div>

            {/* Fill-in-the-blank Sentences Block (Clean Paragraph Layout, 16px font size) */}
            <div className="space-y-4 text-[16px] font-normal text-slate-800 leading-relaxed">
              {/* 5 Dynamic Sentences for current test */}
              {testQuestionsData.map((q, idx) => {
                const answerKey = isAllPractice ? (currentQuestionIndex * 5 + idx) : idx;
                const selectedValue = userAnswers[answerKey] || '';
                const isAnswerChecked = isReviewMode || showExplanation;
                const isUserCorr = selectedValue === q.correctAnswer;

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{q.questionStart}</span>

                      {/* Inline Select Dropdown */}
                      <select
                        disabled={isReviewMode}
                        value={selectedValue}
                        onChange={(e) => onAnswer(answerKey, e.target.value)}
                        className={`mx-1 px-3 py-1 text-[16px] appearance-auto min-w-[130px] rounded-md transition-all font-normal ${
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

          {/* Minimalist "Đáp án" Section */}
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
        /* Card 2: Chi tiết bài làm Card (Static) */
        <div className="bg-[#F0EFEE] rounded-3xl p-6 sm:p-8 text-left space-y-5 border border-slate-200/70 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Chi tiết bài làm
            </h3>
            <p className="text-xs italic text-slate-500 font-normal">
              Choose the word that fits in the gap.
            </p>
          </div>

          {/* Sentences List with Inline Colored Badges */}
          <div className="space-y-4 text-base font-normal text-slate-800 leading-relaxed pt-2">
            {/* Dynamic Question Sentences */}
            {allQuestionsList.map((q, idx) => {
              const userAns = userAnswers[idx] || '';
              const isCorr = userAns === q.correctAnswer;

              return (
                <div key={idx} className="flex flex-wrap items-center gap-2">
                  <span>{q.questionStart}</span>

                  {isCorr ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-md text-sm">
                      {userAns}
                    </span>
                  ) : (
                    <>
                      <span className="bg-red-100 text-red-800 border border-red-300 line-through font-bold px-3 py-1 rounded-md text-sm">
                        {userAns || '(trống)'}
                      </span>
                      <span className="text-slate-400 text-sm font-bold mx-0.5">→</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-md text-sm">
                        {q.correctAnswer}
                      </span>
                    </>
                  )}

                  <span>{q.questionEnd}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
