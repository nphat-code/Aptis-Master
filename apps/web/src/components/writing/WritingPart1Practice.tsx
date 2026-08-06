'use client';

import React, { useMemo, useState, useEffect } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart1View, { WritingPart1Item, countWords } from './WritingPart1View';
import WritingAiFeedbackCard from './WritingAiFeedbackCard';
import { WritingAiFeedbackResponse } from '@/app/api/writing/evaluate/route';

export interface WritingPart1PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingResultsViewProps {
  userAnswers: Record<number, any>;
  targetQuestions: WritingPart1Item[];
  clubName: string;
  onAiEvaluated?: (score: number | undefined, cefrLevel: string | undefined) => void;
}

function WritingResultsView({
  userAnswers,
  targetQuestions,
  clubName,
  onAiEvaluated,
}: WritingResultsViewProps) {
  const [aiFeedback, setAiFeedback] = useState<WritingAiFeedbackResponse | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const runAiEvaluation = async () => {
    setIsAiAnalyzing(true);
    setAiFeedback(null);
    if (onAiEvaluated) {
      onAiEvaluated(undefined, undefined);
    }

    try {
      const payloadQuestions = targetQuestions.map((q, idx) => ({
        id: idx + 1,
        questionText: q.questionText,
        userAnswer: userAnswers[idx] || '',
      }));

      const res = await fetch('/api/writing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId: 'part1',
          clubName,
          questions: payloadQuestions,
        }),
      });

      if (!res.ok) throw new Error('API evaluation request failed');
      const data: WritingAiFeedbackResponse = await res.json();
      setAiFeedback(data);
      if (onAiEvaluated) {
        onAiEvaluated(data.score, data.cefrLevel);
      }
    } catch (err) {
      console.error('AI Evaluation error:', err);
    } finally {
      setIsAiAnalyzing(false);
      setHasEvaluated(true);
    }
  };

  useEffect(() => {
    if (!hasEvaluated && !isAiAnalyzing) {
      runAiEvaluation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanClub = (clubName || 'club').trim().toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an '))
    ? cleanClub
    : /^[aeiou]/i.test(cleanClub)
    ? `an ${cleanClub}`
    : `a ${cleanClub}`;

  const instructionSubtitle = `You want to join ${clubText}. You have 5 messages from a member of the club. Write short answers (1–5 words) to each message. Recommended time: 3 minutes.`;

  if (!aiFeedback) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* AI Evaluation Card */}
      <WritingAiFeedbackCard
        feedback={aiFeedback}
        onReEvaluate={runAiEvaluation}
      />

      {/* Standard Answer Details Card */}
      <DetailedAnswersCard
        title="Chi tiết bài làm"
        subtitle={instructionSubtitle}
      >
        <div className="space-y-4 text-left">
          {targetQuestions.map((q, idx) => {
            const userAns = userAnswers[idx] || '';
            const wc = countWords(userAns);
            const isValid = wc >= 1 && wc <= 5;

            return (
              <div
                key={idx}
                className="text-left space-y-2.5 pb-4 border-b border-slate-200/60 last:border-b-0 last:pb-0"
              >
                {/* Question prompt */}
                <p className="font-normal text-slate-900 leading-relaxed text-[14px]">
                  {q.questionText}
                </p>

                {/* User Answer */}
                <div className="space-y-1 text-[14px]">
                  <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
                  <p className={`font-normal p-3 rounded-xl border text-[14px] ${
                    userAns
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-red-50/60 border-red-200 text-red-700'
                  }`}>
                    {userAns || <span className="italic text-slate-400">(Bỏ trống)</span>}
                  </p>
                </div>

                {/* Model Sample Answer */}
                {q.sampleAnswer && (
                  <div className="text-[14px]">
                    <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                      <span className="text-xs font-bold text-emerald-800 block">💡 Bài viết mẫu</span>
                      <p className="font-normal text-emerald-950">{q.sampleAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DetailedAnswersCard>
    </div>
  );
}

export default function WritingPart1Practice({
  testIndex = 0,
  onExit,
}: WritingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const [aiScore, setAiScore] = useState<number | undefined>(undefined);
  const [aiCefrLevel, setAiCefrLevel] = useState<string | undefined>(undefined);

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  // Transform scrapedData writing questions1 into structured WritingPart1Item lists
  const allTestQuestions: WritingPart1Item[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      const qObj = testObj.questions1 || {};
      const aObj = testObj.questions1_answer || {};

      return [1, 2, 3, 4, 5].map((num) => {
        const qKey = `question1_${num}`;
        const aKey = `question1_${num}_answer`;
        return {
          id: `${tKey}_q1_${num}`,
          questionNum: num,
          questionText: qObj[qKey] || `Question ${num}`,
          sampleAnswer: aObj[aKey] || '',
        };
      });
    });
  }, [rawWritingTests, testKeys]);

  const singleTestQuestions = allTestQuestions[safeTestIndex] || [];
  const allQuestionsFlat = useMemo(() => allTestQuestions.flat(), [allTestQuestions]);

  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 1 – Short answers"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={180} // 3 mins for Writing Part 1
      subQuestionsPerSet={5}
      pointsPerSubQuestion={6} // Total max score 30
      customScore={aiScore}
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        return wc >= 1 && wc <= 5;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const currentQuestions = allTestQuestions[activeIdx] || allTestQuestions[0] || [];
        const baseAnswerKey = isAllPractice ? currentQuestionIndex * 5 : 0;
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        return (
          <WritingPart1View
            questions={currentQuestions}
            userAnswers={userAnswers}
            baseAnswerKey={baseAnswerKey}
            clubName={activeClubName}
            onAnswer={onAnswer}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <WritingResultsView
            userAnswers={userAnswers}
            targetQuestions={targetQuestions}
            clubName={activeClubName}
            onAiEvaluated={(score, cefr) => {
              setAiScore(score);
              setAiCefrLevel(cefr);
            }}
          />
        );
      }}
    />
  );
}
