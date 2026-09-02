'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'dashboard' ? '/' : tab === 'mock-test' ? '/thi-thu' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        router.push(targetPath);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] font-sans flex flex-col lg:flex-row">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeTab="dashboard" setActiveTab={handleTabChange} />

      {/* 2. Main Workspace Content Area */}
      <div
        key="dashboard-content"
        className="flex-1 flex flex-col min-h-screen animate-tab-fade-up lg:pl-64 pt-14 lg:pt-0"
      >
        <DashboardView
          onSelectSkill={(skillId) => handleTabChange(skillId)}
          onStartMockTest={() => handleTabChange('mock-test')}
        />
      </div>
    </div>
  );
}
