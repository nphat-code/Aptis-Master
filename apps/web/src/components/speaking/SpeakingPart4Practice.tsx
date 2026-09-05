'use client';

import React, { useMemo, useState } from 'react';
import scrapedData from '@/data/scraped_data.json';
import BasePracticeExam from '../exam/BasePracticeExam';
import DetailedAnswersCard from '../exam/DetailedAnswersCard';
import SpeakingPart4View, { SpeakingPart4Data } from './SpeakingPart4View';
import { buildSpeakingPart4FullSetPrompt } from '@/utils/geminiPrompts';

export interface SpeakingPart4PracticeProps {
  testIndex?: number;
  onExit: () => void;
}

export default function SpeakingPart4Practice({
  testIndex = 0,
  onExit,
}: SpeakingPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawSpeaking = (scrapedData as any)?.speaking || {};
  const rawPart4: any[] = rawSpeaking.part4_practice || [];

  // Slice off index 0 (general template) if length > 1
  const topicsList = useMemo(() => {
    if (rawPart4.length > 1) {
      return rawPart4.slice(1);
    }
    return rawPart4;
  }, [rawPart4]);

  const totalSets = topicsList.length || 52;
  const safeTestIndex = isAllPractice ? 0 : (((testIndex % totalSets) + totalSets) % totalSets);

  const allTestData: SpeakingPart4Data[] = useMemo(() => {
    return topicsList.map((item, idx) => ({
      id: `p4_topic_${idx + 1}`,
      topic: item.question || `Topic ${idx + 1}`,
      questions: [
        'Kể lại sự việc diễn ra thế nào?',
        'Cảm xúc hoặc khó khăn bạn đối mặt?',
        'Kết quả và bài học rút ra?',
      ],
      sampleAnswer: item.answer1 || '',
    }));
  }, [topicsList]);

  const currentData = allTestData[safeTestIndex] || allTestData[0];
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const cleanTitle = currentData?.topic
    ? currentData.topic.replace(/\s*\(.*\)\s*$/, '').trim()
    : 'Personal experience';

  const cleanText = (htmlStr?: string) => {
    if (!htmlStr) return '';
    return htmlStr.replace(/<[^>]+>/g, '').trim();
  };

  const handleCopyAllForGemini = () => {
    const text = buildSpeakingPart4FullSetPrompt(currentData.topic, cleanText(currentData.sampleAnswer));
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <BasePracticeExam
      moduleName="Speaking"
      partTitle="Part 4 – Personal experience"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={cleanTitle}
      defaultTimeSeconds={180} // 1 min prep + 2 mins speak = 3 mins (180s)
      subQuestionsPerSet={1}
      pointsPerSubQuestion={10}
      isAnswerCorrect={() => true}
      onExit={onExit}
      renderQuestions={() => {
        return <SpeakingPart4View data={currentData} />;
      }}
      renderDetailedAnswers={() => {
        return (
          <div className="space-y-6">
            <DetailedAnswersCard
              title="Tổng hợp chủ đề & dàn ý bài mẫu Part 4"
              subtitle="Trả lời 3 câu hỏi sâu về trải nghiệm cá nhân. Thời gian: 1 phút chuẩn bị và 2 phút nói liên tục."
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
                  <span>{copiedAll ? 'Đã sao chép vào Clipboard!' : 'Sao chép đề để luyện cùng Gemini'}</span>
                </button>
              </div>

              <div className="space-y-5 text-left">
                <div className="rounded-2xl p-6 border border-slate-200/80 bg-white text-left space-y-4 shadow-2xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    Chủ đề bài thi
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {currentData.topic}
                  </h3>

                  {currentData.sampleAnswer && (
                    <div className="p-5 bg-[#ecfdf5] border border-emerald-200/80 rounded-xl space-y-2 text-[14px]">
                      <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                        <span>Dàn ý mẫu & Gợi ý câu trả lời tham khảo (Band C1)</span>
                      </span>
                      <div
                        className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: currentData.sampleAnswer }}
                      />
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
