'use client';

import React, { useState } from 'react';
import QuestionInstructionHeader from '../exam/QuestionInstructionHeader';

export interface ReadingPart23ViewProps {
  originalSentences: string[];
  scrambledSentences: string[];
  userAnswers: Record<number, any>;
  baseAnswerKey?: number;
  onAnswer: (key: number, value: string) => void;
  isReviewMode?: boolean;
  showExplanation?: boolean;
}

export default function ReadingPart23View({
  originalSentences,
  scrambledSentences,
  userAnswers,
  baseAnswerKey = 0,
  onAnswer,
  isReviewMode = false,
  showExplanation = false,
}: ReadingPart23ViewProps) {
  const [draggedItem, setDraggedItem] = useState<{ text: string; sourceSlot?: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [isOverRightArea, setIsOverRightArea] = useState(false);

  const currentOrdered = [0, 1, 2, 3, 4].map((pos) => userAnswers[baseAnswerKey + pos] || '');
  const unplaced = scrambledSentences.filter((s) => !currentOrdered.includes(s));

  const placeSentence = (slotIdx: number, sentenceText: string) => {
    if (isReviewMode) return;
    const existingPos = currentOrdered.indexOf(sentenceText);
    if (existingPos !== -1 && existingPos !== slotIdx) {
      const currentValAtSlot = userAnswers[baseAnswerKey + slotIdx] || '';
      onAnswer(baseAnswerKey + existingPos, currentValAtSlot);
    }
    onAnswer(baseAnswerKey + slotIdx, sentenceText);
  };

  const unplaceSentence = (slotIdx: number) => {
    if (isReviewMode) return;
    onAnswer(baseAnswerKey + slotIdx, '');
  };

  const autoPlaceSentence = (sentenceText: string) => {
    if (isReviewMode) return;
    const firstEmptyIdx = currentOrdered.findIndex((val) => !val);
    if (firstEmptyIdx !== -1) {
      onAnswer(baseAnswerKey + firstEmptyIdx, sentenceText);
    }
  };

  return (
    <>
      <QuestionInstructionHeader>
        The sentences below make a complete text. Put them in the correct order.
      </QuestionInstructionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {/* Left Column: Target Slots */}
        <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-3.5">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const answerKey = baseAnswerKey + slotIdx;
            const placedText = userAnswers[answerKey] || '';
            const isCorrect = placedText === originalSentences[slotIdx];
            const isChecked = isReviewMode || showExplanation;
            const isOver = dragOverSlot === slotIdx;

            return (
              <div key={slotIdx} className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-slate-600 min-w-[16px] text-right">
                  {slotIdx + 1}.
                </span>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isReviewMode) setDragOverSlot(slotIdx);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    if (draggedItem && !isReviewMode) {
                      placeSentence(slotIdx, draggedItem.text);
                      setDraggedItem(null);
                    }
                  }}
                  className={`flex-1 min-h-[48px] rounded-lg transition-all border ${
                    isChecked
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 p-3'
                        : placedText
                        ? 'bg-red-50 border-red-300 text-red-950 p-3'
                        : 'bg-slate-50 border-slate-300 text-slate-600 p-3'
                      : isOver
                      ? 'bg-amber-50 border-2 border-[#CC1C01] p-3'
                      : placedText
                      ? 'bg-white border border-slate-300 text-slate-900 p-3 shadow-2xs'
                      : 'bg-slate-50 border border-dashed border-slate-300 text-slate-400 p-3'
                  }`}
                >
                  {placedText ? (
                    <div
                      draggable={!isReviewMode}
                      onDragStart={() => setDraggedItem({ text: placedText, sourceSlot: slotIdx })}
                      onDragEnd={() => setDraggedItem(null)}
                      onClick={() => !isReviewMode && unplaceSentence(slotIdx)}
                      className="text-[14px] font-normal leading-relaxed text-slate-800 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2"
                    >
                      <span>{placedText}</span>
                      {isChecked && (
                        <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isCorrect ? '✓' : '✕'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center text-[14px] text-slate-400 italic select-none">
                      {/* Empty slot */}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sentence Pool */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isReviewMode) setIsOverRightArea(true);
          }}
          onDragLeave={() => setIsOverRightArea(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOverRightArea(false);
            if (draggedItem && draggedItem.sourceSlot !== undefined && !isReviewMode) {
              unplaceSentence(draggedItem.sourceSlot);
              setDraggedItem(null);
            }
          }}
          className={`bg-[#ECEEF2] rounded-xl border border-slate-300 p-4 space-y-3 min-h-[300px] transition-all ${
            isOverRightArea ? 'border-[#CC1C01] bg-[#E2E5EC]' : ''
          }`}
        >
          {unplaced.length === 0 ? (
            <div className="h-full min-h-[260px] flex items-center justify-center text-slate-500 text-[14px] italic">
              Đã xếp tất cả các câu vào vị trí.
            </div>
          ) : (
            unplaced.map((sentenceText, sIdx) => (
              <div
                key={sIdx}
                draggable={!isReviewMode}
                onDragStart={() => setDraggedItem({ text: sentenceText })}
                onDragEnd={() => setDraggedItem(null)}
                onClick={() => autoPlaceSentence(sentenceText)}
                className={`bg-white rounded-lg p-3 border border-slate-300 text-[14px] text-slate-800 font-normal leading-relaxed transition-all shadow-2xs ${
                  isReviewMode
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                {sentenceText}
              </div>
            ))
          )}
        </div>
      </div>

      {showExplanation && (
        <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 text-left text-[14px]">
          <h3 className="text-[16px] font-bold text-slate-900">
            Đáp án
          </h3>
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
            {originalSentences.map((sentence, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-800 text-[14px] leading-relaxed">
                <span className="text-slate-500 font-medium">{idx + 1}.</span>
                <p className="font-normal text-slate-800">{sentence}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
