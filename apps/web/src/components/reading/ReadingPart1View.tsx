'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface Question1Item {
  questionStart: string;
  answerOptions: string[];
  questionEnd: string;
  correctAnswer: string;
  translation?: string;
}

export interface ReadingPart1ViewProps {
  questions: Question1Item[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ReadingPart1View({
  questions,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ReadingPart1ViewProps) {
  return (
    <>
      <QuestionInstructionHeader>
        Choose one word from the list for each gap.
      </QuestionInstructionHeader>

      <div className="space-y-4 mt-6 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {questions.map((q, idx) => {
          const answerKey = baseAnswerKey + idx;
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
                  className={`mx-1 px-3 py-1 text-[14px] appearance-auto min-w-[130px] rounded-md transition-all font-normal disabled:opacity-100 ${
                    isAnswerChecked
                      ? isUserCorr
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 cursor-pointer disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedValue
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 cursor-pointer disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border border-slate-300 bg-slate-50 text-slate-600 cursor-pointer disabled:bg-slate-50'
                      : 'bg-white border border-slate-300 cursor-pointer text-slate-800 focus:outline-none focus:ring-2 focus:border-[#162544] focus:ring-[#162544]/20 hover:border-slate-400'
                  }`}
                >
                  <option value="" disabled hidden></option>
                  {(q.answerOptions || []).filter((opt) => opt && opt.trim() !== '').map((opt, oIdx) => (
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
            {questions.map((q, idx) => {
              const answerKey = baseAnswerKey + idx;
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
                      <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-0.5 rounded-md text-[13px] font-normal inline-flex items-center gap-1.5">
                        <span className="text-red-500 font-bold text-xs">✕</span>
                        <span className="line-through">{userAns || '—'}</span>
                      </span>
                    )}

                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-md text-[13px] font-normal inline-flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold text-xs">✓</span>
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
}
