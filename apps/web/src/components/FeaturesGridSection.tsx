'use client';

import React from 'react';

export default function FeaturesGridSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 relative">
      <div className="absolute left-0 top-0 w-64 h-64 bg-[#4edea3]/10 blur-[120px] pointer-events-none" />

      <div className="glass-panel rounded-[48px] p-8 md:p-16 overflow-hidden relative border-white/5 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Technologies */}
          <div>
            <span className="text-xs font-bold text-[#4edea3] tracking-[0.2em] mb-4 block uppercase">
              CÔNG NGHỆ CỐT LÕI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
              AI Diagnostic Engine™
            </h2>

            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex gap-5 group">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#4edea3] border border-white/10 group-hover:bg-[#4edea3] group-hover:text-[#003824] transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5">AI Speaking Coach</h4>
                  <p className="text-sm text-[#bbcabf] leading-relaxed">
                    Phân tích phát âm (IPA), độ trôi chảy và ngữ pháp theo thời gian thực giúp bạn nâng band thần tốc.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-5 group">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#4edea3] border border-white/10 group-hover:bg-[#4edea3] group-hover:text-[#003824] transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl">history_edu</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5">AI Writing Examiner</h4>
                  <p className="text-sm text-[#bbcabf] leading-relaxed">
                    Chấm điểm bài viết dựa trên dataset hàng ngàn bài thi thực tế, đảm bảo độ chính xác lên đến 98%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accuracy Badge Card */}
          <div className="relative flex justify-center items-center min-h-[220px]">
            <div className="glass-panel p-8 rounded-3xl border-[#4edea3]/30 shadow-[0_0_40px_rgba(78,222,163,0.15)] text-center max-w-xs">
              <div className="text-5xl font-extrabold text-[#4edea3] mb-2">98%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#bbcabf]">
                Độ chính xác so với thi thật
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
