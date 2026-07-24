'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans pt-12 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E52E12] to-[#A01400] flex items-center justify-center text-white font-black text-lg shadow-sm">
                K
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Aptis <span className="text-[#CC1C01]">Kỳ Tích</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng luyện thi Aptis ESOL chuẩn định dạng đề thật. Hỗ trợ đầy đủ 4 kỹ năng Reading, Listening, Writing, Speaking.
            </p>
          </div>

          {/* Practice Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Luyện tập kỹ năng</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">📖 Aptis Reading</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">🎧 Aptis Listening</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">✍️ Aptis Writing</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">🗣️ Aptis Speaking</span></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Tính năng nổi bật</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">⏱️ Thi thử mô phỏng</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">🎯 Đáp án & Review chi tiết</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">📚 Từ vựng & Ngữ pháp Aptis</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">💡 Mẹo học nhanh</span></li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Trạng thái dữ liệu</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Dữ liệu bài thi:</span>
                <span className="text-emerald-400 font-bold">100% Đầy đủ</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Nguồn trích xuất:</span>
                <span className="font-mono text-indigo-300">scraped_data.json</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Aptis Kỳ Tích — Luyện thi Aptis & Thi thử miễn phí.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế lại theo phong cách</span>
            <a href="https://aptiskytich.vn/" target="_blank" rel="noreferrer" className="text-[#CC1C01] font-bold hover:underline">
              aptiskytich.vn
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
