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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Navbar activeTab="grammar" setActiveTab={() => {}} />
      <GrammarView onBackToHome={() => window.location.href = '/'} data={data} />
      <Footer />
    </div>
  );
}
