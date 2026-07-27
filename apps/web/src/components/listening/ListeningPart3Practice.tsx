'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ListeningPart3View, { ListeningPart3Data } from './ListeningPart3View';

export interface ListeningPart3PracticeProps {
  testIndex: number; // 0-based test index or -1 for Marathon
  onExit: () => void;
}

export default function ListeningPart3Practice({
  testIndex = 0,
  onExit,
}: ListeningPart3PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const testKeys = Object.keys(rawListeningTests); // ['test1', 'test2', ..., 'test15']
  const totalTestSets = testKeys.length || 15;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalTestSets) + totalTestSets) % totalTestSets);

  const rawPart3List: ListeningPart3Data[] = useMemo(() => {
    return testKeys.map((tKey) => {
      const q15 = rawListeningTests[tKey]?.q15 || {};
      return {
        audioUrl: q15.audioUrl || '',
        topic: q15.topic || 'Topic: Short Conversations',
        description: q15.description || '',
        questions: q15.questions || [],
        correctAnswer: q15.correctAnswer || [],
        transcript: q15.transcript || '',
      };
    });
  }, [rawListeningTests, testKeys]);

  const fullPart3Bank: ListeningPart3Data[] = useMemo(() => {
    const rawBank = (scrapedData as any).listening?.listening_question15;
    if (Array.isArray(rawBank) && rawBank.length > 0) {
      return rawBank.map((q15: any) => ({
        audioUrl: q15.audioUrl || '',
        topic: q15.topic || 'Topic: Short Conversations',
        description: q15.description || '',
        questions: q15.questions || [],
        correctAnswer: q15.correctAnswer || [],
        transcript: q15.transcript || '',
      }));
    }
    return rawPart3List;
  }, [rawPart3List]);

  const activeBank = isAllPractice ? fullPart3Bank : rawPart3List;
  const totalSetsCount = isAllPractice ? fullPart3Bank.length : totalTestSets;

  const currentData = rawPart3List[safeTestIndex] || {
    audioUrl: '',
    questions: [],
  };

  return (
    <BasePracticeExam
      moduleName="Listening"
      partTitle="Part 3 – Short Conversations"
      testIndex={testIndex}
      totalSets={totalSetsCount}
      defaultTimeSeconds={600} // 10 mins as requested
      subQuestionsPerSet={4}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(subIdx, val) => {
        const setIdx = isAllPractice ? Math.floor(subIdx / 4) : safeTestIndex;
        const qOffset = subIdx % 4;
        const targetData = activeBank[setIdx] || currentData;
        const correctAnswers = targetData.correctAnswer || [];
        const correctVal = correctAnswers[qOffset];
        return val === correctVal;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const activeData = activeBank[activeSetIndex] || currentData;
        const baseKey = isAllPractice ? currentQuestionIndex * 4 : 0;

        return (
          <ListeningPart3View
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
        const firstItem = activeDataList[0] || {};
        const fullDesc = firstItem.description || "Listen to the conversation. Read the statements and decide whose opinion matches the best: the man's, the woman's or both.";
        const topText = fullDesc.replace(/Who expresses which opinion\?*/gi, '').trim();

        return (
          <DetailedAnswersCard title="Chi tiết bài làm" subtitle={topText}>
            <div className="space-y-6 text-left">
              {activeDataList.map((item, setIdx) => {
                const normalizedAudioUrl = item.audioUrl.startsWith('http') || item.audioUrl.startsWith('/')
                  ? item.audioUrl
                  : `/${item.audioUrl}`;
                const baseKey = isAllPractice ? setIdx * 4 : 0;
                const correctAnswersList = item.correctAnswer || [];
                const formattedTranscript = item.transcript
                  ? item.transcript
                      .replace(/^W:\s*/gm, 'Woman: ')
                      .replace(/^M:\s*/gm, 'Man: ')
                      .replace(/\n(?=Woman:|Man:|W:|M:)/g, '\n\n')
                      .replace(/\n{3,}/g, '\n\n')
                      .trim()
                  : '';

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

                    {/* Sub-prompt Below Audio Bar */}
                    <p className="text-[14px] font-normal text-slate-700 pt-0.5">
                      Who expresses which opinion?
                    </p>

                    {/* 4 Statement Cards */}
                    <div className="space-y-3 pt-1">
                      {item.questions.map((qText, qIdx) => {
                        const answerKey = baseKey + qIdx;
                        const userAns = userAnswers[answerKey] || '';
                        const correctAns = correctAnswersList[qIdx] || '';
                        const isCorr = userAns === correctAns;
                        const cleanQText = qText.replace(/^\d+\.\s*/, '');

                        return (
                          <div
                            key={qIdx}
                            className={`p-3.5 rounded-xl border text-[14px] space-y-1.5 text-left ${
                              isCorr
                                ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                                : 'bg-[#fef2f2] border-[#fecaca]'
                            }`}
                          >
                            {/* Question Statement Header with Icon */}
                            <div className="flex items-start gap-2">
                              {isCorr ? (
                                <div className="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  ✓
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-red-600 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  ✕
                                </div>
                              )}
                              <span className="font-normal text-slate-900">
                                {qIdx + 1}. {cleanQText}
                              </span>
                            </div>

                            {/* Options Output Below Statement */}
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
                    {formattedTranscript && (
                      <div className="pt-3 border-t border-slate-200/60 mt-3 space-y-1">
                        <span className="text-[14px] font-bold text-slate-900 block">
                          Script
                        </span>
                        <p className="text-[14px] text-slate-700 font-normal leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                          {formattedTranscript}
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
