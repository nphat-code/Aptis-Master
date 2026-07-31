'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface WritingPart1Item {
  id: string; // e.g. "question1_1"
  questionNum: number; // 1 to 5
  questionText: string; // e.g. "How are you?"
  sampleAnswer: string; // e.g. "I'm doing great, thanks!"
}

export interface WritingPart1ViewProps {
  questions: WritingPart1Item[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  clubName?: string;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function WritingPart1View({
  questions,
  userAnswers,
  baseAnswerKey = 0,
  clubName = 'Club',
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: WritingPart1ViewProps) {
  const formattedClubName = clubName || 'Club';

  return (
    <>
      <QuestionInstructionHeader>
        You are joining a {formattedClubName}. Fill out the form. Write short answers (1-5 words) for each message.
      </QuestionInstructionHeader>

      <div className="space-y-6 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {questions.map((q, idx) => {
          const answerKey = baseAnswerKey + idx;
          const selectedValue = userAnswers[answerKey] || '';
          const wordCount = countWords(selectedValue);
          const isWordCountValid = wordCount >= 1 && wordCount <= 5;
          const isAnswerChecked = isReviewMode || showExplanation;

          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              {/* Question Header & Prompt */}
              <div className="flex items-start gap-2 text-[14px]">
                <span className="font-normal text-slate-800">{q.questionNum}.</span>
                <p className="font-normal text-slate-900 leading-snug">
                  {q.questionText}
                </p>
              </div>

              {/* Text Input Box */}
              <div className="space-y-1.5">
                <textarea
                  rows={2}
                  disabled={isReviewMode}
                  value={selectedValue}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  placeholder="Type your answer"
                  className={`w-full px-4 py-2.5 rounded-xl text-[14px] font-normal transition-all disabled:opacity-100 resize-y min-h-[52px] ${
                    isAnswerChecked
                      ? isWordCountValid
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedValue
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border-2 border-red-300 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-300'
                      : 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#24085A]/20 focus:border-[#24085A] hover:border-slate-400'
                  }`}
                />

                {/* Live Word Count Indicator */}
                <div className="flex items-center justify-between text-xs pt-1">
                  {isAnswerChecked ? (
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[12px] ${
                      isWordCountValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isWordCountValid ? '✓ Hợp lệ (1–5 từ)' : wordCount === 0 ? '✗ Bỏ trống' : '✗ Quá 5 từ'}
                    </span>
                  ) : <div />}

                  <span className={`font-medium ml-auto ${
                    wordCount > 5
                      ? 'text-red-600 font-semibold'
                      : wordCount >= 1
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}>
                    Words: {wordCount} / 5
                    {wordCount > 5 && ' (Vượt quá số từ quy định)'}
                  </span>
                </div>
              </div>

              {/* Sample Model Answer Box in Review / Explanation Mode */}
              {isAnswerChecked && q.sampleAnswer && (
                <div className="mt-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-1 text-left">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    💡 Gợi ý bài mẫu (Sample Answer)
                  </span>
                  <p className="text-[14px] text-slate-800 font-medium italic">
                    &ldquo;{q.sampleAnswer}&rdquo;
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
