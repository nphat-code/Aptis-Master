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
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#4edea3] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#4edea3] font-bold text-sm">Đang nạp dữ liệu AptisMaster...</p>
      </div>
    );
  }

  // Render Skill Views for Reading, Listening, Speaking, Writing, Grammar
  if (activeTab === 'reading') {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ReadingView onBackToHome={() => setActiveTab('dashboard')} data={data} />
        <Footer />
      </div>
    );
  }

  if (activeTab === 'listening') {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <ListeningView onBackToHome={() => setActiveTab('dashboard')} />
        <Footer />
      </div>
    );
  }

  if (activeTab === 'speaking') {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SpeakingView onBackToHome={() => setActiveTab('dashboard')} />
        <Footer />
      </div>
    );
  }

  if (activeTab === 'writing') {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <WritingView onBackToHome={() => setActiveTab('dashboard')} />
        <Footer />
      </div>
    );
  }

  if (activeTab === 'grammar') {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <GrammarView onBackToHome={() => setActiveTab('dashboard')} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
      {/* 1. Header Navigation Bar (Navbar) - Fixed Top */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

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

      {/* 8. Footer Component */}
      <Footer />
    </div>
  );
}
