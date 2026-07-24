'use client';

import React from 'react';

export default function StrengthsGridSection() {
  const strengths = [
    {
      id: 1,
      title: 'Mô phỏng giống đề thật 100%',
      desc: 'Giao diện kéo thả, dropdown, timer y hệt bài thi Aptis.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Đầy đủ đề thật, cập nhật liên tục',
      desc: '596+ đề bám sát kỳ thi, bổ sung thường xuyên.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'AI chấm & chữa Speaking–Writing',
      desc: 'Sát thực tế, trả kết quả & nhận xét ngay.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Nắm rõ band điểm',
      desc: 'Biết chính xác band từng kỹ năng để ôn đúng chỗ yếu.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Giải thích chi tiết từng câu',
      desc: 'Mỗi câu có đáp án + lý do, hiểu sâu không học vẹt.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: 'Theo dõi tiến bộ + streak',
      desc: 'Biểu đồ tiến bộ từng kỹ năng, giữ thói quen mỗi ngày.',
      icon: (
        <svg className="w-5 h-5 text-[#FF3300]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title Area */}
        <div className="text-center space-y-2">
          <span className="text-[#FF3300] font-black text-xs uppercase tracking-widest block">
            ĐIỂM MẠNH
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1510] tracking-tight">
            Vì sao chọn Aptis Kỳ Tích
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Những điều làm nên khác biệt khi luyện thi cùng Kỳ Tích.
          </p>
        </div>

        {/* Featured Key Predictions Banner */}
        <div className="bg-gradient-to-r from-[#FFF5F2] via-[#FFF8F6] to-white rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#FF2E00] to-[#FF7700] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                PREMIUM
              </span>
              <span className="text-xs font-bold text-[#FF3300]">Cập nhật mỗi ngày</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-red-500">🪄</span>
              <span>Đề Key Dự Đoán</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Cập nhật hằng ngày bộ đề dự đoán theo topic khả năng ra thi, phân mức ưu tiên. Marathon từng part để cày đúng trọng tâm, tiết kiệm thời gian ôn.
            </p>
          </div>

          <button className="bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700] hover:brightness-110 hover:-translate-y-0.5 text-white font-bold text-sm px-6 py-3 rounded-full shadow-md shadow-orange-500/30 whitespace-nowrap transition-all duration-200 flex items-center gap-2 flex-shrink-0">
            <span>Xem key hôm nay</span>
            <span>→</span>
          </button>
        </div>

        {/* 6 Strengths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {strengths.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-red-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-pointer group shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h4 className="font-bold text-base text-slate-900 group-hover:text-[#FF3300] transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
