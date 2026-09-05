'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import scrapedData from '@/data/scraped_data.json';
import SpeakingPart1Practice from './speaking/SpeakingPart1Practice';
import SpeakingPart2Practice from './speaking/SpeakingPart2Practice';
import SpeakingPart3Practice from './speaking/SpeakingPart3Practice';
import SpeakingPart4Practice from './speaking/SpeakingPart4Practice';

interface SpeakingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function SpeakingView({ onBackToHome, onExamStateChange, data }: SpeakingViewProps) {
  const rawSpeaking = (scrapedData as any)?.speaking || {};
  const countPart1 = Math.ceil(((rawSpeaking.part1_practice || []).length || 28) / 3);
  const countPart2 = (rawSpeaking.part2_practice || []).length || 37;
  const countPart3 = (rawSpeaking.part3_practice || []).length || 25;
  const countPart4 = Math.max(0, ((rawSpeaking.part4_practice || []).length || 53) - 1) || 52;

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
      subtitle: `${countPart1} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: countPart1,
    },
    part2: {
      title: 'Part 2 – Describe, express opinion',
      subtitle: `${countPart2} bộ đề luyện tập`,
      badge: 'Part 2',
      testCount: countPart2,
    },
    part3: {
      title: 'Part 3 – Describe, compare & provide reasons',
      subtitle: `${countPart3} bộ đề luyện tập`,
      badge: 'Part 3',
      testCount: countPart3,
    },
    part4: {
      title: 'Part 4 – Discuss personal experience & opinion',
      subtitle: `${countPart4} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: countPart4,
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
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        if (partId === 'full') {
          return {
            title: `Đề ${testNumberStr} - Full Part Speaking`,
            badge: 'Full Part',
            durationText: '12 phút',
          };
        }
        if (partId === 'part1') {
          return {
            title: `Đề ${testNumberStr} - Personal info`,
            badge: 'Part 1',
            durationText: '2 phút',
          };
        }
        if (partId === 'part2') {
          return {
            title: `Đề ${testNumberStr} - Describe picture`,
            badge: 'Part 2',
            durationText: '3 phút',
          };
        }
        if (partId === 'part3') {
          return {
            title: `Đề ${testNumberStr} - Compare pictures`,
            badge: 'Part 3',
            durationText: '3 phút',
          };
        }
        if (partId === 'part4') {
          const topicObj = (rawSpeaking.part4_practice || [])[testNum] || {};
          const topicRaw = topicObj.question || '';
          const cleanTopic = topicRaw.replace(/\s*\(.*\)\s*$/, '').trim();
          return {
            title: cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Personal experience`,
            badge: 'Part 4',
            durationText: '3 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'part1') {
          return <SpeakingPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <SpeakingPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <SpeakingPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <SpeakingPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        return (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#CC1C01] flex items-center justify-center mx-auto text-xl font-bold">
              🗣️
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Luyện tập Full Part Speaking
            </h3>
            <p className="text-sm text-slate-600">
              Vui lòng chọn từng Part (Part 1, 2, 3 hoặc 4) ở thanh chọn phía trên để luyện tập từng dạng đề chuyên sâu.
            </p>
            <button
              type="button"
              onClick={onExit}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162544] text-white text-sm font-semibold hover:bg-[#0f1a30] transition-colors cursor-pointer"
            >
              Quay lại danh sách đề thi
            </button>
          </div>
        );
      }}
    />
  );
}
