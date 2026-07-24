'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsAndFeaturesSection from '@/components/StatsAndFeaturesSection';
import RoadmapSection from '@/components/RoadmapSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import ExamStructureSection from '@/components/ExamStructureSection';
import StrengthsGridSection from '@/components/StrengthsGridSection';
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
      {/* 1. Header Navigation Bar (Navbar) - Aptis Kỳ Tích Style */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Hero Section - Aptis Kỳ Tích Style (Main Content Part 1) */}
      <HeroSection 
        onStartMockTest={() => setActiveTab('mock-test')} 
        onStartPractice={() => setActiveTab('reading')} 
      />

      {/* 3. Stats & Benefits Highlights (Main Content Part 2 - Block A) */}
      <StatsAndFeaturesSection />

      {/* 4. Study Roadmap Section (Main Content Part 2 - Block B) */}
      <RoadmapSection onSelectRoadmap={(type) => setActiveTab(type === 'urgent' ? 'mock-test' : 'reading')} />

      {/* 5. Main Features Showcase (Main Content Part 3 - Block A) */}
      <FeaturesGridSection />

      {/* 6. Exam Structure 5 Skills (Main Content Part 3 - Block B) */}
      <ExamStructureSection />

      {/* 7. Why Choose Us / Strengths Grid (Main Content Part 3 - Block C) */}
      <StrengthsGridSection />

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 1 Step Indicator Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-100 text-[#CC1C01] font-black text-sm flex items-center justify-center border border-red-200">
                1
              </span>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Bước 1: Hoàn thành Bố Cục Khung & Thanh Điều Hướng (Aptis Kỳ Tích)
                </h2>
                <p className="text-xs text-slate-500">
                  Đã tách nhỏ thành các file component: <code className="text-[#CC1C01] font-mono">Navbar.tsx</code>, <code className="text-[#CC1C01] font-mono">HeaderBanner.tsx</code>, <code className="text-[#CC1C01] font-mono">Footer.tsx</code>
                </p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đã hoàn thành Bước 1
            </span>
          </div>

          {/* Skill Selection Grid (Aptis Kỳ Tích Style Preview) */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Chọn kỹ năng luyện tập (Dữ liệu đã nạp sẵn)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Reading Card */}
              <div 
                onClick={() => setActiveTab('reading')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                  activeTab === 'reading'
                    ? 'bg-red-50/60 border-[#CC1C01] ring-2 ring-red-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#CC1C01] flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-[#CC1C01] transition-colors">
                    Aptis Reading
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    4 Parts bài đọc: Điền từ, Sắp xếp câu, Chọn người nói & Đọc nối tiêu đề.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#CC1C01]">
                  <span>48 Bộ câu hỏi</span>
                  <span>→</span>
                </div>
              </div>

              {/* Listening Card */}
              <div 
                onClick={() => setActiveTab('listening')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                  activeTab === 'listening'
                    ? 'bg-red-50/60 border-[#CC1C01] ring-2 ring-red-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  🎧
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-[#CC1C01] transition-colors">
                    Aptis Listening
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Nghe audio thực tế: Thông tin ngắn, đoạn hội thoại & bài phát biểu dài.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>16+ Bài nghe</span>
                  <span>→</span>
                </div>
              </div>

              {/* Writing Card */}
              <div 
                onClick={() => setActiveTab('writing')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                  activeTab === 'writing'
                    ? 'bg-red-50/60 border-[#CC1C01] ring-2 ring-red-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  ✍️
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-[#CC1C01] transition-colors">
                    Aptis Writing
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Viết theo các Club: Câu đơn, chat ngắn, phản hồi bạn bè & gửi quản lý.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>14 Chủ đề Club</span>
                  <span>→</span>
                </div>
              </div>

              {/* Speaking Card */}
              <div 
                onClick={() => setActiveTab('speaking')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                  activeTab === 'speaking'
                    ? 'bg-red-50/60 border-[#CC1C01] ring-2 ring-red-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                  🗣️
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 group-hover:text-[#CC1C01] transition-colors">
                    Aptis Speaking
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Luyện nói 4 phần: Trả lời cá nhân, miêu tả tranh & so sánh tranh.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>4 Parts Nói</span>
                  <span>→</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* 4. Footer Component */}
      <Footer />
    </div>
  );
}
