'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';

import scrapedData from '@/data/scraped_data.json';
import ListeningPart1Practice from './listening/ListeningPart1Practice';
import ListeningPart2Practice from './listening/ListeningPart2Practice';
import ListeningPart3Practice from './listening/ListeningPart3Practice';
import ListeningPart4Practice from './listening/ListeningPart4Practice';
import ListeningFullPractice from './listening/ListeningFullPractice';

interface ListeningViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function ListeningView({ onBackToHome, onExamStateChange, data }: ListeningViewProps) {
  const rawListeningTests = (scrapedData as any).listening_tests || {};
  const totalTestSets = Object.keys(rawListeningTests).length || 15;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Information recognition' },
    { id: 'part2', label: 'Part 2 – Information matching' },
    { id: 'part3', label: 'Part 3 – Inference - discussion' },
    { id: 'part4', label: 'Part 4 – Inference - longer monologues' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Listening',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: totalTestSets,
    },
    part1: {
      title: 'Part 1 – Information recognition',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: totalTestSets,
    },
    part2: {
      title: 'Part 2 – Information matching',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 2',
      testCount: totalTestSets,
    },
    part3: {
      title: 'Part 3 – Inference - discussion',
      subtitle: `${totalTestSets} bộ đề luyện tập`,
      badge: 'Part 3',
      testCount: totalTestSets,
    },
    part4: {
      title: 'Part 4 – Inference - longer monologues',
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
          <span>🎧</span>
          <span>Chiến thuật Listening Aptis 2026 (17 audio – 40 phút):</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Mỗi đoạn audio chỉ được nghe <strong>tối đa 2 lần</strong>. Hãy luôn đọc kỹ câu hỏi và các phương án lựa chọn <em>trước khi</em> bấm nút Play để định hình sẵn thông tin cần bắt.
        </p>
      </div>

      {/* Part 1 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 1</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Information Recognition (Câu 1–13 – 26 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Phần gỡ điểm chính
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">13 đoạn hội thoại/độc thoại ngắn (Thông báo, tin nhắn thoại, chỉ đường)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc trước phương án (Pre-reading):</strong> Dành 5–10 giây trước khi nghe để đọc 3 đáp án A, B, C và khoanh vùng loại thông tin (giờ giấc, giá tiền, địa điểm, hành động).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Cẩn thận bẫy tự sửa (Self-Correction):</strong> Người nói thường đưa ra một thông tin trước rồi sửa lại ngay sau đó (ví dụ: <em>"Let's meet at 3 PM... Oh wait, I have a meeting, so 4 PM is better"</em> → Đáp án là 4 PM).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Tận dụng lần nghe 1 & 2:</strong> Lần nghe 1 chọn đáp án sơ bộ, lần nghe 2 nghe rà soát lại để chắc chắn 100%.</span></li>
        </ul>
      </div>

      {/* Part 2 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 2</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Information Matching (Câu 14 – 8 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
            Ghép người nói
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">4 người nói (Speaker 1–4) thảo luận về 1 chủ đề, ghép với 4 trong 6 options</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc lướt 6 ý kiến trước:</strong> Gạch chân từ khóa chỉ thái độ (thích, ghét, lo lắng, bất ngờ, đề xuất) trong 6 lựa chọn.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Bắt ý chính từng Speaker:</strong> Mỗi người nói chỉ kéo dài khoảng 15–20 giây. Tập trung vào câu kết luận hoặc tính từ biểu cảm chính của người đó.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Loại trừ 2 options thừa:</strong> Hai ý kiến thừa thường là các bẫy nhắc lại từ vựng nhưng không phải ý chính của người nào.</span></li>
        </ul>
      </div>

      {/* Part 3 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 3</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Opinion & Attitude (Câu 15 – 8 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#c7d2fe]">
            Man / Woman / Both
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Đối thoại nam – nữ, xác định quan điểm của Man, Woman, hoặc Both</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Phân biệt giọng Nam và Nữ:</strong> Chú ý xem ai là người khởi xướng ý kiến và phản ứng của người đối diện là gì.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Dấu hiệu chọn BOTH (Cả hai):</strong> Khi người thứ hai đồng tình bằng các câu như: <em>"I completely agree", "You took the words right out of my mouth", "That's exactly what I think"</em>.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Dấu hiệu bất đồng:</strong> Khi có các từ chuyển hướng: <em>"Well, I'm not so sure", "On the other hand", "Actually, I see it differently"</em>.</span></li>
        </ul>
      </div>

      {/* Part 4 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 4</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Inference & Monologues (Câu 16–17 – 8 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Độc thoại nâng cao
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">2 bài thuyết trình/phát biểu dài, mỗi bài gồm 2 câu hỏi trắc nghiệm</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc kỹ 2 câu hỏi trước khi nghe:</strong> Câu hỏi 1 thường hỏi về mục đích chung/nguyên nhân, câu hỏi 2 thường hỏi về chi tiết kết quả hoặc suy luận trong tương lai.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Bắt từ chuyển ý (Signposts):</strong> Lắng nghe các từ định hướng cấu trúc bài nói: <em>"First of all", "The key challenge was", "Consequently", "In conclusion"</em>.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Không hoảng loạn nếu lỡ một câu:</strong> Nếu bị lỡ thông tin câu 1, hãy chuyển sự tập trung ngay sang câu 2 và dùng lần nghe thứ 2 để bổ sung.</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="listening"
      skillTitle="Phần thi Listening"
      skillDescription="Luyện nghe theo format bài thi Aptis Listening. Làm quen với các dạng câu hỏi và luyện tập với audio giống bài thi thật. Mỗi đoạn audio chỉ được nghe tối đa 2 lần."
      durationText="25-30 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 15h3v4H3v-4zm15 0h3v4h-3v-4z" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part2', 'part3', 'part4']}
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo thi Aptis Listening"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') return null;
        if (partId === 'part1') {
          const totalP1 = (scrapedData as any).listening?.listening_question1_13?.length || 210;
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: '',
            totalCount: totalP1,
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
          const totalP3 = (scrapedData as any).listening?.listening_question15?.length || totalTestSets;
          return {
            title: 'Luyện tất cả đề Part 3',
            subtitle: '',
            totalCount: totalP3,
          };
        }
        if (partId === 'part4') {
          const totalP4 = (scrapedData as any).listening?.listening_question16_17?.length || totalTestSets;
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: '',
            totalCount: totalP4,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
        if (partId === 'full') {
          return {
            title: `Đề ${testNumberStr} - Listening Full Part`,
            badge: 'Full Part',
            durationText: '40 phút',
          };
        }
        if (partId === 'part1') {
          return {
            title: `Đề ${testNumberStr} - Listening Part 1`,
            badge: 'Part 1',
            durationText: '8 phút',
          };
        }
        if (partId === 'part2') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q14 = rawListeningTests[testKey]?.q14 || {};
          const topicRaw = q14.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 2`;

          return {
            title: titleText,
            badge: 'Part 2',
            durationText: '10 phút',
          };
        }
        if (partId === 'part3') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q15 = rawListeningTests[testKey]?.q15 || {};
          const topicRaw = q15.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 3`;

          return {
            title: titleText,
            badge: 'Part 3',
            durationText: '10 phút',
          };
        }
        if (partId === 'part4') {
          const rawListeningTests = (scrapedData as any).listening_tests || {};
          const testKey = `test${testNum}`;
          const q16_17 = rawListeningTests[testKey]?.q16_17 || [];
          const firstMono = q16_17[0] || {};
          const topicRaw = firstMono.topic || '';
          const cleanTopic = topicRaw.replace(/^Topic:\s*/i, '').trim();
          const titleText = cleanTopic ? `Đề ${testNumberStr} - ${cleanTopic}` : `Đề ${testNumberStr} - Listening Part 4`;

          return {
            title: titleText,
            badge: 'Part 4',
            durationText: '12 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'full') {
          return <ListeningFullPractice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part1') {
          return <ListeningPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part2') {
          return <ListeningPart2Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part3') {
          return <ListeningPart3Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <ListeningPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
