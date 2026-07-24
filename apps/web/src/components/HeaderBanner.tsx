'use client';

import React from 'react';

interface HeaderBannerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function HeaderBanner({ activeTab, setActiveTab }: HeaderBannerProps) {
  const tabs = [
    { id: 'dashboard', label: 'Tổng quan' },
    { id: 'reading', label: '📖 Reading' },
    { id: 'listening', label: '🎧 Listening' },
    { id: 'writing', label: '✍️ Writing' },
    { id: 'speaking', label: '🗣️ Speaking' },
    { id: 'grammar', label: '📚 Grammar & Vocab' },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-[#2A0601] text-white pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800 font-sans relative overflow-hidden">
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CC1C01]/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#CC1C01] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Mô Phỏng Aptis ESOL
              </span>
              <span className="text-xs text-slate-400 font-medium">Cập nhật 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hệ Thống Luyện Thi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5233] to-[#CC1C01]">Aptis Kỳ Tích</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Format câu hỏi và giao diện làm bài bám sát đề thi thật. Chọn kỹ năng bên dưới để bắt đầu luyện tập.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <span className="block font-bold text-white">Dữ liệu sẵn sàng</span>
                <span className="text-[10px] text-slate-400">100% Bộ đề có đáp án</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#CC1C01] text-white shadow-md shadow-red-900/40 ring-2 ring-red-400/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
