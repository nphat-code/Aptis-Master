'use client';

import React from 'react';

export type AptisSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Grammar';

export interface ExamInstructionsProps {
  skill: AptisSkill | string;
  timeMinutes?: number;
  timeSeconds?: number;
  isFullExam?: boolean;
  partsCount?: number;
  customLines?: string[];
}

export function formatTimeMinutes(minutes: number): string {
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
}

export function numberToWord(num: number): string {
  const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  return words[num - 1] || `${num}`;
}

export function ExamInstructions({
  skill,
  timeMinutes,
  timeSeconds,
  isFullExam = false,
  partsCount,
  customLines,
}: ExamInstructionsProps) {
  const calculatedMinutes = timeMinutes ?? (timeSeconds ? Math.round(timeSeconds / 60) : 8);
  const timeText = formatTimeMinutes(calculatedMinutes);

  if (isFullExam) {
    const partsText = partsCount ? numberToWord(partsCount) : 'several';
    return (
      <>
        {partsCount && (
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            The test has {partsText} parts.
          </p>
        )}
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          You have {timeText} to complete the test.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </>
    );
  }

  if (skill === 'Listening') {
    return (
      <>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          Click on the PLAY button to listen to each recording.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          You can listen to each recording TWO TIMES ONLY.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </>
    );
  }

  if (skill === 'Reading') {
    return (
      <>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </>
    );
  }

  return (
    <>
      {customLines ? (
        customLines.map((line, idx) => (
          <p key={idx} className="text-sm font-medium text-slate-700 leading-relaxed">
            {line}
          </p>
        ))
      ) : (
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          You have {timeText} to complete this part.
        </p>
      )}
      <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
        When you click on the &apos;Next&apos; button, the test will begin.
      </p>
    </>
  );
}

export default ExamInstructions;
