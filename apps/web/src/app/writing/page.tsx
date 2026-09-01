'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import WritingView from '@/components/WritingView';

export default function WritingPage() {
  const router = useRouter();
  const [isExamActive, setIsExamActive] = useState(false);

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
      {!isExamActive && <Sidebar activeTab="writing" setActiveTab={handleTabChange} />}
      <div
        key="writing-content"
        className={`flex-1 flex flex-col min-h-screen animate-tab-fade-up ${
          !isExamActive ? 'lg:pl-64 pt-14 lg:pt-0' : ''
        }`}
      >
        <WritingView onBackToHome={() => handleTabChange('dashboard')} onExamStateChange={setIsExamActive} />
      </div>
    </div>
  );
}


