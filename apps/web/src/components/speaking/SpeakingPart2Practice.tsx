'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import SpeakingPart2View, { SpeakingPart2Data } from './SpeakingPart2View';
import { buildSpeakingPart2FullSetPrompt } from '@/utils/geminiPrompts';

export interface SpeakingPart2PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

export default function SpeakingPart2Practice({
  testIndex = 0,
  onExit,
}: SpeakingPart2PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawSpeaking = (scrapedData as any)?.speaking || {};
  const rawPart2: any[] = rawSpeaking.part2_practice || [];
  const totalSets = rawPart2.length || 37;

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const allTestData: SpeakingPart2Data[] = useMemo(() => {
    return rawPart2.map((item, idx) => ({
      id: `p2_set_${idx + 1}`,
      imageUrl: item.urlpic1 || '',
      questions: [
        {
          num: 1,
          text: item.question1 || 'Describe the picture?',
          sampleAnswer: item.question1_answer || '',
        },
        {
          num: 2,
          text: item.question2 || 'Question 2',
          sampleAnswer: item.question2_answer || '',
        },
        {
          num: 3,
          text: item.question3 || 'Question 3',
          sampleAnswer: item.question3_answer || '',
        },
      ],
    }));
  }, [rawPart2]);

  const currentData = allTestData[safeTestIndex] || allTestData[0];
  const [currentSubIndex, setCurrentSubIndex] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const topicTitle = currentData?.questions[1]?.text
    ? currentData.questions[1].text.replace(/\?.*$/, '')
    : 'Describe a picture';

  const handleCopyAllForGemini = () => {
    const text = buildSpeakingPart2FullSetPrompt(safeTestIndex, currentData.imageUrl, currentData.questions);
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <BasePracticeExam
      moduleName="Speaking"
      partTitle="Part 2 – Describe picture"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={topicTitle}
      defaultTimeSeconds={135} // 3 questions x 45s
      subQuestionsPerSet={3}
      pointsPerSubQuestion={3.33}
      isAnswerCorrect={() => true}
      onExit={onExit}
      renderQuestions={() => {
        return (
          <SpeakingPart2View
            data={currentData}
            currentSubIndex={currentSubIndex}
            onNextQuestion={() => setCurrentSubIndex((prev) => Math.min(prev + 1, currentData.questions.length - 1))}
            onPrevQuestion={() => setCurrentSubIndex((prev) => Math.max(prev - 1, 0))}
          />
        );
      }}
      renderDetailedAnswers={() => {
        return (
          <div className="space-y-6">
            <DetailedAnswersCard
              title="Tổng hợp câu hỏi & gợi ý bài mẫu Part 2"
              subtitle="Miêu tả 1 bức tranh và trả lời 2 câu hỏi mở rộng. Thời gian chuẩn: 45 giây cho mỗi câu."
            >
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleCopyAllForGemini}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-purple-700 hover:to-indigo-700 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedAll ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedAll ? 'Đã sao chép vào Clipboard!' : 'Sao chép toàn bộ đề để luyện cùng Gemini'}</span>
                </button>
              </div>

              {/* Picture Preview */}
              {currentData.imageUrl && (
                <div className="flex justify-center mb-6">
                  <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={currentData.imageUrl}
                      alt="Part 2 Picture"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 text-left">
                {currentData.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <span>Câu hỏi {q.num} (45s)</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {q.text}
                    </h4>

                    {q.sampleAnswer && (
                      <div className="p-4 bg-[#ecfdf5] border border-emerald-200/80 rounded-xl space-y-1.5 text-[14px]">
                        <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                          <span>Gợi ý câu trả lời tham khảo</span>
                        </span>
                        <p className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line">
                          {q.sampleAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DetailedAnswersCard>
          </div>
        );
      }}
    />
  );
}
