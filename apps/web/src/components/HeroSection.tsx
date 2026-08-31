'use client';

import React from 'react';

interface HeroSectionProps {
  onStartMockTest?: () => void;
  onStartPractice?: () => void;
}

export default function HeroSection({ onStartMockTest, onStartPractice }: HeroSectionProps) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 grid md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[720px] pt-32 pb-20">
      
      {/* Left Column: Headline & Action Buttons */}
      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3efe6] border border-[#e5ded3] text-[#162544] font-medium text-xs tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#d97706]" />
          <span>BRITISH COUNCIL CEFR STANDARDS 2026</span>
        </div>

        <h1 className="text-4xl sm:text-[56px] font-serif font-bold text-[#162544] leading-[1.08] tracking-tight">
          Hệ thống luyện thi <br />
          <span className="text-[#d97706] italic">
            Aptis ESOL 2026
          </span>
        </h1>

        <p className="text-[#333842] text-base sm:text-lg font-normal max-w-xl leading-relaxed">
          Nền tảng học thuật ứng dụng mô hình AI thông minh giúp phân tích chi tiết lỗi sai, tối ưu phản xạ và nâng band B2/C1 thần tốc.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onStartMockTest}
            className="bg-[#162544] hover:bg-[#0f1a30] active:bg-[#0a1122] text-white px-8 py-3.5 rounded-full font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-sm cursor-pointer border border-[#162544]"
          >
            <span>Thử sức đề thi Full Test</span>
          </button>
          <button
            onClick={onStartPractice}
            className="bg-[#ffffff] hover:bg-[#f3efe6] text-[#162544] px-8 py-3.5 rounded-full font-medium text-sm sm:text-base transition-all border border-[#e5ded3] shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>🎯 Luyện tập theo kỹ năng</span>
          </button>
        </div>
      </div>

      {/* Right Column: AI Diagnostic Center Widget (Oxford Deep Navy Chrome) */}
      <div className="relative">
        <div className="bg-[#101b33] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-[#233760] shadow-xl">
          
          <div className="flex justify-between items-center mb-8 border-b border-[#233760] pb-5">
            <div>
              <h3 className="text-xl font-serif font-semibold text-white">AI Diagnostic Center</h3>
              <p className="text-xs text-[#a3b3d1]">Real-time CEFR performance evaluation</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#162544] flex items-center justify-center text-[#d97706] border border-[#233760]">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
          </div>

          <div className="flex flex-col items-center py-4">
            <div className="relative w-44 h-44 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-[#162544]" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeWidth="10" />
                <circle
                  className="text-[#d97706] transition-all duration-1000"
                  cx="88"
                  cy="88"
                  fill="transparent"
                  r="76"
                  stroke="currentColor"
                  strokeDasharray="477"
                  strokeDashoffset="119"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-serif font-bold text-white">B2</span>
                <span className="text-[11px] font-medium text-[#f59e0b] tracking-widest uppercase mt-1">PREDICTED BAND</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-4 rounded-xl bg-[#162544] border border-[#233760]">
                <p className="text-xs text-[#a3b3d1] mb-1.5 uppercase tracking-wider font-medium">Fluency</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-[#0f1a30] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f59e0b] w-[82%]" />
                  </div>
                  <span className="text-xs font-mono text-[#f59e0b]">82%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#162544] border border-[#233760]">
                <p className="text-xs text-[#a3b3d1] mb-1.5 uppercase tracking-wider font-medium">Accuracy</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-[#0f1a30] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] w-[78%]" />
                  </div>
                  <span className="text-xs font-mono text-[#10b981]">78%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-[#162544] border border-[#233760]">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-[#f59e0b] text-lg">insights</span>
              <div>
                <p className="text-xs font-medium text-white">Đề xuất trọng tâm: Part 4 Speaking & Writing</p>
                <p className="text-[11px] text-[#a3b3d1] mt-0.5">Tăng cường cấu trúc câu phức và các từ nối quan điểm học thuật.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
