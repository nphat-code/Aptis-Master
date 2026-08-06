'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart3View, { WritingPart3Item, countWords } from './WritingPart3View';
import WritingAiFeedbackCard from './WritingAiFeedbackCard';
import { WritingAiFeedbackResponse } from '@/app/api/writing/evaluate/route';

export interface WritingPart3PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingPart3ResultsViewProps {
  userAnswers: Record<number, any>;
  targetQuestions: WritingPart3Item[];
  clubName: string;
  onAiEvaluated?: (score: number | undefined, cefrLevel: string | undefined) => void;
}

function WritingPart3ResultsView({
  userAnswers,
  targetQuestions,
  clubName,
  onAiEvaluated,
}: WritingPart3ResultsViewProps) {
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
          partId: 'part3',
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

  React.useEffect(() => {
    if (!hasEvaluated && !isAiAnalyzing) {
      runAiEvaluation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!aiFeedback) {
    return null;
  }

  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';

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
        subtitle={`You are communicating online with other members of the ${formattedClubName}. Reply to their questions. Write in sentences. Use 30–40 words per answer. Recommended time: 10 minutes.`}
      >
        <div className="space-y-4 text-left">
          {targetQuestions.map((q, idx) => {
            const userAns = userAnswers[idx] || '';

            return (
              <div
                key={idx}
                className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs"
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

export default function WritingPart3Practice({
  testIndex = 0,
  onExit,
}: WritingPart3PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const [aiScore, setAiScore] = useState<number | undefined>(undefined);

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  // Transform scrapedData writing questions3 into structured WritingPart3Item lists
  const allTestQuestions: WritingPart3Item[][] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      const qObj = testObj.questions3 || {};
      const aObj = testObj.questions3_answer || {};

      return [
        {
          id: `${tKey}_q3_1`,
          questionText: qObj.question3_1 || 'Tell me about your experience.',
          sampleAnswer: aObj.question3_1_answer || aObj.question3_1 || '',
        },
        {
          id: `${tKey}_q3_2`,
          questionText: qObj.question3_2 || 'What is your opinion on this topic?',
          sampleAnswer: aObj.question3_2_answer || aObj.question3_2 || '',
        },
        {
          id: `${tKey}_q3_3`,
          questionText: qObj.question3_3 || 'Please give me some advice or suggestions.',
          sampleAnswer: aObj.question3_3_answer || aObj.question3_3 || '',
        },
      ];
    });
  }, [rawWritingTests, testKeys]);

  const singleTestQuestions = allTestQuestions[safeTestIndex] || [];
  const allQuestionsFlat = useMemo(() => allTestQuestions.flat(), [allTestQuestions]);

  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 3 – Social media conversation"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={600} // 10 mins for Writing Part 3
      subQuestionsPerSet={3}
      pointsPerSubQuestion={10} // Total max score 30 (10 points per sub-question)
      customScore={aiScore}
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        return wc >= 30 && wc <= 40;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? Math.floor(currentQuestionIndex / 3) : safeTestIndex;
        const currentQuestions = allTestQuestions[activeIdx] || allTestQuestions[0] || [];
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        // Map overall userAnswers map for the 3 subquestions of this set
        const setAnswers: Record<number, string> = {
          0: userAnswers[isAllPractice ? activeIdx * 3 : 0] || '',
          1: userAnswers[isAllPractice ? activeIdx * 3 + 1 : 1] || '',
          2: userAnswers[isAllPractice ? activeIdx * 3 + 2 : 2] || '',
        };

        return (
          <WritingPart3View
            questions={currentQuestions}
            userAnswers={setAnswers}
            clubName={activeClubName}
            onAnswer={(subIdx, val) => {
              const globalIdx = isAllPractice ? activeIdx * 3 + subIdx : subIdx;
              onAnswer(globalIdx, val);
            }}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <WritingPart3ResultsView
            userAnswers={userAnswers}
            targetQuestions={targetQuestions}
            clubName={activeClubName}
            onAiEvaluated={(score) => {
              setAiScore(score);
            }}
          />
        );
      }}
    />
  );
}
