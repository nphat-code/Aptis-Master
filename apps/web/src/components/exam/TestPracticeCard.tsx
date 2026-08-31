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
      className={`bg-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between group h-full cursor-pointer transition-all duration-200 border relative overflow-hidden shadow-xs hover:-translate-y-1 ${
        isMarathon
          ? 'border-[#fde68a] bg-[#fffdfa] hover:border-[#d97706] hover:shadow-md'
          : isCompleted
          ? 'border-[#a7f3d0] bg-[#f9fefb] hover:border-emerald-500 hover:shadow-md'
          : 'border-[#e5ded3] hover:border-[#162544] hover:shadow-md'
      }`}
    >
      {/* Top Header Row: Badge & Icon */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <span
          className={`px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${
            isMarathon
              ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
              : isCompleted
              ? 'bg-[#ecfdf5] text-emerald-800 border-[#a7f3d0]'
              : 'bg-[#f3efe6] text-[#162544] border-[#e5ded3]'
          }`}
        >
          {isMarathon ? '🔥 MARATHON FULL' : badge}
        </span>

        {isCompleted ? (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0] flex items-center gap-1.5 shadow-xs">
            <span>✓</span>
            <span>{completedScoreText || 'Đã làm'}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined text-xl transition-colors ${
              isMarathon ? 'text-[#d97706]' : 'text-[#8e8b82] group-hover:text-[#162544]'
            }`}
          >
            {isMarathon ? 'bolt' : 'assignment'}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mb-5 relative z-10 flex-grow">
        {testNumPrefix && topicTitle !== testNumPrefix ? (
          <div className="space-y-1 mb-2">
            <span
              className={`inline-block text-xs font-semibold tracking-wide ${
                isCompleted ? 'text-emerald-700' : 'text-[#d97706]'
              }`}
            >
              {testNumPrefix}
            </span>
            <h4
              className={`text-base sm:text-lg font-serif font-semibold text-[#162544] transition-colors leading-snug line-clamp-2 ${
                isCompleted ? 'group-hover:text-emerald-800' : 'group-hover:text-[#162544]'
              }`}
            >
              {topicTitle}
            </h4>
          </div>
        ) : (
          <h4
            className={`text-lg font-serif font-semibold text-[#162544] mb-2 transition-colors leading-snug line-clamp-2 ${
              isCompleted ? 'group-hover:text-emerald-800' : 'group-hover:text-[#162544]'
            }`}
          >
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#6b6860] line-clamp-2 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Area: Meta & CTA Button */}
      <div className="mt-auto relative z-10 space-y-4 pt-4 border-t border-[#e5ded3]">
        {/* Meta badges */}
        <div className="flex items-center justify-between text-xs text-[#6b6860] font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[17px] ${
                isCompleted ? 'text-emerald-600' : 'text-[#d97706]'
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
          className={`w-full py-2.5 rounded-xl border font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
            isMarathon
              ? 'bg-[#fef3c7] border-[#fde68a] text-[#92400e] hover:bg-[#d97706] hover:text-white hover:border-[#d97706]'
              : isCompleted
              ? 'bg-[#ecfdf5] border-[#a7f3d0] text-emerald-800 hover:bg-emerald-700 hover:text-white hover:border-emerald-700'
              : 'bg-white border-[#e5ded3] text-[#162544] group-hover:bg-[#162544] group-hover:text-white group-hover:border-[#162544]'
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
