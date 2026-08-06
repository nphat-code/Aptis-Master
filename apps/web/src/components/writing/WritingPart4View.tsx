'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface WritingPart4Data {
  id?: string;
  mainEmail: string;
  task1Text: string;
  task2Text: string;
  sampleAnswer1?: string;
  sampleAnswer2?: string;
}

export interface WritingPart4ViewProps {
  data: WritingPart4Data;
  userAnswers: Record<number, string>;
  clubName?: string;
  onAnswer: (taskIndex: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatMainEmail(text: string): string {
  if (!text) return '';
  return text
    .replace(/^(Dear\s+(?:all\s+members|members?|all|member)\s*,\s*)/i, '$1\n')
    .trim();
}

export default function WritingPart4View({
  data,
  userAnswers,
  clubName = 'Club',
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: WritingPart4ViewProps) {
  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const cleanClub = formattedClubName.toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an ') || cleanClub.startsWith('the '))
    ? cleanClub
    : `the ${formattedClubName}`;

  const isAnswerChecked = isReviewMode || showExplanation;

  const ans1 = userAnswers[0] || '';
  const ans2 = userAnswers[1] || '';

  const words1 = countWords(ans1);
  const words2 = countWords(ans2);

  const isValid1 = words1 >= 40 && words1 <= 60; // target ~50 words
  const isValid2 = words2 >= 120 && words2 <= 150; // target 120-150 words

  return (
    <>
      <QuestionInstructionHeader>
        You are a member of {clubText}. You have received this email from the club:
      </QuestionInstructionHeader>

      <div className="space-y-6 mt-6 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {/* Main Email Prompt Text */}
        <p className="font-normal text-slate-800 text-[14px] leading-relaxed whitespace-pre-line">
          {formatMainEmail(data.mainEmail)}
        </p>

        {/* Task 1: Informal Email */}
        <div className="space-y-3 pt-2 text-left">
          <p className="font-bold text-slate-900 text-[14px]">
            Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.
          </p>

          <div className="space-y-1.5">
            <textarea
              rows={5}
              disabled={isReviewMode}
              value={ans1}
              onChange={(e) => onAnswer(0, e.target.value)}
              placeholder="Type your answer here"
              className={`w-full px-4 py-3 rounded-xl text-[14px] font-normal transition-all disabled:opacity-100 resize-y min-h-[120px] ${
                isAnswerChecked
                  ? isValid1
                    ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-950 font-medium'
                    : 'border-2 border-red-400 bg-[#fef2f2] text-red-950 font-medium'
                  : 'border border-slate-300/80 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500'
              }`}
            />

            {/* Word Counter & Validation Display */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              {isAnswerChecked ? (
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[12px] ${
                    isValid1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isValid1
                    ? '✓ Hợp lệ (~50 từ)'
                    : words1 === 0
                    ? '✗ Bỏ trống'
                    : words1 < 40
                    ? '✗ Dưới 40 từ'
                    : '✗ Vượt quá 60 từ'}
                </span>
              ) : (
                <div />
              )}

              <span className="font-normal text-slate-500 ml-auto text-xs">
                Words: {words1} / 75
              </span>
            </div>
          </div>
        </div>

        {/* Task 2: Formal Email */}
        <div className="space-y-3 pt-4 text-left">
          <p className="font-bold text-slate-900 text-[14px]">
            Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.
          </p>

          <div className="space-y-1.5">
            <textarea
              rows={8}
              disabled={isReviewMode}
              value={ans2}
              onChange={(e) => onAnswer(1, e.target.value)}
              placeholder="Type your answer here"
              className={`w-full px-4 py-3 rounded-xl text-[14px] font-normal transition-all disabled:opacity-100 resize-y min-h-[180px] ${
                isAnswerChecked
                  ? isValid2
                    ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-950 font-medium'
                    : 'border-2 border-red-400 bg-[#fef2f2] text-red-950 font-medium'
                  : 'border border-slate-300/80 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500'
              }`}
            />

            {/* Word Counter & Validation Display */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              {isAnswerChecked ? (
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[12px] ${
                    isValid2 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isValid2
                    ? '✓ Hợp lệ (120–150 từ)'
                    : words2 === 0
                    ? '✗ Bỏ trống'
                    : words2 < 120
                    ? '✗ Dưới 120 từ'
                    : '✗ Vượt quá 150 từ'}
                </span>
              ) : (
                <div />
              )}

              <span className="font-normal text-slate-500 ml-auto text-xs">
                Words: {words2} / 225
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
