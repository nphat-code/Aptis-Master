'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import ExamPracticeLayout from '../exam/ExamPracticeLayout';
import ExamInstructions from '../exam/ExamInstructions';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart1View, { WritingPart1Item, countWords } from './WritingPart1View';
import WritingPart2View, { WritingPart2Item } from './WritingPart2View';
import WritingPart3View, { WritingPart3Item } from './WritingPart3View';
import WritingPart4View, { WritingPart4Data, formatMainEmail } from './WritingPart4View';
import { buildWritingFullGeminiPrompt } from '@/utils/geminiPrompts';

export interface WritingFullPracticeProps {
  testIndex?: number;
  onExit: () => void;
}

export default function WritingFullPractice({
  testIndex = 0,
  onExit,
}: WritingFullPracticeProps) {
  const [copied, setCopied] = useState(false);

  const rawWritingTests = (scrapedData as any)?.writing || {};
  const testKeys = useMemo(() => Object.keys(rawWritingTests), [rawWritingTests]);
  const totalSets = testKeys.length || 40;
  const safeTestIndex = ((testIndex % totalSets) + totalSets) % totalSets;

  const testNumberStr = safeTestIndex + 1 < 10 ? '0' + (safeTestIndex + 1) : `${safeTestIndex + 1}`;
  const testKey = testKeys[safeTestIndex] || 'test1';
  const testData = rawWritingTests[testKey] || {};

  const clubNameRaw = testData.club_name ? testData.club_name.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const cleanClub = clubNameRaw.toLowerCase();
  const clubWithArticle = (cleanClub.startsWith('a ') || cleanClub.startsWith('an ') || cleanClub.startsWith('the '))
    ? clubNameRaw
    : /^[aeiou]/i.test(cleanClub)
    ? `an ${clubNameRaw}`
    : `a ${clubNameRaw}`;

  // 1. Part 1 Data (5 items: subIndex 0..4)
  const part1Questions: WritingPart1Item[] = useMemo(() => {
    const qObj = testData.questions1 || {};
    const aObj = testData.questions1_answer || {};
    return [1, 2, 3, 4, 5].map((num) => ({
      id: `${testKey}_q1_${num}`,
      questionNum: num,
      questionText: qObj[`question1_${num}`] || `Question ${num}`,
      sampleAnswer: aObj[`question1_${num}_answer`] || '',
    }));
  }, [testData, testKey]);

  // 2. Part 2 Data (1 item: subIndex 5)
  const part2Question: WritingPart2Item = useMemo(() => {
    const qObj = testData.questions2 || {};
    const aObj = testData.questions2_answer || {};
    return {
      id: `${testKey}_q2`,
      questionNum: 1,
      questionText: qObj.question2 || 'Please fill in the form with your personal experience.',
      sampleAnswer: aObj.question2 || '',
    };
  }, [testData, testKey]);

  // 3. Part 3 Data (3 items: subIndex 6..8)
  const part3Questions: WritingPart3Item[] = useMemo(() => {
    const qObj = testData.questions3 || {};
    const aObj = testData.questions3_answer || {};
    return [1, 2, 3].map((num) => ({
      id: `${testKey}_q3_${num}`,
      questionNum: num,
      questionText: qObj[`question3_${num}`] || `Question ${num}`,
      sampleAnswer: aObj[`question3_${num}_answer`] || '',
    }));
  }, [testData, testKey]);

  // 4. Part 4 Data (Task 1: subIndex 9, Task 2: subIndex 10)
  const part4Data: WritingPart4Data = useMemo(() => {
    return {
      id: testKey,
      mainEmail: testData.questions4_main || 'Dear member, please read this notification and write your responses.',
      task1Text: testData.question4_1_text || 'Write a short email to your friend (about 50 words).',
      task2Text: testData.question4_2_text || 'Write an email to the president of the club (about 120-150 words).',
      sampleAnswer1: testData.question4_1_text_answer || '',
      sampleAnswer2: testData.question4_2_text_answer || '',
    };
  }, [testData, testKey]);

  const partTitles = [
    'Part 1 – Word-level writing',
    'Part 2 – Short text writing',
    'Part 3 – Three written responses',
    'Part 4 – Formal & informal writing',
  ];

  // Validation function for sub-questions 0..10
  const isAnswerCorrect = (subIdx: number, val: any): boolean => {
    if (typeof val !== 'string' || !val.trim()) return false;
    const wc = countWords(val);

    // Part 1: Q1..Q5 (indices 0..4) -> 1–5 words
    if (subIdx >= 0 && subIdx <= 4) {
      return wc >= 1 && wc <= 5;
    }
    // Part 2: Form filling (index 5) -> 20–30 words (ceiling 45 words)
    if (subIdx === 5) {
      return wc >= 20 && wc <= 45;
    }
    // Part 3: Social chat (indices 6..8) -> 30–40 words (ceiling 60 words)
    if (subIdx >= 6 && subIdx <= 8) {
      return wc >= 30 && wc <= 60;
    }
    // Part 4 Task 1: Friendly email (index 9) -> ~50 words (ceiling 75 words)
    if (subIdx === 9) {
      return wc >= 40 && wc <= 75;
    }
    // Part 4 Task 2: Formal email (index 10) -> 120–150 words (ceiling 225 words)
    if (subIdx === 10) {
      return wc >= 100 && wc <= 225;
    }
    return false;
  };

  // Sub-question weights (Sum = 50 pts)
  const getSubQuestionWeight = (subIdx: number): number => {
    if (subIdx <= 4) return 1;  // Part 1: 5 x 1 pt = 5 pts
    if (subIdx === 5) return 5; // Part 2: 1 x 5 pts = 5 pts
    if (subIdx <= 8) return 5;  // Part 3: 3 x 5 pts = 15 pts
    if (subIdx === 9) return 10; // Part 4 Task 1: 10 pts
    if (subIdx === 10) return 15; // Part 4 Task 2: 15 pts (Part 4 = 25 pts)
    return 1;
  };

  const cleanSample = (ans?: string) => {
    if (!ans) return '';
    return ans.replace(/<br\s*\/?>/gi, '\n').trim();
  };

  const handleCopyForGemini = (userAnswers: Record<number, any>) => {
    const promptText = buildWritingFullGeminiPrompt({
      clubName: clubNameRaw,
      part1Questions: part1Questions.map((q, idx) => ({
        num: idx + 1,
        text: q.questionText,
        userAnswer: userAnswers[idx] || '',
        sampleAnswer: q.sampleAnswer || '',
      })),
      part2: {
        questionText: part2Question.questionText,
        userAnswer: userAnswers[5] || '',
        sampleAnswer: part2Question.sampleAnswer || '',
      },
      part3Questions: part3Questions.map((q, idx) => ({
        num: idx + 1,
        text: q.questionText,
        userAnswer: userAnswers[6 + idx] || '',
        sampleAnswer: q.sampleAnswer || '',
      })),
      part4: {
        mainEmail: part4Data.mainEmail,
        userAnswer1: userAnswers[9] || '',
        sampleAnswer1: cleanSample(part4Data.sampleAnswer1),
        userAnswer2: userAnswers[10] || '',
        sampleAnswer2: cleanSample(part4Data.sampleAnswer2),
      },
    });

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <ExamPracticeLayout
      moduleName="Writing"
      partTitle="Full Part"
      getPartTitle={(idx) => partTitles[idx] || 'Full Part'}
      testTitle={`Writing Đề ${testNumberStr}`}
      totalQuestions={4} // 4 screens (Part 1, Part 2, Part 3, Part 4)
      timeAllowedSeconds={3000} // 50 minutes standard
      maxScore={50}
      customTotalSubQuestions={11} // 5 + 1 + 3 + 2 = 11 sub-questions
      getCefrLevel={(calculatedScore, maxScore) => {
        const scaled = maxScore === 50 ? calculatedScore : Math.round((calculatedScore * 50) / maxScore);
        if (scaled >= 46) return 'C1';
        if (scaled >= 40) return 'B2';
        if (scaled >= 26) return 'B1';
        if (scaled >= 18) return 'A2';
        if (scaled >= 6) return 'A1';
        return 'A0';
      }}
      getSubQuestionWeight={getSubQuestionWeight}
      instructionsText={<ExamInstructions skill="Writing" isFullExam={true} partsCount={4} timeMinutes={50} />}
      isAnswerCorrect={isAnswerCorrect}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        return (
          <div className="space-y-6 text-left">
            {/* Screen 0: Part 1 – Word-level writing (5 questions) */}
            {currentQuestionIndex === 0 && (
              <WritingPart1View
                questions={part1Questions}
                userAnswers={userAnswers}
                baseAnswerKey={0}
                clubName={clubNameRaw}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Screen 1: Part 2 – Short text writing (1 question) */}
            {currentQuestionIndex === 1 && (
              <WritingPart2View
                question={part2Question}
                userAnswer={userAnswers[5] || ''}
                clubName={clubNameRaw}
                onAnswer={(val) => onAnswer(5, val)}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Screen 2: Part 3 – Three written responses to questions */}
            {currentQuestionIndex === 2 && (
              <WritingPart3View
                questions={part3Questions}
                userAnswers={{
                  0: userAnswers[6] || '',
                  1: userAnswers[7] || '',
                  2: userAnswers[8] || '',
                }}
                clubName={clubNameRaw}
                onAnswer={(idx, val) => onAnswer(6 + idx, val)}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}

            {/* Screen 3: Part 4 – Formal and informal writing (2 emails) */}
            {currentQuestionIndex === 3 && (
              <WritingPart4View
                data={part4Data}
                userAnswers={{
                  0: userAnswers[9] || '',
                  1: userAnswers[10] || '',
                }}
                clubName={clubNameRaw}
                onAnswer={(idx, val) => onAnswer(9 + idx, val)}
                isReviewMode={isReviewMode}
                showExplanation={showExplanation}
              />
            )}
          </div>
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => {
        // Part 1 score (indices 0..4, 5 questions = 5 pts)
        let p1Valid = 0;
        for (let i = 0; i <= 4; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p1Valid++;
        }
        const p1Score = p1Valid * 1;

        // Part 2 score (index 5, 1 question = 5 pts)
        const p2Valid = isAnswerCorrect(5, userAnswers[5]) ? 1 : 0;
        const p2Score = p2Valid * 5;

        // Part 3 score (indices 6..8, 3 questions = 15 pts)
        let p3Valid = 0;
        for (let i = 6; i <= 8; i++) {
          if (isAnswerCorrect(i, userAnswers[i])) p3Valid++;
        }
        const p3Score = p3Valid * 5;

        // Part 4 score (indices 9..10, 2 tasks = 25 pts)
        const t1Valid = isAnswerCorrect(9, userAnswers[9]) ? 1 : 0;
        const t2Valid = isAnswerCorrect(10, userAnswers[10]) ? 1 : 0;
        const p4Valid = t1Valid + t2Valid;
        const p4Score = (t1Valid * 10) + (t2Valid * 15);

        const totalValid = p1Valid + p2Valid + p3Valid + p4Valid;
        const totalScore = p1Score + p2Score + p3Score + p4Score;

        const partsData = [
          { name: 'Part 1 – Word-level writing (1–5 từ)', valid: p1Valid, total: 5, score: p1Score, maxScore: 5 },
          { name: 'Part 2 – Short text writing (20–30 từ)', valid: p2Valid, total: 1, score: p2Score, maxScore: 5 },
          { name: 'Part 3 – Social club chat (30–40 từ/câu)', valid: p3Valid, total: 3, score: p3Score, maxScore: 15 },
          { name: 'Part 4 – Formal & informal writing (2 emails)', valid: p4Valid, total: 2, score: p4Score, maxScore: 25 },
        ];

        return (
          <div className="space-y-10">
            {/* 1. OVERVIEW BREAKDOWN CARD */}
            <DetailedAnswersCard
              title="Chi tiết kết quả từng Part"
              subtitle={`Bài thi thử Writing Aptis Full 4 Phần theo chủ đề "${clubNameRaw}". Thời gian làm bài 50 phút.`}
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => handleCopyForGemini(userAnswers)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-purple-700 hover:to-indigo-700 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Đã sao chép vào Clipboard!' : 'Sao chép toàn bộ Đề & Bài làm để chấm điểm cùng Gemini'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {partsData.map((part, pIdx) => (
                  <div key={pIdx} className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                    <div className="space-y-0.5 text-left">
                      <div className="font-bold text-sm text-slate-900">{part.name}</div>
                      <div className="text-xs font-semibold text-slate-500">
                        Đạt chuẩn <span className="text-emerald-600 font-bold">{part.valid}</span> / {part.total} câu
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
                      Đạt chuẩn độ dài <span className="text-emerald-700 font-bold">{totalValid}</span> / 11 câu
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#24085A]">{totalScore}</span>
                    <span className="text-sm font-bold text-slate-500">/50 điểm</span>
                  </div>
                </div>
              </div>
            </DetailedAnswersCard>

            {/* 2. PART 1 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 1: Word-level writing"
              subtitle={`You want to join ${clubWithArticle}. You have 5 messages from a member. Write short answers (1–5 words).`}
            >
              <div className="space-y-4 text-left">
                {part1Questions.map((q, idx) => {
                  const userAns = userAnswers[idx] || '';
                  const wc = countWords(userAns);
                  const isValid = isAnswerCorrect(idx, userAns);

                  return (
                    <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs text-left">
                      <div className="bg-slate-50 p-3.5 px-4 border-b border-slate-200/80 flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-[14px]">
                          Q{idx + 1}: {q.questionText}
                        </h4>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          isValid ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800' : 'bg-[#fef2f2] border-red-300 text-red-700'
                        }`}>
                          {isValid ? `✓ Hợp lệ (${wc} từ)` : userAns ? `✗ ${wc} từ (chuẩn 1–5 từ)` : '✗ Bỏ trống'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 text-[14px]">
                        <div className="p-4 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-slate-200/60 space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Bài làm của bạn</span>
                          <p className={`font-normal text-[14px] leading-relaxed ${userAns ? 'text-slate-900' : 'text-red-600 italic'}`}>
                            {userAns || '(Bỏ trống)'}
                          </p>
                        </div>
                        <div className="p-4 bg-[#ECFDF5]/60 space-y-1">
                          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block">Gợi ý mẫu</span>
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

            {/* 3. PART 2 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 2: Short text writing"
              subtitle={`You are a new member of the ${clubNameRaw}. Fill in the form. Write in sentences. Use 20–30 words.`}
            >
              <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-[14px]">{part2Question.questionText}</h4>
                  {(() => {
                    const ans = userAnswers[5] || '';
                    const wc = countWords(ans);
                    const isValid = isAnswerCorrect(5, ans);
                    return (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isValid ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800' : 'bg-[#fef2f2] border-red-300 text-red-700'
                      }`}>
                        {isValid ? `✓ Hợp lệ (${wc} từ)` : ans ? `✗ ${wc} từ (chuẩn 20–30 từ)` : '✗ Bỏ trống'}
                      </span>
                    );
                  })()}
                </div>
                <div className="space-y-1 text-[14px]">
                  <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn:</span>
                  <p className={`font-normal p-3 rounded-xl border text-[14px] ${
                    userAnswers[5] ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-red-50/60 border-red-200 text-red-700 italic'
                  }`}>
                    {userAnswers[5] || '(Bỏ trống)'}
                  </p>
                </div>
                {part2Question.sampleAnswer && (
                  <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 text-[14px] space-y-1">
                    <span className="text-xs font-bold text-emerald-800 block">💡 Bài viết mẫu:</span>
                    <p className="font-normal text-emerald-950 text-[14px]">{part2Question.sampleAnswer}</p>
                  </div>
                )}
              </div>
            </DetailedAnswersCard>

            {/* 4. PART 3 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 3: Social club chat"
              subtitle={`You are communicating online with other members of the ${clubNameRaw}. Reply to their questions (30–40 words per answer).`}
            >
              <div className="space-y-4 text-left">
                {part3Questions.map((q, idx) => {
                  const subIdx = 6 + idx;
                  const userAns = userAnswers[subIdx] || '';
                  const wc = countWords(userAns);
                  const isValid = isAnswerCorrect(subIdx, userAns);

                  return (
                    <div key={idx} className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-[14px]">Câu hỏi {idx + 1}: {q.questionText}</h4>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          isValid ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800' : 'bg-[#fef2f2] border-red-300 text-red-700'
                        }`}>
                          {isValid ? `✓ Hợp lệ (${wc} từ)` : userAns ? `✗ ${wc} từ (chuẩn 30–40 từ)` : '✗ Bỏ trống'}
                        </span>
                      </div>
                      <div className="space-y-1 text-[14px]">
                        <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn:</span>
                        <p className={`font-normal p-3 rounded-xl border text-[14px] ${
                          userAns ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-red-50/60 border-red-200 text-red-700 italic'
                        }`}>
                          {userAns || '(Bỏ trống)'}
                        </p>
                      </div>
                      {q.sampleAnswer && (
                        <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 text-[14px] space-y-1">
                          <span className="text-xs font-bold text-emerald-800 block">💡 Gợi ý mẫu:</span>
                          <p className="font-normal text-emerald-950 text-[14px]">{q.sampleAnswer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </DetailedAnswersCard>

            {/* 5. PART 4 REVIEW CARD */}
            <DetailedAnswersCard
              title="Part 4: Formal and informal writing"
              subtitle={`You are a member of the ${clubNameRaw}. You received an email from the club and write 2 responses.`}
            >
              <div className="space-y-5 text-left">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Email thông báo:</span>
                  <p className="font-normal text-slate-800 text-[14px] whitespace-pre-line leading-relaxed">
                    {formatMainEmail(part4Data.mainEmail)}
                  </p>
                </div>

                {/* Task 1 */}
                <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-[14px]">Task 1: Email gửi bạn bè (~50 từ)</p>
                    {(() => {
                      const ans = userAnswers[9] || '';
                      const wc = countWords(ans);
                      const isValid = isAnswerCorrect(9, ans);
                      return (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          isValid ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800' : 'bg-[#fef2f2] border-red-300 text-red-700'
                        }`}>
                          {isValid ? `✓ Hợp lệ (${wc} từ)` : ans ? `✗ ${wc} từ (chuẩn ~50 từ)` : '✗ Bỏ trống'}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="space-y-1 text-[14px]">
                    <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn:</span>
                    <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                      userAnswers[9] ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-red-50/60 border-red-200 text-red-700 italic'
                    }`}>
                      {userAnswers[9] || '(Bỏ trống)'}
                    </p>
                  </div>
                  {cleanSample(part4Data.sampleAnswer1) && (
                    <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 text-[14px] space-y-1">
                      <span className="text-xs font-bold text-emerald-800 block">💡 Bài mẫu tham khảo:</span>
                      <p className="font-normal text-emerald-950 text-[14px] whitespace-pre-line">{cleanSample(part4Data.sampleAnswer1)}</p>
                    </div>
                  )}
                </div>

                {/* Task 2 */}
                <div className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 text-[14px]">Task 2: Email gửi Chủ tịch CLB (120–150 từ)</p>
                    {(() => {
                      const ans = userAnswers[10] || '';
                      const wc = countWords(ans);
                      const isValid = isAnswerCorrect(10, ans);
                      return (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          isValid ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800' : 'bg-[#fef2f2] border-red-300 text-red-700'
                        }`}>
                          {isValid ? `✓ Hợp lệ (${wc} từ)` : ans ? `✗ ${wc} từ (chuẩn 120–150 từ)` : '✗ Bỏ trống'}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="space-y-1 text-[14px]">
                    <span className="text-xs font-semibold text-slate-600 block">Bài làm của bạn:</span>
                    <p className={`font-normal p-3 rounded-xl border text-[14px] whitespace-pre-line ${
                      userAnswers[10] ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-red-50/60 border-red-200 text-red-700 italic'
                    }`}>
                      {userAnswers[10] || '(Bỏ trống)'}
                    </p>
                  </div>
                  {cleanSample(part4Data.sampleAnswer2) && (
                    <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 text-[14px] space-y-1">
                      <span className="text-xs font-bold text-emerald-800 block">💡 Bài mẫu tham khảo:</span>
                      <p className="font-normal text-emerald-950 text-[14px] whitespace-pre-line">{cleanSample(part4Data.sampleAnswer2)}</p>
                    </div>
                  )}
                </div>
              </div>
            </DetailedAnswersCard>
          </div>
        );
      }}
    />
  );
}
