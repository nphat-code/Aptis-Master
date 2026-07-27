'use client';

import React, { useMemo } from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface ReadingPart5ViewProps {
  paragraphs: string[];
  options: string[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ReadingPart5View({
  paragraphs,
  options,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ReadingPart5ViewProps) {
  const availableHeadings = useMemo(() => {
    return options.filter((opt) => Boolean(opt && opt.trim())).sort((a, b) => a.localeCompare(b));
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
          const correctVal = options[pIdx + 1] || '';
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
                  className={`px-3.5 py-1.5 text-[14px] appearance-auto max-w-full rounded-lg transition-all font-semibold cursor-pointer ${
                    isChecked
                      ? isCorr
                        ? 'border-2 border-emerald-500 bg-white text-emerald-700 font-bold'
                        : selectedVal
                        ? 'border-2 border-red-500 bg-white text-red-700 font-bold'
                        : 'border border-slate-300 bg-slate-50 text-slate-600'
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

                {isChecked && (
                  <div className="flex items-center gap-1.5">
                    {isCorr ? (
                      <span className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center text-[11px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <>
                        <span className="w-5 h-5 rounded-full border border-red-500 text-red-500 flex items-center justify-center text-[11px] font-bold">
                          ✕
                        </span>
                        <span className="text-emerald-600 font-extrabold text-sm flex items-center gap-0.5">
                          <span>→</span>
                          <span>{correctVal}</span>
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

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
