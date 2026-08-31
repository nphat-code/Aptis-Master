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
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#141413] mb-2">
            Ma trận kỹ năng Aptis ESOL
          </h2>
          <p className="text-sm sm:text-base text-[#6c6a64] max-w-2xl">
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
          className="md:col-span-2 bg-[#efe9de] p-7 rounded-2xl border border-[#e6dfd8] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#cc785c] cursor-pointer min-h-[300px]"
        >
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] mb-5 border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#141413] mb-2">Reading</h3>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              Luyện kỹ năng đọc hiểu đa dạng chủ đề từ dễ đến khó với hệ thống AI hỗ trợ.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e6dfd8] flex items-center justify-between text-[#cc785c] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Listening Card */}
        <div
          onClick={() => handleNavigate('listening')}
          className="md:col-span-2 bg-[#efe9de] p-7 rounded-2xl border border-[#e6dfd8] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#cc785c] cursor-pointer min-h-[300px]"
        >
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] mb-5 border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">headphones</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#141413] mb-2">Listening</h3>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              Mô phỏng 100% âm thanh phòng thi thực tế với kho dữ liệu đa dạng các giọng đọc.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e6dfd8] flex items-center justify-between text-[#cc785c] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Writing Card */}
        <div
          onClick={() => handleNavigate('writing')}
          className="md:col-span-2 bg-[#efe9de] p-7 rounded-2xl border border-[#e6dfd8] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#cc785c] cursor-pointer min-h-[300px]"
        >
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] mb-5 border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#141413] mb-2">Writing</h3>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              AI sửa lỗi ngữ pháp & nâng cấp từ vựng B2/C1 dựa trên hàng ngàn bài thi thực tế.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e6dfd8] flex items-center justify-between text-[#cc785c] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Row 2: Speaking, Grammar */}
        
        {/* Speaking Card */}
        <div
          onClick={() => handleNavigate('speaking')}
          className="md:col-start-2 md:col-span-2 bg-[#efe9de] p-7 rounded-2xl border border-[#e6dfd8] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#cc785c] cursor-pointer min-h-[300px]"
        >
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] mb-5 border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">mic</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#141413] mb-2">Speaking</h3>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              Luyện nói 1:1 với AI Coach, chấm điểm theo tiêu chí độ trôi chảy và phát âm IPA.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e6dfd8] flex items-center justify-between text-[#cc785c] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Grammar Card */}
        <div
          onClick={() => handleNavigate('grammar')}
          className="md:col-span-2 bg-[#efe9de] p-7 rounded-2xl border border-[#e6dfd8] flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:border-[#cc785c] cursor-pointer min-h-[300px]"
        >
          <div className="mb-auto">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] mb-5 border border-[#e6dfd8]">
              <span className="material-symbols-outlined text-2xl">spellcheck</span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-[#141413] mb-2">Grammar & Vocabulary</h3>
            <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
              Hệ thống ngữ pháp & từ vựng theo khung ESOL giúp củng cố nền tảng vững chắc.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#e6dfd8] flex items-center justify-between text-[#cc785c] font-medium text-xs sm:text-sm">
            <span>Vào luyện kỹ năng</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </div>

    </section>
  );
}
