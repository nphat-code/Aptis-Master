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
  // Load questions for specified testIndex
  const rawQuestionsList = scrapedData?.reading?.question1 || [];
  const testQuestionsData: Question[] =
    rawQuestionsList[testIndex % rawQuestionsList.length] || rawQuestionsList[0] || [];

  const testTitle = `Đề ${testIndex + 1 < 10 ? '0' + (testIndex + 1) : testIndex + 1}`;

  return (
    <ExamPracticeLayout
      moduleName="Reading"
      partTitle="Part 1 – Gap Fill"
      testTitle={testTitle}
      totalQuestions={5}
      timeAllowedSeconds={360} // 6 minutes
      maxScore={10} // 2 points per correct question
      onExit={onExit}
      renderQuestions={({ userAnswers, onAnswer, isReviewMode, showExplanation }) => (
        <>
          {/* Question Instructions */}
          <div>
            <p className="text-[16px] font-bold text-slate-900 leading-snug">
              Choose the word that fits in the gap. The first one is done for you.
            </p>
          </div>

          {/* Fill-in-the-blank Sentences Block (Clean Paragraph Layout, 16px font size) */}
          <div className="space-y-4 text-[16px] font-normal text-slate-800 leading-relaxed">
            {/* Example Item */}
            <div className="flex flex-wrap items-center gap-2">
              <span>I saw some shows in the</span>
              <span className="bg-slate-200/80 text-slate-600 font-medium px-3.5 py-1 rounded-md border border-slate-300/60 min-w-[120px] text-center inline-block text-[16px]">
                window
              </span>
              <span>of one store.</span>
            </div>

            {/* 5 Dynamic Sentences */}
            {testQuestionsData.map((q, idx) => {
              const selectedValue = userAnswers[idx] || '';

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{q.questionStart}</span>

                    {/* Inline Select Dropdown */}
                    <select
                      disabled={isReviewMode}
                      value={selectedValue}
                      onChange={(e) => onAnswer(idx, e.target.value)}
                      className={`mx-1 px-3 py-1 text-[16px] appearance-auto min-w-[130px] rounded-md transition-all ${
                        isReviewMode
                          ? selectedValue === q.correctAnswer
                            ? 'border border-emerald-500 bg-emerald-50 text-emerald-700 font-bold cursor-not-allowed'
                            : selectedValue
                            ? 'border border-red-500 bg-red-50 text-red-700 font-bold cursor-not-allowed'
                            : 'border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed'
                          : 'bg-white border border-slate-300 font-normal cursor-pointer text-slate-700 focus:outline-none focus:ring-2 focus:border-[#24085A] focus:ring-[#24085A]/20 hover:border-slate-400'
                      }`}
                    >
                      <option value={selectedValue}>{selectedValue || ''}</option>
                      {!isReviewMode &&
                        q.answerOptions.map((opt, oIdx) => (
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

          {/* "Hiện đáp án" Drawer Container (Shown when clicking floating button, matching aptiskytich.vn, no translation) */}
          {showExplanation && (
            <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Đáp án
              </h3>

              <div className="space-y-4">
                {testQuestionsData.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-sm">
                    <div className="text-base font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-slate-400">{idx + 1}.</span>
                      <p className="italic font-medium">
                        {q.questionStart}
                        <u className="text-emerald-700 font-extrabold not-italic px-1">{q.correctAnswer}</u>
                        {q.questionEnd}
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-md text-xs">
                        <span>✓ Đáp án đúng:</span>
                        <span>{q.correctAnswer}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      renderDetailedAnswers={({ userAnswers }) => (
        /* Card 2: Chi tiết bài làm Card (Static) */
        <div className="bg-[#F0EFEE] rounded-3xl p-6 sm:p-8 text-left space-y-5 border border-slate-200/70 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Chi tiết bài làm
            </h3>
            <p className="text-xs italic text-slate-500 font-normal">
              Choose the word that fits in the gap. The first one is done for you.
            </p>
          </div>

          {/* Sentences List with Inline Colored Badges */}
          <div className="space-y-4 text-base font-normal text-slate-800 leading-relaxed pt-2">
            {/* Example Item */}
            <div className="flex flex-wrap items-center gap-2">
              <span>I saw some shows in the</span>
              <span className="bg-slate-200 text-slate-600 font-normal px-3 py-1 rounded-md text-sm border border-slate-300/60">
                window <span className="text-xs text-slate-400 font-normal">(cho sẵn)</span>
              </span>
              <span>of one store.</span>
            </div>

            {/* 5 Dynamic Question Sentences */}
            {testQuestionsData.map((q, idx) => {
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
