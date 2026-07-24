'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0F] text-slate-400 font-sans pt-14 pb-8 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF2E00] via-[#FF5500] to-[#FF7700] flex items-center justify-center text-white font-black shadow-md shadow-orange-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Aptis <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E00] via-[#FF5500] to-[#FF7700]">Kỳ Tích</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Nền tảng luyện thi Aptis có AI Kỳ Tích hỗ trợ. Giúp bạn đạt B1–B2 nhanh nhất.
            </p>
          </div>

          {/* Column 2: LUYỆN TẬP */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">
              LUYỆN TẬP
            </h4>
            <ul className="space-y-2.5 text-[14px] font-semibold text-slate-400">
              <li>
                <a href="/grammar" className="hover:text-[#FF3300] transition-colors">
                  Grammar & Vocab
                </a>
              </li>
              <li>
                <a href="/reading" className="hover:text-[#FF3300] transition-colors">
                  Reading
                </a>
              </li>
              <li>
                <a href="/listening" className="hover:text-[#FF3300] transition-colors">
                  Listening
                </a>
              </li>
              <li>
                <a href="/speaking" className="hover:text-[#FF3300] transition-colors">
                  Speaking
                </a>
              </li>
              <li>
                <a href="/writing" className="hover:text-[#FF3300] transition-colors">
                  Writing
                </a>
              </li>
              <li>
                <a href="/vocabulary" className="hover:text-[#FF3300] transition-colors">
                  Học từ vựng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: TÍNH NĂNG */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">
              TÍNH NĂNG
            </h4>
            <ul className="space-y-2.5 text-[14px] font-semibold text-slate-400">
              <li>
                <a href="/thi-thu" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>Thi thử Aptis</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
              <li>
                <a href="/grammar" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>Luyện theo kỹ năng</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
              <li>
                <a href="/speaking" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>AI chấm Speaking–Writing</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
              <li>
                <a href="/progress" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>Theo dõi tiến bộ</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
              <li>
                <a href="/meo-thi-aptis" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>Mẹo thi Aptis</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
              <li>
                <a href="/connect" className="hover:text-[#FF3300] transition-colors inline-flex items-center gap-1">
                  <span>Kết nối AI Assistant</span>
                  <span className="text-[11px]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: LIÊN HỆ */}
          <div className="space-y-4">
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">
              LIÊN HỆ
            </h4>
            <ul className="space-y-3 text-[14px] font-medium text-slate-400">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:aptiskytich.admin@gmail.com" className="hover:text-white transition-colors">
                  aptiskytich.admin@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0867833227" className="hover:text-white transition-colors font-semibold text-white">
                  0867 833 227
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <a href="https://zalo.me/0867833227" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Zalo: 0867 833 227
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <a href="https://www.facebook.com/Aptiskytich" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Facebook: Aptis Kỳ Tích
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-8">
          <p>© 2026 Aptis Kỳ Tích. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>from Aptis Kỳ Tích</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
