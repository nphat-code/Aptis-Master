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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      {/* 1. Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#FFF5F3] via-[#FFF8F7] to-[#FFF1EF] border-b border-slate-200/60 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Icon Box & Duration Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#CC1C01] flex items-center justify-center flex-shrink-0">
              {icon || (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
              <span>⏱</span>
              <span>{durationText}</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {skillTitle}
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-normal max-w-3xl leading-relaxed">
              {skillDescription}
            </p>
          </div>

          {/* Tips Button */}
          {tipsContent && (
            <div className="pt-1">
              <button
                onClick={() => setShowTipsModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CC1C01] text-[#CC1C01] bg-white hover:bg-[#FFF2EE] font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 shadow-2xs cursor-pointer"
              >
                <span>💡</span>
                <span>{tipsTitle || `Xem ngay - Mẹo làm bài ${skillTitle}`}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 2. Main Workspace Container */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7">
        
        {/* Progress Banner */}
        <div className="bg-[#F3F4F6] rounded-xl p-5 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center shadow-2xs flex-shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Tiến độ học tập của bạn
              </h4>
              <p className="text-sm text-slate-500 font-normal mt-0.5">
                Đã hoàn thành {completedCount} bộ đề {skillTitle.replace('Phần thi ', '')}
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#CC1C01] text-[#CC1C01] bg-white hover:bg-[#FFF2EE] font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 whitespace-nowrap self-start sm:self-auto shadow-2xs cursor-pointer">
            <span>Xem lịch sử</span>
            <span>→</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Tìm kiếm bộ đề ${skillTitle.replace('Phần thi ', '')}...`}
            className="w-full h-11 pl-10 pr-10 bg-[#F3F4F6] rounded-md border-none text-sm font-normal text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#CC1C01]/20 transition-all"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2 w-full pt-1">
          {partTabs.map((tab) => {
            const isActive = activePartTab === tab.id;
            const isFullPart = tab.id === 'full';

            const activeClass = isActive
              ? isFullPart
                ? 'bg-[#CC1C01] text-white shadow-sm'
                : 'bg-[#FEAD5D] text-white shadow-sm'
              : 'bg-[#F4F4F6] text-[#666666] hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60';

            const dashIndex = tab.label.search(/\s+[–—\-]\s+/);
            const hasDash = dashIndex !== -1;
            const prefix = hasDash ? tab.label.substring(0, dashIndex) : tab.label;
            const rest = hasDash ? tab.label.substring(dashIndex) : '';

            return (
              <button
                key={tab.id}
                onClick={() => setActivePartTab(tab.id)}
                className={`w-full px-2.5 py-3 rounded-lg text-xs sm:text-sm text-center justify-center transition-all duration-150 flex items-center ${activeClass}`}
              >
                <span className="w-full text-center leading-snug">
                  <span className="font-bold">{prefix}</span>
                  {rest && <span className="font-normal">{rest}</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-heading above test grid with headerFadeIn animation */}
        <div key={`header-${activePartTab}`} className="pt-2 space-y-1 animate-header-fade">
          <h2 className="text-xl font-extrabold text-slate-900">
            {currentTabInfo.title}
          </h2>
          <p className="text-sm text-slate-500 font-normal">
            {currentTabInfo.subtitle}
          </p>
        </div>

        {/* Dynamic Test Practice Cards Grid with cardAppear stagger animation */}
        <div key={`grid-${activePartTab}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
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
            const cardSubtitle = customProps?.subtitle || '📖 Đề luyện tập';
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
        </div>

      </div>

      {/* Skill Tips Modal */}
      {showTipsModal && tipsContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3 text-[#CC1C01]">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {tipsTitle || `Mẹo học ${skillTitle}`}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chiến thuật ôn luyện từng Part để đạt điểm tối đa
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-base transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-3 font-sans">
              {tipsContent}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#CC1C01] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#b51901] transition-colors shadow-xs cursor-pointer"
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4 cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Bộ đề {showUpdatingModalPart} đang cập nhật
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tính năng đang được hoàn thiện
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-normal leading-relaxed">
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
                className="bg-[#24085A] hover:bg-[#1a0642] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Chuyển sang Part khả dụng
              </button>
              <button
                onClick={() => setShowUpdatingModalPart(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
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
