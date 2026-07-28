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

  // Allow custom override lines if explicitly passed
  if (customLines && customLines.length > 0) {
    return (
      <div className="space-y-1">
        {customLines.map((line, idx) => (
          <p key={idx} className="text-sm font-medium text-slate-700 leading-snug">
            {line}
          </p>
        ))}
      </div>
    );
  }

  // 1. LISTENING SKILL INSTRUCTIONS
  if (skill === 'Listening') {
    if (isFullExam) {
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You will listen to seventeen recordings.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            Click on the PLAY button to listen to each recording.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You can listen to each recording TWO TIMES ONLY.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You have {timeText} to complete the test.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700 leading-snug">
          Click on the PLAY button to listen to each recording.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You can listen to each recording TWO TIMES ONLY.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  // 2. READING SKILL INSTRUCTIONS
  if (skill === 'Reading') {
    if (isFullExam) {
      const partsText = partsCount ? numberToWord(partsCount) : 'five';
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 leading-snug">
            The test has {partsText} parts.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You have {timeText} to complete the test.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  // 3. WRITING SKILL INSTRUCTIONS
  if (skill === 'Writing') {
    if (isFullExam) {
      const partsText = partsCount ? numberToWord(partsCount) : 'four';
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 leading-snug">
            The test has {partsText} parts.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You have {timeText} to complete the test.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  // 4. SPEAKING SKILL INSTRUCTIONS
  if (skill === 'Speaking') {
    if (isFullExam) {
      const partsText = partsCount ? numberToWord(partsCount) : 'four';
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 leading-snug">
            The test has {partsText} parts.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            Please make sure your microphone is connected and working.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You have {timeText} to complete the test.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700 leading-snug">
          Please make sure your microphone is connected and working.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  // 5. GRAMMAR & VOCABULARY INSTRUCTIONS
  if (skill === 'Grammar') {
    if (isFullExam) {
      const partsText = partsCount ? numberToWord(partsCount) : 'two';
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 leading-snug">
            The test has {partsText} parts.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            You have {timeText} to complete the test.
          </p>
          <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
            When you click on the &apos;Next&apos; button, the test will begin.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete this part.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  // GENERAL FALLBACK INSTRUCTIONS
  if (isFullExam) {
    const partsText = partsCount ? numberToWord(partsCount) : 'several';
    return (
      <div className="space-y-1">
        {partsCount && (
          <p className="text-sm font-medium text-slate-700 leading-snug">
            The test has {partsText} parts.
          </p>
        )}
        <p className="text-sm font-medium text-slate-700 leading-snug">
          You have {timeText} to complete the test.
        </p>
        <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
          When you click on the &apos;Next&apos; button, the test will begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-700 leading-snug">
        You have {timeText} to complete this part.
      </p>
      <p className="text-sm font-medium text-slate-700 leading-snug pt-3">
        When you click on the &apos;Next&apos; button, the test will begin.
      </p>
    </div>
  );
}

export default ExamInstructions;
