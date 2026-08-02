'use client';

import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubPart?: string | null;
  setSelectedSubPart?: (part: string | null) => void;
}

export default function Navbar({ activeTab, setActiveTab, setSelectedSubPart }: NavbarProps) {
  const handleSkillSelect = (skillId: string) => {
    setActiveTab(skillId);
    if (setSelectedSubPart) setSelectedSubPart(null);

    if (typeof window !== 'undefined') {
      const targetPath = skillId === 'dashboard' ? '/' : skillId === 'mock-test' ? '/thi-thu' : `/${skillId}`;
      if (window.location.pathname !== targetPath) {
        window.location.href = targetPath;
      }
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Trang chủ' },
    { id: 'reading', label: 'Reading' },
    { id: 'listening', label: 'Listening' },
    { id: 'writing', label: 'Writing' },
    { id: 'speaking', label: 'Speaking' },
    { id: 'grammar', label: 'Grammar & Vocabulary' },
    { id: 'mock-test', label: 'Thi thử Full' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-full border border-white/15 bg-slate-900/80 backdrop-blur-xl px-8 py-3 shadow-2xl z-50 flex items-center justify-between transition-all duration-300">
      {/* Logo */}
      <div
        onClick={() => handleSkillSelect('dashboard')}
        className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
      >
        <span
          className="material-symbols-outlined text-[#4edea3] text-2xl drop-shadow-[0_0_8px_rgba(78,222,163,0.6)] group-hover:scale-110 transition-transform"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          school
        </span>
        <span className="text-xl font-extrabold text-[#4edea3] tracking-tight">
          AptisMaster
        </span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-7">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSkillSelect(item.id)}
              className={`text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#4edea3] border-b-2 border-[#4edea3] pb-0.5'
                  : 'text-[#bbcabf] hover:text-[#4edea3]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Action Button */}
      <button
        onClick={() => handleSkillSelect('mock-test')}
        className="bg-[#4edea3] text-[#003824] font-bold text-sm px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(78,222,163,0.3)] cursor-pointer flex-shrink-0"
      >
        Vào thi ngay
      </button>
    </nav>
  );
}
