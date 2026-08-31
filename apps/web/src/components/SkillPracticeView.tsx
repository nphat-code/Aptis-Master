'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  onExamStateChange?: (isExamActive: boolean) => void;
  renderPracticeExam?: (props: { partId: string; testIndex: number; onExit: () => void }) => React.ReactNode;
  getCustomCardProps?: (partId: string, testNum: number) => { title?: string; subtitle?: string; badge?: string; durationText?: string } | null;
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
  onExamStateChange,
  renderPracticeExam,
  getCustomCardProps,
  getMarathonCardProps,
}: SkillPracticeViewProps) {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showUpdatingModalPart, setShowUpdatingModalPart] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePartTab, setActivePartTab] = useState(defaultPartTab || partTabs[0]?.id || 'full');
  const [activePracticeTestIndex, setActivePracticeTestIndex] = useState<number | null>(null);
  const [completedTestKeys, setCompletedTestKeys] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`aptis_completed_${skillId}`);
      if (saved) {
        setCompletedTestKeys(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error('Failed to load completed test state', e);
    }
  }, [skillId]);

  React.useEffect(() => {
    if (onExamStateChange) {
      onExamStateChange(activePracticeTestIndex !== null);
    }
  }, [activePracticeTestIndex, onExamStateChange]);

  const currentTabInfo = partTabContent[activePartTab] || partTabContent[partTabs[0]?.id || 'full'];

  const markTestCompleted = (partId: string, testIndex: number) => {
    const key = `${partId}_${testIndex + 1}`;
    setCompletedTestKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      try {
        localStorage.setItem(`aptis_completed_${skillId}`, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Failed to save completed test state', e);
      }
      return next;
    });
  };

  if (activePracticeTestIndex !== null && renderPracticeExam) {
    return renderPracticeExam({
      partId: activePartTab,
      testIndex: activePracticeTestIndex,
      onExit: () => {
        markTestCompleted(activePartTab, activePracticeTestIndex);
        setActivePracticeTestIndex(null);
      },
    });
  }

  const marathonInfo = getMarathonCardProps ? getMarathonCardProps(activePartTab) : null;
  const isCurrentPartSupported = supportedPartIds.includes(activePartTab);

  const totalAvailableTests = currentTabInfo ? currentTabInfo.testCount : 10;
  const progressPercent = Math.min(Math.round((completedCount / (totalAvailableTests || 1)) * 100), 100);

  return (
    <div key={`skill-view-${skillId}`} className="min-h-screen bg-[#faf9f5] text-[#141413] font-sans pb-24 pt-24 animate-tab-fade-up">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* 1. Skill Header Section */}
        <section className="grid grid-cols-12 gap-8 items-stretch pt-28 mb-12">
          
          {/* Left Hero Card (7 cols) */}
          <div className="col-span-12 lg:col-span-7 bg-[#efe9de] rounded-3xl p-8 sm:p-10 border border-[#e6dfd8] flex flex-col justify-between relative overflow-hidden min-h-[400px]">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-[#cc785c] border border-[#e6dfd8]">
                  <span>{icon || '🎯'}</span>
                  <span>{skillTitle}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#6c6a64] border border-[#e6dfd8]">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{durationText}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#141413] mb-4 leading-tight">
                Luyện thi {skillTitle}
              </h1>

              <p className="text-sm sm:text-base text-[#6c6a64] max-w-xl leading-relaxed mb-6">
                {skillDescription}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-[#e6dfd8]">
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => setActivePracticeTestIndex(0)}
                  className="bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium px-7 py-3 rounded-full transition-all text-sm cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <span>⚡ Luyện đề đầu tiên</span>
                </button>

                {tipsContent && (
                  <button
                    onClick={() => setShowTipsModal(true)}
                    className="bg-white text-[#141413] font-medium px-6 py-3 rounded-full border border-[#e6dfd8] hover:bg-[#faf9f5] transition-all text-sm cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>💡</span>
                    <span>{tipsTitle || `Mẹo thi ${skillTitle}`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Widgets (5 cols) */}
          <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-6 min-h-[400px]">
            
            {/* Widget 1: Study Progress Card */}
            <div className="bg-[#efe9de] rounded-3xl p-6 sm:p-7 flex items-center justify-between border border-[#e6dfd8]">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#141413] mb-1">Tiến độ học tập</h3>
                <p className="text-xs sm:text-sm text-[#6c6a64]">
                  Đã hoàn thành <strong className="text-[#cc785c] font-semibold">{completedCount}</strong> bài luyện tập.
                </p>
                <div className="mt-4">
                  <span className="text-[#cc785c] font-medium text-xs flex items-center gap-1">
                    <span>Đang tiến bộ đều đặn</span>
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                  </span>
                </div>
              </div>

              <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-[#e6dfd8]" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
                  <circle
                    className="text-[#cc785c]"
                    cx="48"
                    cy="48"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 - (251.3 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-semibold text-[#141413]">{progressPercent}%</span>
                  <span className="text-[8px] font-medium text-[#6c6a64] uppercase tracking-wider">Goal</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Strategy Card */}
            <div className="bg-[#efe9de] rounded-3xl p-6 sm:p-7 border border-[#e6dfd8] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#141413] mb-1">Chiến thuật làm bài</h3>
                <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed line-clamp-2">
                  Luyện tập phân bổ thời gian hợp lý cho từng phần để tối đa hóa điểm số CEFR B2/C1.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full border border-white bg-[#a9583e]" />
                  <div className="w-6 h-6 rounded-full border border-white bg-[#d97706]" />
                  <div className="w-6 h-6 rounded-full border border-white bg-[#e8a55a]" />
                </div>
                <span className="text-xs font-medium text-[#6c6a64]">+2.4k học viên đang luyện</span>
              </div>
            </div>

          </div>

        </section>

        {/* 2. Main Practice Workspace (Option 2: Sidebar 3:9 Layout) */}
        <section className="grid grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Sticky Sidebar Menu (3/12 cols) */}
          <aside className="col-span-12 lg:col-span-3 sticky top-28 z-20 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-[#e6dfd8] shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#cc785c] text-xl">view_list</span>
                  <h3 className="font-serif font-semibold text-base text-[#141413]">Cấu trúc phần thi</h3>
                </div>
                <span className="text-[10px] font-medium bg-[#efe9de] text-[#141413] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  2026
                </span>
              </div>

              {/* Vertical Part Cards Navigation */}
              <div className="flex flex-col gap-1.5">
                {partTabs.map((tab) => {
                  const isActive = activePartTab === tab.id;

                  let partIcon = 'grid_view';
                  if (tab.id.includes('1')) partIcon = 'filter_1';
                  else if (tab.id.includes('2') || tab.id.includes('23')) partIcon = 'filter_2';
                  else if (tab.id.includes('3')) partIcon = 'filter_3';
                  else if (tab.id.includes('4')) partIcon = 'filter_4';
                  else if (tab.id.includes('5')) partIcon = 'filter_5';

                  const activeClass = isActive
                    ? 'bg-[#FEAD5D] text-white shadow-sm font-bold'
                    : 'text-[#666666] hover:text-[#141413] hover:bg-[#f5f0e8] border border-transparent';

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
                      className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${activeClass}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-lg shrink-0">{partIcon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold tracking-tight truncate">{prefix}</span>
                          {rest && <span className="font-normal text-[11px] opacity-90 truncate">{rest}</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-[#efe9de] text-[#666666]'}`}>
                        {testCount} đề
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </aside>

          {/* Right Workspace Area (9/12 cols): Search Bar & Practice Test Cards */}
          <div key={`right-workspace-${activePartTab}`} className="col-span-12 lg:col-span-9 space-y-6 animate-tab-fade-up">
            
            {/* Search Bar Container */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e6dfd8] shadow-xs">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8b82] text-xl pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Tìm kiếm bộ đề, chủ đề ${skillTitle.replace('Phần thi ', '')}...`}
                  className="w-full bg-[#faf9f5] border border-[#e6dfd8] rounded-xl pl-11 pr-10 py-2.5 text-[#141413] text-sm focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] transition-all placeholder:text-[#8e8b82] outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#efe9de] text-[#6c6a64] hover:text-[#141413] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
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
                const cardSubtitle = customProps?.subtitle || '';
                const cardBadge = customProps?.badge || currentTabInfo.badge;
                const cardDuration = (customProps as any)?.durationText;

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

                const isTestDone = completedTestKeys.has(`${activePartTab}_${testNum}`);

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
                      durationText={cardDuration}
                      isCompleted={isTestDone}
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

      {/* Skill Tips Modal (Claude Warm Modal) */}
      {showTipsModal && tipsContent && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#141413]/50 backdrop-blur-sm flex items-center justify-center p-6 sm:p-10 my-auto">
          <div className="bg-[#faf9f5] rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[78vh] flex flex-col justify-between space-y-5 shadow-2xl border border-[#e6dfd8] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e6dfd8] pb-4 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#efe9de] border border-[#e6dfd8] flex items-center justify-center text-[#cc785c] text-xl">
                  💡
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-xl text-[#141413]">
                    {tipsTitle || `Mẹo học ${skillTitle}`}
                  </h3>
                  <p className="text-xs text-[#6c6a64] font-normal">
                    Chiến thuật ôn luyện từng Part để đạt điểm tối đa
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-8 h-8 rounded-full bg-[#efe9de] text-[#6c6a64] hover:text-[#141413] flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#3d3d3a] leading-relaxed max-h-[48vh] overflow-y-auto pr-3 font-sans custom-scrollbar relative z-10 flex-1">
              {tipsContent}
            </div>

            <div className="pt-3 flex justify-end border-t border-[#e6dfd8] relative z-10 shrink-0">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Part Updating Notice Modal */}
      {showUpdatingModalPart && typeof window !== 'undefined' && createPortal(
        <div
          onClick={() => setShowUpdatingModalPart(null)}
          className="fixed inset-0 z-[9999] bg-[#141413]/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#faf9f5] border border-[#e6dfd8] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 cursor-default"
          >
            <div className="w-12 h-12 bg-[#efe9de] text-[#cc785c] rounded-2xl flex items-center justify-center mx-auto border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">construction</span>
            </div>
            <h4 className="text-lg font-serif font-semibold text-[#141413]">
              Bộ đề {showUpdatingModalPart} đang cập nhật
            </h4>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              Bộ đề làm bài dành riêng cho <strong>{showUpdatingModalPart}</strong> đang được cập nhật nội dung bám sát cấu trúc 2026. Vui lòng chọn các phần thi sẵn sàng khác để trải nghiệm!
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUpdatingModalPart(null);
                  if (supportedPartIds.length > 0) {
                    setActivePartTab(supportedPartIds[0]);
                  }
                }}
                className="bg-[#cc785c] hover:bg-[#a9583e] text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Chuyển sang Part khả dụng
              </button>
              <button
                onClick={() => setShowUpdatingModalPart(null)}
                className="bg-white hover:bg-[#efe9de] text-[#141413] font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#e6dfd8] transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
