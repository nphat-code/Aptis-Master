'use client';

import React from 'react';
import { WritingAiFeedbackResponse } from '@/app/api/writing/evaluate/route';

export interface WritingAiFeedbackCardProps {
  feedback: WritingAiFeedbackResponse;
  onReEvaluate?: () => void;
}

export default function WritingAiFeedbackCard({
  feedback,
  onReEvaluate,
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 text-left p-6 sm:p-8 animate-fast-fade">


      {/* 2. Key Takeaway Conclusion Box */}
      {keyTakeaway && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl space-y-1 text-[14px]">
          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
            📌 Kết luận đánh giá tổng quan
          </span>
          <p className="text-slate-800 font-normal leading-relaxed">
            {keyTakeaway}
          </p>
        </div>
      )}

      {/* 3. Detailed Criteria Assessment */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-slate-900 border-b pb-2">
          Chi tiết nhận xét 3 tiêu chí
        </h4>

        {/* Task Completion */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
              <span className="text-base">🎯</span>
              Hoàn thành nhiệm vụ (Task Completion)
            </h5>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                taskCompletion.status === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : taskCompletion.status === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {taskCompletion.status === 'success' ? 'Hoàn hảo' : taskCompletion.status === 'warning' ? 'Đạt' : 'Cần cải thiện'}
            </span>
          </div>
          <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
            {taskCompletion.summary}
          </p>

          {/* Sub-question detail breakdown if provided */}
          {taskCompletion.details && taskCompletion.details.length > 0 && (
            <div className="pt-2 space-y-2">
              {taskCompletion.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[14px] text-slate-700 leading-relaxed">
                  <span className={`shrink-0 whitespace-nowrap font-bold ${d.isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                    {d.isCorrect ? '✓' : '✗'} Câu {d.questionIndex}:
                  </span>
                  <span className="text-slate-600 font-normal">{d.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grammar & Spelling */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
              <span className="text-base">✍️</span>
              Ngữ pháp & Chính tả (Grammar & Spelling)
            </h5>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                grammarAndSpelling.status === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {grammarAndSpelling.corrections.length === 0 ? 'Không có lỗi' : `${grammarAndSpelling.corrections.length} lỗi cần sửa`}
            </span>
          </div>
          <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
            {grammarAndSpelling.summary}
          </p>

          {/* Detailed Error Corrections Cards - Styled exactly like user design */}
          {grammarAndSpelling.corrections && grammarAndSpelling.corrections.length > 0 && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-[15px]">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                  ✕
                </span>
                <span>Lỗi cần sửa</span>
              </div>

              <div className="space-y-3">
                {grammarAndSpelling.corrections.map((c, idx) => {
                  // Determine error category type (Ngữ pháp or Chính tả)
                  const rawType = c.type || '';
                  const isSpelling =
                    rawType.toLowerCase().includes('chính tả') ||
                    rawType.toLowerCase().includes('spelling') ||
                    c.explanation?.toLowerCase().includes('chính tả') ||
                    c.explanation?.toLowerCase().includes('spelling');
                  const errorTypeLabel = isSpelling ? 'Chính tả' : 'Ngữ pháp';

                  return (
                    <div
                      key={idx}
                      className="bg-[#fef2f2]/80 border border-rose-100/90 rounded-2xl p-4 sm:p-5 space-y-1.5 text-left"
                    >
                      {/* Error Category Header */}
                      <div className="text-slate-500 font-medium text-[14px]">
                        {errorTypeLabel}
                      </div>

                      {/* Original Error with Strikethrough */}
                      <div className="text-rose-500 line-through font-normal text-[15px]">
                        &ldquo;{c.original}&rdquo;
                      </div>

                      {/* Correction with Arrow */}
                      <div className="text-emerald-600 font-normal text-[15px]">
                        ➔ &ldquo;{c.correction}&rdquo;
                      </div>

                      {/* Explanation Text */}
                      <div className="text-slate-500 text-[14px] font-normal leading-relaxed pt-0.5">
                        {c.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary & Range */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
              <span className="text-base">📚</span>
              Từ vựng & Diễn đạt (Vocabulary & Range)
            </h5>
          </div>
          <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
            {vocabulary.summary}
          </p>

          {vocabulary.suggestions && vocabulary.suggestions.length > 0 && (
            <div className="pt-2 text-[14px] space-y-1.5 leading-relaxed">
              <span className="font-bold text-slate-800 block text-[14px]">💡 Gợi ý nâng cao:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 font-normal">
                {vocabulary.suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Re-evaluate button */}
      {onReEvaluate && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onReEvaluate}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[14px] font-medium transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-95 shadow-xs hover:shadow-sm cursor-pointer"
          >
            Chấm lại
          </button>
        </div>
      )}
    </div>
  );
}
