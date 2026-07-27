'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ReadingPart23View from './ReadingPart23View';

interface QuestionSetData {
  topicTitle: string;
  originalSentences: string[];
}

interface ReadingPart23PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

// Fisher-Yates Shuffle with deterministic seed to keep scrambled order consistent per question set
function shuffleArray(array: string[], seed: number): string[] {
  const shuffled = [...array];
  let m = shuffled.length;
  let t: string;
  let i: number;

  const random = () => {
    const x = Math.sin(seed++) * 10000;
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

  const singleTopicTitle = testQuestionSets[0]?.topicTitle || '';

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 2 + 3 – Text Cohesion"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={singleTopicTitle}
      defaultTimeSeconds={420}
      subQuestionsPerSet={5}
      pointsPerSubQuestion={1}
      isAnswerCorrect={isAnswerCorrect}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const qData = testQuestionSets[currentQuestionIndex];
        if (!qData) return null;

        const scrambled = scrambledSentencesPerQuestion[currentQuestionIndex] || [];
        const baseKey = currentQuestionIndex * 5;

        return (
          <ReadingPart23View
            originalSentences={qData.originalSentences}
            scrambledSentences={scrambled}
            userAnswers={userAnswers}
            baseAnswerKey={baseKey}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => (
        <DetailedAnswersCard
          title="Chi tiết bài làm"
          subtitle="The sentences below make a complete text. Put them in the correct order."
        >
          {testQuestionSets.map((qData, qIdx) => {
            const baseKey = qIdx * 5;
            return (
              <div key={qIdx} className="space-y-4 text-[14px]">
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
                            <div className="flex items-start gap-2 text-[#008080] bg-[#008080]/10 border border-[#008080]/30 p-2.5 rounded-lg font-normal">
                              <span className="text-[#008080] font-bold">✓</span>
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
                              <div className="flex items-start gap-2 text-[#008080] bg-[#008080]/10 border border-[#008080]/30 p-2.5 rounded-lg font-normal">
                                <span className="text-[#008080] font-bold">✓</span>
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
        </DetailedAnswersCard>
      )}
    />
  );
}
