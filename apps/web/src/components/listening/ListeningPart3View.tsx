'use client';

import React from 'react';
import AudioPlayer from './AudioPlayer';
import ScriptViewer from './ScriptViewer';

export interface ListeningPart3Data {
  audioUrl: string;
  topic?: string;
  description?: string;
  questions: string[];
  correctAnswer?: string[];
  transcript?: string;
}

export interface ListeningPart3ViewProps {
  data: ListeningPart3Data;
  userAnswers: Record<number, any>;
  baseAnswerKey: number;
  onAnswer: (subIdx: number, val: any) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function ListeningPart3View({
  data,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ListeningPart3ViewProps) {
  const normalizedAudioUrl = data.audioUrl.startsWith('http') || data.audioUrl.startsWith('/')
    ? data.audioUrl
    : `/${data.audioUrl}`;

  const isChecked = isReviewMode || showExplanation;
  const correctAnswersList = data.correctAnswer || [];

  const formattedTranscript = data.transcript
    ? data.transcript
        .replace(/^W:\s*/gm, 'Woman: ')
        .replace(/^M:\s*/gm, 'Man: ')
        .replace(/\n(?=Woman:|Man:|W:|M:)/g, '\n\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
    : '';

  const optionsList = ['Man', 'Woman', 'Both'];

  const fullDesc = data.description || "Listen to the conversation. Read the statements and decide whose opinion matches the best: the man's, the woman's or both.";
  const topText = fullDesc.replace(/Who expresses which opinion\?*/gi, '').trim();
  const bottomText = "Who expresses which opinion?";

  return (
    <div className="space-y-4 text-left max-w-4xl mx-auto font-sans text-[14px]">
      {/* Description Prompt Above Audio Player */}
      <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
        {topText}
      </p>

      {/* Audio Player Button (Identical to Part 1 & Part 2) */}
      <div className="pt-1">
        <AudioPlayer src={normalizedAudioUrl} />
      </div>

      {/* Sub-prompt Below Audio Player */}
      <p className="text-[14px] font-normal text-slate-700 pt-1">
        {bottomText}
      </p>

      {/* 4 Statements / Questions */}
      <div className="space-y-3.5 pt-1">
        {data.questions.map((qText, qIdx) => {
          const answerKey = baseAnswerKey + qIdx;
          const selectedVal = userAnswers[answerKey] || '';
          const correctVal = correctAnswersList[qIdx] || '';
          const isCorr = selectedVal === correctVal;
          const cleanQText = qText.replace(/^\d+\.\s*/, '');

          return (
            <div key={qIdx} className="space-y-1">
              {/* Question Statement + Inline Option Select Box directly after text */}
              <div className="flex flex-wrap items-center gap-2 text-[14px]">
                <span className="font-normal text-[#24085A] text-[14px] shrink-0">{qIdx + 1}.</span>
                <span className="text-[14px] font-normal text-slate-800 leading-normal">
                  {cleanQText}
                </span>

                {/* Option Select Box on the left directly after question text */}
                <select
                  disabled={isReviewMode}
                  value={selectedVal}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  className={`px-2.5 py-1 text-[14px] appearance-auto rounded-lg transition-all font-normal cursor-pointer shrink-0 min-w-[95px] disabled:opacity-100 ${
                    isChecked
                      ? isCorr
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedVal
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border border-slate-300 bg-slate-50 text-slate-600 disabled:bg-slate-50'
                      : 'bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-400 hover:border-slate-400'
                  }`}
                >
                  <option value="" disabled hidden></option>
                  {(optionsList || []).filter((opt) => opt && opt.trim() !== '').map((opt, oIdx) => (
                    <option key={oIdx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inline Answer Display for Review/Explanation */}
              {isChecked && (
                <div className="pl-3 pt-0.5 flex items-center gap-2 text-[14px]">
                  {isCorr ? (
                    <span className="text-emerald-700 text-[14px] font-normal">
                      ✓ {selectedVal}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[14px] font-normal flex-wrap">
                      <span className="text-red-600 line-through">
                        {selectedVal || '(trống)'}
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-emerald-700">
                        {correctVal}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Script Box */}
      {(showExplanation || isReviewMode) && (
        <ScriptViewer transcript={formattedTranscript} />
      )}
    </div>
  );
}

export default ListeningPart3View;
