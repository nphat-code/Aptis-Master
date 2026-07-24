'use client';

import React from 'react';

export default function ExamStructureSection() {
  const skills = [
    {
      id: 'grammar',
      name: 'Grammar & Vocabulary',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
        </svg>
      ),
      count: '25 câu',
      time: '25 phút',
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      count: '4 phần',
      time: '30 phút',
    },
    {
      id: 'listening',
      name: 'Listening',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 15h3v4H3v-4zm15 0h3v4h-3v-4z" />
        </svg>
      ),
      count: '25 câu',
      time: '25 phút',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      count: '4 phần',
      time: '12 phút',
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      count: '4 phần',
      time: '25 phút',
    },
  ];

  return (
    <section className="bg-slate-50/60 py-16 md:py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title Area */}
        <div className="text-center space-y-2">
          <span className="text-[#FF3300] font-black text-xs uppercase tracking-widest block">
            CẤU TRÚC BÀI THI
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1510] tracking-tight">
            5 kỹ năng trong{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700]">
              đề Aptis
            </span>
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Hiểu rõ thời lượng từng phần để luyện đúng trọng tâm.
          </p>
        </div>

        {/* 5 Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white rounded-2xl p-5 border border-red-100 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center space-y-3 cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform">
                {skill.icon}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {skill.name}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700">{skill.count}</span>
                <span>•</span>
                <span className="bg-red-50 text-[#FF3300] px-2.5 py-0.5 rounded-full font-bold">{skill.time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
