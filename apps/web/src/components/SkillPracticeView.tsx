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
  skillId: string; // e.g. "reading", "listening", "speaking", "writing", "grammar"
  skillTitle: string; // e.g. "Phần thi Reading"
  skillDescription: string;
  durationText?: string; // e.g. "30 phút"
  icon?: React.ReactNode;
  partTabs: PartTab[];
  partTabContent: Record<string, PartTabContent>;
  defaultPartTab?: string;
  completedCount?: number;
  tipsTitle?: string;
  tipsContent?: React.ReactNode;
  supportedPartIds?: string[]; // e.g. ['part1', 'part23']
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
  const [sortBy, setSortBy] = useState('newest');
  const [activePartTab, setActivePartTab] = useState(defaultPartTab || partTabs[0]?.id || 'full');
  const [activePracticeTestIndex, setActivePracticeTestIndex] = useState<number | null>(null);

  const currentTabInfo = partTabContent[activePartTab] || partTabContent[partTabs[0]?.id || 'full'];

  // Render Practice Exam Workspace when test index is selected
  if (activePracticeTestIndex !== null && renderPracticeExam) {
    return renderPracticeExam({
      partId: activePartTab,
      testIndex: activePracticeTestIndex,
      onExit: () => setActivePracticeTestIndex(null),
    });
  }

  const marathonInfo = getMarathonCardProps ? getMarathonCardProps(activePartTab) : null;
  const isCurrentPartSupported = supportedPartIds.includes(activePartTab);

  // Calculate progress percentage
  const totalAvailableTests = currentTabInfo ? currentTabInfo.testCount : 10;
  const progressPercent = Math.min(Math.round((completedCount / (totalAvailableTests || 1)) * 100), 100);
  const strokeDashoffset = 364.42 - (364.42 * progressPercent) / 100;

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

              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-[#2d3449]"
                    cx="56"
                    cy="56"
                    fill="transparent"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="9"
                  />
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

        {/* 2. Filter & Search Bar Section */}
        <section className="mb-10">
          <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
            
            {/* Search Input Box */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[#bbcabf] text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Tìm kiếm bộ đề, chủ đề ${skillTitle.replace('Phần thi ', '')}...`}
                className="w-full bg-[#131b2e] border border-[#3c4a42] rounded-2xl pl-14 pr-10 py-3.5 text-[#dae2fd] text-sm focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] transition-all placeholder:text-[#bbcabf]/60"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbcabf] hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs & Sort Controls (Rule 15 Compliant: Active orange #FEAD5D / red #CC1C01, inactive #666666) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-[#3c4a42]/30 pt-6">
              
              {/* Part Filter Tabs */}
              <div className="flex flex-wrap bg-[#131b2e] p-1.5 rounded-2xl gap-1">
                {partTabs.map((tab) => {
                  const isActive = activePartTab === tab.id;
                  const isFullPart = tab.id === 'full';

                  const activeClass = isActive
                    ? isFullPart
                      ? 'bg-[#CC1C01] text-white shadow-lg'
                      : 'bg-[#FEAD5D] text-white shadow-lg'
                    : 'text-[#666666] hover:text-[#dae2fd] hover:bg-[#222a3d]';

                  const dashIndex = tab.label.search(/\s+[–—\-]\s+/);
                  const hasDash = dashIndex !== -1;
                  const prefix = hasDash ? tab.label.substring(0, dashIndex) : tab.label;
                  const rest = hasDash ? tab.label.substring(dashIndex) : '';

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePartTab(tab.id)}
                      className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${activeClass}`}
                    >
                      <span className="font-bold">{prefix}</span>
                      {rest && <span className="font-normal">{rest}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3 self-end lg:self-auto">
                <span className="text-xs font-medium text-[#bbcabf]">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#131b2e] border border-[#3c4a42] rounded-xl text-[#dae2fd] text-xs py-2 px-3.5 focus:ring-1 focus:ring-[#4edea3] focus:border-[#4edea3]"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Được làm nhiều nhất</option>
                  <option value="difficulty">Độ khó: Dễ đến Khó</option>
                </select>
              </div>

            </div>

          </div>
        </section>

        {/* 3. Practice Cards Grid (CONTINUOUS SCROLL - NO PAGINATION) */}
        <section key={`grid-${activePartTab}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            // Search filter
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
        </section>

      </main>

      {/* Skill Tips Modal */}
      {showTipsModal && tipsContent && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl border border-[#3c4a42] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 text-[#4edea3]">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-extrabold text-xl text-[#dae2fd]">
                    {tipsTitle || `Mẹo học ${skillTitle}`}
                  </h3>
                  <p className="text-xs text-[#bbcabf] font-medium">
                    Chiến thuật ôn luyện từng Part để đạt điểm tối đa
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-9 h-9 rounded-full bg-[#222a3d] text-[#bbcabf] hover:bg-[#2d3449] flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-[#dae2fd] leading-relaxed max-h-[70vh] overflow-y-auto pr-3 font-sans custom-scrollbar">
              {tipsContent}
            </div>

            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#4edea3] text-[#003824] font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#3ec991] transition-colors shadow-xs cursor-pointer"
              >
                Đã hiểu
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
