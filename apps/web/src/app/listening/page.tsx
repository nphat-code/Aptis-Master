'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ListeningView from '@/components/ListeningView';
import Footer from '@/components/Footer';

export default function ListeningPage() {
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
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
      {!isExamActive && <Navbar activeTab="listening" setActiveTab={handleTabChange} />}
      <div key="listening-content" className="animate-tab-fade-up flex-1 flex flex-col">
        <ListeningView onBackToHome={() => handleTabChange('dashboard')} onExamStateChange={setIsExamActive} />
      </div>
      {!isExamActive && <Footer />}
    </div>
  );
}


