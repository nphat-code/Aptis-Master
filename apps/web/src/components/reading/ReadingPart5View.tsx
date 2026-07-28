'use client';

import React, { useMemo } from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface ReadingPart5ViewProps {
  paragraphs: string[];
  options: string[];
  correctAnswers?: string[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ReadingPart5View({
  paragraphs,
  options,
  correctAnswers = [],
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ReadingPart5ViewProps) {
  const availableHeadings = useMemo(() => {
    return options.filter((opt) => Boolean(opt && opt.trim()));
  }, [options]);

  return (
    <>
      <QuestionInstructionHeader>
        Read the text below and choose the correct heading for each paragraph from the options provided.
      </QuestionInstructionHeader>

      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6 text-left">
        {paragraphs.map((pText, pIdx) => {
          const answerKey = baseAnswerKey + pIdx;
          const selectedVal = userAnswers[answerKey] || '';
          const correctVal = correctAnswers[pIdx] || options[pIdx + 1] || '';
          const isChecked = isReviewMode || showExplanation;
          const isCorr = selectedVal === correctVal;

          return (
            <div key={pIdx} className="space-y-2.5 border-b border-slate-100 last:border-none pb-5 last:pb-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-extrabold text-[#24085A] text-[15px] min-w-[20px]">
                  {pIdx + 1}.
                </span>

                <select
                  disabled={isReviewMode}
                  value={selectedVal}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  className={`px-3.5 py-1.5 text-[14px] appearance-auto max-w-full rounded-lg transition-all font-normal cursor-pointer disabled:opacity-100 ${
                    isChecked
                      ? isCorr
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedVal
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border border-slate-300 bg-slate-50 text-slate-600 disabled:bg-slate-50'
                      : 'bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:border-[#24085A] focus:ring-[#24085A]/20 hover:border-slate-400'
                  }`}
                >
                  <option value="">— Select heading —</option>
                  {availableHeadings.map((h, hIdx) => (
                    <option key={hIdx} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

              </div>

              {isChecked && (
                <div className="sm:pl-7 pt-0.5 flex items-center gap-2 text-[14px]">
                  {isCorr ? (
                    <span className="bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0] px-3 py-1 rounded-md text-[13px] font-normal inline-flex items-center gap-1.5">
                      <span className="text-emerald-600 text-xs font-normal">✓</span>
                      <span>{selectedVal}</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#fef2f2] text-red-800 border border-[#fecaca] px-3 py-1 rounded-md text-[13px] font-normal inline-flex items-center gap-1.5">
                        <span className="text-red-600 text-xs font-normal">✕</span>
                        <span className="line-through">{selectedVal || '(trống)'}</span>
                      </span>
                      <span className="text-slate-400 text-[13px] font-normal">→</span>
                      <span className="bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0] px-3 py-1 rounded-md text-[13px] font-normal inline-flex items-center gap-1.5">
                        <span>{correctVal}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[14px] text-slate-800 leading-relaxed font-normal sm:pl-7">
                {pText}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
