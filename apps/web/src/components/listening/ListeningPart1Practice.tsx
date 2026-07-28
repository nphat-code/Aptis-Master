'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import { shuffleArray } from '@/utils/shuffle';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ListeningPart1View, { Question13Item } from './ListeningPart1View';
import ScriptViewer from './ScriptViewer';

export interface ListeningPart1PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ListeningPart1Practice({
  testIndex = 0,
  onExit,
}: ListeningPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const testKeys = Object.keys(rawListeningTests); // ['test1', 'test2', ..., 'test15']
  const totalSets = testKeys.length || 15;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const rawQuestionsList: Question13Item[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const list: Question13Item[] = rawListeningTests[tKey]?.q1_13 || [];
      return list.map((q) => ({
        ...q,
        options: shuffleArray(q.options || []),
      }));
    });
  }, [rawListeningTests, testKeys]);

  const singleTestQuestions: Question13Item[] = rawQuestionsList[safeTestIndex] || [];
  const allQuestionsFlat: Question13Item[] = useMemo(() => {
    const rawAll = (scrapedData as any).listening?.listening_question1_13;
    if (Array.isArray(rawAll) && rawAll.length > 0) {
      return rawAll.map((q: any) => ({
        ...q,
        options: shuffleArray(q.options || []),
      }));
    }
    return rawQuestionsList.flat();
  }, [rawQuestionsList]);

  const totalQuestionsCount = isAllPractice ? allQuestionsFlat.length : singleTestQuestions.length;

  return (
    <BasePracticeExam
      moduleName="Listening"
      partTitle="Part 1 – Word Recognition"
      testIndex={testIndex}
      totalSets={totalSets}
      defaultTimeSeconds={480} // 8 mins
      subQuestionsPerSet={13}
      customTotalQuestions={totalQuestionsCount}
      pointsPerSubQuestion={2}
      isAnswerCorrect={(idx, val) => {
        const targetQ = isAllPractice ? allQuestionsFlat[idx] : singleTestQuestions[idx];
        return val === targetQ?.correctAnswer;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;

        return (
          <ListeningPart1View
            questions={activeQuestions}
            userAnswers={userAnswers}
            baseAnswerKey={0}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const activeQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;

        return (
          <DetailedAnswersCard title="Chi tiết bài làm">
            <div className="space-y-5 text-left">
              {activeQuestions.map((q, idx) => {
                const userAns = userAnswers[idx] || '';
                const isCorr = userAns === q.correctAnswer;
                const normalizedAudioUrl = q.audioUrl.startsWith('http') || q.audioUrl.startsWith('/')
                  ? q.audioUrl
                  : `/${q.audioUrl}`;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 sm:p-6 border text-left space-y-3.5 transition-all ${
                      isCorr
                        ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                        : 'bg-[#fef2f2] border-[#fecaca]'
                    }`}
                  >
                    {/* Question Header Status: (✓) Câu 1 / (⊗) Câu 2 */}
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
                      <span className={`font-bold text-base ${isCorr ? 'text-emerald-950' : 'text-red-950'}`}>
                        Câu {idx + 1}
                      </span>
                    </div>

                    {/* Question Prompt Text */}
                    <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
                      {q.question}
                    </p>

                    {/* Audio Controls Bar */}
                    <div className="pt-1">
                      <audio
                        controls
                        src={normalizedAudioUrl}
                        className="w-full h-10 rounded-lg outline-none opacity-90"
                        preload="metadata"
                      />
                    </div>

                    {/* Options Grid (A, B, C) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isCorrectOpt = opt === q.correctAnswer;
                        const isUserSelected = userAns === opt;

                        let optBoxStyle = 'bg-white/60 border-slate-200/80 text-slate-600 font-normal';

                        if (isCorrectOpt) {
                          optBoxStyle = 'bg-[#ecfdf5] border-[#a7f3d0] text-slate-900 font-semibold ring-1 ring-[#a7f3d0]';
                        } else if (isUserSelected && !isCorr) {
                          optBoxStyle = 'bg-[#fef2f2] border-[#fecaca] text-red-950 font-medium line-through';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border text-[14px] flex items-center gap-2 ${optBoxStyle}`}
                          >
                            <span className="font-bold">{letter}.</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Script Box */}
                    <ScriptViewer transcript={q.transcript} />
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
