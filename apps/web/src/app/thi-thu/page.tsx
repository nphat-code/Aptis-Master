'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ReadingView from '@/components/ReadingView';

export default function ThiThuPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isExamActive, setIsExamActive] = useState(false);

  useEffect(() => {
    fetch('/scraped_data.json')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error('Lỗi nạp scraped_data.json:', err));
  }, []);

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
      {!isExamActive && <Sidebar activeTab="mock-test" setActiveTab={handleTabChange} />}
      <div
        key="thi-thu-content"
        className={`flex-1 flex flex-col min-h-screen animate-tab-fade-up ${
          !isExamActive ? 'lg:pl-64 pt-14 lg:pt-0' : ''
        }`}
      >
        <ReadingView onBackToHome={() => handleTabChange('dashboard')} onExamStateChange={setIsExamActive} data={data} />
      </div>
    </div>
  );
}
