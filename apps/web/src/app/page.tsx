'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DashboardView from '@/components/dashboard/DashboardView';
import ReadingView from '@/components/ReadingView';
import ListeningView from '@/components/ListeningView';
import SpeakingView from '@/components/SpeakingView';
import WritingView from '@/components/WritingView';
import GrammarView from '@/components/GrammarView';
import Footer from '@/components/Footer';

export default function AptisPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isExamActive, setIsExamActive] = useState(false);

  useEffect(() => {
    // Detect URL path on mount
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace('/', '');
      if (['reading', 'listening', 'writing', 'speaking', 'grammar'].includes(path)) {
        setActiveTab(path);
      } else if (path === 'thi-thu') {
        setActiveTab('mock-test');
      }
    }

    fetch('/scraped_data.json')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi nạp scraped_data.json:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-[#162544] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#162544] font-semibold text-sm">Đang nạp dữ liệu AptisMaster...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'reading' || activeTab === 'mock-test') {
      return <ReadingView onBackToHome={() => setActiveTab('dashboard')} onExamStateChange={setIsExamActive} data={data} />;
    }
    if (activeTab === 'listening') {
      return <ListeningView onBackToHome={() => setActiveTab('dashboard')} onExamStateChange={setIsExamActive} />;
    }
    if (activeTab === 'speaking') {
      return <SpeakingView onBackToHome={() => setActiveTab('dashboard')} onExamStateChange={setIsExamActive} />;
    }
    if (activeTab === 'writing') {
      return <WritingView onBackToHome={() => setActiveTab('dashboard')} onExamStateChange={setIsExamActive} />;
    }
    if (activeTab === 'grammar') {
      return <GrammarView onBackToHome={() => setActiveTab('dashboard')} onExamStateChange={setIsExamActive} />;
    }
    return (
      <DashboardView
        onSelectSkill={(skillId) => setActiveTab(skillId)}
        onStartMockTest={() => setActiveTab('mock-test')}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] font-sans flex flex-col">
      {/* 1. Header Navigation Bar (Navbar) - Hide during active exam */}
      {!isExamActive && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* 2. Main Workspace Content Area - Animates from bottom to top on tab switch */}
      <div key={`page-content-${activeTab}`} className="animate-tab-fade-up flex-1 flex flex-col">
        {renderContent()}
      </div>

      {/* 3. Footer - Hide during active exam */}
      {!isExamActive && <Footer />}
    </div>
  );
}
