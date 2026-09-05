'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import WritingPart3View, { WritingPart3Item, countWords } from './WritingPart3View';

export interface WritingPart3PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

interface WritingPart3ResultsViewProps {
  userAnswers: Record<number, any>;
  targetQuestions: WritingPart3Item[];
  clubName: string;
  onRetake?: () => void;
}

function WritingPart3ResultsView({
  userAnswers,
  targetQuestions,
  clubName,
}: WritingPart3ResultsViewProps) {
  const [copied, setCopied] = useState(false);

  const formattedClubName = clubName ? clubName.replace(/^Topic:\s*/i, '').trim() : 'Club';
  const instructionSubtitle = `You are communicating online with other members of the ${formattedClubName}. Reply to their questions. Write in sentences. Use 30–40 words per answer. Recommended time: 10 minutes.`;

  const handleCopyForGemini = () => {
    const text = `ĐỀ THI WRITING APTIS - PART 3
Chủ đề: ${formattedClubName}
Hướng dẫn: ${instructionSubtitle}

NỘI DUNG CÂU HỎI VÀ BÀI LÀM CỦA TÔI:
${targetQuestions.map((q, idx) => `Câu ${idx + 1}: ${q.questionText}\n- Bài làm của tôi: ${userAnswers[idx] || '(Chưa điền)'}\n- Bài mẫu tham khảo: ${q.sampleAnswer || 'N/A'}`).join('\n\n')}

YÊU CẦU:
Hãy nhận xét chi tiết 3 câu trả lời của tôi: kiểm tra số lượng từ (yêu cầu 30-40 từ mỗi câu), ngữ pháp, từ vựng và sự mạch lạc trong văn phong hội thoại trực tuyến (social club chat). Gợi ý thêm cách diễn đạt tự nhiên hơn.`;

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
            const displaySample = q.sampleAnswer;

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
                {displaySample && (
                  <div className="text-[14px]">
                    <div className="p-3 bg-[#ecfdf5] border border-emerald-300/90 rounded-xl text-emerald-900 font-normal text-[14px] space-y-1">
                      <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                        <span>Bài mẫu tham khảo</span>
                      </span>
                      <p className="font-normal text-emerald-950 whitespace-pre-line">{displaySample}</p>
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
      partTitle="Part 3 – Three written responses to questions"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={clubName}
      defaultTimeSeconds={600} // 10 mins for Writing Part 3
      subQuestionsPerSet={3}
      pointsPerSubQuestion={3.3333333333333335} // Total max score 10 for Part 3 (3.33 pts per sub-question)
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
      renderDetailedAnswers={({ userAnswers, onRetake }) => {
        const targetQuestions = isAllPractice ? allQuestionsFlat : singleTestQuestions;
        const activeClubName = clubName || 'Club';

        return (
          <WritingPart3ResultsView
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
