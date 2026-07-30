'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import scrapedData from '@/data/scraped_data.json';

interface WritingViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function WritingView({ onBackToHome, data }: WritingViewProps) {
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const totalTestSets = Object.keys(rawWritingTests).length || 40;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Short answers' },
    { id: 'part2', label: 'Part 2 – Social media response' },
    { id: 'part3', label: 'Part 3 – Three questions' },
    { id: 'part4', label: 'Part 4 – Informal & Formal email' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Writing',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Short answers',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'P.1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Social media response',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'P.2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Three questions',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'P.3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Informal & Formal email',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'P.4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-[14px]">
      {/* Banner / Overview Note */}
      <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/60 text-slate-800 space-y-1">
        <p className="font-medium">
          Writing Aptis gồm 4 dạng bài, trong đó <strong>Question 4 (Viết 2 Email)</strong> chiếm trọng số điểm lớn nhất. Thay vì học thuộc lòng bài mẫu dàn trải, hãy học theo <strong>Bố cục (Form)</strong> và luyện tập linh hoạt cho từng chủ đề.
        </p>
      </div>

      {/* Part 1 */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Câu 1–5</span>
          Part 1 – Short answers (Trả lời câu hỏi ngắn)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Điền thông tin cá nhân ngắn gọn (1–5 từ/câu):</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Điền câu trả lời ngắn từ 1 đến 5 từ về sở thích, thời tiết, hoạt động thường ngày.</li>
          <li>Viết đúng ngữ pháp, đúng chính tả và nhớ viết hoa chữ cái đầu câu.</li>
          <li>Trả lời thẳng vào trọng tâm, không viết quá dài dòng.</li>
        </ul>
      </div>

      {/* Part 2 */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 2</span>
          Part 2 – Social media response (Đoạn văn ngắn 20–30 từ)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Viết về lý do tham gia CLB hoặc trải nghiệm bản thân:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Viết một đoạn văn hoàn chỉnh từ 20 đến 30 từ (khoảng 2–3 câu).</li>
          <li>Sử dụng câu hoàn chỉnh, tránh viết tắt (*I am* thay vì *I'm*).</li>
          <li>Nêu rõ lý do yêu thích chủ đề CLB và mong muốn học hỏi thêm kiến thức.</li>
        </ul>
      </div>

      {/* Part 3 */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 3</span>
          Part 3 – Three questions (3 tin nhắn 30–40 từ)
        </h4>
        <p className="text-xs font-semibold text-slate-500">Trả lời hội thoại trong phòng chat CLB:</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Trả lời câu hỏi của 3 thành viên khác nhau trong phòng chat.</li>
          <li>Mỗi câu trả lời đạt độ dài từ 30 đến 40 từ (khoảng 3 câu).</li>
          <li>Phát triển ý rõ ràng: đưa ra quan điểm cá nhân, gợi ý giải pháp hoặc chia sẻ trải nghiệm liên quan.</li>
        </ul>
      </div>

      {/* Part 4 - Question 4 */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 4</span>
          Part 4 – Informal & Formal email (Viết 2 Email)
        </h4>

        {/* Sub-card Email 1 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
          <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CC1C01]"></span>
            Email 1 (≈50 từ gửi bạn cùng CLB) – Văn phong Thân mật (Informal)
          </h5>
          <p className="text-xs text-slate-600 font-medium">
            <strong>Bố cục chuẩn:</strong> Lời chào (<code className="text-[#CC1C01] font-mono">Hi [Tên],</code>) ➔ Nêu lý do viết ➔ Cảm nhận/suy nghĩ ➔ Kế hoạch/ý kiến ➔ Lời kết (<code className="text-[#CC1C01] font-mono">Best,</code>).
          </p>
          <p className="text-xs text-slate-500">Được dùng từ viết tắt (*I'm, I've, don't*) và từ ngữ giao tiếp đời thường tự nhiên.</p>
        </div>

        {/* Sub-card Email 2 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
          <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#24085A]"></span>
            Email 2 (120–150 từ gửi Quản lý CLB) – Văn phong Trang trọng (Formal)
          </h5>
          <p className="text-xs text-slate-600 font-medium">
            <strong>Bố cục chuẩn:</strong> Giới thiệu bản thân & lý do ➔ Nêu quan điểm ➔ Nguyên nhân/giải thích ➔ Đề xuất giải pháp ➔ Lời kết lịch sự (<code className="text-[#24085A] font-mono">Sincerely, / Best regards,</code>).
          </p>
          <p className="text-xs text-slate-500">Tuyệt đối không viết tắt, sử dụng từ ngữ trang trọng lịch sự và các từ nối (*In addition, Furthermore, For instance*).</p>
        </div>
      </div>

      {/* Vocab Helper Section */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#24085A] text-white text-xs px-2.5 py-0.5 rounded-md">Từ vựng</span>
          Bộ từ vựng cốt lõi cho Email (Opinion & Emotion)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Opinion Vocab */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block border-b pb-1">Từ vựng Đánh giá (Opinion)</span>
            <p className="text-[#047857] font-semibold">Tích cực: <span className="font-normal text-slate-700">Excellent, Practical, Meaningful, Useful, Effective, Creative, Inspiring</span></p>
            <p className="text-[#b91c1c] font-semibold">Tiêu cực: <span className="font-normal text-slate-700">Unclear, Unrealistic, Unnecessary, Confusing, Ineffective, Disappointing</span></p>
          </div>

          {/* Emotion Vocab */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block border-b pb-1">Từ vựng Cảm xúc (Emotion)</span>
            <p className="text-[#047857] font-semibold">Tích cực: <span className="font-normal text-slate-700">Excited, Happy, Pleased, Motivated, Inspired, Hopeful</span></p>
            <p className="text-[#b91c1c] font-semibold">Tiêu cực: <span className="font-normal text-slate-700">Worried, Concerned, Disappointed, Confused, Surprised, Upset</span></p>
          </div>
        </div>
      </div>

      {/* Rules / Checklist */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <span className="bg-[#24085A] text-white text-xs px-2.5 py-0.5 rounded-md">Lưu ý</span>
          Quy trình làm bài & Kiểm tra lỗi
        </h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
          <li>Đọc kỹ yêu cầu đề bài, đảm bảo trả lời đầy đủ tất cả các ý được hỏi.</li>
          <li>Chia đoạn văn rõ ràng, sử dụng từ nối để liên kết giữa các câu.</li>
          <li>Học theo Bố cục (Form) thay vì học thuộc lòng nguyên văn bài mẫu.</li>
          <li>Dành 2–3 phút cuối kiểm tra lại lỗi chính tả, số lượng từ và cấu trúc ngữ pháp.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="writing"
      skillTitle="Phần thi Writing"
      skillDescription="Luyện viết theo format bài thi Aptis Writing. Hoàn thành các task viết với thời gian giống bài thi thật.\nAI chấm bài và nhận band điểm Writing ngay sau khi làm bài."
      durationText="50 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      tipsTitle="Mẹo thi Aptis Writing"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 1 — không giới hạn giờ`,
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part2') {
          return {
            title: 'Luyện tất cả đề Part 2',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 2 — không giới hạn giờ`,
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part3') {
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 3 — không giới hạn giờ`,
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part4') {
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: `Làm liên tục ${totalTestSets} bộ đề Part 4 — không giới hạn giờ`,
            totalCount: totalTestSets,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        const testKey = `test${testNum}`;
        const testObj = rawWritingTests[testKey] || {};
        const clubName = testObj.club_name || '';
        const cleanClub = clubName.replace(/^Topic:\s*/i, '').trim();
        const titleText = cleanClub ? `Đề ${testNumberStr} - ${cleanClub}` : `Đề ${testNumberStr} - Writing Part ${partId === 'full' ? 'Full Part' : partId.replace('part', '')}`;

        if (partId === 'full') {
          return {
            title: titleText,
            subtitle: '✍️ 4 Parts (5 bài viết) • 50 phút',
            badge: 'Full Part',
          };
        }
        if (partId === 'part1') {
          return {
            title: titleText,
            subtitle: '✍️ Short answers (5 câu trả lời ngắn) • 3 phút',
            badge: 'P.1',
          };
        }
        if (partId === 'part2') {
          return {
            title: titleText,
            subtitle: '✍️ Social media response (20-30 từ) • 7 phút',
            badge: 'P.2',
          };
        }
        if (partId === 'part3') {
          return {
            title: titleText,
            subtitle: '✍️ Three questions (3 tin nhắn 30-40 từ) • 10 phút',
            badge: 'P.3',
          };
        }
        if (partId === 'part4') {
          return {
            title: titleText,
            subtitle: '✍️ Formal & Informal Email (2 bài) • 30 phút',
            badge: 'P.4',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        return (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#CC1C01] flex items-center justify-center mx-auto text-xl font-bold">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tính năng Luyện tập Writing đang được hoàn thiện
            </h3>
            <p className="text-sm text-slate-600">
              Chế độ luyện tập từng bài cho phần thi Writing sẽ sớm ra mắt trong phiên bản tiếp theo.
            </p>
            <button
              type="button"
              onClick={onExit}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24085A] text-white text-sm font-semibold hover:bg-[#340b82] transition-colors cursor-pointer"
            >
              Quay lại danh sách bài tập
            </button>
          </div>
        );
      }}
    />
  );
}

