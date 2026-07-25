'use client';

import React, { useState } from 'react';

interface ReadingViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function ReadingView({ onBackToHome, data }: ReadingViewProps) {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePartTab, setActivePartTab] = useState('full');

  const partTabs = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Sentence comprehension' },
    { id: 'part23', label: 'Part 2 + 3 – Text cohesion' },
    { id: 'part4', label: 'Part 4 – Opinion matching' },
    { id: 'part5', label: 'Part 5 – Long reading' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
      
      {/* 1. Hero Header Banner (Gradient Mesh Background) matching aptiskytich.vn */}
      <div className="bg-gradient-to-r from-[#FFF5F2] via-[#FFF9F8] to-[#FFF0EC] border-b border-orange-100/60 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-5">
          
          {/* Top Row: Icon Box & 30 phút Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100/70 text-[#D9381E] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-orange-200/60 text-xs font-bold text-slate-700 shadow-2xs">
              <span>⏱</span>
              <span>30 phút</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D1510] tracking-tight">
              Phần thi Reading
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Luyện đọc hiểu theo format bài thi Aptis Reading. Làm quen với các dạng câu hỏi và nâng cao kỹ năng đọc nhanh.
            </p>
          </div>

          {/* Nút Mẹo thi: Xem ngay - Mẹo làm bài Reading */}
          <div className="pt-2">
            <button
              onClick={() => setShowTipsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D9381E] text-[#D9381E] bg-white hover:bg-red-50 text-xs font-bold transition-all shadow-2xs"
            >
              <span>💡</span>
              <span>Xem ngay - Mẹo làm bài Reading</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Workspace Container (Banner, Search Box & Part Tabs) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Progress Banner Container */}
        <div className="bg-[#EEF1F5] rounded-2xl p-5 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center shadow-2xs flex-shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Tiến độ học tập của bạn
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Đăng nhập để theo dõi tiến độ của bạn
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#D9381E] text-[#D9381E] bg-white hover:bg-red-50 font-bold text-xs transition-colors whitespace-nowrap self-start sm:self-auto shadow-2xs">
            <span>→]</span>
            <span>Đăng nhập</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bộ đề Reading..."
            className="w-full pl-11 pr-10 py-3.5 bg-[#EAECEC] rounded-2xl border-none text-xs font-semibold text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D9381E]/30 transition-all"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* 5 Part Filter Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {partTabs.map((tab) => {
            const isActive = activePartTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePartTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D9381E] text-white shadow-md shadow-red-500/20'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Reading Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[#D9381E]">
                <span className="text-xl">💡</span>
                <h3 className="font-black text-lg text-slate-900">
                  Mẹo làm bài Reading
                </h3>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-1">
                <h4 className="font-bold text-amber-900 text-xs">Part 1 - Sentence comprehension (5 câu):</h4>
                <p>Đọc nhanh cả câu, chú ý các từ đi kèm (collocations) và thì của câu để chọn đáp án đúng ngay.</p>
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200/80 space-y-1">
                <h4 className="font-bold text-blue-900 text-xs">Part 2 + 3 - Text cohesion (Sắp xếp đoạn văn):</h4>
                <p>Tìm câu mở đầu (thường chứa chủ ngữ chính, không chứa từ nối như However, Then, Therefore). Sau đó tìm từ nối chỉ thời gian & nguyên nhân.</p>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1">
                <h4 className="font-bold text-emerald-900 text-xs">Part 4 - Opinion matching (Ghép ý kiến người nói):</h4>
                <p>Tìm từ khóa (keywords) trùng khớp giữa ý kiến và đoạn văn của từng người.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#2D1510] text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
              >
                Đã hiểu, đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
