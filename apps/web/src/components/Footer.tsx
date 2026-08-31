'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1a30] border-t border-[#1e2f50] w-full px-6 sm:px-12 py-16 mt-20 text-[#a3b3d1] font-sans">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Col 1: Brand Info */}
        <div className="col-span-1 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#162544] text-[#d97706] flex items-center justify-center border border-[#233760]">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                school
              </span>
            </div>
            <span className="text-xl font-serif font-bold text-white">AptisMaster</span>
          </div>
          <p className="text-xs sm:text-sm text-[#a3b3d1] leading-relaxed">
            Nền tảng luyện thi Aptis ESOL chuẩn khung đánh giá Châu Âu (CEFR) với công nghệ chấm bài thông minh và kho đề thi thực tế cập nhật 2026.
          </p>
          <div className="flex gap-3 pt-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#162544] border border-[#233760] flex items-center justify-center text-[#a3b3d1] hover:text-[#d97706] hover:border-[#d97706] transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#162544] border border-[#233760] flex items-center justify-center text-[#a3b3d1] hover:text-[#d97706] hover:border-[#d97706] transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Kỹ năng */}
        <div>
          <h5 className="text-white font-serif font-semibold mb-5 text-sm uppercase tracking-wider">Kỹ năng</h5>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="/reading">Reading</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="/listening">Listening</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="/writing">Writing</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="/speaking">Speaking</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="/grammar">Grammar & Vocabulary</a></li>
          </ul>
        </div>

        {/* Col 3: Hỗ trợ */}
        <div>
          <h5 className="text-white font-serif font-semibold mb-5 text-sm uppercase tracking-wider">Hỗ trợ</h5>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="#">Hướng dẫn sử dụng</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="#">Câu hỏi thường gặp</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="#">Liên hệ hỗ trợ</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="#">Điều khoản dịch vụ</a></li>
            <li><a className="text-[#a3b3d1] hover:text-[#f59e0b] transition-all" href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Col 4: Nhận bản tin */}
        <div className="bg-[#162544] p-6 rounded-2xl border border-[#233760]">
          <h5 className="text-white font-serif font-semibold mb-3 text-sm">Bản tin học thuật 2026</h5>
          <p className="text-xs text-[#a3b3d1] mb-4">Cập nhật đề thi mới nhất và chiến thuật bứt phá điểm số CEFR B2/C1.</p>
          <div className="flex flex-col gap-2.5">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-[#0f1a30] border border-[#233760] rounded-lg text-white text-xs py-2.5 px-4 focus:ring-1 focus:ring-[#d97706] focus:border-[#d97706] outline-none"
            />
            <button className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-medium text-xs py-2.5 rounded-lg transition-all cursor-pointer shadow-xs">
              Đăng ký ngay
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-[1440px] mx-auto pt-8 border-t border-[#1e2f50] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <span className="text-[#a3b3d1] opacity-80">© 2026 AptisMaster — British Academic Exam Preparation.</span>
        <div className="flex gap-6">
          <a className="text-[#a3b3d1] hover:text-white transition-colors" href="#">Điều khoản</a>
          <a className="text-[#a3b3d1] hover:text-white transition-colors" href="#">Bảo mật</a>
        </div>
      </div>
    </footer>
  );
}
