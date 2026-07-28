'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import { shuffleArray } from '@/utils/shuffle';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ListeningPart4View, { ListeningPart4Monologue } from './ListeningPart4View';
import ScriptViewer from './ScriptViewer';

export interface ListeningPart4PracticeProps {
  testIndex: number; // 0-based test index or -1 for Marathon
  onExit: () => void;
}

export default function ListeningPart4Practice({
  testIndex = 0,
  onExit,
}: ListeningPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const testKeys = Object.keys(rawListeningTests); // ['test1', 'test2', ..., 'test15']
  const totalTestSets = testKeys.length || 15;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalTestSets) + totalTestSets) % totalTestSets);

  // Full question bank for Marathon mode & cross-referencing answers
  const fullPart4Bank: ListeningPart4Monologue[] = useMemo(() => {
    const rawBank = (scrapedData as any).listening?.listening_question16_17;
    if (Array.isArray(rawBank) && rawBank.length > 0) {
      return rawBank.map((mono: any) => ({
        audioUrl: mono.audioUrl || '',
        topic: mono.topic || '',
        questions: (mono.questions || []).map((q: any) => ({
          id: q.id,
          question: q.question,
          options: shuffleArray(q.options || []),
          correctAnswer: q.correctAnswer || '',
        })),
        transcript: mono.transcript || '',
      }));
    }
    return [];
  }, []);

  // Map 15 test sets: each test has q16_17 (array of 2 monologues)
  const rawPart4List: ListeningPart4Monologue[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const q16_17 = rawListeningTests[tKey]?.q16_17 || [];
      return q16_17.map((mono: any) => {
        const matchedBankMono = fullPart4Bank.find(
          (m) =>
            (mono.audioUrl && m.audioUrl === mono.audioUrl) ||
            (mono.topic && m.topic === mono.topic)
        );

        const mergedQuestions = (mono.questions || []).map((q: any, qIdx: number) => {
          const matchedQ = matchedBankMono?.questions[qIdx];
          const rawOpts = q.options || matchedQ?.options || [];
          return {
            id: q.id || matchedQ?.id,
            question: q.question || matchedQ?.question || '',
            options: shuffleArray(rawOpts),
            correctAnswer: q.correctAnswer || matchedQ?.correctAnswer || '',
          };
        });

        return {
          audioUrl: mono.audioUrl || matchedBankMono?.audioUrl || '',
          topic: mono.topic || matchedBankMono?.topic || '',
          questions: mergedQuestions.length > 0 ? mergedQuestions : (matchedBankMono?.questions || []),
          transcript: mono.transcript || matchedBankMono?.transcript || '',
        };
      });
    });
  }, [rawListeningTests, testKeys, fullPart4Bank]);

  const totalSetsCount = isAllPractice ? fullPart4Bank.length : totalTestSets;
  const currentTestMonologues = rawPart4List[safeTestIndex] || [];

  const customQuestionsCount = isAllPractice ? fullPart4Bank.length : 2;

  return (
    <BasePracticeExam
      moduleName="Listening"
      partTitle="Part 4 – Monologues"
      testIndex={testIndex}
      totalSets={totalSetsCount}
      defaultTimeSeconds={720} // 12 mins
      subQuestionsPerSet={2}
      customTotalQuestions={customQuestionsCount}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(subIdx, val) => {
        if (isAllPractice) {
          const monoIdx = Math.floor(subIdx / 2);
          const qOffset = subIdx % 2;
          const mono = fullPart4Bank[monoIdx];
          if (!mono || !mono.questions[qOffset]) return false;
          return val === mono.questions[qOffset].correctAnswer;
        } else {
          const setIdx = safeTestIndex;
          const monologues = rawPart4List[setIdx] || currentTestMonologues;
          const monoIdx = Math.floor(subIdx / 2);
          const qOffset = subIdx % 2;
          const mono = monologues[monoIdx];
          if (!mono || !mono.questions[qOffset]) return false;
          return val === mono.questions[qOffset].correctAnswer;
        }
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeMonologues = isAllPractice
          ? [fullPart4Bank[currentQuestionIndex]].filter(Boolean)
          : [currentTestMonologues[currentQuestionIndex]].filter(Boolean);
        const baseKey = currentQuestionIndex * 2;

        return (
          <ListeningPart4View
            monologues={activeMonologues}
            userAnswers={userAnswers}
            baseAnswerKey={baseKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const activeSets = isAllPractice
          ? fullPart4Bank.map((m) => [m])
          : [currentTestMonologues];

        const instructionText = "Listen to a talk or presentation and answer the questions.";

        return (
          <DetailedAnswersCard title="Chi tiết bài làm" subtitle={instructionText}>
            <div className="space-y-8 text-left">
              {activeSets.map((monoList, setIdx) => {
                const baseKey = isAllPractice ? setIdx * 2 : 0;
                let subQuestionCounter = 0;

                return (
                  <div key={setIdx} className="space-y-6 text-left">
                    {isAllPractice && (
                      <div className="font-bold text-[#24085A] text-[15px] pb-1 border-b border-slate-200">
                        Bài nghe {setIdx + 1}
                      </div>
                    )}

                    {monoList.map((mono, mIdx) => {
                      const normalizedAudioUrl = mono.audioUrl.startsWith('http') || mono.audioUrl.startsWith('/')
                        ? mono.audioUrl
                        : `/${mono.audioUrl}`;

                      return (
                        <div key={mIdx} className="space-y-4">
                          {/* Native Audio Player */}
                          <div>
                            <audio
                              controls
                              src={normalizedAudioUrl}
                              className="w-full h-10 rounded-lg outline-none opacity-90"
                              preload="metadata"
                            />
                          </div>

                          {/* Questions */}
                          <div className="space-y-3 pt-1">
                            {mono.questions.map((qItem, qIdx) => {
                              const answerKey = baseKey + subQuestionCounter;
                              subQuestionCounter += 1;

                              const userAns = userAnswers[answerKey] || '';
                              const correctAns = qItem.correctAnswer || '';
                              const isCorr = userAns === correctAns;

                              return (
                                <div
                                  key={qIdx}
                                  className={`p-3.5 rounded-xl border text-[14px] space-y-1.5 text-left ${
                                    isCorr
                                      ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                                      : 'bg-[#fef2f2] border-[#fecaca]'
                                  }`}
                                >
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
                                    <span className="font-bold text-slate-900">
                                      {qItem.question}
                                    </span>
                                  </div>

                                  <div className="pl-7 space-y-1 text-[14px]">
                                    {isCorr ? (
                                      <div className="text-emerald-900 font-normal">
                                        {userAns}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className="text-red-900 line-through font-normal">
                                          {userAns || '(Chưa chọn)'}
                                        </div>
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

                          {/* Script */}
                          <ScriptViewer transcript={mono.transcript} />
                        </div>
                      );
                    })}
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
