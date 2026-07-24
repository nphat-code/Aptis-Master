'use client';

import React from 'react';

export default function StatsAndFeaturesSection() {
  return (
    <section className="bg-slate-50/60 py-8 md:py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Row A: 4 Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 text-center border border-red-100 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF8A00] group-hover:scale-105 transition-transform duration-300 inline-block mb-1">
              596+
            </span>
            <span className="text-sm font-bold text-slate-800 block">Đề thi Aptis</span>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 text-center border border-red-100 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF8A00] group-hover:scale-105 transition-transform duration-300 inline-block mb-1">
              Đề Key
            </span>
            <span className="text-sm font-bold text-slate-800 block">Update hằng ngày</span>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 text-center border border-red-100 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF8A00] group-hover:scale-105 transition-transform duration-300 inline-block mb-1">
              AI
            </span>
            <span className="text-sm font-bold text-slate-800 block">Giải thích chi tiết từng câu</span>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 text-center border border-red-100 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF8A00] group-hover:scale-105 transition-transform duration-300 inline-block mb-1">
              Mô phỏng
            </span>
            <span className="text-sm font-bold text-slate-800 block">Giống bài thi thật 100%</span>
          </div>

        </div>

        {/* Row B: 5 Benefit Features Row Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100/80 shadow-sm shadow-orange-500/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF3300] border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900">Sát đề thật</h4>
              <p className="text-xs text-slate-500 font-medium">Mô phỏng 100% Aptis</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900">AI chấm Speaking</h4>
              <p className="text-xs text-slate-500 font-medium">Band + gợi ý sửa</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF3300] border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900">AI chấm Writing</h4>
              <p className="text-xs text-slate-500 font-medium">Nhận xét từng tiêu chí</p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900">596+ đề luyện</h4>
              <p className="text-xs text-slate-500 font-medium">Cập nhật liên tục</p>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF3300] border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900">Theo dõi tiến độ</h4>
              <p className="text-xs text-slate-500 font-medium">Biểu đồ & streak</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
