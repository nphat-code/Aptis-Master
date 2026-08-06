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
  const cleanClub = (clubName || 'club').trim().toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an '))
    ? cleanClub
    : /^[aeiou]/i.test(cleanClub)
    ? `an ${cleanClub}`
    : `a ${cleanClub}`;

  return (
    <>
      <QuestionInstructionHeader>
        You want to join {clubText}. You have 5 messages from a member of the club. Write short answers (1–5 words) to each message. Recommended time: 3 minutes.
      </QuestionInstructionHeader>

      <div className="mt-6 space-y-6 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {questions.map((q, idx) => {
          const answerKey = baseAnswerKey + idx;
          const selectedValue = userAnswers[answerKey] || '';
          const wordCount = countWords(selectedValue);
          const isWordCountValid = wordCount >= 1 && wordCount <= 5;
          const isAnswerChecked = isReviewMode || showExplanation;

          return (
            <div key={idx} className="space-y-2">
              {/* Question Prompt */}
              <p className="font-normal text-slate-900 leading-snug text-[14px]">
                {q.questionText}
              </p>

              {/* Text Input Box */}
              <div className="space-y-1.5">
                <textarea
                  rows={2}
                  disabled={isReviewMode}
                  value={selectedValue}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  placeholder="Type your answer here"
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

                  <span className="font-normal text-slate-500 ml-auto">
                    Words: {wordCount} / 5
                  </span>
                </div>
              </div>

              {/* Sample Model Answer Box in Review / Explanation Mode */}
              {isAnswerChecked && q.sampleAnswer && (
                <div className="mt-3 p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1 text-left">
                  <span className="text-xs font-bold text-emerald-800 block">💡 Bài viết mẫu</span>
                  <p className="font-normal text-emerald-950 text-[14px]">{q.sampleAnswer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
