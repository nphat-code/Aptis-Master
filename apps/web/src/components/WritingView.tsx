'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import scrapedData from '@/data/scraped_data.json';
import WritingPart1Practice from './writing/WritingPart1Practice';
import WritingPart2Practice from './writing/WritingPart2Practice';
import WritingPart3Practice from './writing/WritingPart3Practice';
import WritingPart4Practice from './writing/WritingPart4Practice';

interface WritingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function WritingView({ onBackToHome, onExamStateChange, data }: WritingViewProps) {
  const rawWritingTests = (scrapedData as any)?.writing || {};
  const totalTestSets = Object.keys(rawWritingTests).length || 40;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Word-level writing' },
    { id: 'part2', label: 'Part 2 – Short text writing' },
    { id: 'part3', label: 'Part 3 – Three written responses to questions' },
    { id: 'part4', label: 'Part 4 – Formal and informal writing' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Writing',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Word-level writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Short text writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Three written responses to questions',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Formal and informal writing',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: totalTestSets,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      {/* Chiến thuật tổng quan */}
      <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border border-[#fde68a] text-[#78350f] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#92400e] text-xs sm:text-sm">
          <span>✍️</span>
          <span>Chiến thuật Writing Aptis 2026 (4 phần – 50 phút – Thang 50 điểm):</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Phân bổ thời gian: <strong>Part 1 (3 phút)</strong> → <strong>Part 2 (7 phút)</strong> → <strong>Part 3 (10 phút)</strong> → <strong>Part 4 (30 phút)</strong>. Part 4 chiếm 50% tổng điểm (25/50đ), hãy dành nhiều thời gian nhất để hoàn thiện 2 bức email chỉn chu.
        </p>
      </div>

      {/* Part 1 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 1</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Short Answers (5 câu – 5 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            1–5 từ / câu
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Điền thông tin cá nhân ngắn vào biểu mẫu</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Độ dài chuẩn:</strong> Trả lời từ 1–5 từ. Tuyệt đối không viết thành câu dài để tránh mắc lỗi ngữ pháp không đáng có.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Quy tắc chính tả:</strong> Luôn viết hoa chữ cái đầu câu (hoặc tên riêng, ngày tháng) và kiểm tra kỹ lỗi gõ bàn phím.</span></li>
        </ul>
      </div>

      {/* Part 2 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 2</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Form Filling (1 câu – 5 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
            20–30 từ
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Viết đoạn văn ngắn giải thích lý do tham gia hoặc thói quen cá nhân</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Viết câu hoàn chỉnh:</strong> Viết từ 2–3 câu hoàn chỉnh có đầy đủ Chủ ngữ + Vị ngữ.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Dùng từ nối:</strong> Sử dụng các liên từ cơ bản (<em>because, so, and, especially</em>) để câu văn mạch lạc, tự nhiên.</span></li>
        </ul>
      </div>

      {/* Part 3 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 3</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Social Room / Club Chat (3 câu – 15 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#c7d2fe]">
            30–40 từ / câu
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Trả lời 3 câu hỏi từ 3 thành viên trong phòng chat câu lạc bộ</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Tương tác tự nhiên:</strong> Bắt đầu bằng phản hồi trực tiếp ý kiến của người hỏi (<em>"Hi John! That's a great question.", "I completely agree with your point."</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Cấu trúc chuẩn:</strong> Nêu quan điểm cá nhân → Giải thích lý do → Đưa ra 1 ví dụ thực tế ngắn gọn (đủ 30–40 từ).</span></li>
        </ul>
      </div>

      {/* Part 4 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 4</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Formal & Informal Emails (2 email – 25 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#e11d48] bg-[#fff1f2] px-2.5 py-0.5 rounded-full border border-[#fecdd3]">
            Trọng số lớn nhất
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Phản hồi lại thông báo thay đổi của CLB</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Email 1 – Informal (~50 từ gửi bạn):</strong> Dùng văn phong thân mật (<em>"Hi Sarah,", "Can you believe that...", "Let me know what you think!"</em>), cho phép dùng từ viết tắt (<em>I'm, can't</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Email 2 – Formal (120–150 từ gửi Quản lý):</strong> Văn phong trang trọng. Tuyệt đối không dùng từ viết tắt (phải viết <em>I am, cannot, would like</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Dàn ý Formal chuẩn 4 đoạn:</strong><br/>
            • <em>Mở đầu:</em> "Dear Sir or Madam, / Dear Club President, I am writing to express my concern regarding the recent announcement about..."<br/>
            • <em>Nêu vấn đề & tác động:</em> "This sudden change will cause significant inconvenience to many members because..."<br/>
            • <em>Đề xuất giải pháp mang tính xây dựng:</em> "I would like to suggest that the club could consider..."<br/>
            • <em>Kết thư:</em> "I look forward to hearing from you soon. Yours sincerely, [Your Name]"</span></li>
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
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Writing"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part2') {
          return {
            title: 'Luyện tất cả đề Part 2',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part3') {
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: '',
            totalCount: totalTestSets,
          };
        }
        if (partId === 'part4') {
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: '',
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
            badge: 'Full Part',
            durationText: '50 phút',
          };
        }
        if (partId === 'part1') {
          return {
            title: titleText,
            badge: 'Part 1',
            durationText: '3 phút',
          };
        }
        if (partId === 'part2') {
          return {
            title: titleText,
            badge: 'Part 2',
            durationText: '7 phút',
          };
        }
        if (partId === 'part3') {
          return {
            title: titleText,
            badge: 'Part 3',
            durationText: '10 phút',
          };
        }
        if (partId === 'part4') {
          return {
            title: titleText,
            badge: 'Part 4',
            durationText: '30 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'part1') {
          return <WritingPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <WritingPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <WritingPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <WritingPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        return (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-[#CC1C01] flex items-center justify-center mx-auto text-xl font-bold">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Tính năng Luyện tập Writing đang được hoàn thiện
            </h3>
            <p className="text-sm text-slate-600">
              Chế độ luyện tập cho phần này sẽ sớm ra mắt trong phiên bản tiếp theo.
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

