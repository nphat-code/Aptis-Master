'use client';

import React from 'react';

export default function FeaturesGridSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 relative">
      <div className="bg-[#efe9de] rounded-3xl p-8 md:p-14 overflow-hidden relative border border-[#e6dfd8]">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Core Technologies */}
          <div>
            <span className="text-xs font-semibold text-[#cc785c] tracking-[0.2em] mb-3 block uppercase">
              CÔNG NGHỆ CỐT LÕI
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#141413] mb-8">
              AI Diagnostic Engine™
            </h2>

            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] border border-[#e6dfd8] group-hover:bg-[#cc785c] group-hover:text-white transition-all duration-200">
                  <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#141413] mb-1">AI Speaking Coach</h4>
                  <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                    Phân tích phát âm (IPA), độ trôi chảy và ngữ pháp theo thời gian thực giúp bạn nâng band nhanh chóng.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#cc785c] border border-[#e6dfd8] group-hover:bg-[#cc785c] group-hover:text-white transition-all duration-200">
                  <span className="material-symbols-outlined text-2xl">history_edu</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#141413] mb-1">AI Writing Examiner</h4>
                  <p className="text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                    Chấm điểm bài viết dựa trên dataset hàng ngàn bài thi thực tế, đảm bảo độ chính xác lên đến 98%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accuracy Badge Card */}
          <div className="relative flex justify-center items-center">
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#e6dfd8] shadow-xs text-center max-w-xs w-full">
              <div className="text-5xl sm:text-6xl font-serif font-normal text-[#cc785c] mb-2">98%</div>
              <div className="text-xs font-medium uppercase tracking-wider text-[#6c6a64]">
                Độ chính xác so với thi thật
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
