'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1a30] border-t border-[#1e2f50] w-full px-6 sm:px-12 py-8 mt-16 text-[#a3b3d1] font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#162544] text-[#d97706] flex items-center justify-center border border-[#233760]">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <span className="font-serif font-bold text-white text-sm">AptisMaster</span>
          <span className="text-[#a3b3d1] opacity-70">• Personal Exam Prep System</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-[#a3b3d1]">
          <span>Cấu trúc Aptis ESOL 2026</span>
          <span>CEFR Standards</span>
          <span className="text-[#d97706] font-medium">B1 • B2 • C1</span>
        </div>
      </div>
    </footer>
  );
}
