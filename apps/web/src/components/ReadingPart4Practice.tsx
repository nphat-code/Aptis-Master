'use client';

import React from 'react';
import scrapedData from '../../../../scraped_data.json';
import BasePracticeExam from './exam/BasePracticeExam';
import QuestionInstructionHeader from './exam/QuestionInstructionHeader';
import DetailedAnswersCard, { AnswerDiffBadge } from './exam/DetailedAnswersCard';

interface Question4Item {
  question: string;
  id: string;
  options: string[];
  answer: string;
}

interface ReadingPart4PracticeProps {
  testIndex: number; // 0-based index for tests, or -1 for Marathon
  onExit: () => void;
}

export default function ReadingPart4Practice({
  testIndex = 0,
  onExit,
}: ReadingPart4PracticeProps) {
  const isAllPractice = testIndex === -1;
  const rawPassagesList: string[][] = scrapedData?.reading?.question4?.question4Text || [];
  const rawQuestionsList: Question4Item[][] = (scrapedData?.reading?.question4 as any)?.question4Content || [];
  const topicMap: Record<string, string> = scrapedData?.reading?.question4?.question4Topic1 || {};

  const totalSets = Math.min(rawPassagesList.length, rawQuestionsList.length);
  const safeTestIndex = isAllPractice ? 0 : (testIndex % totalSets);

  const singleQuestions = rawQuestionsList[safeTestIndex] || [];
  const allQuestionsFlat = rawQuestionsList.flat();
  const currentTopicKey = `topic${safeTestIndex + 1}`;
  const topicTitle = topicMap[currentTopicKey] || '';

  return (
    <BasePracticeExam
      moduleName="Reading"
      partTitle="Part 4 – Opinion matching"
      testIndex={testIndex}
      totalSets={totalSets}
      topicTitle={topicTitle}
      defaultTimeSeconds={420}
      subQuestionsPerSet={7}
      pointsPerSubQuestion={16 / 7}
      isAnswerCorrect={(idx, val) => {
        const targetQ = isAllPractice ? allQuestionsFlat[idx] : singleQuestions[idx];
        return val === targetQ?.answer;
      }}
      onExit={onExit}
      renderQuestions={({ currentQuestionIndex, userAnswers, onAnswer, isReviewMode, showExplanation }) => {
        const activeSetIndex = isAllPractice ? currentQuestionIndex : safeTestIndex;
        const currentPassages = rawPassagesList[activeSetIndex] || [];
        const currentQuestions = rawQuestionsList[activeSetIndex] || [];
        const activeTopicKey = `topic${activeSetIndex + 1}`;
        const activeTopicTitle = topicMap[activeTopicKey] || '';

        const introHtml = currentPassages[0] || '<strong>Here is the perspective of four people on the above topic. Please read the content and answer the question.</strong>';
        const personPassages = currentPassages.slice(1, 5);

        return (
          <>
            <QuestionInstructionHeader>
              Read the four texts below and answer the 7 questions.
            </QuestionInstructionHeader>

            {/* Minimalist Single White Box for All 4 Person Passages */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6 text-left">
              {personPassages.map((text, pIdx) => {
                const personLetter = String.fromCharCode(65 + pIdx);
                const cleanContent = text.replace(/^<strong>[A-D]:<\/strong>\s*/i, '');

                return (
                  <div key={pIdx} className="space-y-1.5 border-b border-slate-100 last:border-none pb-5 last:pb-0">
                    <h4 className="font-extrabold text-[14px] text-slate-900">
                      {personLetter}
                    </h4>
                    <div 
                      className="text-[14px] text-slate-800 leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Single Unified White Container for All 7 Questions */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4 text-left">
              {currentQuestions.map((qItem, qIdx) => {
                const answerKey = isAllPractice ? (currentQuestionIndex * 7 + qIdx) : qIdx;
                const selectedVal = userAnswers[answerKey] || '';
                const isChecked = isReviewMode || showExplanation;
                const isCorr = selectedVal === qItem.answer;

                return (
                  <div
                    key={qIdx}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 last:border-none pb-3.5 last:pb-0"
                  >
                    {/* Question Statement Text on the Left */}
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="font-extrabold text-[#24085A] text-[14px] min-w-[24px]">
                        {qIdx + 1}.
                      </span>
                      <p className="text-[14px] font-medium text-slate-900 leading-snug">
                        {qItem.question}
                      </p>
                    </div>

                    {/* Dropdown Select + Answer Feedback Indicator on the Right */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        disabled={isReviewMode}
                        value={selectedVal}
                        onChange={(e) => onAnswer(answerKey, e.target.value)}
                        className={`px-3.5 py-1.5 text-[14px] appearance-auto min-w-[85px] rounded-lg transition-all font-semibold cursor-pointer ${
                          isChecked
                            ? isCorr
                              ? 'border-2 border-emerald-500 bg-white text-emerald-700 font-bold'
                              : selectedVal
                              ? 'border-2 border-red-500 bg-white text-red-700 font-bold'
                              : 'border border-slate-300 bg-white text-slate-600'
                            : 'bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:border-[#24085A] focus:ring-[#24085A]/20 hover:border-slate-400'
                        }`}
                      >
                        <option value="">—</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>

                      {/* Answer Feedback Indicator (Shown during Review / Check Answer mode) */}
                      {isChecked && (
                        <div className="flex items-center gap-1.5 min-w-[55px]">
                          {isCorr ? (
                            <span className="w-5 h-5 rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center text-[11px] font-bold">
                              ✓
                            </span>
                          ) : (
                            <>
                              <span className="w-5 h-5 rounded-full border border-red-500 text-red-500 flex items-center justify-center text-[11px] font-bold">
                                ✕
                              </span>
                              <span className="text-emerald-600 font-extrabold text-sm flex items-center gap-0.5">
                                <span>→</span>
                                <span>{qItem.answer}</span>
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
      renderDetailedAnswers={({ userAnswers }) => (
        <DetailedAnswersCard
          title="Chi tiết bài làm"
          subtitle="Read the four texts below and answer the 7 questions."
        >
          {(isAllPractice ? allQuestionsFlat : singleQuestions).map((qItem, idx) => {
            const userAns = userAnswers[idx] || '';
            const isCorr = userAns === qItem.answer;

            return (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 text-left shadow-2xs">
                <div className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                  <span className="text-[#24085A] font-bold">{idx + 1}.</span>
                  <p className="text-slate-800">{qItem.question}</p>
                </div>

                <div className="pl-6 pt-1">
                  <AnswerDiffBadge
                    userAnswer={userAns}
                    correctAnswer={qItem.answer}
                    isCorrect={isCorr}
                  />
                </div>
              </div>
            );
          })}
        </DetailedAnswersCard>
      )}
    />
  );
}
