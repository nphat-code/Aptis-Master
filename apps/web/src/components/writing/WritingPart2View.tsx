'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface WritingPart2Item {
  id: string;
  questionNum?: number;
  questionText: string;
  sampleAnswer: string;
}

export interface WritingPart2ViewProps {
  question: WritingPart2Item;
  userAnswer: string;
  clubName?: string;
  onAnswer: (value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function WritingPart2View({
  question,
  userAnswer,
  clubName = 'Club',
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: WritingPart2ViewProps) {
  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const wordCount = countWords(userAnswer);
  const isWordCountValid = wordCount >= 20 && wordCount <= 30;
  const isAnswerChecked = isReviewMode || showExplanation;

  return (
    <>
      <QuestionInstructionHeader>
        Now you&apos;ve become a new member of the {formattedClubName}. Fill in the form. Write in sentences. Use 20-30 words.
      </QuestionInstructionHeader>

      <div className="space-y-4 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {/* Question Prompt */}
        <p className="font-normal text-slate-800 text-[14px]">
          {question.questionText}
        </p>

        {/* Text Input Box */}
        <div className="space-y-1.5">
          <textarea
            rows={5}
            disabled={isReviewMode}
            value={userAnswer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer here"
            className={`w-full px-4 py-3 rounded-xl text-[14px] font-normal transition-all disabled:opacity-100 resize-y min-h-[120px] ${
              isAnswerChecked
                ? isWordCountValid
                  ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-950 font-medium'
                  : 'border-2 border-red-400 bg-[#fef2f2] text-red-950 font-medium'
                : 'border border-slate-300/80 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500'
            }`}
          />

          {/* Live Word Count Indicator at bottom right */}
          <div className="flex items-center justify-between text-xs pt-1">
            {isAnswerChecked ? (
              <span
                className={`px-2 py-0.5 rounded-md font-semibold text-[12px] ${
                  isWordCountValid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {isWordCountValid
                  ? '✓ Hợp lệ (20–30 từ)'
                  : wordCount === 0
                  ? '✗ Bỏ trống'
                  : wordCount < 20
                  ? '✗ Dưới 20 từ'
                  : '✗ Vượt quá 30 từ'}
              </span>
            ) : <div />}

            <span className="font-normal text-slate-500 ml-auto">
              Words: {wordCount} / 45
            </span>
          </div>
        </div>

        {/* Sample Answer in Review / Explanation Mode */}
        {isAnswerChecked && question.sampleAnswer && (
          <div className="mt-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-1 text-left">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              💡 Gợi ý bài mẫu (Sample Answer)
            </span>
            <p className="text-[14px] text-slate-800 font-medium italic">
              &ldquo;{question.sampleAnswer}&rdquo;
            </p>
          </div>
        )}
      </div>
    </>
  );
}
