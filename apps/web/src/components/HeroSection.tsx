'use client';

import React from 'react';

interface HeroSectionProps {
  onStartMockTest?: () => void;
  onStartPractice?: () => void;
}

export default function HeroSection({ onStartMockTest, onStartPractice }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8F6] via-[#FFF5F2] to-white pt-8 pb-16 md:pt-12 md:pb-20">
      {/* Background Decorative Soft Glow Sparks */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-orange-300/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, CTAs, Feature Pills */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 shadow-sm shadow-red-500/5 text-xs font-bold text-slate-800">
              <svg className="w-3.5 h-3.5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Nền tảng luyện thi Aptis có AI chấm điểm</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black text-[#2D1510] tracking-tight leading-[1.2]">
              Luyện thi Aptis <br />
              giống thật 100% <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700]">
                AI chấm điểm ngay
              </span>
            </h1>

            {/* Sub-heading Description */}
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
              596+ đề thi sát kỳ thi thật, AI chấm Speaking & Writing, trả band điểm và gợi ý cải thiện chỉ sau vài phút.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onStartMockTest}
                className="bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 text-white font-bold text-base px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/45 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Thi thử miễn phí</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={onStartPractice}
                className="border-2 border-[#FF3300] text-[#FF3300] hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/15 active:translate-y-0 font-bold text-base px-8 py-3.5 rounded-full transition-all duration-200 flex items-center justify-center"
              >
                <span>Bắt đầu luyện tập</span>
              </button>
            </div>

            {/* Feature Pills below CTAs */}
            <div className="pt-3 flex flex-wrap gap-3 items-center">
              
              {/* Pill 1 */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-red-200 shadow-sm text-[14px] font-bold text-slate-900">
                <div className="w-6 h-6 rounded-full border border-red-400/40 bg-red-50 text-[#FF3300] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </div>
                <span>Mô phỏng 100% đề thật.</span>
              </div>

              {/* Pill 2 */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-red-200 shadow-sm text-[14px] font-bold text-slate-900">
                <div className="w-6 h-6 rounded-full border border-red-400/40 bg-red-50 text-[#FF3300] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span>AI chấm Speaking–Writing.</span>
              </div>

              {/* Pill 3 */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-red-200 shadow-sm text-[14px] font-bold text-slate-900">
                <div className="w-6 h-6 rounded-full border border-red-400/40 bg-red-50 text-[#FF3300] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span>Có band điểm ngay.</span>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Browser Window & Floating Badges Mockup */}
          <div className="lg:col-span-6 relative">
            
            {/* Floating Top-Right Badge: AI chấm Writing / Band B2 */}
            <div className="absolute -top-5 -right-2 sm:-right-4 z-20 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF2E00] to-[#FF7700] flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-500">AI chấm Writing</span>
                <span className="text-sm font-black text-slate-900">Band B2</span>
              </div>
            </div>

            {/* Floating Bottom-Left Badge: Streak 18 ngày */}
            <div className="absolute -bottom-6 -left-2 sm:-left-4 z-20 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30 text-lg">
                🔥
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-500">Streak</span>
                <span className="text-sm font-black text-slate-900">18 ngày</span>
              </div>
            </div>

            {/* Main Browser Mockup Window */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative z-10 transition-transform duration-300 hover:scale-[1.01]">
              
              {/* Browser Header Bar */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>

                <div className="bg-white px-6 py-1 rounded-full text-xs font-semibold text-slate-500 border border-slate-200/60 shadow-inner">
                  aptiskytich.vn
                </div>

                <div className="w-12"></div>
              </div>

              {/* Exam Window Preview Canvas */}
              <div className="bg-slate-50 p-4 sm:p-6 space-y-4">
                
                {/* Exam Sub-Header */}
                <div className="bg-[#1E0B2B] text-white p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-purple-300 font-bold block text-[10px]">Grammar & Vocabulary</span>
                    <span className="font-extrabold text-sm">Grammar & Vocabulary - Full Practice</span>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-lg transition-colors">
                    ↳ Thoát
                  </button>
                </div>

                {/* Question Details Card */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Grammar & Vocabulary</h4>
                      <span className="text-[10px] text-slate-400">Question 27 of 30</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
                        🔖 Bookmark
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 block">00:24:39</span>
                        <span className="text-[9px] text-slate-400 block">Time remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="space-y-2 pt-1 text-xs">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Definition Completion
                    </span>
                    <p className="text-slate-600 font-medium">Complete each definition using a word from the drop-down list.</p>

                    {/* Sample Match Inputs */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                        <span className="text-slate-700">To look for information on the internet is to...</span>
                        <span className="bg-white border border-slate-300 text-slate-500 text-[11px] px-3 py-1 rounded-lg">Select... ▾</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                        <span className="text-slate-700">To pour old glass and paper into special bins is to...</span>
                        <span className="bg-white border border-slate-300 text-slate-500 text-[11px] px-3 py-1 rounded-lg">Select... ▾</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam Pagination Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className="bg-white text-slate-600 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    👁️ Hiện đáp án
                  </span>

                  <div className="flex items-center gap-2">
                    <button className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm">
                      ← Previous
                    </button>
                    <button className="bg-[#1E0B2B] text-white text-xs px-4 py-1.5 rounded-lg font-bold shadow-sm">
                      Next →
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
