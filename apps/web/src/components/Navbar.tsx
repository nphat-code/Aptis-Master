'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSubPart?: string | null;
  setSelectedSubPart?: (part: string | null) => void;
}

export default function Navbar({ activeTab, setActiveTab, setSelectedSubPart }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleSkillSelect = (skillId: string) => {
    setActiveTab(skillId);
    if (setSelectedSubPart) setSelectedSubPart(null);
    setMobileMenuOpen(false);

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
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-full border border-white/15 bg-slate-900/85 backdrop-blur-xl px-5 sm:px-8 py-2.5 shadow-2xl z-50 flex items-center justify-between transition-all duration-300 overflow-hidden">
        {/* Glowing Top Progress Loading Bar */}
        {(isLoading || isPending) && (
          <div
            className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#4edea3] via-[#00f2fe] to-[#4edea3] shadow-[0_0_15px_#4edea3] transition-all duration-300 ease-out z-50"
            style={{ width: `${loadingProgress || 80}%` }}
          />
        )}

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

        {/* Desktop Center Links */}
        <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = effectiveActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSkillSelect(item.id)}
                className={`text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer px-3.5 py-1.5 rounded-full relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 shadow-[0_0_16px_rgba(78,222,163,0.25)] scale-[1.02]'
                    : 'text-[#bbcabf] hover:text-[#4edea3] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full shadow-[0_0_8px_#4edea3] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>


        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSkillSelect('mock-test')}
            className="bg-[#4edea3] text-[#003824] font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(78,222,163,0.3)] cursor-pointer flex-shrink-0"
          >
            Vào thi ngay
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#bbcabf] hover:text-[#4edea3] transition-colors rounded-full hover:bg-white/5 cursor-pointer flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#060e20]/80 backdrop-blur-md lg:hidden pt-24 px-6 animate-fast-fade">
          <div className="bg-[#131b2e] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-3">
            <p className="text-xs font-bold text-[#4edea3] uppercase tracking-wider px-3 mb-2">
              Danh mục kỹ năng
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSkillSelect(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 font-bold'
                      : 'text-[#bbcabf] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
