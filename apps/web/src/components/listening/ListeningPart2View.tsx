'use client';

import React from 'react';
import AudioPlayer from './AudioPlayer';
import ScriptViewer from './ScriptViewer';

export interface ListeningPart2Data {
  audioUrl: string;
  topic?: string;
  options: string[];
  correctAnswers?: string[];
  transcript?: string;
}

export interface ListeningPart2ViewProps {
  data: ListeningPart2Data;
  userAnswers: Record<number, any>;
  baseAnswerKey: number;
  onAnswer: (subIdx: number, val: any) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function ListeningPart2View({
  data,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ListeningPart2ViewProps) {
  const speakers = [
    { label: 'Speaker A ...', keyOffset: 0 },
    { label: 'Speaker B ...', keyOffset: 1 },
    { label: 'Speaker C ...', keyOffset: 2 },
    { label: 'Speaker D ...', keyOffset: 3 },
  ];

  const normalizedAudioUrl = data.audioUrl.startsWith('http') || data.audioUrl.startsWith('/')
    ? data.audioUrl
    : `/${data.audioUrl}`;

  const isChecked = isReviewMode || showExplanation;
  const correctAnswersList = data.correctAnswers || data.options.slice(0, 4);

  return (
    <div className="space-y-4 text-left max-w-4xl mx-auto font-sans text-[14px]">
      {/* Instruction Prompt */}
      <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
        Listen to four people and match each person to the correct information.
      </p>

      {/* Audio Player Button (Identical to Part 1) */}
      <div className="pt-1">
        <AudioPlayer src={normalizedAudioUrl} />
      </div>

      {/* 4 Speakers List: Speaker A ... Option on the right */}
      <div className="space-y-3 pt-1">
        {speakers.map((spk, sIdx) => {
          const answerKey = baseAnswerKey + spk.keyOffset;
          const selectedVal = userAnswers[answerKey] || '';
          const correctVal = correctAnswersList[spk.keyOffset] || data.options[spk.keyOffset] || '';
          const isCorr = selectedVal === correctVal;

          return (
            <div key={sIdx} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                {/* Speaker Label */}
                <span className="text-[14px] font-medium text-slate-800 w-28 shrink-0">
                  {spk.label}
                </span>

                {/* Option Select Box on the Right */}
                <select
                  disabled={isReviewMode}
                  value={selectedVal}
                  onChange={(e) => onAnswer(answerKey, e.target.value)}
                  className={`w-full sm:flex-1 px-3 py-2 text-[14px] appearance-auto rounded-lg transition-all font-normal cursor-pointer disabled:opacity-100 ${
                    isChecked
                      ? isCorr
                        ? 'border-2 border-emerald-500 bg-[#ecfdf5] text-emerald-800 disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500'
                        : selectedVal
                        ? 'border-2 border-red-400 bg-[#fef2f2] text-red-700 disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400'
                        : 'border border-slate-300 bg-slate-50 text-slate-600 disabled:bg-slate-50'
                      : 'bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-400 hover:border-slate-400'
                  }`}
                >
                  <option value=""></option>
                  {data.options.map((opt, oIdx) => (
                    <option key={oIdx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Inline Answer Display for Review/Explanation */}
              {isChecked && (
                <div className="sm:pl-[104px] pt-0.5 flex items-center gap-2 text-[14px]">
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
        <ScriptViewer transcript={data.transcript} />
      )}
    </div>
  );
}

export default ListeningPart2View;
