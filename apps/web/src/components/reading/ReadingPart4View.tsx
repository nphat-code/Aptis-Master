'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface Question4Item {
  question: string;
  id: string;
  options: string[];
  answer: string;
}

export interface ReadingPart4ViewProps {
  passages: string[];
  questions: Question4Item[];
  correctAnswers?: string[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ReadingPart4View({
  passages,
  questions,
  correctAnswers = [],
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ReadingPart4ViewProps) {
  return (
    <>
      <QuestionInstructionHeader>
        Read the four texts below and answer the 7 questions.
      </QuestionInstructionHeader>

      {/* 4 Passages Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6 text-left">
        {passages.slice(1, 5).map((text, pIdx) => {
          const personLetter = String.fromCharCode(65 + pIdx);
          const textStr = typeof text === 'string' ? text : (typeof text === 'object' && text !== null ? ((text as any).text || (text as any).question || '') : String(text || ''));
          const cleanContent = textStr.replace(/^<strong>[A-D]:<\/strong>\s*/i, '');

          return (
            <div key={pIdx} className="space-y-1.5 border-b border-slate-100 last:border-none pb-5 last:pb-0">
              <h4 className="font-extrabold text-[14px] text-slate-900">
                {personLetter}
              </h4>
              <div
                className="text-[14px] text-slate-800 leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />
            </div>
          );
        })}
      </div>

      {/* 7 Questions Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4 text-left">
        {questions.map((qItem, qIdx) => {
          const answerKey = baseAnswerKey + qIdx;
          const selectedVal = userAnswers[answerKey] || '';
          const isChecked = isReviewMode || showExplanation;
          const targetAns = correctAnswers[qIdx] || qItem.answer;
          const isCorr = selectedVal === targetAns;

          return (
            <div
              key={qIdx}
              className="flex items-center justify-between gap-4 border-b border-slate-100 last:border-none pb-3.5 last:pb-0"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="font-extrabold text-[#24085A] text-[14px] min-w-[24px]">
                  {qIdx + 1}.
                </span>
                <p className="text-[14px] font-medium text-slate-900 leading-snug">
                  {qItem.question}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  disabled={isReviewMode}
                  value={selectedVal}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  className={`px-3.5 py-1.5 text-[14px] appearance-auto min-w-[85px] rounded-lg transition-all font-normal cursor-pointer disabled:opacity-100 ${
                    isChecked
                      ? isCorr
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedVal
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border border-slate-300 bg-slate-50 text-slate-600 disabled:bg-slate-50'
                      : 'bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:border-[#24085A] focus:ring-[#24085A]/20 hover:border-slate-400'
                  }`}
                >
                  <option value="">—</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>

                {isChecked && (
                  <div className="flex items-center gap-1.5 min-w-[55px]">
                    {isCorr ? (
                      <span className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center text-[11px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <>
                        <span className="w-5 h-5 rounded-full border border-red-500 text-red-500 flex items-center justify-center text-[11px] font-bold">
                          ✕
                        </span>
                        <span className="text-emerald-700 font-normal text-sm flex items-center gap-0.5">
                          <span>→</span>
                          <span>{targetAns}</span>
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
