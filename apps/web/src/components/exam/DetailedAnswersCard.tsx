'use client';

import React from 'react';

export interface DetailedAnswersCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DetailedAnswersCard({
  title = 'Chi tiết bài làm',
  subtitle,
  children,
}: DetailedAnswersCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 text-left space-y-4 border border-[#e5ded3] shadow-xs w-full">
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-[#162544] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#162544]">analytics</span>
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p className="text-[12px] text-[#6b6860] font-normal">{subtitle}</p>
        )}
      </div>

      <div className="pt-2 text-left space-y-4 text-[14px]">{children}</div>
    </div>
  );
}

export interface AnswerDiffBadgeProps {
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export function AnswerDiffBadge({
  userAnswer,
  correctAnswer,
  isCorrect,
}: AnswerDiffBadgeProps) {
  if (isCorrect) {
    return (
      <span className="bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0] font-normal px-3 py-1 rounded-md text-[14px] inline-flex items-center">
        {userAnswer}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className="bg-[#fef2f2] text-red-800 border border-[#fecaca] line-through font-normal px-3 py-1 rounded-md text-[14px]">
        {userAnswer || '(trống)'}
      </span>
      <span className="text-slate-400 text-[14px] font-normal">→</span>
      <span className="bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0] font-normal px-3 py-1 rounded-md text-[14px]">
        {correctAnswer}
      </span>
    </span>
  );
}

export default DetailedAnswersCard;
