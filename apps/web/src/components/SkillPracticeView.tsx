'use client';

import React, { useState } from 'react';
import { TestPracticeCard } from './exam/TestPracticeCard';

export interface PartTab {
  id: string;
  label: string;
}

export interface PartTabContent {
  title: string;
  subtitle: string;
  badge: string;
  testCount: number;
}

export interface SkillPracticeViewProps {
  skillId: string;
  skillTitle: string;
  skillDescription: string;
  durationText?: string;
  icon?: React.ReactNode;
  partTabs: PartTab[];
  partTabContent: Record<string, PartTabContent>;
  defaultPartTab?: string;
  completedCount?: number;
  tipsTitle?: string;
  tipsContent?: React.ReactNode;
  supportedPartIds?: string[];
  renderPracticeExam?: (props: { partId: string; testIndex: number; onExit: () => void }) => React.ReactNode;
  getCustomCardProps?: (partId: string, testNum: number) => { title?: string; subtitle?: string; badge?: string } | null;
  getMarathonCardProps?: (partId: string) => { title: string; subtitle: string; totalCount: number } | null;
}

export default function SkillPracticeView({
  skillId,
  skillTitle,
  skillDescription,
  durationText = '30 phút',
  icon,
  partTabs,
  partTabContent,
  defaultPartTab,
  completedCount = 5,
  tipsTitle,
  tipsContent,
  supportedPartIds = [],
  renderPracticeExam,
  getCustomCardProps,
  getMarathonCardProps,
}: SkillPracticeViewProps) {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showUpdatingModalPart, setShowUpdatingModalPart] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePartTab, setActivePartTab] = useState(defaultPartTab || partTabs[0]?.id || 'full');
  const [activePracticeTestIndex, setActivePracticeTestIndex] = useState<number | null>(null);

  const currentTabInfo = partTabContent[activePartTab] || partTabContent[partTabs[0]?.id || 'full'];

  if (activePracticeTestIndex !== null && renderPracticeExam) {
    return renderPracticeExam({
      partId: activePartTab,
      testIndex: activePracticeTestIndex,
      onExit: () => setActivePracticeTestIndex(null),
    });
  }

  const marathonInfo = getMarathonCardProps ? getMarathonCardProps(activePartTab) : null;
  const isCurrentPartSupported = supportedPartIds.includes(activePartTab);

  const totalAvailableTests = currentTabInfo ? currentTabInfo.testCount : 10;
  const progressPercent = Math.min(Math.round((completedCount / (totalAvailableTests || 1)) * 100), 100);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans pb-24 pt-24">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* 1. Hero Bento Grid Section (Stitch 7:5 Layout) */}
        <section className="grid grid-cols-12 gap-6 mb-10">
          
          {/* Left Hero Banner (7 cols) */}
          <div className="col-span-12 lg:col-span-7 relative overflow-hidden rounded-3xl min-h-[440px] glass-panel group flex flex-col justify-center p-8 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4edea3]/20 via-transparent to-[#c0c1ff]/20 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] font-bold text-xs uppercase tracking-wider mb-5">
                UPDATE 2026
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#dae2fd] mb-4 leading-tight">
                {skillTitle} <br />
                <span className="text-[#4edea3]">Aptis ESOL 2026</span>
              </h1>

              <p className="text-sm sm:text-base text-[#bbcabf] mb-8 max-w-lg leading-relaxed">
                {skillDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    if (supportedPartIds.length > 0) {
                      setActivePracticeTestIndex(0);
                    }
                  }}
                  className="bg-[#4edea3] text-[#003824] font-extrabold px-7 py-3.5 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(78,222,163,0.4)] text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  <span>Bắt đầu đề thi ngẫu nhiên</span>
                </button>

                {tipsContent && (
                  <button
                    onClick={() => setShowTipsModal(true)}
                    className="bg-[#222a3d] text-[#dae2fd] font-bold px-6 py-3.5 rounded-full border border-[#3c4a42] hover:bg-[#2d3449] transition-all text-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>💡</span>
                    <span>{tipsTitle || `Mẹo thi ${skillTitle}`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Widgets (5 cols) */}
          <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-6 min-h-[440px]">
            
            {/* Widget 1: Study Progress Card */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 flex items-center justify-between group bento-card">
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd] mb-1.5">Tiến độ học tập</h3>
                <p className="text-xs sm:text-sm text-[#bbcabf]">
                  Đã hoàn thành <strong className="text-[#4edea3]">{completedCount}</strong> bài luyện tập kỹ năng này.
                </p>
                <div className="mt-5">
                  <button className="text-[#4edea3] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                    <span>Xem báo cáo chi tiết</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#2d3449]" cx="56" cy="56" fill="transparent" r="50" stroke="currentColor" strokeWidth="9" />
                  <circle
                    className="text-[#4edea3]"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeDasharray="314.15"
                    strokeDashoffset={314.15 - (314.15 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-[#dae2fd]">{progressPercent}%</span>
                  <span className="text-[9px] font-bold text-[#bbcabf] uppercase tracking-widest">Goal</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Strategy Card */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 group bento-card relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 text-[#4edea3] opacity-15 transform translate-x-3 -translate-y-3 pointer-events-none">
                <span className="material-symbols-outlined text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lightbulb
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd] mb-2">Chiến thuật làm bài</h3>
                <p className="text-xs sm:text-sm text-[#bbcabf] leading-relaxed line-clamp-2">
                  Luyện tập phân bổ thời gian hợp lý cho từng phần để tối đa hóa điểm số CEFR B2/C1.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-[#0b1326] bg-[#171f33] flex items-center justify-center overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3TROKMpmRHONVzG4CPnwhUY-Kf5XKaYfOnWYmlYhBX7qKrIl9Ina8oDNo1vY2kqWIk3mNShBn9j4bUeS2Aef39Xr1YQw7PmCapUKprC1FNuH2VUGhIWo4qqNXRGuIo9mOku5iqtRVrHQNjxifwmjV7V1gzk9Dlm9ymZFm_Z8QgW4i_aDWF2CsC6OFE_aeAp1Q_HMLE3YT_Szt67-c6mRs-zOpB3UotOSoaajjcZDyQrDW-Oqkz7NuNg" />
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-[#0b1326] bg-[#171f33] flex items-center justify-center overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVPOnryA--7A-OxIRfTzqUm89BaOFzjKx-qZi6oGxVO1Dswnw7NtGzAclDvjq2OVITf8KVAgTqQ0ZtP6_wfzLpVXqPJSMC3zAlfsd4K4vxVISsaU2TY7r0VSWwVcsu0WiaQxKC9mYoCXK-TRzOReaw-SEeKTKigormbjwEb5enUIgCspTSLuXxR2PbuKfsQWVwKwoqJlp-OzSXAFRfSsSfdbLEiN05jApkEdzKTh__kZhlf8eL9UmOlg" />
                  </div>
                </div>
                <span className="text-xs font-medium text-[#bbcabf]">+2.4k học viên đang học</span>
              </div>
            </div>

          </div>

        </section>

        {/* 2. Main Practice Workspace (Option 2: Sidebar 3:9 Layout) */}
        <section className="grid grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Sticky Sidebar Menu (3/12 cols) */}
          <aside className="col-span-12 lg:col-span-3 sticky top-28 z-20 space-y-4">
            <div className="glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-xl">view_list</span>
                  <h3 className="font-extrabold text-base text-white">Cấu trúc phần thi</h3>
                </div>
                <span className="text-[10px] font-bold bg-[#4edea3]/10 text-[#4edea3] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  2026
                </span>
              </div>

              {/* Vertical Part Cards Navigation */}
              <div className="flex flex-col gap-2">
                {partTabs.map((tab) => {
                  const isActive = activePartTab === tab.id;

                  let partIcon = 'grid_view';
                  if (tab.id.includes('1')) partIcon = 'filter_1';
                  else if (tab.id.includes('2') || tab.id.includes('23')) partIcon = 'filter_2';
                  else if (tab.id.includes('3')) partIcon = 'filter_3';
                  else if (tab.id.includes('4')) partIcon = 'filter_4';
                  else if (tab.id.includes('5')) partIcon = 'filter_5';

                  const activeClass = isActive
                    ? 'bg-[#10b981]/20 text-[#4edea3] border border-[#4edea3]/40 shadow-[0_0_20px_rgba(78,222,163,0.3)] scale-[1.02]'
                    : 'text-[#666666] hover:text-[#dae2fd] hover:bg-white/5 border border-transparent';

                  const dashIndex = tab.label.search(/\s+[–—\-]\s+/);
                  const hasDash = dashIndex !== -1;
                  const prefix = hasDash ? tab.label.substring(0, dashIndex) : tab.label;
                  const rawRest = hasDash ? tab.label.substring(dashIndex) : '';
                  const rest = rawRest.replace(/^\s*[–—\-]\s*/, '');

                  const tabInfo = partTabContent[tab.id];
                  const testCount = tabInfo ? tabInfo.testCount : 10;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePartTab(tab.id)}
                      className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${activeClass}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-xl shrink-0">{partIcon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold tracking-tight truncate">{prefix}</span>
                          {rest && <span className="font-normal text-[11px] opacity-80 truncate">{rest}</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-white/5 text-[#666666]'}`}>
                        {testCount} đề
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </aside>

          {/* Right Workspace Area (9/12 cols): Search Bar & Practice Test Cards */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Search Bar Container */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4edea3] text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Tìm kiếm bộ đề, chủ đề ${skillTitle.replace('Phần thi ', '')}...`}
                  className="w-full bg-[#0b1326]/70 border border-white/15 rounded-2xl pl-12 pr-10 py-3.5 text-[#dae2fd] text-sm focus:border-[#4edea3] focus:ring-2 focus:ring-[#4edea3]/30 transition-all placeholder:text-[#bbcabf]/60 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#222a3d] text-[#bbcabf] hover:text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Practice Test Cards Grid (3 Columns inside the 9-col container) */}
            <div key={`grid-${activePartTab}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 0: Marathon Card if available */}
              {marathonInfo && (!searchTerm || marathonInfo.title.toLowerCase().includes(searchTerm.toLowerCase())) && (
                <div
                  key={`marathon-${activePartTab}`}
                  className="animate-card-appear"
                  style={{ animationDelay: '0ms' }}
                >
                  <TestPracticeCard
                    title={marathonInfo.title}
                    badge="Marathon"
                    isMarathon={true}
                    subtitle={marathonInfo.subtitle}
                    actionText="Bắt đầu"
                    onClick={() => setActivePracticeTestIndex(-1)}
                  />
                </div>
              )}

              {Array.from({ length: currentTabInfo.testCount }, (_, index) => {
                const testNum = index + 1;
                const customProps = getCustomCardProps ? getCustomCardProps(activePartTab, testNum) : null;
                const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;

                const cardTitle = customProps?.title || `Đề ${testNumberStr} - ${currentTabInfo.badge}`;
                const cardSubtitle = customProps?.subtitle || 'Đề thi mô phỏng cấu trúc chuẩn ESOL 2026';
                const cardBadge = customProps?.badge || currentTabInfo.badge;

                if (
                  searchTerm &&
                  !cardTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  !cardSubtitle.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return null;
                }

                const hasMarathon = !!marathonInfo && !searchTerm;
                const cardStaggerIndex = hasMarathon ? index + 1 : index;
                const delayMs = Math.min(cardStaggerIndex * 35, 450);

                return (
                  <div
                    key={`card-${activePartTab}-${testNum}`}
                    className="animate-card-appear"
                    style={{ animationDelay: `${delayMs}ms` }}
                  >
                    <TestPracticeCard
                      title={cardTitle}
                      badge={cardBadge}
                      isMarathon={false}
                      subtitle={cardSubtitle}
                      actionText={activePartTab === 'full' ? 'Bắt đầu luyện tập' : 'Luyện tập'}
                      onClick={() => {
                        if (isCurrentPartSupported) {
                          setActivePracticeTestIndex(index);
                        } else {
                          setShowUpdatingModalPart(currentTabInfo.badge);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>

          </div>

        </section>

      </main>

      {/* Skill Tips Modal (Ultra-Sleek Stitch Dark Glassmorphic Modal) */}
      {showTipsModal && tipsContent && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#131b2e] rounded-[32px] p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#4edea3]/5 blur-[90px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/20 flex items-center justify-center text-[#4edea3] text-2xl shadow-inner">
                  💡
                </div>
                <div>
                  <h3 className="font-extrabold text-xl sm:text-2xl text-white">
                    {tipsTitle || `Mẹo học ${skillTitle}`}
                  </h3>
                  <p className="text-xs text-[#bbcabf] font-medium">
                    Chiến thuật ôn luyện từng Part để đạt điểm tối đa
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-9 h-9 rounded-full bg-[#222a3d] text-[#bbcabf] hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-[#dae2fd] leading-relaxed max-h-[65vh] overflow-y-auto pr-3 font-sans custom-scrollbar relative z-10">
              {tipsContent}
            </div>

            <div className="pt-3 flex justify-end border-t border-white/10 relative z-10">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#4edea3] text-[#003824] font-extrabold text-sm px-7 py-3 rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(78,222,163,0.35)] cursor-pointer"
              >
                Đã hiểu chiến thuật
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Part Updating Notice Modal */}
      {showUpdatingModalPart && (
        <div
          onClick={() => setShowUpdatingModalPart(null)}
          className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#171f33] rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-[#3c4a42] text-left space-y-4 cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ffb95f]/20 text-[#ffb95f] flex items-center justify-center text-xl font-black">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#dae2fd]">
                  Bộ đề {showUpdatingModalPart} đang cập nhật
                </h3>
                <p className="text-xs text-[#bbcabf] font-medium">
                  Tính năng đang được hoàn thiện
                </p>
              </div>
            </div>

            <p className="text-sm text-[#bbcabf] font-normal leading-relaxed">
              Bộ đề làm bài dành riêng cho <strong>{showUpdatingModalPart}</strong> đang được hệ thống cập nhật nội dung. Vui lòng chọn các tab Part đang sẵn sàng để trải nghiệm bộ đề thi chuẩn nhé!
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUpdatingModalPart(null);
                  if (supportedPartIds.length > 0) {
                    setActivePartTab(supportedPartIds[0]);
                  }
                }}
                className="bg-[#4edea3] text-[#003824] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Chuyển sang Part khả dụng
              </button>
              <button
                onClick={() => setShowUpdatingModalPart(null)}
                className="bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
