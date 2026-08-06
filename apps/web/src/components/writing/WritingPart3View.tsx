'use client';

import React from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface WritingPart3Item {
  id: string;
  questionNum?: number;
  questionText: string;
  sampleAnswer: string;
}

export interface WritingPart3ViewProps {
  questions: WritingPart3Item[];
  userAnswers: Record<number, string>;
  clubName?: string;
  onAnswer: (questionIndex: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function WritingPart3View({
  questions,
  userAnswers,
  clubName = 'Club',
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: WritingPart3ViewProps) {
  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const isAnswerChecked = isReviewMode || showExplanation;

  return (
    <>
      <QuestionInstructionHeader>
        You are communicating online with other members of the club. Reply to their questions. Write in sentences. Use 30–40 words per answer. Recommended time: 10 minutes.
      </QuestionInstructionHeader>

      <div className="space-y-6 mt-6 text-[14px] font-normal text-slate-800 leading-relaxed text-left">
        {questions.map((q, idx) => {
          const userAns = userAnswers[idx] || '';
          const wordCount = countWords(userAns);
          const isWordCountValid = wordCount >= 30 && wordCount <= 40;

          return (
            <div
              key={q.id || idx}
              className="space-y-2 text-left"
            >
              {/* Question / Member Prompt */}
              <p className="font-normal text-slate-800 text-[14px]">
                {q.questionText}
              </p>

              {/* Textarea Input */}
              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  disabled={isReviewMode}
                  value={userAns}
                  onChange={(e) => onAnswer(idx, e.target.value)}
                  placeholder="Type your answer here"
                  className={`w-full px-4 py-3 rounded-xl text-[14px] font-normal transition-all disabled:opacity-100 resize-y min-h-[110px] ${
                    isAnswerChecked
                      ? isWordCountValid
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-950 font-medium'
                        : 'border-2 border-red-400 bg-[#fef2f2] text-red-950 font-medium'
                      : 'border border-slate-300/80 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500'
                  }`}
                />

                {/* Word Counter Display */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  {isAnswerChecked ? (
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[12px] ${
                        isWordCountValid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isWordCountValid
                        ? '✓ Hợp lệ (30–40 từ)'
                        : wordCount === 0
                        ? '✗ Bỏ trống'
                        : wordCount < 30
                        ? '✗ Dưới 30 từ'
                        : '✗ Vượt quá 40 từ'}
                    </span>
                  ) : <div />}

                  <span className="font-normal text-slate-500 ml-auto text-xs">
                    Words: {wordCount} / 60
                  </span>
                </div>
              </div>

              {/* Sample Answer in Review Mode */}
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
