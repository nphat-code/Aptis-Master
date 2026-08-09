'use client';

import React from 'react';
import { WritingAiFeedbackResponse } from '@/app/api/writing/evaluate/route';

export interface WritingAiFeedbackCardProps {
  feedback: WritingAiFeedbackResponse;
  partTitle?: string;
  clubName?: string;
  onReEvaluate?: () => void;
  onRetake?: () => void;
}

export default function WritingAiFeedbackCard({
  feedback,
  partTitle,
  clubName,
  onReEvaluate,
  onRetake,
}: WritingAiFeedbackCardProps) {
  const { score, maxScore, cefrLevel, taskCompletion, grammarAndSpelling, vocabulary, keyTakeaway } = feedback;

  const cefrColorMap: Record<string, string> = {
    C1: 'bg-purple-600 text-white',
    B2: 'bg-indigo-600 text-white',
    B1: 'bg-emerald-600 text-white',
    A2: 'bg-amber-500 text-white',
    A1: 'bg-slate-500 text-white',
  };

  const badgeColor = cefrColorMap[cefrLevel] || 'bg-[#24085A] text-white';

  return (
    <div className="w-full space-y-6 text-left animate-fast-fade font-sans">
      {/* 1. Top Section: Title & Score Header Box */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-[#24085A] tracking-tight">
            {partTitle || 'Kết Quả Đánh Giá Writing - Part 1'}
          </h1>
          <p className="text-[14px] text-slate-600 font-medium">
            Chủ đề: {clubName || 'General Club'}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#24085A]">
              {score}
            </span>
            <span className="text-[14px] font-semibold text-slate-500">
              /{maxScore || 3} điểm
            </span>
          </div>

          {maxScore === 10 ? (
            <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>{score >= 9 ? 'Excellent' : score >= 7 ? 'Good' : score >= 5 ? 'Pass' : score >= 3 ? 'Satisfactory' : 'Needs Work'}</span>
            </span>
          ) : maxScore === 3 ? (
            <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>{score === 3 ? 'Above A1 (Excellent)' : score === 2 ? 'A1.2 (Good)' : score === 1 ? 'A1.1 (Pass)' : 'A0 (Needs Work)'}</span>
            </span>
          ) : maxScore === 5 ? (
            <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>{score === 5 ? 'Above A1.2 (Excellent)' : score === 4 ? 'A2.1 (Good)' : score === 3 ? 'A1.2 (Pass)' : score === 2 ? 'A1.1 (Satisfactory)' : 'A0 (Needs Work)'}</span>
            </span>
          ) : maxScore === 15 ? (
            <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>{score >= 14 ? 'B2 (Excellent)' : score >= 11 ? 'B1.2 (Good)' : score >= 8 ? 'B1.1 (Pass)' : score >= 5 ? 'A2.2 (Satisfactory)' : 'A0 (Needs Work)'}</span>
            </span>
          ) : maxScore === 25 ? (
            <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>{score >= 23 ? 'C1 (Advanced)' : score >= 19 ? 'B2 (Upper-Inter)' : score >= 14 ? 'B1.2 (Intermediate)' : score >= 9 ? 'B1.1 (Pass)' : 'A0 (Needs Work)'}</span>
            </span>
          ) : (
            <span className={`px-3.5 py-1 text-[13px] font-bold rounded-full ${badgeColor} shadow-xs flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>Trình độ: {cefrLevel}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Overall Evaluation Conclusion Box */}
      {keyTakeaway && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl space-y-2 text-[14px] shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 font-bold text-[#92400E] text-[14px]">
            <span className="material-symbols-outlined text-[#92400E]">push_pin</span>
            <span>Kết luận tổng quan</span>
          </div>
          <p className="text-[#92400E] font-normal leading-relaxed text-[14px]">
            {keyTakeaway}
          </p>
        </div>
      )}

      {/* 3. AI 3-Criteria Bento Grid Section */}
      <div className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Task Completion */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col gap-3 hover:border-[#24085A] transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-[#24085A]">target</span>
              <h3 className="font-bold text-base text-[#24085A]">Task Completion</h3>
            </div>

            {/* Sub-question detail checklist */}
            {taskCompletion.details && taskCompletion.details.length > 0 ? (
              <ul className="flex flex-col gap-2 font-normal text-[14px] text-slate-800 mt-auto">
                {taskCompletion.details.map((d, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-100/80 rounded-lg"
                  >
                    <span>
                      Câu {d.questionIndex} {d.note ? `(${d.note})` : ''}
                    </span>
                    <span className={`material-symbols-outlined text-lg ${d.isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {d.isCorrect ? 'check_circle' : 'cancel'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-slate-600 font-normal leading-relaxed">
                {taskCompletion.summary}
              </p>
            )}
          </div>

          {/* Card 2: Grammar & Spelling */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col gap-3 hover:border-[#24085A] transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-[#24085A]">edit_document</span>
              <h3 className="font-bold text-base text-[#24085A]">Grammar &amp; Spelling</h3>
            </div>

            {grammarAndSpelling.corrections.length === 0 ? (
              <div className="flex items-center justify-center p-6 bg-slate-100/80 rounded-xl my-auto text-center">
                <div>
                  <span className="material-symbols-outlined text-4xl text-emerald-600 mb-1">verified</span>
                  <p className="font-bold text-base text-slate-900">0 lỗi phát hiện</p>
                  <p className="text-xs text-slate-500 font-normal">Tuyệt vời! Bạn không mắc lỗi nào.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1 overflow-y-auto max-h-[240px]">
                {grammarAndSpelling.corrections.map((c, idx) => {
                  const rawType = c.type || '';
                  const isSpelling =
                    rawType.toLowerCase().includes('chính tả') ||
                    rawType.toLowerCase().includes('spelling') ||
                    c.explanation?.toLowerCase().includes('chính tả');

                  return (
                    <div
                      key={idx}
                      className="bg-[#fef2f2] border border-rose-200/80 rounded-xl p-3 space-y-1 text-[14px]"
                    >
                      <div className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                        {isSpelling ? 'Chính tả' : 'Ngữ pháp'}
                      </div>
                      <div className="text-rose-600 line-through font-normal text-[14px]">
                        &ldquo;{c.original}&rdquo;
                      </div>
                      <div className="text-emerald-700 font-semibold text-[14px]">
                        ➔ &ldquo;{c.correction}&rdquo;
                      </div>
                      <p className="text-slate-600 text-xs font-normal leading-normal pt-0.5">
                        {c.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 3: Vocabulary */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col gap-3 hover:border-[#24085A] transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-[#24085A]">menu_book</span>
              <h3 className="font-bold text-base text-[#24085A]">Vocabulary</h3>
            </div>

            <p className="text-[14px] text-slate-600 font-normal leading-relaxed">
              {vocabulary.summary}
            </p>

            {vocabulary.suggestions && vocabulary.suggestions.length > 0 && (
              <div className="bg-slate-100/80 p-3 rounded-lg space-y-1.5 mt-auto text-[14px]">
                <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wide">
                  Vocabulary Suggestions:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 font-normal text-[14px] leading-relaxed">
                  {vocabulary.suggestions.map((sug, idx) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons Row */}
      {(onReEvaluate || onRetake) && (
        <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-3">
          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-[14px] font-semibold transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-600 text-lg">refresh</span>
              <span>Chấm lại bài</span>
            </button>
          )}

          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#24085A] hover:bg-[#1a0642] text-white text-[14px] font-semibold transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <span>Làm lại</span>
              <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

