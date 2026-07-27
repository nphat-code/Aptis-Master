'use client';

import React from 'react';
import AudioPlayer from './AudioPlayer';

export interface Question13Item {
  heading?: string;
  audioUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  transcript?: string;
}

export interface ListeningPart1ViewProps {
  questions: Question13Item[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (questionIndex: number, value: any) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ListeningPart1View({
  questions,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ListeningPart1ViewProps) {
  if (!questions || questions.length === 0) {
    return <div className="text-slate-500 text-sm">Không có dữ liệu câu hỏi Listening Part 1.</div>;
  }

  return (
    <div className="space-y-8 text-left">
      {questions.map((q, idx) => {
        const answerKey = baseAnswerKey + idx;
        const selectedVal = userAnswers[answerKey] || '';
        const isCorrect = selectedVal === q.correctAnswer;

        return (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 text-left"
          >
            {/* Question Heading & Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-sm text-[#24085A]">
                {q.heading || `Question ${idx + 1}`}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                Listening Part 1
              </span>
            </div>

            {/* Audio Player */}
            <div className="pt-1">
              <AudioPlayer src={q.audioUrl} title={q.heading || `Audio Q${idx + 1}`} />
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {q.question}
              </h3>

              {/* 3 Radio Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedVal === opt;
                  const isAnsCorrect = opt === q.correctAnswer;

                  let borderStyle = 'border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300';
                  if (showExplanation || isReviewMode) {
                    if (isAnsCorrect) {
                      borderStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold';
                    } else if (isSelected) {
                      borderStyle = 'border-red-500 bg-red-50/70 text-red-950 font-semibold';
                    } else {
                      borderStyle = 'border-slate-200 bg-slate-50/50 opacity-60';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-[#24085A] bg-purple-50/60 font-semibold text-[#24085A] ring-1 ring-[#24085A]';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isReviewMode}
                      onClick={() => onAnswer(answerKey, opt)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${borderStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'border-[#24085A] bg-[#24085A] text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>

                      {/* Correct / Incorrect Badges in Review Mode */}
                      {(showExplanation || isReviewMode) && (
                        <div>
                          {isAnsCorrect && (
                            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                              Đáp án đúng
                            </span>
                          )}
                          {!isAnsCorrect && isSelected && (
                            <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                              Đã chọn sai
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transcript & Explanation Card (Shown in Review Mode or when Show Explanation is toggled) */}
            {(showExplanation || isReviewMode) && q.transcript && (
              <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-200/80 space-y-2 text-left pt-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 font-bold text-xs text-[#24085A] uppercase tracking-wider">
                  <svg className="w-4 h-4 text-[#24085A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>AUDIO TRANSCRIPT & EXPLANATION</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                  &ldquo;{q.transcript}&rdquo;
                </p>
                <div className="pt-1 text-xs font-semibold text-emerald-800">
                  👉 Đáp án đúng: <span className="font-bold">{q.correctAnswer}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
