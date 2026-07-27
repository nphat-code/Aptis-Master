'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ListeningPart2View, { ListeningPart2Data } from './ListeningPart2View';

export interface ListeningPart2PracticeProps {
  testIndex: number; // 0-based test index or -1 for Marathon
  onExit: () => void;
}

export default function ListeningPart2Practice({
  testIndex = 0,
  onExit,
}: ListeningPart2PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const testKeys = Object.keys(rawListeningTests); // ['test1', 'test2', ..., 'test15']
  const totalTestSets = testKeys.length || 15;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalTestSets) + totalTestSets) % totalTestSets);

  const rawPart2List: ListeningPart2Data[] = useMemo(() => {
    return testKeys.map((tKey) => {
      const q14 = rawListeningTests[tKey]?.q14 || {};
      return {
        audioUrl: q14.audioUrl || '',
        topic: q14.topic || 'Topic: Matching Information',
        options: q14.options || [],
        correctAnswers: q14.correctAnswers || q14.options?.slice(0, 4) || [],
        transcript: q14.transcript || '',
      };
    });
  }, [rawListeningTests, testKeys]);

  const fullPart2Bank: ListeningPart2Data[] = useMemo(() => {
    const rawBank = (scrapedData as any).listening?.listening_question14;
    if (Array.isArray(rawBank) && rawBank.length > 0) {
      return rawBank.map((q14: any) => ({
        audioUrl: q14.audioUrl || '',
        topic: q14.topic || 'Topic: Matching Information',
        options: q14.options || [],
        correctAnswers: q14.correctAnswers || q14.options?.slice(0, 4) || [],
        transcript: q14.transcript || '',
      }));
    }
    return rawPart2List;
  }, [rawPart2List]);

  const activeBank = isAllPractice ? fullPart2Bank : rawPart2List;
  const totalSetsCount = isAllPractice ? fullPart2Bank.length : totalTestSets;

  const currentData = rawPart2List[safeTestIndex] || {
    audioUrl: '',
    options: [],
  };

  const speakerLabels = ['Speaker A', 'Speaker B', 'Speaker C', 'Speaker D'];

  return (
    <BasePracticeExam
      moduleName="Listening"
      partTitle="Part 2 – Information Matching"
      testIndex={testIndex}
      totalSets={totalSetsCount}
      defaultTimeSeconds={600} // 10 mins as requested
      subQuestionsPerSet={4}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(subIdx, val) => {
        const setIdx = isAllPractice ? Math.floor(subIdx / 4) : safeTestIndex;
        const speakerOffset = subIdx % 4;
        const targetData = activeBank[setIdx] || currentData;
        const correctAnswers = targetData.correctAnswers || targetData.options.slice(0, 4);
        const correctVal = correctAnswers[speakerOffset];
        return val === correctVal;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const activeData = activeBank[activeSetIndex] || currentData;
        const baseKey = isAllPractice ? currentQuestionIndex * 4 : 0;

        return (
          <ListeningPart2View
            data={activeData}
            userAnswers={userAnswers}
            baseAnswerKey={baseKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const activeDataList = isAllPractice ? activeBank : [currentData];
        const instructionText = "Listen to four people and match each person to the correct information.";

        return (
          <DetailedAnswersCard title="Chi tiết bài làm" subtitle={instructionText}>
            <div className="space-y-6 text-left">
              {activeDataList.map((item, setIdx) => {
                const normalizedAudioUrl = item.audioUrl.startsWith('http') || item.audioUrl.startsWith('/')
                  ? item.audioUrl
                  : `/${item.audioUrl}`;
                const baseKey = isAllPractice ? setIdx * 4 : 0;
                const correctAnswersList = item.correctAnswers || item.options.slice(0, 4);

                return (
                  <div key={setIdx} className="space-y-4 text-left">
                    {/* Test set header only when all practice */}
                    {isAllPractice && (
                      <div className="font-bold text-[#24085A] text-[15px] pb-1 border-b border-slate-200">
                        Bộ đề {setIdx + 1}
                      </div>
                    )}

                    {/* Native Audio Player Bar directly below instruction prompt */}
                    <div>
                      <audio
                        controls
                        src={normalizedAudioUrl}
                        className="w-full h-10 rounded-lg outline-none opacity-90"
                        preload="metadata"
                      />
                    </div>

                    {/* Speakers Answer List */}
                    <div className="space-y-3 pt-1">
                      {speakerLabels.map((spkLabel, sIdx) => {
                        const answerKey = baseKey + sIdx;
                        const userAns = userAnswers[answerKey] || '';
                        const correctAns = correctAnswersList[sIdx] || item.options[sIdx] || '';
                        const isCorr = userAns === correctAns;

                        return (
                          <div
                            key={sIdx}
                            className={`p-3.5 rounded-xl border text-[14px] space-y-1.5 text-left ${
                              isCorr
                                ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                                : 'bg-[#fef2f2] border-[#fecaca]'
                            }`}
                          >
                            {/* Speaker Header with Icon: (✓) Speaker A / (✕) Speaker A */}
                            <div className="flex items-center gap-2">
                              {isCorr ? (
                                <div className="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  ✓
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-red-600 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  ✕
                                </div>
                              )}
                              <span className="font-bold text-slate-900">{spkLabel}</span>
                            </div>

                            {/* Options Output Below Speaker Label: Incorrect on top, Correct on bottom */}
                            <div className="pl-7 space-y-1 text-[14px]">
                              {isCorr ? (
                                <div className="text-emerald-900 font-normal">
                                  {userAns}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  {/* Câu sai ở trên */}
                                  <div className="text-red-900 line-through font-normal">
                                    {userAns || '(Chưa chọn)'}
                                  </div>
                                  {/* Câu đúng ở dưới */}
                                  <div className="text-emerald-900 font-normal">
                                    {correctAns}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Script Box */}
                    {item.transcript && (
                      <div className="pt-3 border-t border-slate-200/60 mt-3 space-y-1">
                        <span className="text-[14px] font-bold text-slate-900 block">
                          Script
                        </span>
                        <p className="text-[14px] text-slate-700 font-normal leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                          {item.transcript}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DetailedAnswersCard>
        );
      }}
    />
  );
}
