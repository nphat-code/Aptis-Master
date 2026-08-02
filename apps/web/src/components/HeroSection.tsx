'use client';

import React from 'react';

interface HeroSectionProps {
  onStartMockTest?: () => void;
  onStartPractice?: () => void;
}

export default function HeroSection({ onStartMockTest, onStartPractice }: HeroSectionProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 grid md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[780px] pt-32 pb-20">
      
      {/* Left Column: Headline & Action Buttons */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] font-bold mb-6 text-xs uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>AI-POWERED PREPARATION 2026</span>
        </div>

        <h1 className="text-3xl sm:text-[48px] font-extrabold text-white mb-6 leading-[1.15] tracking-tight">
          Hệ Thống Luyện Thi <br />
          <span className="text-[#4edea3] drop-shadow-[0_0_20px_rgba(78,222,163,0.4)]">
            Aptis ESOL 2026
          </span>
        </h1>

        <p className="text-[#bbcabf] text-base sm:text-lg font-normal mb-10 max-w-xl leading-relaxed">
          Sử dụng mô hình ngôn ngữ lớn để phân tích lỗi sai và dự đoán chính xác trình độ B1/B2/C1 của bạn chỉ sau 1 bài test nhanh.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={onStartMockTest}
            className="bg-[#4edea3] text-[#003824] px-8 py-4 rounded-full font-extrabold text-sm sm:text-base flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(78,222,163,0.3)] cursor-pointer"
          >
            <span>⚡ Thử sức đề thi ngẫu nhiên</span>
          </button>
          <button
            onClick={onStartPractice}
            className="glass-panel text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white/5 transition-all border border-white/20 cursor-pointer"
          >
            <span>🎯 Kiểm tra trình độ miễn phí</span>
          </button>
        </div>
      </div>

      {/* Right Column: AI Diagnostic Center Widget */}
      <div className="relative">
        <div className="absolute -inset-10 bg-[#4edea3]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="glass-panel p-8 sm:p-10 rounded-[32px] relative overflow-hidden border-white/10 shadow-2xl">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">AI Diagnostic Center</h3>
              <p className="text-xs text-[#bbcabf]">Real-time performance metrics</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="86" stroke="currentColor" strokeWidth="12" />
                <circle
                  className="text-[#4edea3] transition-all duration-1000"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="86"
                  stroke="currentColor"
                  strokeDasharray="540"
                  strokeDashoffset="135"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white">B2</span>
                <span className="text-xs font-bold text-[#4edea3] tracking-widest uppercase mt-1">PREDICTED BAND</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-[#bbcabf] mb-1 uppercase tracking-wider font-semibold">Fluency</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffb95f] w-[82%]" />
                  </div>
                  <span className="text-xs font-bold text-[#ffb95f]">82%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-[#bbcabf] mb-1 uppercase tracking-wider font-semibold">Accuracy</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4edea3] w-[75%]" />
                  </div>
                  <span className="text-xs font-bold text-[#4edea3]">75%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
              <div>
                <p className="text-xs font-bold text-white">Cần cải thiện: Part 4 Speaking</p>
                <p className="text-[11px] text-[#bbcabf] mt-0.5">Lỗi thường gặp ở việc liên kết các ý tưởng phức tạp.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
