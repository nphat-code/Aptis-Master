'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart1View, { WritingPart1Item, countWords } from './WritingPart1View';

export interface WritingPart1PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingResultsViewProps {
  userAnswers: Record<number, any>;
  targetQuestions: WritingPart1Item[];
  clubName: string;
  onRetake?: () => void;
}

function WritingResultsView({
  userAnswers,
  targetQuestions,
  clubName,
}: WritingResultsViewProps) {
  const [copied, setCopied] = useState(false);

  const cleanClub = (clubName || 'club').trim().toLowerCase();
  const clubText = (cleanClub.startsWith('a ') || cleanClub.startsWith('an '))
    ? cleanClub
    : /^[aeiou]/i.test(cleanClub)
    ? `an ${cleanClub}`
    : `a ${cleanClub}`;

  const instructionSubtitle = `You want to join ${clubText}. You have 5 messages from a member of the club. Write short answers (1–5 words) to each message. Recommended time: 3 minutes.`;

  const handleCopyForGemini = () => {
    const text = `ĐỀ THI WRITING APTIS - PART 1
Chủ đề: ${clubName || 'Club'}
Hướng dẫn: ${instructionSubtitle}

NỘI DUNG CÂU HỎI VÀ BÀI LÀM CỦA TÔI:
${targetQuestions.map((q, idx) => `Câu ${idx + 1}: ${q.questionText}\n- Bài làm của tôi: ${userAnswers[idx] || '(Chưa điền)'}\n- Bài mẫu tham khảo: ${q.sampleAnswer || 'N/A'}`).join('\n\n')}

YÊU CẦU:
Hãy nhận xét chi tiết bài làm của tôi: kiểm tra ngữ pháp, tính phù hợp với câu hỏi (độ dài 1-5 từ), và gợi ý các cách trả lời tự nhiên, đạt điểm tối đa trong bài thi Aptis.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Standard Answer Details Card */}
      <DetailedAnswersCard
        title="Đánh giá chi tiết từng câu"
        subtitle={instructionSubtitle}
      >
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleCopyForGemini}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-purple-700 hover:to-indigo-700 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Đã sao chép vào Clipboard!' : 'Sao chép đề & bài làm để luyện cùng Gemini'}</span>
          </button>
        </div>

        <div className="space-y-4 text-left">
          {targetQuestions.map((q, idx) => {
            const userAns = userAnswers[idx] || '';
            const displaySample = q.sampleAnswer || 'N/A';

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
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                      <span>Bài mẫu tham khảo</span>
                    </span>
                    <p className="font-normal text-emerald-950 text-[14px] leading-relaxed">
                      {displaySample}
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
          />
        );
      }}
    />
  );
}
