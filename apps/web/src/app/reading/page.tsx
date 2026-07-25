'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ReadingView from '@/components/ReadingView';
import Footer from '@/components/Footer';

export default function ReadingPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/scraped_data.json')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error('Lỗi nạp scraped_data.json:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Navbar activeTab="reading" setActiveTab={() => {}} />
      <ReadingView onBackToHome={() => window.location.href = '/'} data={data} />
      <Footer />
    </div>
  );
}
