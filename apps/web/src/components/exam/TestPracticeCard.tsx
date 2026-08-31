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
          ? 'border-[#e8a55a] bg-[#fffaf5] hover:border-[#cc785c]'
          : isCompleted
          ? 'border-emerald-300 bg-[#f9fefb] hover:border-emerald-500'
          : 'border-[#e6dfd8] hover:border-[#cc785c]'
      }`}
    >
      {/* Top Header Row: Badge & Icon */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <span
          className={`px-3 py-0.5 rounded-full text-[11px] font-medium tracking-wide border ${
            isMarathon
              ? 'bg-[#fff2e2] text-[#c26500] border-[#fddbb5]'
              : isCompleted
              ? 'bg-[#ecfdf5] text-emerald-800 border-emerald-200'
              : 'bg-[#efe9de] text-[#141413] border-[#e6dfd8]'
          }`}
        >
          {isMarathon ? '🔥 MARATHON FULL' : badge}
        </span>

        {isCompleted ? (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ecfdf5] text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
            <span>✓</span>
            <span>{completedScoreText || 'Đã làm'}</span>
          </span>
        ) : (
          <span
            className={`material-symbols-outlined text-xl transition-colors ${
              isMarathon ? 'text-[#e8a55a]' : 'text-[#8e8b82] group-hover:text-[#cc785c]'
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
                isCompleted ? 'text-emerald-700' : 'text-[#cc785c]'
              }`}
            >
              {testNumPrefix}
            </span>
            <h4
              className={`text-base sm:text-lg font-serif font-semibold text-[#141413] transition-colors leading-snug line-clamp-2 ${
                isCompleted ? 'group-hover:text-emerald-800' : 'group-hover:text-[#cc785c]'
              }`}
            >
              {topicTitle}
            </h4>
          </div>
        ) : (
          <h4
            className={`text-lg font-serif font-semibold text-[#141413] mb-2 transition-colors leading-snug line-clamp-2 ${
              isCompleted ? 'group-hover:text-emerald-800' : 'group-hover:text-[#cc785c]'
            }`}
          >
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#6c6a64] line-clamp-2 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Footer Area: Meta & CTA Button */}
      <div className="mt-auto relative z-10 space-y-4 pt-4 border-t border-[#e6dfd8]">
        {/* Meta badges */}
        <div className="flex items-center justify-between text-xs text-[#6c6a64] font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[17px] ${
                isCompleted ? 'text-emerald-600' : 'text-[#cc785c]'
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
              ? 'bg-[#fff2e2] border-[#fddbb5] text-[#c26500] hover:bg-[#cc785c] hover:text-white'
              : isCompleted
              ? 'bg-[#ecfdf5] border-emerald-300 text-emerald-800 hover:bg-emerald-700 hover:text-white'
              : 'bg-white border-[#e6dfd8] text-[#141413] group-hover:bg-[#cc785c] group-hover:text-white group-hover:border-[#cc785c]'
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
