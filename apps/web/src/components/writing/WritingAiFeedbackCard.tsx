'use client';

import React, { useState } from 'react';
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
  const {
    score,
    maxScore = 10,
    cefrLevel,
    bands,
    taskCompletion,
    grammarAndSpelling,
    vocabulary,
    grammarErrors = [],
    spellingErrors = [],
    improvedVersion,
    criteriaAnalysis,
    keyTakeaway,
  } = feedback;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'grammar' | 'spelling'>('all');

  const handleCopyModelAnswer = () => {
    if (!improvedVersion) return;
    navigator.clipboard.writeText(improvedVersion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cefrColorMap: Record<string, string> = {
    C1: 'bg-purple-700 text-white',
    B2: 'bg-indigo-700 text-white',
    B1: 'bg-emerald-700 text-white',
    A2: 'bg-amber-600 text-white',
    A1: 'bg-slate-600 text-white',
    A0: 'bg-rose-600 text-white',
  };

  const badgeColor = cefrColorMap[cefrLevel] || 'bg-[#24085A] text-white';

  const allErrors = [
    ...(grammarAndSpelling?.corrections || []).map((c) => ({
      questionIndex: c.questionIndex,
      type: c.type || (c.explanation?.toLowerCase().includes('chính tả') ? 'Chính tả' : 'Ngữ pháp'),
      original: c.original,
      correction: c.correction,
      explanation: c.explanation,
    })),
    ...grammarErrors.map((g) => ({
      questionIndex: g.questionIndex,
      type: 'Ngữ pháp',
      original: g.original,
      correction: g.corrected,
      explanation: g.explanation,
    })),
    ...spellingErrors.map((s) => ({
      questionIndex: s.questionIndex,
      type: 'Chính tả',
      original: s.original,
      correction: s.corrected,
      explanation: s.explanation,
    })),
  ].filter(
    (err) =>
      Boolean(err.original && err.correction) &&
      err.original.trim().toLowerCase() !== err.correction.trim().toLowerCase() &&
      !err.type?.toLowerCase().includes('độ dài')
  );

  // Deduplicate errors by original + correction
  const uniqueErrors = allErrors.filter(
    (err, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.original?.trim().toLowerCase() === err.original?.trim().toLowerCase() &&
          t.correction?.trim().toLowerCase() === err.correction?.trim().toLowerCase()
      )
  );

  const filteredErrors = uniqueErrors.filter((err) => {
    if (activeTab === 'grammar') return err.type?.toLowerCase().includes('ngữ pháp');
    if (activeTab === 'spelling') return err.type?.toLowerCase().includes('chính tả');
    return true;
  });

  const criteriaList = [
    {
      key: 'tf',
      title: 'Task Fulfillment',
      subtitle: 'Hoàn thành nhiệm vụ',
      score: bands?.tf ?? 0,
      icon: 'target',
      analysis: criteriaAnalysis?.tf,
    },
    {
      key: 'gra',
      title: 'Grammar Accuracy',
      subtitle: 'Độ chính xác ngữ pháp',
      score: bands?.gra ?? 0,
      icon: 'spellcheck',
      analysis: criteriaAnalysis?.gra,
    },
    {
      key: 'vra',
      title: 'Vocabulary Range',
      subtitle: 'Vốn từ & Độ chuẩn xác',
      score: bands?.vra ?? 0,
      icon: 'menu_book',
      analysis: criteriaAnalysis?.vra,
    },
    {
      key: 'cc',
      title: 'Coherence & Cohesion',
      subtitle: 'Tính mạch lạc & Liên kết',
      score: bands?.cc ?? 0,
      icon: 'hub',
      analysis: criteriaAnalysis?.cc,
    },
    {
      key: 'reg',
      title: 'Register & Tone',
      subtitle: 'Văn phong phù hợp',
      score: bands?.reg ?? 0,
      icon: 'forum',
      analysis: criteriaAnalysis?.reg,
    },
  ];

  return (
    <div className="w-full space-y-6 text-left animate-fast-fade font-sans">
      {/* 1. Top Section: Title & Score Header Box */}
      <div className="bg-white border border-[#e5ded3] p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f3ede4] text-[#162544]">
              Aptis ESOL Scoring
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor} shadow-2xs`}>
              CEFR {cefrLevel || 'A1'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#162544] tracking-tight pt-1">
            {partTitle || 'Kết Quả Đánh Giá Writing'}
          </h1>
          <p className="text-[14px] text-slate-600 font-medium">
            Chủ đề: <span className="font-semibold text-slate-800">{clubName || 'General Club'}</span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#162544]">
              {score}
            </span>
            <span className="text-[14px] font-semibold text-slate-500">
              /{maxScore} điểm
            </span>
          </div>

          <span className="px-3.5 py-1 text-[13px] font-bold rounded-full bg-[#FEAD5D] text-white shadow-2xs flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span>
              {score >= 9
                ? 'Excellent (Xuất sắc)'
                : score >= 7
                ? 'Good (Tốt)'
                : score >= 5
                ? 'Pass (Đạt yêu cầu)'
                : score >= 3
                ? 'Satisfactory (Cần cố gắng)'
                : 'Needs Work (Cần ôn luyện lại)'}
            </span>
          </span>
        </div>
      </div>

      {/* 2. Overall Evaluation Conclusion Box */}
      {keyTakeaway && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl space-y-2 text-[14px] shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-2 font-bold text-[#92400E] text-[14px]">
            <span className="material-symbols-outlined text-[#92400E]">push_pin</span>
            <span>Kết luận tổng quan của Giám khảo AI</span>
          </div>
          <p className="text-[#92400E] font-normal leading-relaxed text-[14px]">
            {keyTakeaway}
          </p>
        </div>
      )}

      {/* 3. 5 CEFR Criteria Band Breakdown */}
      <div className="bg-white border border-[#e5ded3] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0e9df] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#FEAD5D]">analytics</span>
            <h2 className="text-base sm:text-lg font-bold text-[#162544]">
              Đánh Giá 5 Tiêu Chí Chuẩn CEFR
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Thang điểm: 0 - 5 điểm/tiêu chí
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {criteriaList.map((item) => (
            <div
              key={item.key}
              className="bg-[#faf8f5] border border-[#ebe4da] rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:border-[#FEAD5D]/60 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[#162544] text-[18px]">
                    {item.icon}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#162544] text-white">
                    {item.score}/5
                  </span>
                </div>
                <p className="font-bold text-[13px] text-[#162544] leading-tight pt-1">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 font-normal">
                  {item.subtitle}
                </p>
              </div>

              {/* Dot visual indicators */}
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`h-1.5 flex-1 rounded-full ${
                      dot <= item.score
                        ? item.score >= 4
                          ? 'bg-emerald-600'
                          : item.score >= 3
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {item.analysis && (
                <p className="text-[11px] text-slate-600 leading-normal border-t border-[#eee7dc] pt-2 line-clamp-2">
                  {item.analysis}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Details Section: 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Column 1: Task Completion & Word Count Check */}
        <div className="bg-white border border-[#e5ded3] p-5 rounded-2xl shadow-2xs flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2 border-b border-[#f0e9df] pb-3">
            <span className="material-symbols-outlined text-[#162544]">checklist</span>
            <h3 className="font-bold text-base text-[#162544]">Hoàn Thành Nhiệm Vụ</h3>
          </div>

          <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
            {taskCompletion?.summary}
          </p>

          {taskCompletion?.details && taskCompletion.details.length > 0 && (
            <ul className="flex flex-col gap-2 font-normal text-[14px] text-slate-800 mt-auto pt-2">
              {taskCompletion.details.map((d, idx) => (
                <li
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${
                    d.isCorrect
                      ? 'bg-[#ecfdf5] border-emerald-200 text-emerald-900'
                      : 'bg-[#fef2f2] border-rose-200 text-rose-900'
                  }`}
                >
                  <span className="text-[13px] font-medium">
                    Câu {d.questionIndex} {d.note ? `– ${d.note}` : ''}
                  </span>
                  <span
                    className={`material-symbols-outlined text-lg shrink-0 ml-2 ${
                      d.isCorrect ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {d.isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Column 2: Grammar & Spelling Corrections */}
        <div className="bg-white border border-[#e5ded3] p-5 rounded-2xl shadow-2xs flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between border-b border-[#f0e9df] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#162544]">spellcheck</span>
              <h3 className="font-bold text-base text-[#162544]">Sửa Lỗi Chi Tiết</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f3ede4] text-[#162544]">
              {uniqueErrors.length} lỗi
            </span>
          </div>

          {uniqueErrors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 bg-[#ecfdf5] border border-emerald-200 rounded-xl my-auto text-center">
              <span className="material-symbols-outlined text-4xl text-emerald-600 mb-1">verified</span>
              <p className="font-bold text-base text-emerald-900">0 lỗi ngữ pháp / chính tả</p>
              <p className="text-xs text-emerald-700 font-normal pt-0.5">Tuyệt vời! Bài viết của bạn rất chuẩn xác.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 flex flex-col">
              {/* Tab Filter */}
              <div className="flex gap-1.5 p-1 bg-[#f3ede4] rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-1 rounded-md transition-colors ${
                    activeTab === 'all' ? 'bg-white text-[#162544] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({uniqueErrors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('grammar')}
                  className={`flex-1 py-1 rounded-md transition-colors ${
                    activeTab === 'grammar' ? 'bg-white text-[#162544] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ngữ pháp
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('spelling')}
                  className={`flex-1 py-1 rounded-md transition-colors ${
                    activeTab === 'spelling' ? 'bg-white text-[#162544] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Chính tả
                </button>
              </div>

              {/* Error list */}
              <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
                {filteredErrors.map((c, idx) => (
                  <div
                    key={idx}
                    className="bg-[#fef2f2] border border-rose-200 rounded-xl p-3 space-y-1.5 text-[13px]"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                      <span>{c.type || 'Ngữ pháp'}</span>
                      {c.questionIndex && (
                        <span className="text-[11px] text-slate-500 font-normal">Câu {c.questionIndex}</span>
                      )}
                    </div>
                    <div className="text-rose-700 line-through font-normal">
                      &ldquo;{c.original}&rdquo;
                    </div>
                    <div className="text-emerald-800 font-semibold bg-[#ecfdf5] border border-emerald-200 px-2 py-1 rounded-md">
                      ➔ &ldquo;{c.correction}&rdquo;
                    </div>
                    <p className="text-slate-600 text-xs font-normal leading-normal pt-0.5">
                      {c.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Vocabulary Enhancement */}
        <div className="bg-white border border-[#e5ded3] p-5 rounded-2xl shadow-2xs flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2 border-b border-[#f0e9df] pb-3">
            <span className="material-symbols-outlined text-[#162544]">menu_book</span>
            <h3 className="font-bold text-base text-[#162544]">Nâng Cấp Từ Vựng</h3>
          </div>

          <p className="text-[14px] text-slate-700 font-normal leading-relaxed">
            {vocabulary?.summary}
          </p>

          {vocabulary?.suggestions && vocabulary.suggestions.length > 0 && (
            <div className="bg-[#faf8f5] border border-[#ebe4da] p-3.5 rounded-xl space-y-2 mt-auto text-[13px]">
              <h4 className="font-bold text-xs text-[#162544] uppercase tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#FEAD5D]">lightbulb</span>
                <span>Gợi ý mở rộng Band điểm:</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-normal text-[13px] leading-relaxed">
                {vocabulary.suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 5. Improved Version / Model Answer Box */}
      {improvedVersion && (
        <div className="bg-white border border-[#e5ded3] p-5 sm:p-6 rounded-2xl shadow-2xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#f0e9df] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FEAD5D]">auto_awesome</span>
              <h3 className="font-bold text-base sm:text-lg text-[#162544]">
                Bài Viết Mẫu Nâng Band (CEFR B2 / C1 Reference)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopyModelAnswer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3ede4] hover:bg-[#e8dfd2] text-[#162544] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-[#faf8f5] border border-[#ebe4da] p-4 sm:p-5 rounded-xl text-[14px] text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
            {improvedVersion}
          </div>

          <p className="text-xs text-slate-500 font-normal italic">
            * Tham khảo cấu trúc câu, từ nối và từ vựng nâng cao ở bài mẫu trên để áp dụng vào các bài thi tiếp theo.
          </p>
        </div>
      )}

      {/* 6. Bottom Action Buttons */}
      {(onReEvaluate || onRetake) && (
        <div className="pt-4 border-t border-[#e5ded3] flex flex-wrap items-center justify-center gap-3">
          {onReEvaluate && (
            <button
              type="button"
              onClick={onReEvaluate}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-[14px] font-semibold transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-600 text-lg">refresh</span>
              <span>Chấm lại bài</span>
            </button>
          )}

          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FEAD5D] hover:bg-[#ea9c4d] text-white text-[14px] font-bold transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              <span>Làm lại bài</span>
              <span className="material-symbols-outlined text-white text-lg">arrow_forward</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
