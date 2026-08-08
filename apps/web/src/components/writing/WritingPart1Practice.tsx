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
  onRetake?: () => void;
  onAiEvaluated?: (score: number | undefined, cefrLevel: string | undefined) => void;
}

function WritingResultsView({
  userAnswers,
  targetQuestions,
  clubName,
  onRetake,
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
        partTitle="Kết Quả Đánh Giá Writing - Part 1"
        clubName={clubName}
        onReEvaluate={runAiEvaluation}
        onRetake={onRetake}
      />

      {/* Standard Answer Details Card */}
      <DetailedAnswersCard
        title="Đánh giá chi tiết từng câu"
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
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-0 text-left"
              >
                {/* Question Header */}
                <div className="bg-slate-50 p-3.5 px-4 border-b border-slate-200/80">
                  <h4 className="font-bold text-slate-900 text-[14px]">
                    Q{idx + 1}: {q.questionText}
                  </h4>
                </div>

                {/* 2-Column Grid: User Answer vs Model Answer */}
                <div className="grid grid-cols-1 md:grid-cols-2 text-[14px]">
                  {/* Left Column: User Answer */}
                  <div className="p-4 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-slate-200/60 space-y-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                      Bài làm của bạn
                    </span>
                    <p className={`font-normal text-[14px] leading-relaxed ${
                      userAns ? 'text-slate-900' : 'text-rose-600 italic'
                    }`}>
                      {userAns || '(Bỏ trống)'}
                    </p>
                  </div>

                  {/* Right Column: Model Answer */}
                  <div className="p-4 bg-[#ecfdf5] space-y-1.5">
                    <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                      <span>Bài mẫu tham khảo</span>
                    </span>
                    <p className="font-normal text-emerald-950 text-[14px] leading-relaxed">
                      {q.sampleAnswer || 'N/A'}
                    </p>
                  </div>
                </div>
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
      partTitle="Part 1 – Word-level writing"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={180} // 3 mins for Writing Part 1
      subQuestionsPerSet={5}
      pointsPerSubQuestion={2} // Total max score 10 for Part 1 (2 pts per sub-question)
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
      renderDetailedAnswers={({ userAnswers, onRetake }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <WritingResultsView
            userAnswers={userAnswers}
            targetQuestions={targetQuestions}
            clubName={activeClubName}
            onRetake={onRetake}
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
