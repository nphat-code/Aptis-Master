'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ExamStructureSection() {
  const router = useRouter();
  const handleNavigate = (skillId: string) => {
    router.push(`/${skillId}`);
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <span className="text-xs font-semibold text-[#d97706] tracking-[0.2em] mb-2 block uppercase">
            CẤU TRÚC ĐỀ THI 2026
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#162544] mb-2">
            Ma trận kỹ năng Aptis ESOL
          </h2>
          <p className="text-sm sm:text-base text-[#6b6860] max-w-2xl">
            Hệ thống học liệu được thiết kế theo cấu trúc module học thuật, tối ưu cho việc ôn luyện chuyên sâu từng kỹ năng.
          </p>
        </div>
      </div>

      {/* 3 + 2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        
        {/* Row 1: Reading, Listening, Writing */}
        
        {/* Reading Card */}
        <div
          onClick={() => handleNavigate('reading')}
          className="md:col-span-2 bg-[#ffffff] p-7 rounded-2xl border border-[#e5ded3] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#059669] hover:shadow-md cursor-pointer min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#059669]" />
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#059669] mb-5 border border-[#a7f3d0]">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#162544] mb-2">Reading</h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              Luyện kỹ năng đọc hiểu đa dạng chủ đề từ dễ đến khó với hệ thống AI hỗ trợ từ vựng & ngữ cảnh.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5ded3] flex items-center justify-between text-[#059669] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Listening Card */}
        <div
          onClick={() => handleNavigate('listening')}
          className="md:col-span-2 bg-[#ffffff] p-7 rounded-2xl border border-[#e5ded3] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#d97706] hover:shadow-md cursor-pointer min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#d97706]" />
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#d97706] mb-5 border border-[#fde68a]">
              <span className="material-symbols-outlined text-2xl">headphones</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#162544] mb-2">Listening</h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              Mô phỏng 100% âm thanh phòng thi thực tế với kho dữ liệu đa dạng các giọng đọc chuẩn bản xứ.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5ded3] flex items-center justify-between text-[#d97706] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Writing Card */}
        <div
          onClick={() => handleNavigate('writing')}
          className="md:col-span-2 bg-[#ffffff] p-7 rounded-2xl border border-[#e5ded3] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#4f46e5] hover:shadow-md cursor-pointer min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#4f46e5]" />
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] mb-5 border border-[#c7d2fe]">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#162544] mb-2">Writing</h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              AI sửa lỗi ngữ pháp & nâng cấp từ vựng B2/C1 dựa trên hàng ngàn bài thi thực tế.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5ded3] flex items-center justify-between text-[#4f46e5] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Row 2: Speaking, Grammar */}
        
        {/* Speaking Card */}
        <div
          onClick={() => handleNavigate('speaking')}
          className="md:col-start-2 md:col-span-2 bg-[#ffffff] p-7 rounded-2xl border border-[#e5ded3] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#e11d48] hover:shadow-md cursor-pointer min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#e11d48]" />
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-[#fff1f2] flex items-center justify-center text-[#e11d48] mb-5 border border-[#fecdd3]">
              <span className="material-symbols-outlined text-2xl">mic</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#162544] mb-2">Speaking</h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              Luyện nói 1:1 với AI Examiner, chấm điểm theo tiêu chí độ trôi chảy và phát âm IPA.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5ded3] flex items-center justify-between text-[#e11d48] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Grammar Card */}
        <div
          onClick={() => handleNavigate('grammar')}
          className="md:col-span-2 bg-[#ffffff] p-7 rounded-2xl border border-[#e5ded3] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#2563eb] hover:shadow-md cursor-pointer min-h-[300px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563eb]" />
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] mb-5 border border-[#bfdbfe]">
              <span className="material-symbols-outlined text-2xl">spellcheck</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#162544] mb-2">Grammar & Vocabulary</h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              Hệ thống ngữ pháp & từ vựng theo khung ESOL giúp củng cố nền tảng học thuật vững chắc.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e5ded3] flex items-center justify-between text-[#2563eb] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </div>

    </section>
  );
}
