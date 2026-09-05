'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { buildSpeakingPart2GeminiPrompt } from '@/utils/geminiPrompts';

export interface SpeakingPart2Data {
  id: string;
  imageUrl: string;
  questions: Array<{
    num: number;
    text: string;
    sampleAnswer: string;
  }>;
}

interface SpeakingPart2ViewProps {
  data: SpeakingPart2Data;
  currentSubIndex: number;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
}

export default function SpeakingPart2View({
  data,
  currentSubIndex,
  onNextQuestion,
  onPrevQuestion,
}: SpeakingPart2ViewProps) {
  const currentQ = data.questions[currentSubIndex] || data.questions[0];
  const totalSub = data.questions.length;

  // 45-second timer per question
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showSample, setShowSample] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(45);
    setIsRunning(true);
    setShowSample(false);
  }, [currentSubIndex]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleCopy = () => {
    if (!currentQ) return;
    const promptText = buildSpeakingPart2GeminiPrompt(currentQ.num, currentQ.text);
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-question">
      {/* Sub-question progress & Timer bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#162544] text-white text-xs font-bold px-3 py-1 rounded-full">
            Câu {currentSubIndex + 1} / {totalSub}
          </span>
          <span className="text-xs text-slate-500 font-medium">Part 2 – Describe picture</span>
        </div>

        {/* 45s Countdown timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
            timeLeft <= 5
              ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
              : 'bg-orange-50 text-[#CC1C01] border-orange-200'
          }`}>
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isRunning ? 'Tạm dừng đếm ngược' : 'Tiếp tục đếm ngược'}
          >
            <span className="material-symbols-outlined text-[16px] block">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Image on Left / Top, Question on Right / Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Picture */}
        <div className="md:col-span-6 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col items-center">
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl}
                alt="Aptis Speaking Part 2 Picture"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Không có hình ảnh
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2">
            Hình ảnh minh họa cho cả 3 câu hỏi của Part 2
          </span>
        </div>

        {/* Right Column: Question Card */}
        <div className="md:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Question {currentSubIndex + 1}
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentQ.text}
            </h3>
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
              <span>{showSample ? 'Ẩn câu trả lời mẫu' : 'Xem câu trả lời mẫu'}</span>
            </button>
          </div>

          {/* Sample Answer Accordion */}
          {showSample && currentQ.sampleAnswer && (
            <div className="p-4 bg-[#ecfdf5] border border-emerald-300/80 rounded-2xl space-y-2 animate-fast-fade text-[14px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#064e3b] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">auto_awesome</span>
                <span>Gợi ý câu trả lời tham khảo</span>
              </div>
              <p className="text-[14px] text-emerald-950 font-normal leading-relaxed whitespace-pre-line">
                {currentQ.sampleAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrevQuestion}
          disabled={currentSubIndex === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
            currentSubIndex === 0
              ? 'opacity-40 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Câu trước</span>
        </button>

        <button
          type="button"
          onClick={onNextQuestion}
          disabled={currentSubIndex === totalSub - 1}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentSubIndex === totalSub - 1
              ? 'opacity-40 bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-[#162544] text-white hover:bg-[#0f1a30] shadow-sm'
          }`}
        >
          <span>Câu tiếp theo</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
