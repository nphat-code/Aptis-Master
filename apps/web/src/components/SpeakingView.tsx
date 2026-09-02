'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface SpeakingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function SpeakingView({ onBackToHome, onExamStateChange, data }: SpeakingViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Personal info' },
    { id: 'part2', label: 'Part 2 – Describe picture' },
    { id: 'part3', label: 'Part 3 – Compare pictures' },
    { id: 'part4', label: 'Part 4 – Personal experience' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Speaking',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: 20,
    },
    part1: {
      title: 'Part 1 – Personal information',
      subtitle: '15 bộ đề luyện tập (Trả lời 3 câu hỏi cá nhân • 30s/câu)',
      badge: 'Part 1',
      testCount: 15,
    },
    part2: {
      title: 'Part 2 – Describe, express opinion',
      subtitle: '15 bộ đề luyện tập (Miêu tả tranh & Bày tỏ quan điểm • 45s/câu)',
      badge: 'Part 2',
      testCount: 15,
    },
    part3: {
      title: 'Part 3 – Describe, compare & provide reasons',
      subtitle: '12 bộ đề luyện tập (So sánh 2 bức tranh • 45s/câu)',
      badge: 'Part 3',
      testCount: 12,
    },
    part4: {
      title: 'Part 4 – Discuss personal experience & opinion',
      subtitle: '10 bộ đề luyện tập (Trả lời 3 câu hỏi sâu • 2 phút nói liên tục)',
      badge: 'Part 4',
      testCount: 10,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      {/* Chiến thuật tổng quan */}
      <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border border-[#fde68a] text-[#78350f] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#92400e] text-xs sm:text-sm">
          <span>🗣️</span>
          <span>Chiến thuật Speaking Aptis 2026 (4 phần – 12 phút):</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Quy tắc cốt lõi: <strong>Nói to, rõ ràng và không để khoảng lặng quá 3 giây</strong>. Luôn áp dụng công thức <strong>PREP (Point – Reason – Example – Point)</strong> hoặc mở rộng câu trả lời bằng 2–3 ý bổ trợ.
        </p>
      </div>

      {/* Part 1 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 1</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Personal Information (3 câu hỏi – 30s / câu)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Khởi động tự tin
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">3 câu hỏi về thông tin cá nhân, gia đình, sở thích, công việc</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Độ dài lý tưởng:</strong> Trả lời từ 3–4 câu hoàn chỉnh trong 20–25 giây, không ngắt lời quá sớm hoặc nói cụt lủn (Yes/No).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Dùng Filler tự nhiên:</strong> Khi cần suy nghĩ 1–2 giây, hãy dùng: <em>"Well, that's an interesting question...", "To be honest, I'd say that..."</em> thay vì <em>"À, Ừm"</em>.</span></li>
        </ul>
      </div>

      {/* Part 2 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 2</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Describe a Picture (1 ảnh, 3 câu hỏi – 45s / câu)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
            Miêu tả chi tiết
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Miêu tả tranh (Câu 1) & Trả lời câu hỏi mở rộng (Câu 2 & 3)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Cấu trúc miêu tả tranh 45s:</strong> Tổng quan bối cảnh (<em>"In this picture, I can see..."</em>) → Chi tiết trung tâm & hành động (dùng Hiện tại tiếp diễn: <em>"A man is walking..."</em>) → Vị trí (<em>"In the background / On the left"</em>) → Dự đoán cảm xúc/thời tiết (<em>"They seem very happy because..."</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Câu 2 & 3:</strong> Trả lời theo trải nghiệm thực tế hoặc quan điểm bản thân, liên hệ trực tiếp với chủ đề bức ảnh.</span></li>
        </ul>
      </div>

      {/* Part 3 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 3</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Compare Two Pictures (2 ảnh, 3 câu hỏi – 45s / câu)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#c7d2fe]">
            So sánh & Đánh giá
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">So sánh 2 bức ảnh (Câu 1) & Bày tỏ quan điểm ưu/nhược điểm (Câu 2 & 3)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Mẫu câu so sánh:</strong> <em>"Both pictures show people engaging in..., however there are several noticeable differences."</em> / <em>"While the first photo illustrates..., the second one depicts..."</em>.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Thể hiện sở thích/lựa chọn:</strong> <em>"If I had to choose between them, I would definitely opt for... because..."</em>.</span></li>
        </ul>
      </div>

      {/* Part 4 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 4</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Personal Experience & Abstract Talk (1p chuẩn bị + 2p nói)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#e11d48] bg-[#fff1f2] px-2.5 py-0.5 rounded-full border border-[#fecdd3]">
            Nói liên tục 2 phút
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Nhìn 1 bức ảnh và trả lời liên tiếp 3 câu hỏi trừu tượng/trải nghiệm cá nhân</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Tận dụng 1 phút chuẩn bị:</strong> Ghi nhanh các từ khóa chính cho từng câu hỏi (Keywords Q1, Q2, Q3) ra giấy nháp theo thứ tự.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Cấu trúc bài nói 2 phút:</strong> Phân bổ khoảng 35–40 giây cho mỗi câu hỏi. Dùng các cụm chuyển ý mạch lạc: <em>"Regarding the first question...", "Moving on to the second point...", "Finally, when it comes to..."</em>.</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="speaking"
      skillTitle="Phần thi Speaking"
      skillDescription="Luyện nói theo format bài thi Aptis Speaking. Thực hành miêu tả bức tranh, so sánh và bày tỏ quan điểm cá nhân."
      durationText="12 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Speaking"
      tipsContent={tipsContent}
    />
  );
}
