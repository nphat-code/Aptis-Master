'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubPart?: string | null;
  setSelectedSubPart?: (part: string | null) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  dotColor?: string;
}

const SKILL_NAV_ITEMS: NavItem[] = [
  { id: 'reading', label: 'Reading', icon: 'menu_book', badge: '14 đề', dotColor: '#059669' },
  { id: 'listening', label: 'Listening', icon: 'headphones', badge: '14 đề', dotColor: '#d97706' },
  { id: 'writing', label: 'Writing', icon: 'edit_note', badge: '10 đề', dotColor: '#4f46e5' },
  { id: 'speaking', label: 'Speaking', icon: 'mic', badge: '10 đề', dotColor: '#e11d48' },
  { id: 'grammar', label: 'Grammar & Vocab', icon: 'spellcheck', badge: '14 đề', dotColor: '#2563eb' },
];

export default function Sidebar({ activeTab, setActiveTab, setSelectedSubPart }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [targetCefr, setTargetCefr] = useState('B2');
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCefr = localStorage.getItem('aptis_target_cefr') || 'B2';
      setTargetCefr(savedCefr);
      const savedStreak = parseInt(localStorage.getItem('aptis_study_streak') || '1', 10);
      setStreak(savedStreak);
    }
  }, []);

  // Sync state and finish progress bar when pathname changes
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleSelect = (skillId: string) => {
    if (setSelectedSubPart) setSelectedSubPart(null);
    setMobileOpen(false);

    const targetPath = skillId === 'dashboard' ? '/' : skillId === 'mock-test' ? '/thi-thu' : `/${skillId}`;

    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      setIsLoading(true);
      setLoadingProgress(35);

      const t1 = setTimeout(() => setLoadingProgress(75), 120);
      const t2 = setTimeout(() => setLoadingProgress(92), 260);

      startTransition(() => {
        router.push(targetPath);
      });

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setActiveTab(skillId);
    }
  };

  const effectiveActiveTab = React.useMemo(() => {
    if (!pathname || pathname === '/') return activeTab || 'dashboard';
    if (pathname === '/thi-thu') return 'mock-test';
    const path = pathname.replace('/', '');
    if (['reading', 'listening', 'writing', 'speaking', 'grammar'].includes(path)) {
      return path;
    }
    return activeTab || 'dashboard';
  }, [pathname, activeTab]);

  return (
    <>
      {/* Glowing Top Progress Loading Bar */}
      {(isLoading || isPending) && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#d97706] shadow-[0_0_10px_#d97706] transition-all duration-300 ease-out z-[9999]"
          style={{ width: `${loadingProgress || 80}%` }}
        />
      )}

      {/* Mobile Top Header Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#e5ded3] px-4 flex items-center justify-between z-40">
        <div
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-[#162544] text-[#d97706] flex items-center justify-center">
            <span className="material-symbols-outlined text-base">school</span>
          </div>
          <span className="font-serif font-bold text-base text-[#162544]">AptisMaster</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#162544] hover:bg-[#f3efe6] rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in"
        />
      )}

      {/* Left Sidebar Body */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#e5ded3] z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Logo */}
        <div>
          <div
            onClick={() => handleSelect('dashboard')}
            className="p-5 border-b border-[#e5ded3] flex items-center gap-3 cursor-pointer group hover:bg-[#faf8f5] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#162544] text-[#d97706] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <div className="font-serif font-bold text-base text-[#162544] leading-tight tracking-tight">
                AptisMaster
              </div>
              <div className="text-[10px] text-[#6b6860] uppercase tracking-wider font-semibold">
                ESOL Exam Prep
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
            
            {/* Main Category: Dashboard */}
            <div>
              <button
                onClick={() => handleSelect('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  effectiveActiveTab === 'dashboard'
                    ? 'bg-[#162544] text-white shadow-xs'
                    : 'text-[#6b6860] hover:text-[#162544] hover:bg-[#f3efe6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  <span>Dashboard</span>
                </div>
                {effectiveActiveTab === 'dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                )}
              </button>
            </div>

            {/* Skills Category */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] uppercase font-bold text-[#8e8b82] tracking-wider">
                5 Kỹ năng thi
              </div>

              {SKILL_NAV_ITEMS.map((item) => {
                const isActive = effectiveActiveTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#f3efe6] text-[#162544] font-bold border border-[#e5ded3] shadow-2xs'
                        : 'text-[#6b6860] hover:text-[#162544] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.dotColor }}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isActive
                          ? 'bg-[#162544] text-white'
                          : 'bg-[#faf8f5] text-[#8e8b82] border border-[#e5ded3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Exam Room Category */}
            <div className="space-y-1">
              <div className="px-3 pb-1 text-[10px] uppercase font-bold text-[#8e8b82] tracking-wider">
                Phòng thi
              </div>

              <button
                onClick={() => handleSelect('mock-test')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  effectiveActiveTab === 'mock-test'
                    ? 'bg-[#d97706] text-white shadow-xs'
                    : 'bg-[#fffdfa] border border-[#fde68a] text-[#92400e] hover:bg-[#fef3c7]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-lg">timer</span>
                  <span>Thi thử Full Test</span>
                </div>
                <span className="text-[10px] font-bold bg-white/30 text-current px-1.5 py-0.2 rounded uppercase">
                  4 Skill
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom User Status & CEFR Target Widget */}
        <div className="p-3 border-t border-[#e5ded3] bg-[#faf8f5] space-y-2">
          <div className="bg-white p-2.5 rounded-xl border border-[#e5ded3] shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <div>
                <div className="text-[9px] uppercase font-bold text-[#8e8b82]">Mục tiêu</div>
                <div className="font-bold text-[#162544]">CEFR {targetCefr}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs">🔥</span>
              <span className="font-bold text-[#162544] text-xs">{streak}d</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#8e8b82] font-medium">
            Aptis ESOL 2026 • Personal LMS
          </div>
        </div>

      </aside>
    </>
  );
}
