'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import ExamPracticeLayout from '../exam/ExamPracticeLayout';
import ExamInstructions from '../exam/ExamInstructions';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ReadingPart1View, { Question1Item } from './ReadingPart1View';
import ReadingPart23View from './ReadingPart23View';
import ReadingPart4View, { Question4Item } from './ReadingPart4View';
import ReadingPart5View from './ReadingPart5View';

// Deterministic array shuffle helper for Part 2 & Part 3
function shuffleArray<T>(array: T[], seed: number): T[] {
  if (!array || array.length === 0) return [];
  const shuffled = [...array];
  let m = shuffled.length,
    t,
    i;

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

interface ReadingFullPracticeProps {
  testIndex: number; // 0-based test index
  onExit: () => void;
}

export default function ReadingFullPractice({
  testIndex = 0,
  onExit,
}: ReadingFullPracticeProps) {
  const readingTests = (scrapedData as any)?.reading_tests || {};
  const testKeys = Object.keys(readingTests);
  const totalSets = testKeys.length || 14;
  const safeTestIndex = ((testIndex % totalSets) + totalSets) % totalSets;

  const testNumberStr = safeTestIndex + 1 < 10 ? '0' + (safeTestIndex + 1) : `${safeTestIndex + 1}`;
  const testKey = `test${safeTestIndex + 1}`;
  const testData = readingTests[testKey] || readingTests['test1'] || {};

  // Part 1 Questions (5 items)
  const part1Questions: Question1Item[] = testData.questions1 || [];

  // Part 2 Sentences (5 sentences)
  const part2RawItems: any[] = testData.question2Content || [];
  const part2Sentences: string[] = useMemo(() => {
    return part2RawItems.map((item) => (typeof item === 'string' ? item : item?.text || ''));
  }, [part2RawItems]);
  const scrambledPart2 = useMemo(() => {
    return shuffleArray(part2Sentences, (safeTestIndex + 1) * 100 + 2);
  }, [part2Sentences, safeTestIndex]);

  // Part 3 Sentences (5 items)
  const part3RawItems: any[] = testData.question3Content || [];
  const part3Sentences: string[] = useMemo(() => {
    return part3RawItems.map((item) => (typeof item === 'string' ? item : item?.text || ''));
  }, [part3RawItems]);
  const scrambledPart3 = useMemo(() => {
    return shuffleArray(part3Sentences, (safeTestIndex + 1) * 100 + 3);
  }, [part3Sentences, safeTestIndex]);

  // Part 4 Passages & Questions (7 questions)
  const part4Passages: string[] = testData.question4Text || [];
  const part4Questions: Question4Item[] = testData.question4Content || [];
  const part4Answers: string[] = testData.correctAnswersQuestion4 || [];

  // Part 5 Paragraphs & Options (7 paragraphs)
  const part5Paragraphs: string[] = testData.paragraph_question5 || [];
  const part5Options: string[] = testData.options || [];

  // Dynamic header titles for each of the 5 questions (parts)
  const partTitles = [
    'Part 1 – Gap Fill',
    'Part 2 + 3 – Text Cohesion',
    'Part 2 + 3 – Text Cohesion',
    'Part 4 – Opinion matching',
    'Part 5 – Long reading',
  ];

  // Answer validation helper for subquestions 0..28
  const isAnswerCorrect = (subIndex: number, val: any): boolean => {
    if (val === undefined || val === '') return false;

    // Part 1: Q1 - Q5 (indices 0..4)
    if (subIndex >= 0 && subIndex <= 4) {
      return val === part1Questions[subIndex]?.correctAnswer;
    }

    // Part 2: Q6 - Q10 (indices 5..9)
    if (subIndex >= 5 && subIndex <= 9) {
      const posIdx = subIndex - 5;
      return val === part2Sentences[posIdx];
    }

    // Part 3: Q11 - Q15 (indices 10..14)
    if (subIndex >= 10 && subIndex <= 14) {
      const posIdx = subIndex - 10;
      return val === part3Sentences[posIdx];
    }

    // Part 4: Q16 - Q22 (indices 15..21)
    if (subIndex >= 15 && subIndex <= 21) {
      const qIdx = subIndex - 15;
      const targetAns = part4Answers[qIdx] || part4Questions[qIdx]?.answer;
      return val === targetAns;
    }

    // Part 5: Q23 - Q29 (indices 22..28)
    if (subIndex >= 22 && subIndex <= 28) {
      const pIdx = subIndex - 22;
      const correctHeading = part5Options[pIdx + 1] || '';
      return val === correctHeading;
    }

    return false;
  };

  return (
    <ExamPracticeLayout
      moduleName="Reading"
      partTitle="Part 1 – Gap Fill"
      getPartTitle={(idx) => partTitles[idx] || 'Full Part'}
      testTitle={`Reading Đề ${testNumberStr}`}
      totalQuestions={5} // 5 Parts -> Question 1 of 5 to Question 5 of 5
      timeAllowedSeconds={2100} // 35 minutes
      maxScore={50}
      customTotalSubQuestions={29}
      getCefrLevel={(calculatedScore, maxScore) => {
        const scaled = maxScore === 50 ? calculatedScore : Math.round((calculatedScore * 50) / maxScore);
        if (scaled >= 46) return 'C1';
        if (scaled >= 38) return 'B2';
        if (scaled >= 26) return 'B1';
        if (scaled >= 16) return 'A2';
        if (scaled >= 8) return 'A1';
        return 'A0';
      }}
      getSubQuestionWeight={(subIdx) => {
        if (subIdx <= 4) return 2;       // Part 1: 2 pt/câu (5 câu = 10đ)
        if (subIdx <= 9) return 1;       // Part 2: 1 pt/câu (5 câu = 5đ)
        if (subIdx <= 14) return 1;      // Part 3: 1 pt/câu (5 câu = 5đ)
        if (subIdx <= 21) return 16 / 7; // Part 4: 16/7 pt/câu (7 câu = 16đ)
        return 2;                        // Part 5: 2 pt/câu (7 câu = 14đ)
      }}
      instructionsText={<ExamInstructions skill="Reading" isFullExam={true} partsCount={5} timeMinutes={35} />}
      isAnswerCorrect={isAnswerCorrect}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        return (
          <div className="space-y-6 text-left">

            {/* PART 1 */}
            {currentQuestionIndex === 0 && (
              <ReadingPart1View
                questions={part1Questions}
                userAnswers={userAnswers}
                baseAnswerKey={0}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* PART 2 */}
            {currentQuestionIndex === 1 && (
              <ReadingPart23View
                originalSentences={part2Sentences}
                scrambledSentences={scrambledPart2}
                userAnswers={userAnswers}
                baseAnswerKey={5}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* PART 3 */}
            {currentQuestionIndex === 2 && (
              <ReadingPart23View
                originalSentences={part3Sentences}
                scrambledSentences={scrambledPart3}
                userAnswers={userAnswers}
                baseAnswerKey={10}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* PART 4 */}
            {currentQuestionIndex === 3 && (
              <ReadingPart4View
                passages={part4Passages}
                questions={part4Questions}
                correctAnswers={part4Answers}
                userAnswers={userAnswers}
                baseAnswerKey={15}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* PART 5 */}
            {currentQuestionIndex === 4 && (
              <ReadingPart5View
                paragraphs={part5Paragraphs}
                options={part5Options}
                userAnswers={userAnswers}
                baseAnswerKey={22}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}
          </div>
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        // Part 1: Q1 - Q5 (indices 0..4, 2 pt/câu = 10đ max)
        let p1Correct = 0;
        for (let i = 0; i <= 4; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p1Correct++;
        }
        const p1Score = p1Correct * 2;

        // Part 2: Q6 - Q10 (indices 5..9, 1 pt/câu = 5đ max)
        let p2Correct = 0;
        for (let i = 5; i <= 9; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p2Correct++;
        }
        const p2Score = p2Correct * 1;

        // Part 3: Q11 - Q15 (indices 10..14, 1 pt/câu = 5đ max)
        let p3Correct = 0;
        for (let i = 10; i <= 14; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p3Correct++;
        }
        const p3Score = p3Correct * 1;

        // Part 4: Q16 - Q22 (indices 15..21, 16/7 pt/câu = 16đ max)
        let p4Correct = 0;
        for (let i = 15; i <= 21; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p4Correct++;
        }
        const p4Score = Math.round(p4Correct * (16 / 7));

        // Part 5: Q23 - Q29 (indices 22..28, 2 pt/câu = 14đ max)
        let p5Correct = 0;
        for (let i = 22; i <= 28; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p5Correct++;
        }
        const p5Score = p5Correct * 2;

        const totalCorrect = p1Correct + p2Correct + p3Correct + p4Correct + p5Correct;
        const totalScore = Math.round(p1Score + p2Score + p3Score + (p4Correct * 16 / 7) + p5Score);

        const partsData = [
          { name: 'Part 1 – Sentence comprehension', correct: p1Correct, total: 5, score: p1Score, maxScore: 10 },
          { name: 'Part 2 – Text cohesion', correct: p2Correct, total: 5, score: p2Score, maxScore: 5 },
          { name: 'Part 3 – Text cohesion', correct: p3Correct, total: 5, score: p3Score, maxScore: 5 },
          { name: 'Part 4 – Opinion matching', correct: p4Correct, total: 7, score: p4Score, maxScore: 16 },
          { name: 'Part 5 – Long reading', correct: p5Correct, total: 7, score: p5Score, maxScore: 14 },
        ];

        return (
          <DetailedAnswersCard
            title="Chi tiết kết quả từng Part"
            subtitle="Thống kê số câu đúng và điểm số tương ứng của mỗi phần trong bài thi Aptis Reading."
          >
            <div className="space-y-3">
              {partsData.map((part, pIdx) => (
                <div key={pIdx} className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5 text-left">
                    <div className="font-bold text-sm text-slate-900">{part.name}</div>
                    <div className="text-xs font-semibold text-slate-500">
                      Đúng <span className="text-emerald-600 font-bold">{part.correct}</span> / {part.total} câu
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#24085A]">{part.score}</span>
                    <span className="text-xs font-bold text-slate-400">/{part.maxScore} điểm</span>
                  </div>
                </div>
              ))}

              {/* Total Summary Row */}
              <div className="bg-[#24085A]/5 p-4 rounded-xl border border-[#24085A]/20 flex items-center justify-between font-bold pt-4 mt-2">
                <div className="text-slate-900 text-sm font-extrabold text-left">
                  <div>Tổng cộng 5 Part</div>
                  <div className="text-xs font-semibold text-slate-600 font-normal">
                    Đã đúng <span className="text-emerald-700 font-bold">{totalCorrect}</span> / 29 câu
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#CC1C01]">{totalScore}</span>
                  <span className="text-sm font-bold text-slate-500">/50 điểm</span>
                </div>
              </div>
            </div>
          </DetailedAnswersCard>
        );
      }}
    />
  );
}
