'use client';

import React from 'react';

export default function StatsAndFeaturesSection() {
  return (
    <section className="bg-[#0b1326] py-16 text-[#dae2fd]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        
        {/* Bento Grid: 4 Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="glass-panel rounded-[32px] p-8 border border-[#4edea3]/30 shadow-[0_0_20px_rgba(78,222,163,0.15)] group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#4edea3] mb-2 tracking-tight">100+</div>
            <h3 className="text-xl font-bold text-white mb-2">Đề thi Aptis ESOL</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">Cập nhật chuẩn 2026 với cấu trúc mới nhất từ British Council.</p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-[32px] p-8 border border-[#ffb95f]/30 shadow-[0_0_20px_rgba(255,185,95,0.15)] group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#ffb95f] mb-2 tracking-tight">98%</div>
            <h3 className="text-xl font-bold text-white mb-2">Sát đề thi thật</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">Tỉ lệ tương thích thực tế cao nhất thị trường hiện nay.</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-[32px] p-8 border border-[#c0c1ff]/30 shadow-[0_0_20px_rgba(192,193,255,0.15)] group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c0c1ff] mb-2 tracking-tight">AI Scoring</div>
            <h3 className="text-xl font-bold text-white mb-2">Chấm Speaking & Writing</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">Giải thích chi tiết từng lỗi sai và gợi ý cách diễn đạt hay hơn.</p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel rounded-[32px] p-8 border border-[#4edeff]/30 shadow-[0_0_20px_rgba(78,222,255,0.15)] group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#4edeff] mb-2 tracking-tight">100%</div>
            <h3 className="text-xl font-bold text-white mb-2">Mô phỏng thực tế</h3>
            <p className="text-xs text-[#bbcabf] leading-relaxed">Đúng chuẩn thời gian, giao diện và áp lực phòng thi thật.</p>
          </div>

        </div>

        {/* Core Highlight Features: 5 Column Layout */}
        <div className="glass-panel rounded-[40px] p-8 sm:p-10 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4edea3]/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 relative z-10">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3] border border-[#4edea3]/20 group-hover:bg-[#4edea3]/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px]">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">Sát đề thật</h4>
                <p className="text-xs text-[#bbcabf]">Mô phỏng 100% cấu trúc Aptis</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] border border-[#c0c1ff]/20 group-hover:bg-[#c0c1ff]/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px]">mic</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">AI chấm Speaking</h4>
                <p className="text-xs text-[#bbcabf]">Phân tích Band + gợi ý sửa câu</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-[#ffb95f]/10 flex items-center justify-center text-[#ffb95f] border border-[#ffb95f]/20 group-hover:bg-[#ffb95f]/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px]">edit_note</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">AI chấm Writing</h4>
                <p className="text-xs text-[#bbcabf]">Nhận xét chi tiết từng tiêu chí</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3] border border-[#4edea3]/20 group-hover:bg-[#4edea3]/20 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px]">menu_book</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">100+ đề luyện</h4>
                <p className="text-xs text-[#bbcabf]">Kho dữ liệu cập nhật liên tục</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#dae2fd] border border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                <span className="material-symbols-outlined text-[32px]">insights</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">Theo dõi tiến độ</h4>
                <p className="text-xs text-[#bbcabf]">Biểu đồ & streak hằng ngày</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
