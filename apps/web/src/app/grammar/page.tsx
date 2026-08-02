'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GrammarView from '@/components/GrammarView';
import Footer from '@/components/Footer';

export default function GrammarPage() {
  const [data, setData] = useState<any>(null);

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
        window.location.href = targetPath;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col">
      <Navbar activeTab="grammar" setActiveTab={handleTabChange} />
      <GrammarView onBackToHome={() => handleTabChange('dashboard')} />
      <Footer />
    </div>
  );
}
