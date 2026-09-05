'use client';

import React, { useState, useEffect } from 'react';

export interface SpeakingPart4Data {
  id: string;
  topic: string;
  questions: string[];
  sampleAnswer: string;
}

interface SpeakingPart4ViewProps {
  data: SpeakingPart4Data;
}

export default function SpeakingPart4View({ data }: SpeakingPart4ViewProps) {
  // Phase: 'prep' (60s) or 'speak' (120s)
  const [phase, setPhase] = useState<'prep' | 'speak'>('prep');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showSample, setShowSample] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setPhase('prep');
    setTimeLeft(60);
    setIsRunning(true);
    setShowSample(false);
  }, [data.id]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      if (phase === 'prep') {
        // Switch to speaking phase (120 seconds)
        setPhase('speak');
        setTimeLeft(120);
      } else {
        setIsRunning(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, phase]);

  const cleanText = (htmlStr?: string) => {
    if (!htmlStr) return '';
    return htmlStr.replace(/<[^>]+>/g, '').trim();
  };

  const handleCopy = () => {
    const promptText = `CÂU HỎI LUYỆN NÓI APTIS - SPEAKING PART 4 (Personal Experience)
Chủ đề: "${data.topic}"
Cấu trúc: 1 phút chuẩn bị + 2 phút nói liên tục (Long turn)

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc bài nói 2 phút của tôi về chủ đề trên, sau đó:
1. Đánh giá tính liên kết (coherence & cohesion), vốn từ vựng học thuật/idiomatic expressions, ngữ pháp và cấu trúc kể chuyện (narrative tenses).
2. Gợi ý phiên bản bài nói mẫu hoàn chỉnh đạt band C1 Aptis.`;

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-question">
      {/* Top Header & Two-phase Timer */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#162544] text-white text-xs font-bold px-3 py-1 rounded-full">
            Part 4 – Long Turn
          </span>
          <span className="text-xs text-slate-500 font-medium">1p chuẩn bị • 2p nói liên tục</span>
        </div>

        {/* Phase Badge & Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold ${
            phase === 'prep'
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {phase === 'prep' ? 'edit_note' : 'mic'}
            </span>
            <span>
              {phase === 'prep' ? 'Chuẩn bị' : 'Đang nói'}: {formatTime(timeLeft)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isRunning ? 'Tạm dừng' : 'Tiếp tục'}
          >
            <span className="material-symbols-outlined text-[16px] block">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {phase === 'prep' && (
            <button
              type="button"
              onClick={() => {
                setPhase('speak');
                setTimeLeft(120);
                setIsRunning(true);
              }}
              className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Bỏ qua thời gian chuẩn bị và bắt đầu nói ngay"
            >
              Nói ngay
            </button>
          )}
        </div>
      </div>

      {/* Main Question / Topic Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
              Chủ đề trải nghiệm cá nhân
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            {data.topic}
          </h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-[14px] text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
              Gợi ý các ý cần triển khai trong bài nói 2 phút:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[14px] text-slate-600">
              <li>Kể lại sự việc đã xảy ra khi nào, ở đâu, cùng với ai?</li>
              <li>Bạn đã cảm thấy thế nào hoặc gặp những khó khăn gì?</li>
              <li>Kết quả cuối cùng ra sao và bài học/cảm nghĩ của bạn là gì?</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:from-purple-700 hover:to-indigo-700 hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Đã sao chép vào Clipboard!' : 'Sao chép đề để luyện cùng Gemini'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSample(!showSample)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showSample ? 'visibility_off' : 'lightbulb'}
            </span>
            <span>{showSample ? 'Ẩn dàn ý & bài mẫu' : 'Xem dàn ý & bài mẫu'}</span>
          </button>
        </div>

        {/* Sample Answer Accordion */}
        {showSample && data.sampleAnswer && (
          <div className="p-5 bg-[#ecfdf5] border border-emerald-300/80 rounded-2xl space-y-3 animate-fast-fade text-[14px]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#064e3b] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
              <span>Dàn ý mẫu & Gợi ý câu trả lời tham khảo (Band C1)</span>
            </div>
            <div
              className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: data.sampleAnswer }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
