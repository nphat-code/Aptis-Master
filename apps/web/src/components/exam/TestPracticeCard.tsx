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
  isCompleted?: boolean;
  completedScoreText?: string;
  onClick: () => void;
}

export function TestPracticeCard({
  title,
  badge,
  isMarathon = false,
  subtitle = '',
  actionText = 'Luyện tập',
  durationText = '30 phút',
  levelText = '',
  isCompleted = false,
  completedScoreText,
  onClick,
}: TestPracticeCardProps) {
  // Extract "Đề XX" prefix if available for clean hierarchical layout
  const titleMatch = title.match(/^(Đề\s*\d+)(?:\s*[-–—]\s*(.*))?$/i);
  const testNumPrefix = titleMatch ? titleMatch[1] : null;
  const topicTitle = titleMatch ? (titleMatch[2] || titleMatch[1]) : title;

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between group h-full cursor-pointer transition-all duration-300 border relative overflow-hidden hover:scale-[1.015] ${
        isMarathon
          ? 'border-[#ffb95f]/40 bg-[#ffb95f]/5 shadow-[0_0_20px_rgba(255,185,95,0.15)]'
          : isCompleted
          ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
          : 'border-white/10 hover:border-[#4edea3]/40 shadow-xl'
      }`}
    >
      {/* Subtle Background Glow */}
      <div
        className={`absolute top-0 right-0 w-36 h-36 blur-[60px] rounded-full pointer-events-none transition-all duration-500 ${
          isMarathon
            ? 'bg-[#ffb95f]/10 group-hover:bg-[#ffb95f]/20'
            : isCompleted
            ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20'
            : 'bg-[#4edea3]/5 group-hover:bg-[#4edea3]/15'
        }`}
      />

      {/* Top Header Row: Badge & Icon */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <span
          className={`px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
            isMarathon
              ? 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/30'
              : isCompleted
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20'
          }`}
        >
          {isMarathon ? '🔥 MARATHON FULL' : badge}
        </span>

        {isCompleted ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <span>✓</span>
            <span>{completedScoreText || 'Đã làm'}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined text-xl transition-colors ${
              isMarathon ? 'text-[#ffb95f]' : 'text-[#bbcabf] group-hover:text-[#4edea3]'
            }`}
          >
            {isMarathon ? 'bolt' : 'assignment'}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mb-5 relative z-10 flex-grow">
        {testNumPrefix && topicTitle !== testNumPrefix ? (
          <div className="space-y-1 mb-2.5">
            <span
              className={`inline-block text-[12px] font-bold tracking-wide ${
                isCompleted ? 'text-emerald-400' : 'text-[#4edea3]'
              }`}
            >
              {testNumPrefix}
            </span>
            <h4
              className={`text-base sm:text-lg font-extrabold text-[#dae2fd] transition-colors leading-snug line-clamp-2 ${
                isCompleted ? 'group-hover:text-emerald-400' : 'group-hover:text-[#4edea3]'
              }`}
            >
              {topicTitle}
            </h4>
          </div>
        ) : (
          <h4
            className={`text-lg sm:text-xl font-extrabold text-[#dae2fd] mb-2.5 transition-colors leading-snug line-clamp-2 ${
              isCompleted ? 'group-hover:text-emerald-400' : 'group-hover:text-[#4edea3]'
            }`}
          >
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#bbcabf] line-clamp-2 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Area: Meta & CTA Button */}
      <div className="mt-auto relative z-10 space-y-4 pt-4 border-t border-white/10">
        {/* Meta badges */}
        <div className="flex items-center justify-between text-xs text-[#bbcabf] font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[17px] ${
                isCompleted ? 'text-emerald-400' : 'text-[#4edea3]'
              }`}
            >
              schedule
            </span>
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
              : isCompleted
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-emerald-950'
              : 'bg-[#171f33] border-white/10 text-[#dae2fd] group-hover:bg-[#4edea3] group-hover:text-[#003824] group-hover:border-[#4edea3]'
          }`}
        >
          {isCompleted && <span className="text-base">↺</span>}
          <span>{isCompleted && actionText === 'Luyện tập' ? 'Làm lại' : actionText}</span>
          {!isCompleted && (
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
