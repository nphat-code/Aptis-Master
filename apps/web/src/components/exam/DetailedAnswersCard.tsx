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
    <div className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-8 text-left space-y-4 border border-slate-200/70 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-[12px] text-[#666666] font-normal">{subtitle}</p>
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
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-md text-[14px] inline-flex items-center">
        {userAnswer}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className="bg-red-100 text-red-800 border border-red-300 line-through font-bold px-3 py-1 rounded-md text-[14px]">
        {userAnswer || '(trống)'}
      </span>
      <span className="text-slate-400 text-[14px] font-bold">→</span>
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-md text-[14px]">
        {correctAnswer}
      </span>
    </span>
  );
}

export default DetailedAnswersCard;
