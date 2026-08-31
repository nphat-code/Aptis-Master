'use client';

import React from 'react';

interface RoadmapSectionProps {
  onSelectRoadmap?: (type: string) => void;
}

export default function RoadmapSection({ onSelectRoadmap }: RoadmapSectionProps) {
  return (
    <section className="bg-[#faf8f5] py-14 border-t border-[#e5ded3] text-[#141413]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
        
        {/* Header Title Area */}
        <div className="text-center space-y-2">
          <span className="text-[#d97706] font-semibold text-xs uppercase tracking-widest block">
            LỘ TRÌNH CHUẨN HOÁ CEFR
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#162544] tracking-tight">
            Chọn lộ trình phù hợp với{' '}
            <span className="text-[#d97706] italic">
              mục tiêu của bạn
            </span>
          </h2>
        </div>

        {/* 3 Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
          
          {/* Card 1: Người mới */}
          <div className="bg-[#ffffff] rounded-2xl p-7 sm:p-8 border border-[#e5ded3] flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:border-[#162544] hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f3efe6] text-[#162544] border border-[#e5ded3] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1">
                  Người mới bắt đầu
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6860] font-normal leading-relaxed">
                  Nắm cơ bản cấu trúc thi, làm quen dạng bài Aptis ESOL 2026.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d97706] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a]">
                <span>⏱</span>
                <span>4–6 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('newbie')}
              className="w-full bg-[#f3efe6] border border-[#e5ded3] text-[#162544] hover:bg-[#162544] hover:text-white hover:border-[#162544] font-medium text-xs sm:text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
            >
              <span>Bắt đầu học</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 2: Luyện thi cấp tốc */}
          <div className="bg-[#ffffff] rounded-2xl p-7 sm:p-8 border border-[#d97706] flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#d97706] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Phổ biến nhất
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fef3c7] text-[#d97706] border border-[#fde68a] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1">
                  Luyện thi cấp tốc
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6860] font-normal leading-relaxed">
                  Cày sát kho đề trọng tâm, củng cố phản xạ bấm giờ thi thật.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d97706] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a]">
                <span>⏱</span>
                <span>1–2 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('urgent')}
              className="w-full bg-[#162544] hover:bg-[#0f1a30] text-white font-medium text-xs sm:text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
            >
              <span>Vào thi thử ngay</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 3: Mục tiêu B2 / C1 */}
          <div className="bg-[#ffffff] rounded-2xl p-7 sm:p-8 border border-[#e5ded3] flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:border-[#162544] hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f3efe6] text-[#162544] border border-[#e5ded3] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1">
                  Mục tiêu B2 / C1
                </h3>
                <p className="text-xs sm:text-sm text-[#6b6860] font-normal leading-relaxed">
                  Bứt phá band điểm Speaking & Writing với công nghệ AI chấm bài chuẩn CEFR.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d97706] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a]">
                <span>⏱</span>
                <span>6–8 tuần</span>
              </div>
            </div>

            <button
              onClick={() => onSelectRoadmap?.('advanced')}
              className="w-full bg-[#f3efe6] border border-[#e5ded3] text-[#162544] hover:bg-[#162544] hover:text-white hover:border-[#162544] font-medium text-xs sm:text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
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
