'use client';

import React from 'react';

export interface QuestionInstructionHeaderProps {
  children: React.ReactNode;
}

export function QuestionInstructionHeader({ children }: QuestionInstructionHeaderProps) {
  return (
    <div>
      <p className="text-[16px] font-bold text-slate-900 leading-snug">
        {children}
      </p>
    </div>
  );
}

export default QuestionInstructionHeader;
