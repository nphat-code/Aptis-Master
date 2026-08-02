'use client';

import React from 'react';

interface RoadmapSectionProps {
  onSelectRoadmap?: (type: string) => void;
}

export default function RoadmapSection({ onSelectRoadmap }: RoadmapSectionProps) {
  return (
    <section className="bg-[#0b1326] py-14 border-t border-white/10 text-[#dae2fd]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
        
        {/* Header Title Area */}
        <div className="text-center space-y-3">
          <span className="text-[#4edea3] font-black text-xs uppercase tracking-widest block">
            LỘ TRÌNH ÔN THI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#dae2fd] tracking-tight">
            Chọn lộ trình phù hợp với{' '}
            <span className="text-[#4edea3] drop-shadow-[0_0_15px_rgba(78,222,163,0.4)]">
              mục tiêu của bạn
            </span>
          </h2>
        </div>

        {/* 3 Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
          
          {/* Card 1: Người mới */}
          <div className="glass-panel rounded-3xl p-7 sm:p-8 bento-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd] mb-1.5">
                  Người mới bắt đầu
                </h3>
                <p className="text-xs sm:text-sm text-[#bbcabf] font-normal leading-relaxed">
                  Nắm cơ bản cấu trúc thi, làm quen dạng bài Aptis ESOL 2026.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4edea3] bg-[#4edea3]/10 px-3.5 py-1 rounded-full">
                <span>⏱</span>
                <span>4–6 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('newbie')}
              className="w-full bg-[#222a3d] border border-[#3c4a42] text-[#dae2fd] hover:bg-[#4edea3] hover:text-[#003824] hover:border-[#4edea3] font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Bắt đầu học</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 2: Thi gấp (Featured Popular Card) */}
          <div className="glass-panel rounded-3xl p-7 sm:p-8 border-2 border-[#4edea3] shadow-[0_0_30px_rgba(78,222,163,0.2)] bento-card flex flex-col justify-between space-y-6 relative scale-[1.02] md:scale-105 z-10">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4edea3] text-[#003824] text-[11px] font-extrabold px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
              ✨ PHỔ BIẾN NHẤT
            </div>

            <div className="space-y-4 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#4edea3] text-[#003824] flex items-center justify-center shadow-lg shadow-[#4edea3]/30">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd] mb-1.5">
                  Luyện thi cấp tốc
                </h3>
                <p className="text-xs sm:text-sm text-[#bbcabf] font-normal leading-relaxed">
                  Cày sát kho đề key, củng cố phản xạ bấm giờ thi thật.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003824] bg-[#4edea3] px-3.5 py-1 rounded-full">
                <span>⏱</span>
                <span>1–2 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('urgent')}
              className="w-full bg-[#4edea3] text-[#003824] font-extrabold text-sm py-3.5 rounded-2xl shadow-[0_0_20px_rgba(78,222,163,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Vào thi thử ngay</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 3: Mục tiêu B2 / C */}
          <div className="glass-panel rounded-3xl p-7 sm:p-8 bento-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffb95f]/10 text-[#ffb95f] border border-[#ffb95f]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd] mb-1.5">
                  Mục tiêu B2 / C1
                </h3>
                <p className="text-xs sm:text-sm text-[#bbcabf] font-normal leading-relaxed">
                  Bứt phá band điểm Speaking & Writing với công nghệ AI chấm bài.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffb95f] bg-[#ffb95f]/10 px-3.5 py-1 rounded-full">
                <span>⏱</span>
                <span>6–8 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('advanced')}
              className="w-full bg-[#222a3d] border border-[#3c4a42] text-[#dae2fd] hover:bg-[#ffb95f] hover:text-[#2a1700] hover:border-[#ffb95f] font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Luyện nâng cao</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
