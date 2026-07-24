'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsAndFeaturesSection from '@/components/StatsAndFeaturesSection';
import RoadmapSection from '@/components/RoadmapSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import ExamStructureSection from '@/components/ExamStructureSection';
import StrengthsGridSection from '@/components/StrengthsGridSection';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';

export default function AptisPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subView, setSubView] = useState('practice');
  const [selectedSubPart, setSelectedSubPart] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#FF2E00] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#FF2E00] font-bold text-sm">Đang nạp dữ liệu Aptis Kỳ Tích...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* 1. Header Navigation Bar (Navbar) - Fixed Top */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Hero Section - Aptis Kỳ Tích Style (Main Content Part 1) */}
      <ScrollReveal delayMs={0}>
        <HeroSection 
          onStartMockTest={() => setActiveTab('mock-test')} 
          onStartPractice={() => setActiveTab('reading')} 
        />
      </ScrollReveal>

      {/* 3. Stats & Benefits Highlights (Main Content Part 2 - Block A) */}
      <ScrollReveal delayMs={100}>
        <StatsAndFeaturesSection />
      </ScrollReveal>

      {/* 4. Study Roadmap Section (Main Content Part 2 - Block B) */}
      <ScrollReveal delayMs={100}>
        <RoadmapSection onSelectRoadmap={(type) => setActiveTab(type === 'urgent' ? 'mock-test' : 'reading')} />
      </ScrollReveal>

      {/* 5. Main Features Showcase (Main Content Part 3 - Block A) */}
      <ScrollReveal delayMs={100}>
        <FeaturesGridSection />
      </ScrollReveal>

      {/* 6. Exam Structure 5 Skills (Main Content Part 3 - Block B) */}
      <ScrollReveal delayMs={100}>
        <ExamStructureSection />
      </ScrollReveal>

      {/* 7. Why Choose Us / Strengths Grid (Main Content Part 3 - Block C) */}
      <ScrollReveal delayMs={100}>
        <StrengthsGridSection />
      </ScrollReveal>

      {/* 8. Footer Component */}
      <Footer />
    </div>
  );
}
