'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function StrengthsGridSection() {
  const router = useRouter();
  const handleStartMock = () => {
    router.push('/thi-thu');
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Student Testimonial Cards Wall */}
        <div className="grid grid-cols-2 gap-5">
          
          {/* Card 1: Minh Anh */}
          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd8] shadow-xs">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cc785c]">
                <img
                  className="w-full h-full object-cover"
                  alt="Minh Anh"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIeZDX0esmV158ja-S9VsbJWEAL4igVk48TfncHmeJOnCC_F_NY2tciR8vEP6PpNHEfivT5rmXNn52j3jZKpj8735r2RV7QdnLWMCAtr0V-DSQx6mkGMlLfUu4AzP1BKzsALrUHWavBLMrvS2J7abQdeAYRj47SJUuWIP5ZrXt6z3_xRwxGTc-wIUVnufRjiVHdWd9uL1Htr6LUjbFjX7pDGo8tro6I0uPm5gmRFd8P9yNENzm6j19UQ"
                />
              </div>
              <div>
                <h5 className="font-semibold text-[#141413] text-sm">Minh Anh</h5>
                <span className="text-[11px] text-[#cc785c] font-medium">B2 Certified</span>
              </div>
            </div>
            <p className="text-xs text-[#6c6a64] leading-relaxed">
              &quot;AI Speaking Coach đã giúp mình tự tin hơn hẳn khi đi thi thực tế. Kết quả đạt B2 ngoài mong đợi!&quot;
            </p>
          </div>

          {/* Card 2: Hoàng Nam */}
          <div className="bg-white p-6 rounded-2xl border border-[#e6dfd8] shadow-xs translate-y-3">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cc785c]">
                <img
                  className="w-full h-full object-cover"
                  alt="Hoàng Nam"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_zACpsrXIRVSQogXqRsfcXYUflVS4eZyQAgcau0smUzwtsGQOLdIYmtJFFuBFC6I8ieoeYLAoKm6DLhospaA8fX-KEEBGejHmZWu5RcWIDaNEaRHNzqg8IOgCNHIfXs2Bv323eUvt1KoklXEK_NDDW3cvEfS-1miETzohdnG7HvIE3Ack5IS7a_GL2rX-HdpK-B7xhkHZAQLx8k3jiXl0WKTjk7QNYVkOarvGOwVltvcsjikHQdP-FQ"
                />
              </div>
              <div>
                <h5 className="font-semibold text-[#141413] text-sm">Hoàng Nam</h5>
                <span className="text-[11px] text-[#cc785c] font-medium">C1 Certified</span>
              </div>
            </div>
            <p className="text-xs text-[#6c6a64] leading-relaxed">
              &quot;Giao diện mô phỏng 100% đề thi thật. Mình chỉ ôn luyện 10 ngày trước khi thi và đã đạt C1.&quot;
            </p>
          </div>

          {/* Metric Box */}
          <div className="bg-[#efe9de] p-6 rounded-2xl border border-[#e6dfd8] col-span-2 mt-3">
            <div className="flex items-center gap-6">
              <div className="shrink-0 text-center">
                <div className="text-3xl font-serif font-normal text-[#cc785c]">2.5k+</div>
                <div className="text-[10px] uppercase font-medium text-[#141413] tracking-wider">Chứng chỉ B2/C1</div>
              </div>
              <div className="h-10 w-[1px] bg-[#e6dfd8]" />
              <p className="text-xs text-[#6c6a64] leading-relaxed">
                Hơn 2,500 học viên đã chinh phục thành công chứng chỉ Aptis ESOL trong năm 2024–2026 thông qua hệ thống AI của chúng tôi.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Claude Coral Callout CTA Banner */}
        <div className="text-center md:text-left bg-[#cc785c] text-white p-10 sm:p-12 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white leading-tight">
            Sẵn sàng đạt B2/C1 Aptis trong 14 ngày?
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-lg">
            Gia nhập cùng 50,000+ học viên đang ôn luyện mỗi ngày trên nền tảng AI thông minh và bám sát đề thi nhất.
          </p>

          <div className="pt-2">
            <button
              onClick={handleStartMock}
              className="bg-[#faf9f5] hover:bg-[#efe9de] text-[#141413] text-sm sm:text-base px-8 py-3.5 rounded-full font-medium transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>⚡ Bắt đầu luyện thi ngay</span>
            </button>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-xs pt-1">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border border-white bg-[#a9583e]" />
              <div className="w-6 h-6 rounded-full border border-white bg-[#d97706]" />
              <div className="w-6 h-6 rounded-full border border-white bg-[#e8a55a]" />
            </div>
            <span>50,000+ lượt luyện thi mỗi tháng</span>
          </div>
        </div>

      </div>
    </section>
  );
}
