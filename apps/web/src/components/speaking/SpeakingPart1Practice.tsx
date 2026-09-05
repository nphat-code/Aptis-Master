'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import SpeakingPart1View, { SpeakingPart1Question } from './SpeakingPart1View';
import { buildSpeakingPart1FullSetPrompt } from '@/utils/geminiPrompts';

export interface SpeakingPart1PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

export default function SpeakingPart1Practice({
  testIndex = 0,
  onExit,
}: SpeakingPart1PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawSpeaking = (scrapedData as any)?.speaking || {};
  const rawPart1: any[] = rawSpeaking.part1_practice || [];

  // Group 28 questions into sets of 3 questions
  const totalQuestions = rawPart1.length || 28;
  const subPerSet = 3;
  const totalSets = Math.ceil(totalQuestions / subPerSet); // 10 sets

  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  // Structured question list grouped by sets
  const allTestSets: SpeakingPart1Question[][] = useMemo(() => {
    const sets: SpeakingPart1Question[][] = [];
    for (let i = 0; i < totalSets; i++) {
      const startIndex = i * subPerSet;
      const chunk = rawPart1.slice(startIndex, startIndex + subPerSet);
      sets.push(
        chunk.map((item, idx) => ({
          id: `p1_set${i + 1}_q${idx + 1}`,
          questionNum: idx + 1,
          questionText: item.question || `Question ${idx + 1}`,
          answer1: item.answer1 || '',
          answer2: item.answer2 || '',
        }))
      );
    }
    return sets;
  }, [rawPart1, totalSets]);

  const currentQuestions = allTestSets[safeTestIndex] || allTestSets[0] || [];
  const [currentSubIndex, setCurrentSubIndex] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const topicTitle = currentQuestions[0]?.questionText
    ? currentQuestions[0].questionText.replace(/\?.*$/, '')
    : 'Personal information';

  const handleCopyAllForGemini = () => {
    const text = buildSpeakingPart1FullSetPrompt(safeTestIndex, currentQuestions);
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <BasePracticeExam
      moduleName="Speaking"
      partTitle="Part 1 – Personal info"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={topicTitle}
      defaultTimeSeconds={90} // 3 questions x 30s
      subQuestionsPerSet={subPerSet}
      pointsPerSubQuestion={3.33}
      isAnswerCorrect={() => true}
      onExit={onExit}
      renderQuestions={() => {
        return (
          <SpeakingPart1View
            questions={currentQuestions}
            currentSubIndex={currentSubIndex}
            onNextQuestion={() => setCurrentSubIndex((prev) => Math.min(prev + 1, currentQuestions.length - 1))}
            onPrevQuestion={() => setCurrentSubIndex((prev) => Math.max(prev - 1, 0))}
          />
        );
      }}
      renderDetailedAnswers={() => {
        return (
          <div className="space-y-6">
            <DetailedAnswersCard
              title="Tổng hợp câu hỏi & gợi ý bài mẫu Part 1"
              subtitle="Trả lời 3 câu hỏi về thông tin cá nhân. Thời gian chuẩn: 30 giây cho mỗi câu."
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

              <div className="space-y-4 text-left">
                {currentQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-5 border border-slate-200/80 bg-white text-left space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <span>Câu hỏi {idx + 1} (30s)</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {q.questionText}
                    </h4>

                    {/* Sample Answers Box */}
                    <div className="p-4 bg-[#ecfdf5] border border-emerald-200/80 rounded-xl space-y-2 text-[14px]">
                      <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                        <span>Gợi ý câu trả lời tham khảo</span>
                      </span>

                      {q.answer1 && (
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-emerald-800">Cách 1:</span>
                          <p className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line">
                            {q.answer1}
                          </p>
                        </div>
                      )}

                      {q.answer2 && (
                        <div className="space-y-0.5 pt-2 border-t border-emerald-200/60">
                          <span className="text-xs font-semibold text-emerald-800">Cách 2:</span>
                          <p className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line">
                            {q.answer2}
                          </p>
                        </div>
                      )}
                    </div>
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
