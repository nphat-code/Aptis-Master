'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart4View, { WritingPart4Data, countWords, formatMainEmail } from './WritingPart4View';
import WritingAiFeedbackCard from './WritingAiFeedbackCard';
import { WritingAiFeedbackResponse } from '@/app/api/writing/evaluate/route';

export interface WritingPart4PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingPart4ResultsViewProps {
  userAnswers: Record<number, any>;
  data: WritingPart4Data;
  clubName: string;
  onRetake?: () => void;
  onAiEvaluated?: (score: number | undefined, cefrLevel: string | undefined) => void;
}

function WritingPart4ResultsView({
  userAnswers,
  data,
  clubName,
  onRetake,
  onAiEvaluated,
}: WritingPart4ResultsViewProps) {
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
      const payloadQuestions = [
        {
          id: 1,
          questionText: data.task1Text || 'Write a short email to your friend (about 50 words).',
          userAnswer: userAnswers[0] || '',
        },
        {
          id: 2,
          questionText: data.task2Text || 'Write an email to the president of the club (about 120-150 words).',
          userAnswer: userAnswers[1] || '',
        },
      ];

      const res = await fetch('/api/writing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId: 'part4',
          clubName,
          questions: payloadQuestions,
        }),
      });

      if (!res.ok) throw new Error('API evaluation request failed');
      const feedbackData: WritingAiFeedbackResponse = await res.json();
      setAiFeedback(feedbackData);
      if (onAiEvaluated) {
        onAiEvaluated(feedbackData.score, feedbackData.cefrLevel);
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
  const cleanClub = formattedClubName.toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an ') || cleanClub.startsWith('the '))
    ? cleanClub
    : `the ${formattedClubName}`;

  const cleanSample = (ans?: string) => {
    if (!ans) return '';
    return ans.replace(/<br\s*\/?>/gi, '\n').trim();
  };

  return (
    <div className="space-y-6">
      {/* AI Evaluation Card */}
      <WritingAiFeedbackCard
        feedback={aiFeedback}
        partTitle="Kết Quả Đánh Giá Writing - Part 4"
        clubName={clubName}
        onReEvaluate={runAiEvaluation}
        onRetake={onRetake}
      />

      {/* Standard Answer Details Card */}
      <DetailedAnswersCard
        title="Đánh giá chi tiết từng câu"
        subtitle={`You are a member of ${clubText}. You have received this email from the club:`}
      >
        <div className="space-y-6 text-left">
          {/* Main Email Display */}
          <p className="font-normal text-slate-800 text-[14px] leading-relaxed whitespace-pre-line">
            {formatMainEmail(data.mainEmail)}
          </p>

          {/* Task 1 Review */}
          <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
            <p className="font-bold text-slate-900 text-[14px]">
              Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.
            </p>
            <div className="space-y-1 text-[14px]">
              <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
              <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                userAnswers[0]
                  ? 'bg-slate-50 border-slate-200 text-slate-900'
                  : 'bg-red-50/60 border-red-200 text-red-700'
              }`}>
                {userAnswers[0] || <span className="italic text-slate-400">(Bỏ trống)</span>}
              </p>
            </div>
            {data.sampleAnswer1 && (
              <div className="text-[14px]">
                <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                  <span className="text-xs font-bold text-emerald-800 block">💡 Bài viết mẫu</span>
                  <p className="font-normal text-emerald-950 whitespace-pre-line">{cleanSample(data.sampleAnswer1)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Task 2 Review */}
          <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
            <p className="font-bold text-slate-900 text-[14px]">
              Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120–150 words. Recommended time: 20 minutes.
            </p>
            <div className="space-y-1 text-[14px]">
              <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn</span>
              <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                userAnswers[1]
                  ? 'bg-slate-50 border-slate-200 text-slate-900'
                  : 'bg-red-50/60 border-red-200 text-red-700'
              }`}>
                {userAnswers[1] || <span className="italic text-slate-400">(Bỏ trống)</span>}
              </p>
            </div>
            {data.sampleAnswer2 && (
              <div className="text-[14px]">
                <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                  <span className="text-xs font-bold text-emerald-800 block">💡 Bài viết mẫu</span>
                  <p className="font-normal text-emerald-950 whitespace-pre-line">{cleanSample(data.sampleAnswer2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DetailedAnswersCard>
    </div>
  );
}

export default function WritingPart4Practice({
  testIndex = 0,
  onExit,
}: WritingPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;

  const [aiScore, setAiScore] = useState<number | undefined>(undefined);

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const allTestData: WritingPart4Data[] = useMemo(() => {
    return testKeys.map((tKey) => {
      const testObj = rawWritingTests[tKey] || {};
      return {
        id: tKey,
        mainEmail: testObj.questions4_main || 'Dear member, please write your response.',
        task1Text: testObj.question4_1_text || 'Write a short email to your friend (about 50 words).',
        task2Text: testObj.question4_2_text || 'Write an email to the president of the club (about 120-150 words).',
        sampleAnswer1: testObj.question4_1_text_answer || '',
        sampleAnswer2: testObj.question4_2_text_answer || '',
      };
    });
  }, [rawWritingTests, testKeys]);

  const activeData = allTestData[safeTestIndex] || allTestData[0];
  const activeTestObj = rawWritingTests[testKeys[safeTestIndex]] || {};
  const clubName = activeTestObj.club_name ? activeTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : '';

  return (
    <BasePracticeExam
      moduleName="Writing"
      partTitle="Part 4 – Formal and informal writing"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={1800}
      subQuestionsPerSet={2}
      pointsPerSubQuestion={5} // Total max score 10 for Part 4 (5 pts per email)
      customScore={aiScore}
      isAnswerCorrect={(idx, val) => {
        const wc = countWords(val);
        const subIdx = idx % 2;
        if (subIdx === 0) return wc >= 40 && wc <= 60;
        if (subIdx === 1) return wc >= 120 && wc <= 150;
        return false;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeIdx = isAllPractice ? Math.floor(currentQuestionIndex / 2) : safeTestIndex;
        const currentData = allTestData[activeIdx] || allTestData[0];
        const currentTestObj = rawWritingTests[testKeys[activeIdx]] || {};
        const activeClubName = currentTestObj.club_name ? currentTestObj.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';

        const setAnswers: Record<number, string> = {
          0: userAnswers[isAllPractice ? activeIdx * 2 : 0] || '',
          1: userAnswers[isAllPractice ? activeIdx * 2 + 1 : 1] || '',
        };

        return (
          <WritingPart4View
            data={currentData}
            userAnswers={setAnswers}
            clubName={activeClubName}
            onAnswer={(subIdx, val) => {
              const globalIdx = isAllPractice ? activeIdx * 2 + subIdx : subIdx;
              onAnswer(globalIdx, val);
            }}
            isReviewMode={isReviewMode}
            showExplanation={showExplanation}
          />
        );
      }}
      renderDetailedAnswers={({ userAnswers, onRetake }) => {
        const activeClubName = clubName || 'Club';

        return (
          <WritingPart4ResultsView
            userAnswers={userAnswers}
            data={activeData}
            clubName={activeClubName}
            onRetake={onRetake}
            onAiEvaluated={(score) => {
              setAiScore(score);
            }}
          />
        );
      }}
    />
  );
}
