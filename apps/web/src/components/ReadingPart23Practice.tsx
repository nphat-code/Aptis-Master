'use client';

import React, { useState, useMemo } from 'react';
import scrapedData from '../../../../scraped_data.json';
import ExamPracticeLayout from './exam/ExamPracticeLayout';

interface ReadingPart23PracticeProps {
  testIndex: number; // 0-based index for tests (-1 for all practice / marathon)
  onExit: () => void;
}

interface QuestionSetData {
  topicTitle: string;
  originalSentences: string[];
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length;
  let t: T;
  let i: number;

  let s = seed;
  const random = () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  while (m) {
    i = Math.floor(random() * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }

  let isSame = true;
  for (let idx = 0; idx < array.length; idx++) {
    if (shuffled[idx] !== array[idx]) {
      isSame = false;
      break;
    }
  }

  if (isSame && shuffled.length > 1) {
    const temp = shuffled[0];
    shuffled[0] = shuffled[1];
    shuffled[1] = temp;
  }

  return shuffled;
}

export default function ReadingPart23Practice({
  testIndex = 0,
  onExit,
}: ReadingPart23PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawQuestionSets: string[][] = scrapedData?.reading?.question2?.questionSets || [];
  const rawHeaders: Record<string, string> = scrapedData?.reading?.question2?.questheader1 || {};

  const totalSets = rawQuestionSets.length;
  
  const testQuestionSets: QuestionSetData[] = useMemo(() => {
    if (isAllPractice) {
      return rawQuestionSets.map((sentences, idx) => ({
        topicTitle: rawHeaders[`question2Content_${idx + 1}`] || `Chủ đề ${idx + 1}`,
        originalSentences: sentences,
      }));
    }

    const setIdx = ((testIndex % totalSets) + totalSets) % totalSets;
    const topicTitle = rawHeaders[`question2Content_${setIdx + 1}`] || `Chủ đề ${setIdx + 1}`;

    return [
      {
        topicTitle,
        originalSentences: rawQuestionSets[setIdx] || [],
      },
    ];
  }, [isAllPractice, testIndex, totalSets, rawQuestionSets, rawHeaders]);

  const totalQuestions = isAllPractice ? totalSets : 1;
  const totalSubQuestions = totalQuestions * 5;
  const maxScore = isAllPractice ? totalSubQuestions : 5;
  const timeAllowedSeconds = isAllPractice ? 999999 : 420;

  const scrambledSentencesPerQuestion = useMemo(() => {
    return testQuestionSets.map((q, qIdx) => {
      const seed = (testIndex + 1) * 100 + qIdx + 1;
      return shuffleArray(q.originalSentences, seed);
    });
  }, [testQuestionSets, testIndex]);

  const isAnswerCorrect = (answerKey: number, val: any) => {
    const qIdx = Math.floor(answerKey / 5);
    const posIdx = answerKey % 5;
    const targetSet = testQuestionSets[qIdx];
    if (!targetSet) return false;
    return val === targetSet.originalSentences[posIdx];
  };

  const testNumberStr = (testIndex + 1) < 10 ? `0${testIndex + 1}` : `${testIndex + 1}`;
  const singleTopicTitle = testQuestionSets[0]?.topicTitle || '';
  const partTitle = 'Part 2 + 3 – Text Cohesion';
  const testTitle = isAllPractice
    ? `Tất cả ${totalSets} bài đọc Part 2+3`
    : `Đề ${testNumberStr}${singleTopicTitle ? ` - ${singleTopicTitle}` : ''}`;

  // Drag state for HTML5 drag and drop
  const [draggedItem, setDraggedItem] = useState<{ text: string; sourceSlot?: number } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [isOverRightArea, setIsOverRightArea] = useState(false);

  return (
    <ExamPracticeLayout
      moduleName="Reading"
      partTitle={partTitle}
      testTitle={testTitle}
      totalQuestions={totalQuestions}
      timeAllowedSeconds={timeAllowedSeconds}
      maxScore={maxScore}
      customTotalSubQuestions={totalSubQuestions}
      isAnswerCorrect={isAnswerCorrect}
      initialStep={isAllPractice ? 'questions' : 'instructions'}
      unlimitedTime={isAllPractice}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const qData = testQuestionSets[currentQuestionIndex];
        if (!qData) return null;

        const scrambled = scrambledSentencesPerQuestion[currentQuestionIndex] || [];
        const baseKey = currentQuestionIndex * 5;

        // Current assigned sentences for slots 0..4
        const currentOrderedSentences = [0, 1, 2, 3, 4].map(
          (pos) => userAnswers[baseKey + pos] || ''
        );

        // Unplaced sentences for right column
        const unplacedSentences = scrambled.filter(
          (sentence) => !currentOrderedSentences.includes(sentence)
        );

        // Place sentence in slot
        const placeSentenceInSlot = (slotIdx: number, sentenceText: string) => {
          if (isReviewMode) return;
          const existingPos = currentOrderedSentences.indexOf(sentenceText);
          if (existingPos !== -1 && existingPos !== slotIdx) {
            const currentValAtSlot = userAnswers[baseKey + slotIdx] || '';
            onAnswer(baseKey + existingPos, currentValAtSlot);
          }
          onAnswer(baseKey + slotIdx, sentenceText);
        };

        // Unplace sentence from left slot back to right pool
        const unplaceSentenceFromSlot = (fromSlotIdx: number) => {
          if (isReviewMode) return;
          onAnswer(baseKey + fromSlotIdx, '');
        };

        // Click on unplaced sentence -> auto-place into first empty slot
        const handleAutoPlace = (sentenceText: string) => {
          if (isReviewMode) return;
          const firstEmptyIdx = currentOrderedSentences.findIndex((val) => !val);
          if (firstEmptyIdx !== -1) {
            onAnswer(baseKey + firstEmptyIdx, sentenceText);
          }
        };

        return (
          <div className="space-y-5 text-left text-[14px]">
            {/* Instruction */}
            <div>
              <p className="text-[14px] font-bold text-slate-900 leading-snug">
                The sentences below make a complete text. Put them in the correct order.
              </p>
            </div>

            {/* 2-Column Minimalist Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column: Entire ordering area inside ONE SINGLE FRAME */}
              <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-3.5">
                {[0, 1, 2, 3, 4].map((slotIdx) => {
                  const answerKey = baseKey + slotIdx;
                  const placedText = userAnswers[answerKey] || '';
                  const isCorrect = isAnswerCorrect(answerKey, placedText);
                  const isChecked = isReviewMode || showExplanation;
                  const isOver = dragOverSlot === slotIdx;

                  return (
                    <div key={slotIdx} className="flex items-center gap-3">
                      {/* Simple plain number */}
                      <span className="text-[14px] font-bold text-slate-600 min-w-[16px] text-right">
                        {slotIdx + 1}.
                      </span>

                      {/* Drop Slot Container */}
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
                            placeSentenceInSlot(slotIdx, draggedItem.text);
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
                            onClick={() => !isReviewMode && unplaceSentenceFromSlot(slotIdx)}
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
                            {/* Empty slot space */}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Unordered sentences with DARK GRAY BACKGROUND */}
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
                    unplaceSentenceFromSlot(draggedItem.sourceSlot);
                    setDraggedItem(null);
                  }
                }}
                className={`bg-[#ECEEF2] rounded-xl border border-slate-300 p-4 space-y-3 min-h-[300px] transition-all ${
                  isOverRightArea ? 'border-[#CC1C01] bg-[#E2E5EC]' : ''
                }`}
              >
                {unplacedSentences.length === 0 ? (
                  <div className="h-full min-h-[260px] flex items-center justify-center text-slate-500 text-[14px] italic">
                    Đã xếp tất cả các câu vào vị trí.
                  </div>
                ) : (
                  unplacedSentences.map((sentenceText, idx) => (
                    <div
                      key={idx}
                      draggable={!isReviewMode}
                      onDragStart={() => setDraggedItem({ text: sentenceText })}
                      onDragEnd={() => setDraggedItem(null)}
                      onClick={() => handleAutoPlace(sentenceText)}
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

            {/* Answer Section for Review Mode */}
            {showExplanation && (
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 text-left text-[14px]">
                <h3 className="text-[16px] font-bold text-slate-900">
                  Đáp án
                </h3>

                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
                  {qData.originalSentences.map((sentence, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800 text-[14px] leading-relaxed">
                      <span className="text-slate-500 font-medium">{idx + 1}.</span>
                      <p className="font-normal text-slate-800">{sentence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => (
        /* Card 2: Chi tiết bài làm Card on Results Page */
        <div className="bg-[#F0EFEE] rounded-3xl p-6 sm:p-8 text-left space-y-5 border border-slate-200/70 shadow-sm text-[14px]">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Chi tiết bài làm
            </h3>
            <p className="text-xs italic text-slate-500 font-normal">
              The sentences below make a complete text. Put them in the correct order.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {testQuestionSets.map((qData, qIdx) => {
              const baseKey = qIdx * 5;
              return (
                <div key={qIdx} className="space-y-4">
                  {/* 5 Slot Answer Check */}
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3, 4].map((posIdx) => {
                      const answerKey = baseKey + posIdx;
                      const userAns = userAnswers[answerKey] || '';
                      const correctAns = qData.originalSentences[posIdx];
                      const isCorr = userAns === correctAns;

                      return (
                        <div key={posIdx} className="flex items-start gap-2">
                          <span className="text-slate-500 font-bold min-w-[20px] pt-1">{posIdx + 1}.</span>
                          
                          <div className="flex-1 space-y-1.5">
                            {isCorr ? (
                              <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300/80 p-2.5 rounded-lg font-normal">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{userAns}</span>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {/* Incorrect User Choice */}
                                <div className="flex items-start gap-2 text-red-800 bg-red-50 border border-red-300/80 p-2.5 rounded-lg font-normal">
                                  <span className="text-red-600 font-bold">✕</span>
                                  <span className="line-through">{userAns || '(Chưa chọn)'}</span>
                                </div>
                                {/* Correct Choice */}
                                <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300/80 p-2.5 rounded-lg font-normal">
                                  <span className="text-emerald-600 font-bold">✓</span>
                                  <span>{correctAns}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Đoạn văn hoàn chỉnh */}
                  <div className="pt-3 border-t border-slate-300/60 space-y-2">
                    <h4 className="text-[15px] font-bold text-slate-900">
                      Đoạn văn hoàn chỉnh:
                    </h4>
                    <div className="text-slate-800 space-y-1.5 text-[14px] leading-relaxed italic">
                      {qData.originalSentences.map((s, idx) => (
                        <p key={idx}>{idx + 1}. {s}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
