'use client';

import React from 'react';

export default function FeaturesGridSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 relative">
      <div className="bg-[#f3efe6] rounded-3xl p-8 md:p-14 overflow-hidden relative border border-[#e5ded3]">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Technologies */}
          <div>
            <span className="text-xs font-semibold text-[#d97706] tracking-[0.2em] mb-3 block uppercase">
              CÔNG NGHỆ HỌC THUẬT ĐỘC QUYỀN
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#162544] mb-8">
              AI Diagnostic Engine™
            </h2>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-all duration-200 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-semibold text-[#162544] mb-1">AI Speaking Examiner</h4>
                  <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
                    Phân tích phát âm chuẩn quốc tế (IPA), độ trôi chảy và ngữ pháp theo thời gian thực giúp bạn nâng band nhanh chóng.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#162544] border border-[#e5ded3] group-hover:bg-[#162544] group-hover:text-[#f59e0b] transition-all duration-200 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">history_edu</span>
                </div>
                <div>
                  <h4 className="text-base font-serif font-semibold text-[#162544] mb-1">AI Writing Examiner</h4>
                  <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
                    Chấm điểm bài viết dựa trên dataset hàng ngàn bài thi thực tế, đảm bảo độ chính xác lên đến 98% chuẩn CEFR.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accuracy Badge Card */}
          <div className="relative flex justify-center items-center">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#e5ded3] shadow-sm text-center max-w-xs w-full">
              <div className="text-5xl sm:text-6xl font-serif font-bold text-[#d97706] mb-2">98%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#162544]">
                Độ chính xác so với thi thật
              </div>
              <p className="text-[11px] text-[#6b6860] mt-2">Được kiểm định độc lập theo chuẩn Aptis ESOL 2026</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
