'use client';

import React from 'react';
import AudioPlayer from './AudioPlayer';
import ScriptViewer from './ScriptViewer';

export interface Part4QuestionItem {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ListeningPart4Monologue {
  audioUrl: string;
  topic?: string;
  questions: Part4QuestionItem[];
  transcript?: string;
}

export interface ListeningPart4ViewProps {
  monologues: ListeningPart4Monologue[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, val: any) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export function ListeningPart4View({
  monologues,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ListeningPart4ViewProps) {
  if (!monologues || monologues.length === 0) {
    return <div className="text-slate-500 text-sm">Không có dữ liệu câu hỏi Listening Part 4.</div>;
  }

  const isChecked = isReviewMode || showExplanation;
  const optionLetters = ['A', 'B', 'C', 'D'];

  let globalQuestionCounter = 0;

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto font-sans text-[14px] animate-slide-question">
      {monologues.map((mono, mIdx) => {
        const normalizedAudioUrl = mono.audioUrl.startsWith('http') || mono.audioUrl.startsWith('/')
          ? mono.audioUrl
          : `/${mono.audioUrl}`;

        const formattedTranscript = mono.transcript
          ? mono.transcript
              .replace(/\n{3,}/g, '\n\n')
              .trim()
          : '';

        return (
          <div key={mIdx} className="space-y-6">
            {/* Audio Player */}
            <div>
              <AudioPlayer src={normalizedAudioUrl} />
            </div>

            {/* Monologue Questions */}
            <div className="space-y-6 pt-2">
              {mono.questions.map((qItem, qIdx) => {
                const answerKey = baseAnswerKey + globalQuestionCounter;
                globalQuestionCounter += 1;

                const selectedVal = userAnswers[answerKey] || '';
                const correctVal = qItem.correctAnswer || '';
                const isCorr = selectedVal === correctVal;

                return (
                  <div key={qIdx} className="space-y-3">
                    {/* Question Text */}
                    <div className="text-[14px]">
                      <p className="text-[14px] font-medium text-slate-900 leading-snug">
                        {qItem.question.replace(/^(\d+\.\d+|\d+[\.\)])\s*/, '')}
                      </p>
                    </div>

                    {/* Options Card List */}
                    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-200/80">
                      {qItem.options.map((opt, oIdx) => {
                        const letter = optionLetters[oIdx] || String.fromCharCode(65 + oIdx);
                        const isSelected = selectedVal === opt;
                        const isAnsCorrect = opt === correctVal;

                        let optionStyle = 'bg-white hover:bg-slate-50 text-slate-800';
                        let letterStyle = 'text-slate-900 border-r border-slate-200/80 bg-slate-50/50';

                        if (isChecked) {
                          if (isAnsCorrect) {
                            optionStyle = 'bg-[#ecfdf5] text-emerald-950 font-normal';
                            letterStyle = 'text-emerald-800 border-r border-emerald-300 bg-emerald-100/60 font-bold';
                          } else if (isSelected) {
                            optionStyle = 'bg-[#fef2f2] text-red-950 font-normal line-through';
                            letterStyle = 'text-red-800 border-r border-red-300 bg-red-100/60 font-bold';
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
                            <div className={`w-12 sm:w-14 min-h-[44px] flex items-center justify-center text-[14px] font-bold shrink-0 ${letterStyle}`}>
                              {letter}
                            </div>
                            <div className="flex-1 px-4 py-2.5 flex items-center justify-between gap-3 text-[14px]">
                              <span>{opt}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Script Box */}
            {isChecked && (
              <ScriptViewer transcript={formattedTranscript} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListeningPart4View;
