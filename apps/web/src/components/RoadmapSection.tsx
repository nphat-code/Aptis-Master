'use client';

import React from 'react';

interface RoadmapSectionProps {
  onSelectRoadmap?: (type: string) => void;
}

export default function RoadmapSection({ onSelectRoadmap }: RoadmapSectionProps) {
  return (
    <section className="bg-slate-50/40 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title Area */}
        <div className="text-center space-y-2">
          <span className="text-[#FF3300] font-black text-xs uppercase tracking-widest block">
            LỘ TRÌNH HỌC
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1510] tracking-tight">
            Chọn lộ trình phù hợp với{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700]">
              bạn
            </span>
          </h2>
        </div>

        {/* 3 Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
          
          {/* Card 1: Người mới */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] flex items-center justify-center shadow-md shadow-orange-500/25">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  Người mới
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Nắm cơ bản, làm quen dạng bài Aptis
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <span>⏱</span>
                <span>4–6 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('newbie')}
              className="w-full border-2 border-[#FF3300] text-[#FF3300] hover:bg-red-50 hover:-translate-y-0.5 font-bold text-sm py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>Bắt đầu học</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: Thi gấp (Featured Popular Card) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#FF3300] shadow-xl shadow-red-500/10 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 flex flex-col justify-between space-y-6 relative scale-[1.02] md:scale-105 z-10">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] text-white text-[11px] font-black px-4 py-1 rounded-full shadow-md shadow-orange-500/30 uppercase tracking-wider">
              ✨ PHỔ BIẾN
            </div>

            <div className="space-y-4 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] flex items-center justify-center shadow-md shadow-orange-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  Thi gấp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Cày sát đề, luyện phản xạ bấm giờ
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <span>⏱</span>
                <span>1–2 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('urgent')}
              className="w-full bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] hover:brightness-110 hover:-translate-y-0.5 text-white font-bold text-sm py-3.5 rounded-full shadow-md shadow-orange-500/35 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>Vào thi thử</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 3: Mục tiêu B2 / C */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] flex items-center justify-center shadow-md shadow-orange-500/25">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  Mục tiêu B2 / C
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  Nâng band Speaking & Writing với AI
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                <span>⏱</span>
                <span>6–8 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('advanced')}
              className="w-full border-2 border-[#FF3300] text-[#FF3300] hover:bg-red-50 hover:-translate-y-0.5 font-bold text-sm py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>Luyện nâng cao</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
