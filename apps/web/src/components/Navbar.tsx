'use client';

import React, { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubPart?: string | null;
  setSelectedSubPart?: (part: string | null) => void;
}

export default function Navbar({ activeTab, setActiveTab, setSelectedSubPart }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSkillSelect = (skillId: string) => {
    setActiveTab(skillId);
    if (setSelectedSubPart) setSelectedSubPart(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);

    // Perform actual Next.js route navigation
    if (typeof window !== 'undefined') {
      const targetPath = skillId === 'dashboard' ? '/' : skillId === 'mock-test' ? '/thi-thu' : `/${skillId}`;
      if (window.location.pathname !== targetPath) {
        window.location.href = targetPath;
      }
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 font-sans shadow-2xs">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Left Container: Logo + Navigation Links */}
          <div className="flex items-center gap-4 xl:gap-6">
            
            {/* Logo - Aptis Kỳ Tích */}
            <div 
              onClick={() => handleSkillSelect('dashboard')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D9381E] to-[#B8220C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-4.5 h-4.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2L3 19h18L12 2zm0 3.8L17.5 17h-11L12 5.8zM11 10h2v4h-2v-4zm0 5h2v2h-2v-2z" />
                </svg>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg tracking-tight text-[#2D1510]">
                  Aptis
                </span>
                <span className="font-extrabold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D9381E] via-[#F4511E] to-[#FF8A65]">
                  Kỳ Tích
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
              
              {/* 1. Thi thử (Pill Button) */}
              <button
                onClick={() => handleSkillSelect('mock-test')}
                className="bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 text-white font-extrabold text-sm px-5 py-1.5 rounded-full shadow-md shadow-orange-500/35 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Thi thử</span>
              </button>

              {/* 2. Luyện tập từng kỹ năng (Dropdown Button) */}
              <div 
                className="relative group"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    ['reading', 'listening', 'writing', 'speaking', 'grammar'].includes(activeTab) || dropdownOpen
                      ? 'bg-red-50 text-[#D9381E]'
                      : 'text-[#2D1510] hover:bg-red-50 hover:text-[#D9381E]'
                  }`}
                >
                  <svg className={`w-4 h-4 transition-colors ${['reading', 'listening', 'writing', 'speaking', 'grammar'].includes(activeTab) || dropdownOpen ? 'text-[#D9381E]' : 'text-slate-700 group-hover:text-[#D9381E]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Luyện tập từng kỹ năng</span>
                  <svg 
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      ['reading', 'listening', 'writing', 'speaking', 'grammar'].includes(activeTab) || dropdownOpen 
                        ? 'text-[#D9381E]' 
                        : 'text-slate-500 group-hover:text-[#D9381E]'
                    } ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu Wrapper with zero-gap hover bridge & smooth CSS animation */}
                <div className={`absolute top-full left-0 pt-1.5 w-64 z-50 transition-all duration-200 ease-out origin-top-left ${
                  dropdownOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                }`}>
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100/80 p-2 space-y-1">
                    
                    {/* 1. Speaking (Micro icon) */}
                    <button
                      onClick={() => handleSkillSelect('speaking')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeTab === 'speaking' ? 'bg-red-50/90' : 'hover:bg-red-50/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-[#D9381E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-snug">
                          Speaking
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">
                          Luyện nói theo đề Aptis
                        </span>
                      </div>
                    </button>

                    {/* 2. Writing (Pen icon) */}
                    <button
                      onClick={() => handleSkillSelect('writing')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeTab === 'writing' ? 'bg-red-50/90' : 'hover:bg-red-50/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-[#D9381E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-snug">
                          Writing
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">
                          Luyện viết theo đề Aptis
                        </span>
                      </div>
                    </button>

                    {/* 3. Listening (Headphones icon) */}
                    <button
                      onClick={() => handleSkillSelect('listening')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeTab === 'listening' ? 'bg-red-50/90' : 'hover:bg-red-50/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-[#D9381E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 15h3v4H3v-4zm15 0h3v4h-3v-4z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-snug">
                          Listening
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">
                          Luyện nghe theo đề Aptis
                        </span>
                      </div>
                    </button>

                    {/* 4. Reading (Open book icon) */}
                    <button
                      onClick={() => handleSkillSelect('reading')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeTab === 'reading' ? 'bg-red-50/90' : 'hover:bg-red-50/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-[#D9381E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-snug">
                          Reading
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">
                          Luyện đọc theo đề Aptis
                        </span>
                      </div>
                    </button>

                    {/* 5. Grammar & Vocabulary (Closed book icon) */}
                    <button
                      onClick={() => handleSkillSelect('grammar')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                        activeTab === 'grammar' ? 'bg-red-50/90' : 'hover:bg-red-50/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                        <svg className="w-4 h-4 text-[#D9381E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-black leading-snug">
                          Grammar & Vocabulary
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 leading-tight">
                          Ngữ pháp và từ vựng
                        </span>
                      </div>
                    </button>

                  </div>
                </div>
              </div>

              {/* 3. Đề Key Dự Đoán */}
              <button
                onClick={() => handleSkillSelect('predictions')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#2D1510] hover:bg-slate-100/80 transition-all"
              >
                <svg className="w-4 h-4 text-[#2D1510]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Đề Key Dự Đoán</span>
              </button>

              {/* 4. Lịch sử học tập */}
              <button
                onClick={() => handleSkillSelect('history')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#2D1510] hover:bg-slate-100/80 transition-all"
              >
                <svg className="w-4 h-4 text-[#2D1510]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lịch sử học tập</span>
              </button>

            </nav>
          </div>

          {/* Right Container: Theme Icon + Auth Buttons / Logged In User Profile */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Light/Dark Theme Switcher Icon */}
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#2D1510] hover:bg-slate-100 transition-colors"
              title="Chế độ giao diện"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            {/* Premium Badge */}
            <div className="bg-gradient-to-r from-[#FF2E00] to-[#FF6600] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs flex items-center gap-1 cursor-pointer">
              <span>👑</span>
              <span>Premium</span>
            </div>

            {/* Notification Bell */}
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-[#FF2E00] text-white rounded-full text-[10px] font-black w-4 h-4 flex items-center justify-center border-2 border-white">
                6
              </span>
            </button>

            {/* Dashboard Navigation */}
            <button 
              onClick={() => handleSkillSelect('dashboard')}
              className="text-slate-800 hover:text-[#CC1C01] font-bold text-xs px-2.5 py-1 flex items-center gap-1.5 transition-colors"
            >
              <span>🔥</span>
              <span>Dashboard</span>
            </button>

            {/* User Avatar Circle P (Phát) */}
            <div 
              title="nguyenphat13112006@gmail.com"
              className="w-8 h-8 rounded-full bg-[#E0523C] text-white font-black text-xs flex items-center justify-center cursor-pointer shadow-2xs hover:brightness-110 transition-all border border-white"
            >
              P
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200 font-sans text-left">
          <button
            onClick={() => handleSkillSelect('mock-test')}
            className="w-full bg-[#D9381E] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            📋 Thi thử ngay
          </button>

          <div className="pt-2 font-bold text-xs text-slate-400 uppercase tracking-wider px-2">
            Kỹ năng luyện tập
          </div>

          <button
            onClick={() => handleSkillSelect('reading')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'reading' ? 'bg-red-50 text-[#D9381E]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            📖 Aptis Reading
          </button>

          <button
            onClick={() => handleSkillSelect('listening')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'listening' ? 'bg-red-50 text-[#D9381E]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            🎧 Aptis Listening
          </button>

          <button
            onClick={() => handleSkillSelect('writing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'writing' ? 'bg-red-50 text-[#D9381E]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            ✍️ Aptis Writing
          </button>

          <button
            onClick={() => handleSkillSelect('speaking')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'speaking' ? 'bg-red-50 text-[#D9381E]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            🗣️ Aptis Speaking
          </button>

          <button
            onClick={() => handleSkillSelect('grammar')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'grammar' ? 'bg-red-50 text-[#D9381E]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            📚 Grammar & Vocab
          </button>
        </div>
      )}
    </header>
  );
}
