'use client';

import React from 'react';

export interface TestPracticeCardProps {
  title: string;
  badge: string;
  isMarathon?: boolean;
  subtitle?: string;
  actionText?: string;
  onClick: () => void;
}

export function TestPracticeCard({
  title,
  badge,
  isMarathon = false,
  subtitle = '📖 Đề luyện tập',
  actionText = 'Bắt đầu',
  onClick,
}: TestPracticeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#F4F4F6] rounded-xl p-6 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between min-h-[210px] relative group cursor-pointer ${
        isMarathon ? 'border-2 border-[#CC1C01]' : 'border border-slate-200/70 hover:border-[#CC1C01]'
      }`}
    >
      {/* Header Row: Badges & Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {isMarathon ? (
            <span className="bg-[#CC1C01] text-white font-bold text-xs px-3 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
              <span>∞</span>
              <span>Marathon</span>
            </span>
          ) : (
            <span className="bg-[#FEEBE8] text-[#E0523C] font-semibold text-xs px-2.5 py-0.5 rounded-md">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-black text-xl text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Action Link */}
      <div className="flex justify-end pt-4">
        {isMarathon ? (
          <span className="bg-[#CC1C01] hover:bg-[#b01801] text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-xs hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-1.5">
            <span>{actionText}</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        ) : (
          <span className="text-[#CC1C01] font-bold text-sm flex items-center gap-1.5 px-4 py-2 rounded-xl bg-transparent hover:bg-[#FFE0D7] border border-transparent hover:border-[#FFA996] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            <span>{actionText}</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        )}
      </div>
    </div>
  );
}
