'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsAndFeaturesSection from '@/components/StatsAndFeaturesSection';
import RoadmapSection from '@/components/RoadmapSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import ExamStructureSection from '@/components/ExamStructureSection';
import StrengthsGridSection from '@/components/StrengthsGridSection';
import ScrollReveal from '@/components/ScrollReveal';
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
      <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-[#cc785c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#cc785c] font-semibold text-sm">Đang nạp dữ liệu AptisMaster...</p>
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
      <>
        {/* 2. Hero Section - Stitch Bento Grid Style */}
        <ScrollReveal delayMs={0}>
          <HeroSection 
            onStartMockTest={() => setActiveTab('mock-test')} 
            onStartPractice={() => setActiveTab('reading')} 
          />
        </ScrollReveal>

        {/* 3. Stats & Benefits Highlights */}
        <ScrollReveal delayMs={100}>
          <StatsAndFeaturesSection />
        </ScrollReveal>

        {/* 5. Main Features Showcase */}
        <ScrollReveal delayMs={100}>
          <FeaturesGridSection />
        </ScrollReveal>

        {/* 6. Exam Structure 5 Skills */}
        <ScrollReveal delayMs={100}>
          <ExamStructureSection />
        </ScrollReveal>

        {/* 7. Why Choose Us / Strengths Grid */}
        <ScrollReveal delayMs={100}>
          <StrengthsGridSection />
        </ScrollReveal>
      </>
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
