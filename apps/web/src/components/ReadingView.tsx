'use client';

import React from 'react';
import SkillPracticeView, { PartTab, PartTabContent } from './SkillPracticeView';
import ReadingPart1Practice from './reading/ReadingPart1Practice';
import ReadingPart23Practice from './reading/ReadingPart23Practice';
import ReadingPart4Practice from './reading/ReadingPart4Practice';
import ReadingPart5Practice from './reading/ReadingPart5Practice';
import ReadingFullPractice from './reading/ReadingFullPractice';
import scrapedData from '@/data/scraped_data.json';

interface ReadingViewProps {
  onBackToHome?: () => void;
  onExamStateChange?: (isExamActive: boolean) => void;
  data?: any;
}

export default function ReadingView({ onBackToHome, onExamStateChange, data }: ReadingViewProps) {
  const part1TotalCount = (scrapedData as any)?.reading?.question1?.length || 48;
  const part23TotalSets = (scrapedData as any)?.reading?.question2?.questionSets?.length || 39;
  const part23TotalCount = part23TotalSets;
  const part4TotalCount = (scrapedData as any)?.reading?.question4?.question4Content?.length || 14;
  const part5TotalCount = (scrapedData as any)?.reading?.question5?.paragraph_question5?.length || 11;
  const fullTotalCount = Object.keys((scrapedData as any)?.reading_tests || {}).length || 14;

  const partTabs: PartTab[] = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Sentence comprehension' },
    { id: 'part23', label: 'Part 2 + 3 – Text cohesion' },
    { id: 'part4', label: 'Part 4 – Opinion matching' },
    { id: 'part5', label: 'Part 5 – Long text comprehension' },
  ];

  const partTabContent: Record<string, PartTabContent> = {
    full: {
      title: 'Luyện tập full part kỹ năng Reading',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: fullTotalCount,
    },
    part1: {
      title: 'Part 1 – Sentence comprehension',
      subtitle: `${part1TotalCount} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: part1TotalCount,
    },
    part23: {
      title: 'Part 2 + 3 – Text cohesion',
      subtitle: `${part23TotalCount} bộ đề luyện tập`,
      badge: 'Part 2+3',
      testCount: part23TotalCount,
    },
    part4: {
      title: 'Part 4 – Opinion matching',
      subtitle: `${part4TotalCount} bộ đề luyện tập`,
      badge: 'Part 4',
      testCount: part4TotalCount,
    },
    part5: {
      title: 'Part 5 – Long text comprehension',
      subtitle: `${part5TotalCount} bộ đề luyện tập`,
      badge: 'Part 5',
      testCount: part5TotalCount,
    },
  };

  const tipsContent = (
    <div className="space-y-4 text-sm font-sans">
      {/* Chiến thuật tổng quan */}
      <div className="bg-[#fffbeb] p-4 sm:p-5 rounded-2xl border border-[#fde68a] text-[#78350f] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-[#92400e] text-xs sm:text-sm">
          <span>💡</span>
          <span>Chiến thuật Reading Aptis 2026 (Tổng thời gian: 35 phút):</span>
        </div>
        <p className="font-normal text-xs sm:text-sm leading-relaxed text-[#78350f]">
          Phân bổ thời gian vàng: <strong>Part 1 (4 phút)</strong> → <strong>Part 2 & 3 (8 phút)</strong> → <strong>Part 4 (10 phút)</strong> → <strong>Part 5 (13 phút)</strong>. Hãy làm theo đúng thứ tự và không dừng lại quá 1 phút ở bất kỳ câu hỏi nào.
        </p>
      </div>

      {/* Part 1 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 1</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Sentence Comprehension (5 câu – 10 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Tích lũy điểm tối đa
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Mục tiêu: Đạt 10/10 điểm trong vòng 3–4 phút</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc lướt toàn câu:</strong> Đọc hết cả câu trước và sau chỗ trống để hiểu nghĩa tổng thể thay vì chỉ nhìn từ đứng ngay trước.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Xác định từ loại và Collocation:</strong> Chú ý giới từ đi kèm (ví dụ: <em>interested in, good at</em>) và cụm từ cố định để chọn ngay đáp án đúng.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Luyện tủ kho 48 đề:</strong> Đa phần các câu hỏi Part 1 đều nằm trong ngân hàng câu hỏi chuẩn, luyện phản xạ nhận diện tức thì.</span></li>
        </ul>
      </div>

      {/* Part 2 & 3 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 2 + 3</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Text Cohesion (10 câu – 10 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
            Logic & Chuỗi câu
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Kỹ thuật sắp xếp 5 câu thành đoạn văn hoàn chỉnh</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Tìm câu mở đầu (Topic Sentence):</strong> Câu đầu tiên luôn là câu giới thiệu độc lập, không chứa các từ nối phụ thuộc (<em>However, Therefore, Meanwhile</em>) hoặc đại từ thay thế chưa rõ nguồn gốc (<em>He, She, They, This, That</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Bắt cặp liên kết (Chain Linking):</strong> Ghép các câu có mối quan hệ Danh từ riêng → Đại từ (<em>Mr. John → He</em>), Mạo từ không xác định → Xác định (<em>a new car → the car</em>), và mốc thời gian tuần tự (<em>In 1990 → Later → Nowadays</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc lại toàn bài:</strong> Sau khi kéo thả xong, đọc liền mạch 5 câu từ trên xuống dưới để đảm bảo mạch truyện tự nhiên, hợp lý.</span></li>
        </ul>
      </div>

      {/* Part 4 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 4</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Opinion Matching (7 câu – 16 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-0.5 rounded-full border border-[#c7d2fe]">
            Trọng số cao nhất
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Ghép quan điểm 7 câu hỏi vào 4 nhân vật (Person A, B, C, D)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Đọc câu hỏi trước – Gạch chân Keywords:</strong> Đọc kỹ 7 câu hỏi và khoanh vùng từ khóa về cảm xúc, thái độ, hành động của người nói.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Tìm Paraphrasing (Từ đồng nghĩa):</strong> Aptis không bao giờ lặp lại từ y hệt trong bài đọc. Hãy tìm các cách diễn đạt tương đương (ví dụ: <em>difficult = hard = challenging</em>).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Cảnh giác với bẫy từ khóa:</strong> Một người có thể nhắc đến từ khóa trong câu hỏi nhưng thái độ lại trái ngược (phủ định hoặc nói về người khác).</span></li>
        </ul>
      </div>

      {/* Part 5 */}
      <div className="bg-white p-5 rounded-2xl border border-[#e5ded3] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#162544] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Part 5</span>
            <h4 className="font-bold text-[#162544] text-sm sm:text-base">Long Text Comprehension (7 câu – 14 điểm)</h4>
          </div>
          <span className="text-[11px] font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0]">
            Ghép Heading
          </span>
        </div>
        <p className="text-xs font-semibold text-[#6b6860]">Chọn tiêu đề chuẩn xác cho 7 đoạn văn từ 8 lựa chọn (1 heading thừa)</p>
        <ul className="space-y-2 text-xs sm:text-sm text-[#333842] pt-1">
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Quy tắc Câu đầu & Câu cuối:</strong> Ý chính của đoạn văn tiếng Anh (Main Idea) thường nằm ở 1–2 câu đầu (diễn dịch) hoặc câu cuối cùng (quy nạp).</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Phân biệt Ý chính vs. Chi tiết minh họa:</strong> Tránh chọn các tiêu đề chỉ nêu 1 ví dụ hay 1 con số nhỏ trong đoạn. Tiêu đề đúng phải bao quát trọn vẹn toàn bộ đoạn văn.</span></li>
          <li className="flex items-start gap-2"><span className="text-[#059669] font-bold">✓</span><span><strong>Phương pháp loại trừ:</strong> Gán tiêu đề chắc chắn trước, sau đó so sánh các heading còn lại để tìm ra tiêu đề bẫy.</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <SkillPracticeView
      skillId="reading"
      skillTitle="Phần thi Reading"
      skillDescription="Luyện đọc hiểu theo format bài thi Aptis Reading. Làm quen với các dạng câu hỏi và nâng cao kỹ năng đọc nhanh."
      durationText="30 phút"
      icon={(
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )}
      partTabs={partTabs}
      partTabContent={partTabContent}
      defaultPartTab="full"
      supportedPartIds={['full', 'part1', 'part23', 'part4', 'part5']}
      onExamStateChange={onExamStateChange}
      tipsTitle="Mẹo học Reading Aptis"
      tipsContent={tipsContent}
      getMarathonCardProps={(partId) => {
        if (partId === 'full') {
          return null;
        }
        if (partId === 'part1') {
          return {
            title: 'Luyện tất cả đề Part 1',
            subtitle: '',
            totalCount: part1TotalCount,
          };
        }
        if (partId === 'part23') {
          return {
            title: 'Luyện tất cả đề Part 2+3',
            subtitle: '',
            totalCount: part23TotalSets,
          };
        }
        if (partId === 'part4') {
          return {
            title: 'Luyện tất cả đề Part 4',
            subtitle: '',
            totalCount: part4TotalCount,
          };
        }
        if (partId === 'part5') {
          return {
            title: 'Luyện tất cả đề Part 5',
            subtitle: '',
            totalCount: part5TotalCount,
          };
        }
        return null;
      }}
      getCustomCardProps={(partId, testNum) => {
        if (partId === 'full') {
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}`,
            badge: 'Full Part',
            durationText: '35 phút',
          };
        }
        if (partId === 'part1') {
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr} - Reading Part 1`,
            badge: 'Part 1',
            durationText: '6 phút',
          };
        }
        if (partId === 'part23') {
          const rawHeaders: Record<string, string> = scrapedData?.reading?.question2?.questheader1 || {};
          const topicTitle = rawHeaders[`question2Content_${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            badge: 'Part 2+3',
            durationText: '7 phút',
          };
        }
        if (partId === 'part4') {
          const topicMap: Record<string, string> = scrapedData?.reading?.question4?.question4Topic1 || {};
          const topicTitle = topicMap[`topic${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            badge: 'Part 4',
            durationText: '7 phút',
          };
        }
        if (partId === 'part5') {
          const topicMap: Record<string, string> = scrapedData?.reading?.question5?.topic_name || {};
          const topicTitle = topicMap[`topic_${testNum}`] || '';
          const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
          return {
            title: `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`,
            badge: 'Part 5',
            durationText: '15 phút',
          };
        }
        return null;
      }}
      renderPracticeExam={({ partId, testIndex, onExit }) => {
        if (partId === 'full') {
          return <ReadingFullPractice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part1') {
          return <ReadingPart1Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part23') {
          return <ReadingPart23Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part4') {
          return <ReadingPart4Practice testIndex={testIndex} onExit={onExit} />;
        }
        if (partId === 'part5') {
          return <ReadingPart5Practice testIndex={testIndex} onExit={onExit} />;
        }
        return null;
      }}
    />
  );
}
