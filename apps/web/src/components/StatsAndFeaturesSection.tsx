'use client';

import React from 'react';

export default function StatsAndFeaturesSection() {
  return (
    <section className="bg-[#faf8f5] py-16 text-[#141413]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        
        {/* Bento Grid: 4 Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#f3efe6] rounded-2xl p-7 border border-[#e5ded3] transition-all duration-200 hover:-translate-y-1 hover:border-[#d97706] hover:shadow-sm cursor-pointer">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#d97706] mb-2 tracking-tight">100+</div>
            <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1.5">Đề thi Aptis ESOL</h3>
            <p className="text-xs text-[#6b6860] leading-relaxed">Cập nhật chuẩn 2026 với cấu trúc mới nhất từ British Council.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f3efe6] rounded-2xl p-7 border border-[#e5ded3] transition-all duration-200 hover:-translate-y-1 hover:border-[#d97706] hover:shadow-sm cursor-pointer">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#d97706] mb-2 tracking-tight">98%</div>
            <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1.5">Sát đề thi thật</h3>
            <p className="text-xs text-[#6b6860] leading-relaxed">Tỉ lệ tương thích thực tế cao nhất thị trường hiện nay.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f3efe6] rounded-2xl p-7 border border-[#e5ded3] transition-all duration-200 hover:-translate-y-1 hover:border-[#d97706] hover:shadow-sm cursor-pointer">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#d97706] mb-2 tracking-tight">AI Scoring</div>
            <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1.5">Chấm Speaking & Writing</h3>
            <p className="text-xs text-[#6b6860] leading-relaxed">Giải thích chi tiết từng lỗi sai và gợi ý cách diễn đạt chuẩn CEFR.</p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f3efe6] rounded-2xl p-7 border border-[#e5ded3] transition-all duration-200 hover:-translate-y-1 hover:border-[#d97706] hover:shadow-sm cursor-pointer">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#d97706] mb-2 tracking-tight">100%</div>
            <h3 className="text-lg font-serif font-semibold text-[#162544] mb-1.5">Mô phỏng thực tế</h3>
            <p className="text-xs text-[#6b6860] leading-relaxed">Đúng chuẩn thời gian, giao diện và áp lực phòng thi thật.</p>
          </div>

        </div>

        {/* Core Highlight Features: 5 Column Layout */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e5ded3] relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 relative z-10">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#f3efe6] flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-colors duration-200">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#162544] mb-0.5">Sát đề thật</h4>
                <p className="text-xs text-[#6b6860]">Mô phỏng 100% cấu trúc Aptis</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#f3efe6] flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-colors duration-200">
                <span className="material-symbols-outlined text-[28px]">mic</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#162544] mb-0.5">AI chấm Speaking</h4>
                <p className="text-xs text-[#6b6860]">Phân tích Band + gợi ý sửa câu</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#f3efe6] flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-colors duration-200">
                <span className="material-symbols-outlined text-[28px]">edit_note</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#162544] mb-0.5">AI chấm Writing</h4>
                <p className="text-xs text-[#6b6860]">Nhận xét chi tiết từng tiêu chí</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#f3efe6] flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-colors duration-200">
                <span className="material-symbols-outlined text-[28px]">menu_book</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#162544] mb-0.5">100+ đề luyện</h4>
                <p className="text-xs text-[#6b6860]">Kho dữ liệu cập nhật liên tục</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center text-center space-y-3 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[#f3efe6] flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-colors duration-200">
                <span className="material-symbols-outlined text-[28px]">insights</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#162544] mb-0.5">Theo dõi tiến độ</h4>
                <p className="text-xs text-[#6b6860]">Báo cáo chi tiết từng kỹ năng</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
