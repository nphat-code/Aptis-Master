'use client';

import React from 'react';

export interface TestPracticeCardProps {
  title: string;
  badge: string;
  isMarathon?: boolean;
  subtitle?: string;
  actionText?: string;
  imageUrl?: string;
  durationText?: string;
  levelText?: string;
  onClick: () => void;
}

export function TestPracticeCard({
  title,
  badge,
  isMarathon = false,
  subtitle = 'Đề thi mô phỏng cấu trúc chuẩn ESOL 2026',
  actionText = 'Luyện tập',
  durationText = '30 phút',
  levelText = '',
  onClick,
}: TestPracticeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between group h-full cursor-pointer transition-all duration-300 border relative overflow-hidden hover:scale-[1.015] ${
        isMarathon
          ? 'border-[#ffb95f]/40 bg-[#ffb95f]/5 shadow-[0_0_20px_rgba(255,185,95,0.15)]'
          : 'border-white/10 hover:border-[#4edea3]/40 shadow-xl'
      }`}
    >
      {/* Subtle Background Glow */}
      <div
        className={`absolute top-0 right-0 w-36 h-36 blur-[60px] rounded-full pointer-events-none transition-all duration-500 ${
          isMarathon ? 'bg-[#ffb95f]/10 group-hover:bg-[#ffb95f]/20' : 'bg-[#4edea3]/5 group-hover:bg-[#4edea3]/15'
        }`}
      />

      {/* Top Header Row: Badge & Icon */}
      <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
        <span
          className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
            isMarathon
              ? 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30'
              : 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20'
          }`}
        >
          {isMarathon ? '🔥 MARATHON FULL' : badge}
        </span>

        <span
          className={`material-symbols-outlined text-xl transition-colors ${
            isMarathon ? 'text-[#ffb95f]' : 'text-[#bbcabf] group-hover:text-[#4edea3]'
          }`}
        >
          {isMarathon ? 'bolt' : 'assignment'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="mb-6 relative z-10 flex-grow">
        <h4 className="text-lg sm:text-xl font-extrabold text-[#dae2fd] mb-2.5 group-hover:text-[#4edea3] transition-colors leading-snug">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[#bbcabf] line-clamp-2 leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      {/* Footer Area: Meta & CTA Button */}
      <div className="mt-auto relative z-10 space-y-4 pt-4 border-t border-white/10">
        {/* Meta badges */}
        <div className="flex items-center justify-between text-xs text-[#bbcabf] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#4edea3]">schedule</span>
            <span>{durationText}</span>
          </div>
          {levelText && (
            <div className="flex items-center gap-1.5">
              <span>{levelText}</span>
            </div>
          )}
        </div>

        {/* CTA Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`w-full py-3 rounded-2xl border font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
            isMarathon
              ? 'bg-[#ffb95f]/20 border-[#ffb95f]/40 text-[#ffb95f] hover:bg-[#ffb95f] hover:text-[#2a1700]'
              : 'bg-[#171f33] border-white/10 text-[#dae2fd] group-hover:bg-[#4edea3] group-hover:text-[#003824] group-hover:border-[#4edea3]'
          }`}
        >
          <span>{actionText}</span>
          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
