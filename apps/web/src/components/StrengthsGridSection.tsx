'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function StrengthsGridSection() {
  const router = useRouter();
  const handleStartMock = () => {
    router.push('/thi-thu');
  };


  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Student Testimonial Cards Wall */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Card 1: Minh Anh */}
          <div className="glass-panel p-6 rounded-3xl border-[#4edea3]/20 rotate-[-2deg] shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#4edea3]">
                <img
                  className="w-full h-full object-cover"
                  alt="Minh Anh"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIeZDX0esmV158ja-S9VsbJWEAL4igVk48TfncHmeJOnCC_F_NY2tciR8vEP6PpNHEfivT5rmXNn52j3jZKpj8735r2RV7QdnLWMCAtr0V-DSQx6mkGMlLfUu4AzP1BKzsALrUHWavBLMrvS2J7abQdeAYRj47SJUuWIP5ZrXt6z3_xRwxGTc-wIUVnufRjiVHdWd9uL1Htr6LUjbFjX7pDGo8tro6I0uPm5gmRFd8P9yNENzm6j19UQ"
                />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Minh Anh</h5>
                <span className="text-[11px] text-[#4edea3] font-bold">B2 Certified</span>
              </div>
            </div>
            <p className="text-xs italic text-[#bbcabf] leading-relaxed">
              &quot;AI Speaking Coach đã giúp mình tự tin hơn hẳn khi đi thi thực tế. Kết quả đạt B2 ngoài mong đợi!&quot;
            </p>
          </div>

          {/* Card 2: Hoàng Nam */}
          <div className="glass-panel p-6 rounded-3xl border-[#ffb95f]/20 translate-y-6 rotate-[3deg] shadow-lg">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#ffb95f]">
                <img
                  className="w-full h-full object-cover"
                  alt="Hoàng Nam"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_zACpsrXIRVSQogXqRsfcXYUflVS4eZyQAgcau0smUzwtsGQOLdIYmtJFFuBFC6I8ieoeYLAoKm6DLhospaA8fX-KEEBGejHmZWu5RcWIDaNEaRHNzqg8IOgCNHIfXs2Bv323eUvt1KoklXEK_NDDW3cvEfS-1miETzohdnG7HvIE3Ack5IS7a_GL2rX-HdpK-B7xhkHZAQLx8k3jiXl0WKTjk7QNYVkOarvGOwVltvcsjikHQdP-FQ"
                />
              </div>
              <div>
                <h5 className="font-bold text-white text-sm">Hoàng Nam</h5>
                <span className="text-[11px] text-[#ffb95f] font-bold">C1 Certified</span>
              </div>
            </div>
            <p className="text-xs italic text-[#bbcabf] leading-relaxed">
              &quot;Giao diện mô phỏng 100% đề thi thật. Mình chỉ ôn luyện 10 ngày trước khi thi và đã đạt C1.&quot;
            </p>
          </div>

          {/* Metric Box */}
          <div className="glass-panel p-6 rounded-3xl border-[#c0c1ff]/20 rotate-[-1deg] col-span-2 mt-4 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="shrink-0 text-center">
                <div className="text-3xl font-extrabold text-white">2.5k+</div>
                <div className="text-[10px] uppercase font-bold text-[#c0c1ff] tracking-wider">Chứng chỉ B2/C1</div>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <p className="text-xs text-[#bbcabf] leading-relaxed">
                Hơn 2,500 học viên đã chinh phục thành công chứng chỉ Aptis ESOL trong năm 2024–2026 thông qua hệ thống AI của chúng tôi.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Final CTA Banner */}
        <div className="text-center md:text-left bg-gradient-to-br from-[#4edea3]/10 to-transparent p-10 sm:p-12 rounded-[40px] border border-[#4edea3]/20 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
            Sẵn sàng đạt B2/C1 Aptis trong 14 ngày?
          </h2>
          <p className="text-base text-[#bbcabf] mb-8 leading-relaxed">
            Gia nhập cùng 50,000+ học viên đang ôn luyện mỗi ngày trên nền tảng AI thông minh nhất.
          </p>

          <button
            onClick={handleStartMock}
            className="bg-[#4edea3] text-[#003824] text-lg px-10 py-4 rounded-full font-extrabold shadow-[0_0_30px_rgba(78,222,163,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Bắt đầu ngay miễn phí
          </button>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-3 text-[#bbcabf] text-xs">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-[#0b1326] bg-slate-400" />
              <div className="w-7 h-7 rounded-full border-2 border-[#0b1326] bg-slate-500" />
              <div className="w-7 h-7 rounded-full border-2 border-[#0b1326] bg-slate-600" />
            </div>
            <span>Hơn 50k người đang online</span>
          </div>
        </div>

      </div>
    </section>
  );
}
