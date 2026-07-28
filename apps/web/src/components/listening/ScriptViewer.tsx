'use client';

import React from 'react';

export interface ScriptViewerProps {
  label?: string;
  transcript?: string;
  className?: string;
}

export function formatScriptText(text: string) {
  if (!text) return null;

  // 1. Fix broken word wraps from scraped data (e.g. "Wo\nman:", "Ma\nn:")
  // 2. Normalize shorthand prefixes (W:, M:) into "Woman: ", "Man: "
  // 3. Add line breaks before speaker tags if they appear inline
  const formattedText = text
    .replace(/\bWo-?\s*\n\s*man:/gi, 'Woman:')
    .replace(/\bMa-?\s*\n\s*n:/gi, 'Man:')
    .replace(/\bSpea-?\s*\n\s*ker/gi, 'Speaker')
    .replace(/\bPer-?\s*\n\s*son/gi, 'Person')
    .replace(/(?:^|\n|\s)\bW:\s*/gi, '\nWoman: ')
    .replace(/(?:^|\n|\s)\bM:\s*/gi, '\nMan: ')
    .replace(/([^\n])\s*(\bWoman:|\bMan:|\bSpeaker\s+[A-Z0-9]+:|\bPerson\s+[A-Z0-9]+:)/gi, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const lines = formattedText.split('\n');

  return (
    <div className="space-y-2 text-[14px] text-[#1e293b] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Match speaker prefixes like "Person 1:", "Speaker A:", "Man:", "Woman:", "Speaker 1:", "Person A:", "Speaker A (Man):", "Speaker:", etc.
        const match = trimmed.match(/^([A-Za-z0-9\s\.\-\(\)]{1,35}:)(.*)/);
        if (match) {
          const speakerPrefix = match[1];
          const restOfLine = match[2];
          return (
            <p key={idx}>
              <strong className="font-bold text-[#0f172a] mr-1">{speakerPrefix}</strong>
              <span>{restOfLine}</span>
            </p>
          );
        }

        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

export default function ScriptViewer({ label = 'Script', transcript, className = '' }: ScriptViewerProps) {
  if (!transcript) return null;

  return (
    <div className={`pt-3 border-t border-slate-200/60 mt-3 space-y-2 text-left ${className}`}>
      <span className="text-[14px] font-bold text-[#0f172a] block">
        {label}
      </span>
      <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200/80">
        {formatScriptText(transcript)}
      </div>
    </div>
  );
}
