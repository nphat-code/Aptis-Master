'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#060e20] border-t border-[#3c4a42]/60 w-full rounded-t-[3rem] px-6 sm:px-12 py-16 mt-20 text-[#bbcabf] font-sans">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Col 1: Brand Info */}
        <div className="col-span-1 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-[#4edea3] text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
            <span className="text-xl font-extrabold text-[#dae2fd]">AptisMaster</span>
          </div>
          <p className="text-xs sm:text-sm text-[#bbcabf] leading-relaxed">
            Nền tảng luyện thi Aptis ESOL hàng đầu Việt Nam với công nghệ chấm bài tự động và kho đề thi sát thực tế nhất.
          </p>
          <div className="flex gap-3 pt-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#171f33] flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#4edea3]/10 transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#171f33] flex items-center justify-center text-[#bbcabf] hover:text-[#4edea3] hover:bg-[#4edea3]/10 transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Kỹ năng */}
        <div>
          <h5 className="text-[#dae2fd] font-bold mb-5 text-sm uppercase tracking-wider">Kỹ năng</h5>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="/reading">Reading Practice</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="/listening">Listening Mock</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="/writing">Writing Task 1 & 2</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="/speaking">Speaking Coach</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="/grammar">Grammar Master</a></li>
          </ul>
        </div>

        {/* Col 3: Hỗ trợ */}
        <div>
          <h5 className="text-[#dae2fd] font-bold mb-5 text-sm uppercase tracking-wider">Hỗ trợ</h5>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="#">Hướng dẫn sử dụng</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="#">Câu hỏi thường gặp</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="#">Liên hệ hỗ trợ</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="#">Điều khoản dịch vụ</a></li>
            <li><a className="text-[#bbcabf] hover:text-[#4edea3] transition-all" href="#">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Col 4: Nhận bản tin */}
        <div className="glass-panel p-6 rounded-3xl">
          <h5 className="text-[#dae2fd] font-bold mb-3 text-sm">Nhận bản tin mẹo thi</h5>
          <p className="text-xs text-[#bbcabf] mb-4">Cập nhật những mẹo làm bài mới nhất mỗi tuần.</p>
          <div className="flex flex-col gap-2.5">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-[#171f33] border border-[#3c4a42] rounded-xl text-[#dae2fd] text-xs py-3 px-4 focus:ring-1 focus:ring-[#4edea3] focus:border-[#4edea3]"
            />
            <button className="w-full bg-[#4edea3] text-[#003824] font-extrabold text-xs py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer">
              Đăng ký ngay
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-[1440px] mx-auto pt-8 border-t border-[#3c4a42]/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <span className="text-[#bbcabf] opacity-80">© 2026 AptisMaster. All rights reserved.</span>
        <div className="flex gap-6">
          <a className="text-[#bbcabf] hover:text-[#4edea3] transition-colors" href="#">Điều khoản</a>
          <a className="text-[#bbcabf] hover:text-[#4edea3] transition-colors" href="#">Bảo mật</a>
        </div>
      </div>
    </footer>
  );
}
