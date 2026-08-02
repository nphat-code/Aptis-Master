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

const defaultImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6m6qiX72DLJ4WfLYv9MssTeTE3WgqXGvoYLaWK0_-aSULuQVP4hFkOt8mMbWYwKzV7wHZuO4kN92qqgPoTKII7VoTHB94hLX7cZWKOYwKyiXkBupgjAXAn-IW0fpjMKM5xPvSX8Rvsma_PPv4GRfEY6T4-SKq-CyADlFxP880dZDj66uYeMJ02Avc6Y1tGdWBeCZyYwQJZegdPH8N8FVbxFAMR1WJkdl9COL6X5Hw3n-RKlTWYy8ikw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0HBGEsJpjDnTOKYZt9s0xE4cEOk0rsRWrMS5UaWdL5kQx6mxV_HRN3nkpK8qNeq-rQjGvm-rpsFI-Zhp7WTwa2OOrPVgzH98_-hIj55BFs1gaOBNpiPcAp3TMdqRv09eeGw7ujfYWJk95iAZe5ebnribLofpASZmapOWwxvGhCxZqTHDvU6n7zSNN00Ia8pAd7g4yaBHFIcbvoWZng0fMS42xsQ9qR5YhwPg3cGez8TcASA5m5Pg7gw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBa0qT5EzqS4tYXKGHH1_vIAAEitc6h0ktce7EqT4bMAsWSQVtzqgWAwmRxrjSX645vYEK3OfIol0ihiw2shaXR2ZzBXRCYeibWLBOfP3t_gOLEe9akGxt1eChBYt1R0OgSCMX0kIuwh0FR3MIkdo1ca123j_dt8jjtaj8Q_CdRY9W1DJa_hr8uDyLQSOcmH56N6044eOZrySe7-5m73UTLFOQCjJ1lQPibKa8sTGDWydLhd6mfynwBZQ',
];

export function TestPracticeCard({
  title,
  badge,
  isMarathon = false,
  subtitle = 'Đề thi mô phỏng cấu trúc chuẩn ESOL 2026',
  actionText = 'Luyện tập',
  imageUrl,
  durationText = '30 phút',
  levelText = 'B1 - B2',
  onClick,
}: TestPracticeCardProps) {
  // Pick deterministic default image based on title length
  const cardImg = imageUrl || defaultImages[title.length % defaultImages.length];

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-3xl overflow-hidden bento-card flex flex-col group h-full cursor-pointer transition-all duration-300 ${
        isMarathon ? 'border-2 border-[#ffb95f]' : 'hover:border-[#4edea3]/40'
      }`}
    >
      {/* Top Banner Image with Glass Badge */}
      <div className="h-44 overflow-hidden relative">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={title}
          src={cardImg}
        />
        <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#0b1326]/80 backdrop-blur-md border border-white/10 text-[12px] font-extrabold text-[#4edea3] tracking-wider uppercase">
          {isMarathon ? '🔥 MARATHON' : badge}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        <h4 className="text-xl font-extrabold text-[#dae2fd] mb-2.5 group-hover:text-[#4edea3] transition-colors leading-snug">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[#bbcabf] mb-6 line-clamp-2 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-auto">
          {/* Metadata Row */}
          <div className="flex items-center justify-between mb-5 pt-3 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#bbcabf]">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="text-xs font-medium">{durationText}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#bbcabf]">
                <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                <span className="text-xs font-medium">{levelText}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#222a3d] border border-[#3c4a42] text-[#dae2fd] font-bold text-sm hover:bg-[#4edea3] hover:text-[#003824] hover:border-[#4edea3] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <span>{actionText}</span>
            <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
