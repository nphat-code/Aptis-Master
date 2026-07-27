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
  currentQuestionIndex?: number; // 0-based index for 1 question per screen
  onAnswer: (questionIndex: number, value: any) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ListeningPart1View({
  questions,
  userAnswers,
  baseAnswerKey = 0,
  currentQuestionIndex = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ListeningPart1ViewProps) {
  if (!questions || questions.length === 0) {
    return <div className="text-slate-500 text-sm">Không có dữ liệu câu hỏi Listening Part 1.</div>;
  }

  // Get current question for 1 question per screen
  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), questions.length - 1);
  const q = questions[safeIndex] || questions[0];
  const answerKey = baseAnswerKey + safeIndex;
  const selectedVal = userAnswers[answerKey] || '';

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div key={safeIndex} className="max-w-3xl mx-auto space-y-3 text-left animate-slide-question">
      
      {/* 1. Question Text (Top) */}
      <p className="text-[14px] font-normal text-slate-900 leading-relaxed">
        {q.question}
      </p>

      {/* 2. Audio Player (Middle) */}
      <div>
        <AudioPlayer
          src={q.audioUrl}
          title={q.heading || `Listening Q${safeIndex + 1}`}
        />
      </div>

      {/* 3. Options Container Card (Exact Aptis Exam layout from screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden divide-y divide-slate-200/80">
        {q.options.map((opt, oIdx) => {
          const letter = optionLetters[oIdx] || String.fromCharCode(65 + oIdx);
          const isSelected = selectedVal === opt;
          const isAnsCorrect = opt === q.correctAnswer;

          let optionStyle = 'bg-white hover:bg-slate-50 text-slate-800';
          let letterStyle = 'text-slate-900 border-r border-slate-200/80 bg-slate-50/50';

          if (showExplanation || isReviewMode) {
            if (isAnsCorrect) {
              optionStyle = 'bg-emerald-50 text-emerald-950 font-semibold';
              letterStyle = 'text-emerald-800 border-r border-emerald-200 bg-emerald-100/60 font-black';
            } else if (isSelected) {
              optionStyle = 'bg-red-50 text-red-950 font-medium line-through';
              letterStyle = 'text-red-800 border-r border-red-200 bg-red-100/60 font-black';
            } else {
              optionStyle = 'bg-white text-slate-400 opacity-60';
              letterStyle = 'text-slate-400 border-r border-slate-200 bg-slate-50/30';
            }
          } else if (isSelected) {
            optionStyle = 'bg-slate-200/90 text-slate-900 font-bold';
            letterStyle = 'text-slate-900 border-r border-slate-300 bg-slate-300/80 font-bold';
          }

          return (
            <button
              key={oIdx}
              type="button"
              disabled={isReviewMode}
              onClick={() => onAnswer(answerKey, opt)}
              className={`w-full text-left flex items-stretch transition-all cursor-pointer ${optionStyle}`}
            >
              {/* Left Column: Option Letter (A, B, C) */}
              <div className={`w-14 sm:w-16 min-h-[52px] sm:min-h-[60px] flex items-center justify-center text-[14px] font-bold shrink-0 ${letterStyle}`}>
                {letter}
              </div>

              {/* Right Column: Option Content Text */}
              <div className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-[14px]">
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Audio Transcript Box in Review / Explanation Mode */}
      {(showExplanation || isReviewMode) && q.transcript && (
        <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-200/80 space-y-2 text-left animate-in fade-in duration-300">
          <div className="text-xs font-extrabold text-[#24085A] uppercase tracking-wider">
            Script
          </div>
          <p className="text-[14px] font-normal text-slate-800 leading-relaxed">
            {q.transcript}
          </p>
        </div>
      )}
    </div>
  );
}
