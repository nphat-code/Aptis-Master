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
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'reading', label: 'Reading' },
    { id: 'listening', label: 'Listening' },
    { id: 'writing', label: 'Writing' },
    { id: 'speaking', label: 'Speaking' },
    { id: 'grammar', label: 'Grammar & Vocabulary' },
    { id: 'mock-test', label: 'Thi thử Full' },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-full border border-[#e5ded3] bg-[#faf8f5]/92 backdrop-blur-xl px-5 sm:px-8 py-2.5 shadow-sm z-50 flex items-center justify-between transition-all duration-300 overflow-hidden">
        {/* Glowing Top Progress Loading Bar */}
        {(isLoading || isPending) && (
          <div
            className="absolute top-0 left-0 h-[3px] bg-[#d97706] shadow-[0_0_10px_#d97706] transition-all duration-300 ease-out z-50"
            style={{ width: `${loadingProgress || 80}%` }}
          />
        )}

        {/* Logo */}
        <div
          onClick={() => handleSkillSelect('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#162544] text-[#d97706] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <span className="text-xl font-serif font-bold text-[#162544] tracking-tight">
            AptisMaster
          </span>
        </div>

        {/* Desktop Center Links */}
        <div className="hidden lg:flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const isActive = effectiveActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSkillSelect(item.id)}
                className={`text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer px-3.5 py-1.5 rounded-full relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#f3efe6] text-[#162544] font-semibold shadow-xs'
                    : 'text-[#6b6860] hover:text-[#162544] hover:bg-[#f7f4ec]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSkillSelect('mock-test')}
            className="bg-[#162544] hover:bg-[#0f1a30] text-white font-medium text-xs sm:text-sm px-5 sm:px-6 py-2 rounded-full transition-all shadow-xs cursor-pointer flex-shrink-0 flex items-center gap-1.5 border border-[#162544]"
          >
            <span>Vào thi ngay</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#6b6860] hover:text-[#162544] transition-colors rounded-full hover:bg-[#f3efe6] cursor-pointer flex items-center justify-center"
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
        <div className="fixed inset-0 z-40 bg-[#0f1a30]/50 backdrop-blur-sm lg:hidden pt-24 px-6 animate-fast-fade">
          <div className="bg-[#faf8f5] border border-[#e5ded3] rounded-3xl p-6 shadow-xl space-y-2">
            <p className="text-xs font-semibold text-[#d97706] uppercase tracking-wider px-3 mb-2">
              Danh mục kỹ năng
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSkillSelect(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#f3efe6] text-[#162544] font-semibold'
                      : 'text-[#6b6860] hover:bg-[#f7f4ec] hover:text-[#162544]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="material-symbols-outlined text-sm text-[#d97706]">check</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
