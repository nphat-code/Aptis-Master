'use client';

import React from 'react';

export default function FeaturesGridSection() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title Area */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[#FF3300] font-black text-xs uppercase tracking-widest block">
            TÍNH NĂNG NỔI BẬT
          </span>
          <h2 className="text-[36px] font-extrabold text-[#2D1510] tracking-tight leading-tight">
            Trải nghiệm luyện thi cùng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700]">
              Kỳ Tích
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
            Mọi công cụ bạn cần để luyện Aptis hiệu quả, ngay trên một nền tảng.
          </p>
        </div>

        {/* 3 Alternating Feature Cards Stack */}
        <div className="space-y-16 md:space-y-24">
          
          {/* Card 01: Thi thử & AI chấm Speaking–Writing (Text Left, Graphic Right) */}
          <div className="bg-gradient-to-br from-[#FFF9F8] to-[#FFF5F2] rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-red-200 text-xs font-bold text-[#FF3300]">
                <span>01</span>
                <span>•</span>
                <span>AI SCORING</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-[#2D1510] leading-tight">
                Thi thử & AI chấm Speaking–Writing
              </h3>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                Làm bài mô phỏng đề thật, AI Kỳ Tích chấm cả Speaking & Writing — trả điểm, band và nhận xét chi tiết ngay sau khi nộp.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Chấm theo tiêu chí CEFR</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Chỉ rõ lỗi & cách sửa</span>
                </div>
              </div>
            </div>

            {/* Graphic Right: AI Correction Interface Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-xs text-slate-900">AI Feedback Report</span>
                  </div>
                  <span className="bg-orange-100 text-[#FF3300] text-xs font-extrabold px-3 py-1 rounded-full">
                    Score: 17.8 / 20 (Band B2)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">Grammar & Coherence</span>
                      <span className="text-emerald-600 font-extrabold">90% Excellent</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Sử dụng đúng thì hoàn thành và cấu trúc câu phức. Cần chú ý thêm từ nối giữa đoạn 2 và đoạn 3.
                    </p>
                  </div>

                  <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#FF3300]">Gợi ý nâng band</span>
                      <span className="text-[#FF3300] font-extrabold">Vocabulary +2</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Thay từ <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-bold border border-red-200">good</code> bằng <code className="bg-white px-1.5 py-0.5 rounded text-emerald-600 font-bold border border-emerald-200">exceptional</code> hoặc <code className="bg-white px-1.5 py-0.5 rounded text-emerald-600 font-bold border border-emerald-200">outstanding</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 02: Luyện theo kỹ năng sát đề thật (Graphic Left, Text Right) */}
          <div className="bg-gradient-to-br from-[#FFF9F8] to-[#FFF5F2] rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Graphic Left: Drag & Drop Reading Mockup */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-800">Reading Part 2 - Order Sentences</span>
                  <span className="text-xs font-black text-[#FF3300] bg-red-50 px-2.5 py-1 rounded-lg">⏱ 18:42</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-3 cursor-grab">
                    <span className="text-slate-400 font-bold">⋮⋮</span>
                    <span className="text-slate-700">First, I decided to book a flight ticket online.</span>
                  </div>
                  <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-200 flex items-center gap-3 cursor-grab">
                    <span className="text-[#FF3300] font-bold">⋮⋮</span>
                    <span className="text-slate-900 font-bold">Then, I packed my bags and prepared for departure.</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-3 cursor-grab">
                    <span className="text-slate-400 font-bold">⋮⋮</span>
                    <span className="text-slate-700">Finally, we arrived at the hotel safely.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-red-200 text-xs font-bold text-[#FF3300]">
                <span>02</span>
                <span>•</span>
                <span>REAL EXAM INTERACTION</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-[#2D1510] leading-tight">
                Luyện theo kỹ năng sát đề thật
              </h3>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                5 kỹ năng riêng biệt với đúng thao tác bài thi: kéo thả, dropdown inline, bấm giờ. Luyện từng phần hoặc trọn bộ như thi thật.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Kéo-thả, dropdown, timer y như thật</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Luyện từng part hoặc full test</span>
                </div>
              </div>
            </div>

          </div>

          {/* Card 03: Theo dõi tiến bộ & giữ streak (Text Left, Graphic Right) */}
          <div className="bg-gradient-to-br from-[#FFF9F8] to-[#FFF5F2] rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-red-200 text-xs font-bold text-[#FF3300]">
                <span>03</span>
                <span>•</span>
                <span>PROGRESS & STREAK</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-[#2D1510] leading-tight">
                Theo dõi tiến bộ & giữ streak
              </h3>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                Xem band tăng theo từng kỹ năng, biểu đồ tiến bộ theo thời gian và giữ chuỗi streak để học đều mỗi ngày.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Biểu đồ tiến bộ từng kỹ năng</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-[#FF3300] flex items-center justify-center text-xs flex-shrink-0">
                    ✓
                  </div>
                  <span>Streak & lịch sử học tập</span>
                </div>
              </div>
            </div>

            {/* Graphic Right: Progress Chart & Streak Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Tiến độ tuần này</span>
                    <span className="text-[10px] text-slate-400">Band B1+ → B2 (85% Mục tiêu)</span>
                  </div>
                  <div className="bg-orange-50 text-[#FF3300] border border-orange-200 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                    <span>🔥</span>
                    <span>18 ngày Streak</span>
                  </div>
                </div>

                {/* Mock Chart Bars */}
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">Reading</span>
                      <span className="text-[#FF3300]">42/50 (Band B2)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#FF2E00] to-[#FF7700] h-full w-[84%] rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">Listening</span>
                      <span className="text-orange-500">38/50 (Band B1+)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full w-[76%] rounded-full"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
