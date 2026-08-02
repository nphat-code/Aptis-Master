'use client';

import React from 'react';

export default function ExamStructureSection() {
  const handleNavigate = (skillId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/${skillId}`;
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Ma Trận Kỹ Năng Aptis
          </h2>
          <p className="text-base text-[#bbcabf] max-w-2xl">
            Hệ thống học liệu được thiết kế theo cấu trúc module, tối ưu cho việc ôn luyện chuyên sâu từng kỹ năng.
          </p>
        </div>
      </div>

      {/* 3 + 2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
        {/* Row 1: Reading, Listening, Writing */}
        
        {/* Reading Card */}
        <div
          onClick={() => handleNavigate('reading')}
          className="md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col group transition-all bento-glow cursor-pointer relative overflow-hidden min-h-[320px]"
        >
          <div className="mb-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3] mb-6 border border-[#4edea3]/20">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Reading</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              Luyện kỹ năng đọc hiểu đa dạng chủ đề từ dễ đến khó với hệ thống AI hỗ trợ.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[#4edea3] font-bold text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Listening Card */}
        <div
          onClick={() => handleNavigate('listening')}
          className="md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col group transition-all bento-glow cursor-pointer border-[#c0c1ff]/20 hover:border-[#c0c1ff]/40 min-h-[320px]"
        >
          <div className="mb-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] mb-6 border border-[#c0c1ff]/20">
              <span className="material-symbols-outlined text-3xl">headphones</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Listening</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              Mô phỏng 100% âm thanh phòng thi thực tế với kho dữ liệu đa dạng các giọng đọc.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[#c0c1ff] font-bold text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Writing Card */}
        <div
          onClick={() => handleNavigate('writing')}
          className="md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col group transition-all bento-glow cursor-pointer border-pink-400/20 hover:border-pink-400/40 min-h-[320px]"
        >
          <div className="mb-auto">
            <div className="w-14 h-14 rounded-2xl bg-pink-400/10 flex items-center justify-center text-pink-400 mb-6 border border-pink-400/20">
              <span className="material-symbols-outlined text-3xl">edit_note</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Writing</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              AI sửa lỗi ngữ pháp & nâng cấp từ vựng B2/C1 dựa trên hàng ngàn bài thi thực tế.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-pink-400 font-bold text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Row 2: Speaking, Grammar (Centered in 6-col grid) */}

        {/* Speaking Card */}
        <div
          onClick={() => handleNavigate('speaking')}
          className="md:col-start-2 md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col group transition-all bento-glow cursor-pointer border-orange-400/20 hover:border-orange-400/40 min-h-[320px]"
        >
          <div className="mb-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-400/10 flex items-center justify-center text-orange-400 mb-6 border border-orange-400/20">
              <span className="material-symbols-outlined text-3xl">mic</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Speaking</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              Luyện nói 1:1 với AI Coach, chấm điểm theo tiêu chí độ trôi chảy và phát âm IPA.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-orange-400 font-bold text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Grammar Card */}
        <div
          onClick={() => handleNavigate('grammar')}
          className="md:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col group transition-all bento-glow cursor-pointer border-[#ffb95f]/20 hover:border-[#ffb95f]/40 min-h-[320px]"
        >
          <div className="mb-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#ffb95f]/10 flex items-center justify-center text-[#ffb95f] mb-6 border border-[#ffb95f]/20">
              <span className="material-symbols-outlined text-3xl">spellcheck</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Grammar</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              Hệ thống ngữ pháp & từ vựng theo khung ESOL giúp củng cố nền tảng vững chắc.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[#ffb95f] font-bold text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </div>

    </section>
  );
}
