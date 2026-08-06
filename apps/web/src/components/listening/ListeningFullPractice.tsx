'use client';

import React, { useMemo } from 'react';
import scrapedData from '@/data/scraped_data.json';
import { shuffleArray } from '@/utils/shuffle';
import ExamPracticeLayout from '../exam/ExamPracticeLayout';
import ExamInstructions from '../exam/ExamInstructions';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import ListeningPart1View, { Question13Item } from './ListeningPart1View';
import { ListeningPart2View, ListeningPart2Data } from './ListeningPart2View';
import { ListeningPart3View, ListeningPart3Data } from './ListeningPart3View';
import { ListeningPart4View, ListeningPart4Monologue } from './ListeningPart4View';
import ScriptViewer from './ScriptViewer';

export interface ListeningFullPracticeProps {
  testIndex: number; // 0-based test index
  onExit: () => void;
}

export default function ListeningFullPractice({
  testIndex = 0,
  onExit,
}: ListeningFullPracticeProps) {
  const rawListeningTests = (scrapedData as any)?.listening_tests || {};
  const testKeys = Object.keys(rawListeningTests);
  const totalSets = testKeys.length || 15;
  const safeTestIndex = ((testIndex % totalSets) + totalSets) % totalSets;

  const testNumberStr = safeTestIndex + 1 < 10 ? '0' + (safeTestIndex + 1) : `${safeTestIndex + 1}`;
  const testKey = `test${safeTestIndex + 1}`;
  const testData = rawListeningTests[testKey] || rawListeningTests['test1'] || {};

  // 1. Part 1 Questions (13 items, subIndex 0..12)
  const part1Raw: Question13Item[] = testData.q1_13 || [];
  const part1Questions: Question13Item[] = useMemo(() => {
    return part1Raw.map((q) => ({
      ...q,
      options: shuffleArray(q.options || []),
    }));
  }, [part1Raw]);

  // 2. Part 2 Data (Q14, 4 speaker items, subIndex 13..16)
  const part2RawBank: ListeningPart2Data[] = useMemo(() => {
    const rawBank = (scrapedData as any)?.listening?.listening_question14;
    if (Array.isArray(rawBank) && rawBank.length > 0) {
      return rawBank.map((q14: any) => ({
        audioUrl: q14.audioUrl || '',
        topic: q14.topic || 'Topic: Matching Information',
        options: q14.options || [],
        correctAnswers: q14.correctAnswers || q14.options?.slice(0, 4) || [],
        transcript: q14.transcript || '',
      }));
    }
    return [];
  }, []);

  const part2Data: ListeningPart2Data = useMemo(() => {
    const q14 = testData.q14 || {};
    const matchedBankItem = part2RawBank.find(
      (item) =>
        (q14.audioUrl && item.audioUrl === q14.audioUrl) ||
        (q14.topic && item.topic === q14.topic)
    );

    const actualCorrectAnswers =
      q14.correctAnswers || matchedBankItem?.correctAnswers || q14.options?.slice(0, 4) || [];
    const rawOpts = q14.options || matchedBankItem?.options || [];

    return {
      audioUrl: q14.audioUrl || matchedBankItem?.audioUrl || '',
      topic: q14.topic || matchedBankItem?.topic || 'Topic: Matching Information',
      options: shuffleArray(rawOpts),
      correctAnswers: actualCorrectAnswers,
      transcript: q14.transcript || matchedBankItem?.transcript || '',
    };
  }, [testData, part2RawBank]);

  // 3. Part 3 Data (Q15, 4 statements, subIndex 17..20)
  const part3Data: ListeningPart3Data = useMemo(() => {
    const q15 = testData.q15 || {};
    return {
      audioUrl: q15.audioUrl || '',
      topic: q15.topic || 'Topic: Short Conversations',
      description: q15.description || '',
      questions: q15.questions || [],
      correctAnswer: q15.correctAnswer || [],
      transcript: q15.transcript || '',
    };
  }, [testData]);

  // 4. Part 4 Data (Q16_17, 2 monologues, subIndex 21..24)
  const part4Bank: ListeningPart4Monologue[] = useMemo(() => {
    const rawBank = (scrapedData as any)?.listening?.listening_question16_17;
    if (Array.isArray(rawBank) && rawBank.length > 0) {
      return rawBank.map((mono: any) => ({
        audioUrl: mono.audioUrl || '',
        topic: mono.topic || '',
        questions: (mono.questions || []).map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
        })),
        transcript: mono.transcript || '',
      }));
    }
    return [];
  }, []);

  const part4Monologues: ListeningPart4Monologue[] = useMemo(() => {
    const q16_17 = testData.q16_17 || [];
    return q16_17.map((mono: any) => {
      const matchedBankMono = part4Bank.find(
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
        questions: mergedQuestions,
        transcript: mono.transcript || matchedBankMono?.transcript || '',
      };
    });
  }, [testData, part4Bank]);

  // Screen titles for 17 screens
  const partTitles = useMemo(() => {
    const titles = [];
    for (let i = 1; i <= 13; i++) {
      titles.push('Part 1 – Word recognition');
    }
    titles.push('Part 2 – Matching information');
    titles.push('Part 3 – Short conversations');
    titles.push('Part 4 – Monologues');
    titles.push('Part 4 – Monologues');
    return titles;
  }, []);

  // Answer validation for subquestion indices 0..24
  const isAnswerCorrect = (subIndex: number, val: any): boolean => {
    if (val === undefined || val === '') return false;

    // Part 1: Q1 - Q13 (subIndex 0..12)
    if (subIndex >= 0 && subIndex <= 12) {
      return val === part1Questions[subIndex]?.correctAnswer;
    }

    // Part 2: Q14 (subIndex 13..16)
    if (subIndex >= 13 && subIndex <= 16) {
      const spkIdx = subIndex - 13;
      const targetAns = part2Data.correctAnswers?.[spkIdx];
      return val === targetAns;
    }

    // Part 3: Q15 (subIndex 17..20)
    if (subIndex >= 17 && subIndex <= 20) {
      const qIdx = subIndex - 17;
      const targetAns = part3Data.correctAnswer?.[qIdx];
      return val === targetAns;
    }

    // Part 4: Q16 & Q17 (subIndex 21..24)
    if (subIndex >= 21 && subIndex <= 24) {
      if (subIndex <= 22) {
        const qIdx = subIndex - 21;
        const targetAns = part4Monologues[0]?.questions[qIdx]?.correctAnswer;
        return val === targetAns;
      } else {
        const qIdx = subIndex - 23;
        const targetAns = part4Monologues[1]?.questions[qIdx]?.correctAnswer;
        return val === targetAns;
      }
    }

    return false;
  };

  return (
    <ExamPracticeLayout
      moduleName="Listening"
      partTitle="Full Part"
      getPartTitle={(idx) => partTitles[idx] || 'Full Part'}
      testTitle={`Listening Đề ${testNumberStr}`}
      totalQuestions={17} // 17 screens (13 for P1, 1 for P2, 1 for P3, 2 for P4)
      timeAllowedSeconds={2400} // 40 minutes (8m + 10m + 10m + 12m)
      maxScore={50}
      customTotalSubQuestions={25}
      getCefrLevel={(calculatedScore, maxScore) => {
        const scaled = maxScore === 50 ? calculatedScore : Math.round((calculatedScore * 50) / maxScore);
        if (scaled >= 42) return 'C1';
        if (scaled >= 34) return 'B2';
        if (scaled >= 24) return 'B1';
        if (scaled >= 16) return 'A2';
        if (scaled >= 8) return 'A1';
        return 'A0';
      }}
      getSubQuestionWeight={() => 2} // 25 questions x 2 pts = 50 pts total
      instructionsText={<ExamInstructions skill="Listening" isFullExam={true} partsCount={4} timeMinutes={40} />}
      isAnswerCorrect={isAnswerCorrect}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        return (
          <div className="space-y-6 text-left">
            {/* Part 1 (Screens 0..12) */}
            {currentQuestionIndex <= 12 && (
              <ListeningPart1View
                questions={part1Questions}
                userAnswers={userAnswers}
                baseAnswerKey={0}
                currentQuestionIndex={currentQuestionIndex}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Part 2 (Screen 13) */}
            {currentQuestionIndex === 13 && (
              <ListeningPart2View
                data={part2Data}
                userAnswers={userAnswers}
                baseAnswerKey={13}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Part 3 (Screen 14) */}
            {currentQuestionIndex === 14 && (
              <ListeningPart3View
                data={part3Data}
                userAnswers={userAnswers}
                baseAnswerKey={17}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Part 4 - Monologue 1 (Screen 15) */}
            {currentQuestionIndex === 15 && part4Monologues[0] && (
              <ListeningPart4View
                monologues={[part4Monologues[0]]}
                userAnswers={userAnswers}
                baseAnswerKey={21}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Part 4 - Monologue 2 (Screen 16) */}
            {currentQuestionIndex === 16 && part4Monologues[1] && (
              <ListeningPart4View
                monologues={[part4Monologues[1]]}
                userAnswers={userAnswers}
                baseAnswerKey={23}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}
          </div>
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        // Part 1 score (indices 0..12, 13 questions = 26 pts)
        let p1Correct = 0;
        for (let i = 0; i <= 12; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p1Correct++;
        }
        const p1Score = p1Correct * 2;

        // Part 2 score (indices 13..16, 4 questions = 8 pts)
        let p2Correct = 0;
        for (let i = 13; i <= 16; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p2Correct++;
        }
        const p2Score = p2Correct * 2;

        // Part 3 score (indices 17..20, 4 questions = 8 pts)
        let p3Correct = 0;
        for (let i = 17; i <= 20; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p3Correct++;
        }
        const p3Score = p3Correct * 2;

        // Part 4 score (indices 21..24, 4 questions = 8 pts)
        let p4Correct = 0;
        for (let i = 21; i <= 24; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p4Correct++;
        }
        const p4Score = p4Correct * 2;

        const totalCorrect = p1Correct + p2Correct + p3Correct + p4Correct;
        const totalScore = p1Score + p2Score + p3Score + p4Score;

        const partsData = [
          { name: 'Part 1 – Information recognition', correct: p1Correct, total: 13, score: p1Score, maxScore: 26 },
          { name: 'Part 2 – Information matching', correct: p2Correct, total: 4, score: p2Score, maxScore: 8 },
          { name: 'Part 3 – Inference - discussion', correct: p3Correct, total: 4, score: p3Score, maxScore: 8 },
          { name: 'Part 4 – Inference - longer monologues', correct: p4Correct, total: 4, score: p4Score, maxScore: 8 },
        ];

        const speakers = ['Speaker A', 'Speaker B', 'Speaker C', 'Speaker D'];
        const optionsListP3 = ['Man', 'Woman', 'Both'];

        return (
          <div className="space-y-10">
            {/* OVERVIEW BREAKDOWN CARD */}
            <DetailedAnswersCard
              title="Chi tiết kết quả từng Part"
              subtitle="Thống kê số câu đúng và điểm số tương ứng của mỗi phần trong bài thi Aptis Listening."
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
                    <div>Tổng cộng 4 Part</div>
                    <div className="text-xs font-semibold text-slate-600 font-normal">
                      Đã đúng <span className="text-emerald-700 font-bold">{totalCorrect}</span> / 25 câu
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#CC1C01]">{totalScore}</span>
                    <span className="text-xs font-bold text-slate-500">/50 điểm</span>
                  </div>
                </div>
              </div>
            </DetailedAnswersCard>

            {/* PART 1 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 1: Word recognition"
              subtitle="Nghe 13 thông báo/hội thoại ngắn và chọn đáp án chính xác nhất."
            >
              <div className="space-y-5 text-left">
                {part1Questions.map((q, idx) => {
                  const userAns = userAnswers[idx] || '';
                  const isCorr = isAnswerCorrect(idx, userAns);
                  const audioSrc = q.audioUrl.startsWith('http') || q.audioUrl.startsWith('/')
                    ? q.audioUrl
                    : `/${q.audioUrl}`;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-5 sm:p-6 border text-left space-y-3.5 transition-all ${
                        isCorr ? 'bg-[#ecfdf5] border-[#a7f3d0]' : 'bg-[#fef2f2] border-[#fecaca]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCorr ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
                        }`}>
                          {isCorr ? '✓' : '✕'}
                        </div>
                        <span className={`font-bold text-base ${isCorr ? 'text-emerald-950' : 'text-red-950'}`}>
                          Câu {idx + 1}
                        </span>
                      </div>

                      <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
                        {q.question}
                      </p>

                      <div className="pt-1">
                        <audio controls src={audioSrc} className="w-full h-10 rounded-lg outline-none opacity-90" preload="metadata" />
                      </div>

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
                            <div key={oIdx} className={`p-3 rounded-xl border text-[14px] flex items-center gap-2 ${optBoxStyle}`}>
                              <span className="font-bold">{letter}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      <ScriptViewer transcript={q.transcript} />
                    </div>
                  );
                })}
              </div>
            </DetailedAnswersCard>

            {/* PART 2 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 2: Matching information"
              subtitle="Nghe 4 người nói và ghép thông tin tương ứng với từng speaker."
            >
              <div className="space-y-4 text-left">
                <div className="pt-1">
                  <audio
                    controls
                    src={part2Data.audioUrl.startsWith('http') || part2Data.audioUrl.startsWith('/') ? part2Data.audioUrl : `/${part2Data.audioUrl}`}
                    className="w-full h-10 rounded-lg outline-none opacity-90"
                    preload="metadata"
                  />
                </div>

                <div className="space-y-3 pt-1">
                  {speakers.map((spkLabel, sIdx) => {
                    const subIdx = 13 + sIdx;
                    const userVal = userAnswers[subIdx] || '';
                    const correctVal = part2Data.correctAnswers?.[sIdx] || '';
                    const isCorr = isAnswerCorrect(subIdx, userVal);

                    return (
                      <div
                        key={sIdx}
                        className={`rounded-2xl p-4 sm:p-5 border space-y-2 transition-all ${
                          isCorr ? 'bg-[#ecfdf5] border-[#a7f3d0]' : 'bg-[#fef2f2] border-[#fecaca]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCorr ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
                            }`}>
                              {isCorr ? '✓' : '✕'}
                            </div>
                            <span className={`font-bold text-base ${isCorr ? 'text-emerald-950' : 'text-red-950'}`}>
                              {spkLabel}
                            </span>
                          </div>
                        </div>

                        <div className="text-[14px] space-y-1 pl-7">
                          <div>
                            <span className="font-semibold text-slate-600">Lựa chọn của bạn: </span>
                            <span className={userVal ? (isCorr ? 'text-emerald-800 font-semibold' : 'text-red-700 font-semibold line-through') : 'text-slate-400 italic'}>
                              {userVal || 'Chưa trả lời'}
                            </span>
                          </div>
                          {!isCorr && (
                            <div>
                              <span className="font-semibold text-slate-600">Đáp án đúng: </span>
                              <span className="text-emerald-800 font-bold">{correctVal}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ScriptViewer transcript={part2Data.transcript} />
              </div>
            </DetailedAnswersCard>

            {/* PART 3 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 3: Short conversations"
              subtitle="Nghe đoạn hội thoại giữa Nam và Nữ, xác định quan điểm/thái độ của ai."
            >
              <div className="space-y-4 text-left">
                <div className="pt-1">
                  <audio
                    controls
                    src={part3Data.audioUrl.startsWith('http') || part3Data.audioUrl.startsWith('/') ? part3Data.audioUrl : `/${part3Data.audioUrl}`}
                    className="w-full h-10 rounded-lg outline-none opacity-90"
                    preload="metadata"
                  />
                </div>

                <div className="space-y-3 pt-1">
                  {(part3Data.questions || []).map((qText, qIdx) => {
                    const subIdx = 17 + qIdx;
                    const userVal = userAnswers[subIdx] || '';
                    const correctVal = part3Data.correctAnswer?.[qIdx] || '';
                    const isCorr = isAnswerCorrect(subIdx, userVal);

                    return (
                      <div
                        key={qIdx}
                        className={`rounded-2xl p-4 sm:p-5 border space-y-3 transition-all ${
                          isCorr ? 'bg-[#ecfdf5] border-[#a7f3d0]' : 'bg-[#fef2f2] border-[#fecaca]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCorr ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
                          }`}>
                            {isCorr ? '✓' : '✕'}
                          </div>
                          <span className={`font-bold text-base ${isCorr ? 'text-emerald-950' : 'text-red-950'}`}>
                            Câu {qIdx + 1}: {qText}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 pt-1 pl-7">
                          {optionsListP3.map((opt) => {
                            const isCorrectOpt = opt === correctVal;
                            const isUserOpt = opt === userVal;

                            let style = 'bg-white/60 border-slate-200/80 text-slate-600 font-normal';
                            if (isCorrectOpt) {
                              style = 'bg-[#ecfdf5] border-[#a7f3d0] text-emerald-900 font-semibold ring-1 ring-[#a7f3d0]';
                            } else if (isUserOpt && !isCorr) {
                              style = 'bg-[#fef2f2] border-[#fecaca] text-red-950 font-medium line-through';
                            }

                            return (
                              <div key={opt} className={`p-2.5 rounded-xl border text-center text-[14px] ${style}`}>
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ScriptViewer transcript={part3Data.transcript} />
              </div>
            </DetailedAnswersCard>

            {/* PART 4 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 4: Monologues"
              subtitle="Nghe 2 bài phát biểu/bài giảng ngắn và trả lời 2 câu hỏi cho mỗi bài."
            >
              <div className="space-y-8 text-left">
                {part4Monologues.map((mono, mIdx) => {
                  const audioSrc = mono.audioUrl.startsWith('http') || mono.audioUrl.startsWith('/')
                    ? mono.audioUrl
                    : `/${mono.audioUrl}`;

                  return (
                    <div key={mIdx} className="space-y-4 pt-2 border-t border-slate-200/80 first:border-none first:pt-0">
                      <h4 className="font-bold text-base text-slate-900">
                        Bài {mIdx + 1}{mono.topic ? `: ${mono.topic.replace(/^Topic:\s*/i, '')}` : ''}
                      </h4>

                      <audio controls src={audioSrc} className="w-full h-10 rounded-lg outline-none opacity-90" preload="metadata" />

                      <div className="space-y-4">
                        {mono.questions.map((q, qIdx) => {
                          const subIdx = mIdx === 0 ? 21 + qIdx : 23 + qIdx;
                          const userAns = userAnswers[subIdx] || '';
                          const isCorr = isAnswerCorrect(subIdx, userAns);

                          return (
                            <div
                              key={qIdx}
                              className={`rounded-2xl p-5 border text-left space-y-3 transition-all ${
                                isCorr ? 'bg-[#ecfdf5] border-[#a7f3d0]' : 'bg-[#fef2f2] border-[#fecaca]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isCorr ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
                                }`}>
                                  {isCorr ? '✓' : '✕'}
                                </div>
                                <span className={`font-bold text-base ${isCorr ? 'text-emerald-950' : 'text-red-950'}`}>
                                  {q.question.replace(/^(\d+\.\d+|\d+[\.\)])\s*/, '')}
                                </span>
                              </div>

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
                                    <div key={oIdx} className={`p-3 rounded-xl border text-[14px] flex items-center gap-2 ${optBoxStyle}`}>
                                      <span className="font-bold">{letter}.</span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <ScriptViewer label={`Script Bài ${mIdx + 1}`} transcript={mono.transcript} />
                    </div>
                  );
                })}
              </div>
            </DetailedAnswersCard>
          </div>
        );
      }}
    />
  );
}
