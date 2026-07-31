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
            <div className="pt-2 space-y-1.5">
              {taskCompletion.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className={d.isCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                    {d.isCorrect ? '✓' : '✗'} Câu {d.questionIndex}:
                  </span>
                  <span>{d.note}</span>
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

          {/* Detailed Error Corrections Table */}
          {grammarAndSpelling.corrections && grammarAndSpelling.corrections.length > 0 && (
            <div className="pt-2 space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase">
                🛠 Thẻ sửa lỗi chi tiết (Corrections):
              </span>
              {grammarAndSpelling.corrections.map((c, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px]">
                      {c.questionIndex}
                    </span>
                    <span>Câu {c.questionIndex}</span>
                  </div>

                  {/* Original vs Correction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[13px]">
                    <div className="bg-[#fef2f2] border border-[#fecaca] text-red-900 p-2.5 rounded-lg">
                      <span className="font-bold text-[10px] text-red-700 block uppercase font-sans mb-0.5">Bài làm gốc:</span>
                      &ldquo;{c.original}&rdquo;
                    </div>
                    <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-emerald-900 p-2.5 rounded-lg">
                      <span className="font-bold text-[10px] text-emerald-700 block uppercase font-sans mb-0.5">Gợi ý sửa chuẩn:</span>
                      &ldquo;{c.correction}&rdquo;
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-slate-600 font-sans italic text-[12px] pt-1">
                    👉 <strong>Giải thích:</strong> {c.explanation}
                  </p>
                </div>
              ))}
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
            <div className="pt-2 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">💡 Gợi ý nâng cao:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>🔄</span> Chấm lại bài bằng AI
          </button>
        </div>
      )}
    </div>
  );
}
