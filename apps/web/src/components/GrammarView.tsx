'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

interface GrammarViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function GrammarView({ onBackToHome, onExamStateChange, data }: GrammarViewProps) {
  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Grammar sentence fill' },
    { id: 'part2', label: 'Part 2 – Vocabulary matching' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part Grammar & Vocabulary',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: 30,
    },
    part1: {
      title: 'Part 1 – Grammar sentence fill',
      subtitle: '25 bộ đề luyện tập (Trắc nghiệm ngữ pháp 25 câu)',
      badge: 'Part 1',
      testCount: 25,
    },
    part2: {
      title: 'Part 2 – Vocabulary matching',
      subtitle: '20 bộ đề luyện tập (Ghép nghĩa từ vựng, từ đồng nghĩa, từ kết hợp)',
      badge: 'Part 2',
      testCount: 20,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      {/* Chiến thuật tổng quan */}
      <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border border-[#fde68a] text-[#78350f] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#92400e] text-xs sm:text-sm">
          <span>📚</span>
          <span>Chiến thuật Grammar & Vocabulary (50 câu – 25 phút):</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Điểm số phần này đóng vai trò quyết định nâng bậc CEFR khi điểm 4 kỹ năng chính nằm ở ngưỡng phân định. Phân bổ: <strong>Grammar (12 phút)</strong> + <strong>Vocabulary (13 phút)</strong> (~30 giây / câu).
        </p>
      </div>

      {/* Grammar */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Phần 1</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Grammar (25 câu – 25 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#2563eb] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            Ngữ pháp trọng tâm
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Các chủ điểm ngữ pháp xuất hiện nhiều nhất trong đề thi</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Hệ thống thì & Thể bị động:</strong> Tập trung vào thì Hiện tại hoàn thành (<em>Since, For, Already, Yet</em>), Quá khứ hoàn thành, và cấu trúc bị động nâng cao (<em>have/get something done</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Câu điều kiện & Đảo ngữ:</strong> Nắm chắc điều kiện loại 1, 2, 3, điều kiện hỗn hợp (Mixed) và đảo ngữ với trạng từ phủ định (<em>Not only, Rarely, Seldom, Hardly... when</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Mệnh đề quan hệ rút gọn & Danh động từ:</strong> Phân biệt khi nào dùng <em>V-ing</em> (chủ động) và <em>V-ed/V3</em> (bị động); các động từ đi với Gerund vs. To-infinitive (<em>remember, stop, forget, regret</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Động từ khuyết thiếu (Modal Verbs):</strong> Suy đoán trong quá khứ với <em>must have + V3, should have + V3, could have + V3</em>.</span></li>
        </ul>
      </div>

      {/* Vocabulary */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Phần 2</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Vocabulary (25 câu – 25 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Từ vựng & Kết hợp từ
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">4 dạng bài từ vựng thường gặp trong Aptis</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Word Matching (Nối từ đồng nghĩa):</strong> Ôn tập các cặp từ đồng nghĩa trình độ B1–C1 (ví dụ: <em>commence = begin, evaluate = assess, enormous = gigantic</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Word Definition (Đoán từ qua định nghĩa):</strong> Đọc kỹ định nghĩa tiếng Anh để xác định chính xác từ loại và nghĩa tương ứng.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Collocations (Cụm từ cố định):</strong> Học từ vựng theo cụm đi liền nhau (ví dụ: <em>make an effort, take advantage of, pay attention to, deeply concerned</em>) thay vì học từ đơn lẻ.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Phrasal Verbs:</strong> Nắm vững các cụm động từ thông dụng trong đời sống và công việc (<em>carry out, look forward to, call off, put up with</em>).</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="grammar"
      skillTitle="Phần thi Grammar & Vocabulary"
      skillDescription="Luyện ngữ pháp và từ vựng Aptis. Củng cố kiến thức ngữ pháp trọng tâm và mở rộng vốn từ vựng đồng nghĩa, collocations."
      durationText="25 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Grammar & Vocabulary"
      tipsContent={tipsContent}
    />
  );
}
