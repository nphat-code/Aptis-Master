'use client';

import React from 'react';
import ExamPracticeLayout, { ExamPracticeLayoutProps } from './ExamPracticeLayout';

import ExamInstructions from './ExamInstructions';

export interface BasePracticeExamProps {
  moduleName: string; // e.g. "Reading", "Listening", "Speaking", "Writing", "Grammar"
  partTitle: string; // e.g. "Part 1 – Gap Fill"
  testIndex: number; // 0-based test index or -1 for Marathon
  totalSets: number; // Total available test sets (e.g. 48, 39, 14)
  topicTitle?: string; // Optional topic title for current test set
  defaultTimeSeconds?: number; // e.g. 360 (6 mins) or 420 (7 mins)
  subQuestionsPerSet?: number; // e.g. 5 for Part 1 & 2+3, 7 for Part 4
  customTotalQuestions?: number; // e.g. 13 for Listening Part 1 (1 question per screen)
  pointsPerSubQuestion?: number; // default 2
  instructionsText?: React.ReactNode;
  customScore?: number;
  getCefrLevel?: (score: number, maxScore: number) => string;
  isAnswerCorrect: (subIndex: number, answerValue: any) => boolean;
  onExit: () => void;
  renderQuestions: ExamPracticeLayoutProps['renderQuestions'];
  renderDetailedAnswers?: ExamPracticeLayoutProps['renderDetailedAnswers'];
}

export default function BasePracticeExam({
  moduleName,
  partTitle,
  testIndex,
  totalSets,
  topicTitle,
  defaultTimeSeconds = 360,
  subQuestionsPerSet = 5,
  customTotalQuestions,
  pointsPerSubQuestion = 2,
  instructionsText,
  customScore,
  getCefrLevel,
  isAnswerCorrect,
  onExit,
  renderQuestions,
  renderDetailedAnswers,
}: BasePracticeExamProps) {
  const isAllPractice = testIndex === -1;
  const safeTestIndex = isAllPractice ? 0 : Math.max(0, testIndex % totalSets);
  
  const testNumberStr = (safeTestIndex + 1) < 10 ? '0' + (safeTestIndex + 1) : `${safeTestIndex + 1}`;
  const partShortName = partTitle.split('–')[0]?.trim() || partTitle;

  const testTitle = isAllPractice
    ? `Tất cả ${totalSets} bài đọc ${partShortName}`
    : topicTitle
    ? `Đề ${testNumberStr} - ${topicTitle}`
    : `Đề ${testNumberStr} - ${moduleName} ${partShortName}`;

  const totalQuestions = customTotalQuestions !== undefined
    ? customTotalQuestions
    : (isAllPractice ? totalSets : 1);
  const totalSubQuestions = isAllPractice && customTotalQuestions !== undefined
    ? (subQuestionsPerSet > 1 ? customTotalQuestions * subQuestionsPerSet : customTotalQuestions)
    : (totalQuestions * subQuestionsPerSet);
  const maxScore = totalSubQuestions * pointsPerSubQuestion;
  const timeAllowedSeconds = isAllPractice ? 999999 : defaultTimeSeconds;

  const finalInstructions = instructionsText || (
    <ExamInstructions skill={moduleName} timeSeconds={defaultTimeSeconds} />
  );

  return (
    <ExamPracticeLayout
      moduleName={moduleName}
      partTitle={partTitle}
      testTitle={testTitle}
      totalQuestions={totalQuestions}
      timeAllowedSeconds={timeAllowedSeconds}
      maxScore={maxScore}
      customScore={customScore}
      getCefrLevel={getCefrLevel}
      customTotalSubQuestions={totalSubQuestions}
      instructionsText={finalInstructions}
      isAnswerCorrect={isAnswerCorrect}
      initialStep={isAllPractice ? 'questions' : 'start'}
      unlimitedTime={isAllPractice}
      onExit={onExit}
      renderQuestions={renderQuestions}
      renderDetailedAnswers={renderDetailedAnswers}
    />
  );
}
