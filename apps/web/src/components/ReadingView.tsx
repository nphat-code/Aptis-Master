'use client';

import React, { useState } from 'react';
import ReadingPart1Practice from './ReadingPart1Practice';
import ReadingPart23Practice from './ReadingPart23Practice';
import { TestPracticeCard } from './exam/TestPracticeCard';
import scrapedData from '../../../../scraped_data.json';

interface ReadingViewProps {
  onBackToHome?: () => void;
  data?: any;
}

export default function ReadingView({ onBackToHome, data }: ReadingViewProps) {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showUpdatingModalPart, setShowUpdatingModalPart] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePartTab, setActivePartTab] = useState('part1');
  const [activePracticeTestIndex, setActivePracticeTestIndex] = useState<number | null>(null);

  const part1TotalCount = scrapedData?.reading?.question1?.length || 48;
  const part23TotalSets = scrapedData?.reading?.question2?.questionSets?.length || 39;
  const part23TotalCount = part23TotalSets;

  const partTabs = [
    { id: 'full', label: 'Full Part – Tất cả các Part' },
    { id: 'part1', label: 'Part 1 – Sentence comprehension' },
    { id: 'part23', label: 'Part 2 + 3 – Text cohesion' },
    { id: 'part4', label: 'Part 4 – Opinion matching' },
    { id: 'part5', label: 'Part 5 – Long reading' },
  ];

  const partTabContent: Record<string, { title: string; subtitle: string; badge: string; testCount: number }> = {
    full: {
      title: 'Luyện tập full part kỹ năng Reading',
      subtitle: 'Hoàn thành tất cả các Part của kỹ năng này trong một lượt thi liên tục để đánh giá năng lực chính xác nhất.',
      badge: 'Full Part',
      testCount: 30,
    },
    part1: {
      title: 'Part 1 – Sentence comprehension',
      subtitle: `${part1TotalCount} bộ đề luyện tập`,
      badge: 'Part 1',
      testCount: part1TotalCount,
    },
    part23: {
      title: 'Part 2 + 3 – Text cohesion',
      subtitle: `${part23TotalCount} bộ đề luyện tập (Mỗi đề 1 Topic • 7 phút)`,
      badge: 'Part 2+3',
      testCount: part23TotalCount,
    },
    part4: {
      title: 'Part 4 – Opinion matching',
      subtitle: '21 bộ đề luyện tập',
      badge: 'Part 4',
      testCount: 21,
    },
    part5: {
      title: 'Part 5 – Long reading',
      subtitle: '23 bộ đề luyện tập',
      badge: 'Part 5',
      testCount: 23,
    },
  };

  const currentTabInfo = partTabContent[activePartTab] || partTabContent.full;

  // Render Practice Exam Workspace when Part 1 or Part 2+3 is selected
  if (activePracticeTestIndex !== null && activePartTab === 'part1') {
    return (
      <ReadingPart1Practice
        testIndex={activePracticeTestIndex}
        onExit={() => setActivePracticeTestIndex(null)}
      />
    );
  }

  if (activePracticeTestIndex !== null && activePartTab === 'part23') {
    return (
      <ReadingPart23Practice
        testIndex={activePracticeTestIndex}
        onExit={() => setActivePracticeTestIndex(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      
      {/* 1. Hero Header Banner (Matching aptiskytich.vn gradient background) */}
      <div className="bg-gradient-to-r from-[#FFF5F3] via-[#FFF8F7] to-[#FFF1EF] border-b border-slate-200/60 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Icon Box & 30 phút Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#CC1C01] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
              <span>⏱</span>
              <span>30 phút</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Phần thi Reading
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-normal max-w-3xl leading-relaxed">
              Luyện đọc hiểu theo format bài thi Aptis Reading. Làm quen với các dạng câu hỏi và nâng cao kỹ năng đọc nhanh.
            </p>
          </div>

          {/* Nút Mẹo thi: Xem ngay - Mẹo làm bài Reading */}
          <div className="pt-1">
            <button
              onClick={() => setShowTipsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CC1C01] text-[#CC1C01] bg-white hover:bg-[#FFF2EE] font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 shadow-2xs cursor-pointer"
            >
              <span>💡</span>
              <span>Xem ngay - Mẹo làm bài Reading</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Workspace Container (Expanded width max-w-[1700px]) */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-7">
        
        {/* Progress Banner Container (Logged In State) */}
        <div className="bg-[#F3F4F6] rounded-xl p-5 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center shadow-2xs flex-shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Tiến độ học tập của bạn
              </h4>
              <p className="text-sm text-slate-500 font-normal mt-0.5">
                Đã hoàn thành 5 bộ đề Reading
              </p>
            </div>
          </div>

          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#CC1C01] text-[#CC1C01] bg-white hover:bg-[#FFF2EE] font-medium text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 whitespace-nowrap self-start sm:self-auto shadow-2xs cursor-pointer">
            <span>Xem lịch sử</span>
            <span>→</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bộ đề Reading..."
            className="w-full h-11 pl-10 pr-10 bg-[#F3F4F6] rounded-md border-none text-sm font-normal text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#CC1C01]/20 transition-all"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* 5 Part Filter Tabs Bar (Stretched 100% Width matching test cards grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full pt-1">
          {partTabs.map((tab) => {
            const isActive = activePartTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePartTab(tab.id)}
                className={`w-full px-4 py-3.5 rounded-lg text-xs sm:text-sm font-bold text-center justify-center transition-all duration-150 flex items-center ${
                  isActive
                    ? 'bg-[#CC1C01] text-white shadow-sm'
                    : 'bg-[#F4F4F6] text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                <span className="w-full text-center leading-snug">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-heading above test grid - Dynamic per tab */}
        <div className="pt-2 space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">
            {currentTabInfo.title}
          </h2>
          <p className="text-sm text-slate-500 font-normal">
            {currentTabInfo.subtitle}
          </p>
        </div>

        {/* Dynamic Reading Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* Card 0: Luyện tất cả đề Part 1 (Marathon Card - Matching aptiskytich.vn 100%) */}
          {activePartTab === 'part1' && (!searchTerm || 'luyện tất cả đề part 1'.includes(searchTerm.toLowerCase())) && (
            <TestPracticeCard
              key="all-part1-practice-card"
              title="Luyện tất cả đề Part 1"
              badge="Marathon"
              isMarathon={true}
              subtitle={`Làm liên tục ${part1TotalCount} đề — không giới hạn giờ`}
              actionText="Bắt đầu"
              onClick={() => setActivePracticeTestIndex(-1)}
            />
          )}

          {/* Card 0: Luyện tất cả đề Part 2+3 (Marathon Card) */}
          {activePartTab === 'part23' && (!searchTerm || 'luyện tất cả đề part 2+3'.includes(searchTerm.toLowerCase())) && (
            <TestPracticeCard
              key="all-part23-practice-card"
              title="Luyện tất cả đề Part 2+3"
              badge="Marathon"
              isMarathon={true}
              subtitle={`Làm liên tục ${part23TotalSets} bài đọc — không giới hạn giờ`}
              actionText="Bắt đầu"
              onClick={() => setActivePracticeTestIndex(-1)}
            />
          )}

          {Array.from({ length: currentTabInfo.testCount }, (_, index) => {
            const testNum = index + 1;
            const rawHeaders: Record<string, string> = scrapedData?.reading?.question2?.questheader1 || {};
            const topicTitle = activePartTab === 'part23' ? (rawHeaders[`question2Content_${testNum}`] || '') : '';
            const testNumberStr = testNum < 10 ? '0' + testNum : `${testNum}`;
            
            const cardTitle = activePartTab === 'part23'
              ? `Đề ${testNumberStr}${topicTitle ? ` - ${topicTitle}` : ''}`
              : `Đề ${testNumberStr} - Reading ${currentTabInfo.badge}`;

            // Search filter
            if (
              searchTerm &&
              !cardTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !topicTitle.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return null;
            }

            return (
              <TestPracticeCard
                key={testNum}
                title={cardTitle}
                badge={currentTabInfo.badge}
                isMarathon={false}
                subtitle={activePartTab === 'part23' ? '📖 1 bài đọc (5 câu) • 7 phút' : '📖 Đề luyện tập'}
                actionText={activePartTab === 'full' ? 'Bắt đầu luyện tập' : 'Luyện tập'}
                onClick={() => {
                  if (activePartTab === 'part1' || activePartTab === 'part23') {
                    setActivePracticeTestIndex(index);
                  } else {
                    setShowUpdatingModalPart(currentTabInfo.badge);
                  }
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Reading Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3 text-[#CC1C01]">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    Mẹo học Reading Aptis
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Chiến thuật ôn luyện từng Part để đạt điểm tối đa
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTipsModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-base transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Content (Full Text from aptiskytich.vn/meo-thi-aptis/meo-hoc-reading-aptis) */}
            <div className="space-y-6 text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-3 font-sans">
              
              <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/60 text-slate-800 space-y-1">
                <p className="font-medium">
                  Reading là một trong những kỹ năng dễ cải thiện nhất trong bài thi Aptis nếu bạn biết cách học đúng trọng tâm. Thay vì làm thật nhiều đề, hãy chia nhỏ từng Part để ôn luyện và ghi nhớ theo hệ thống.
                </p>
              </div>

              {/* Part 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 1</span>
                  Sentence comprehension
                </h4>
                <p className="text-xs font-semibold text-slate-500">Học đầy đủ kho câu hỏi (Phần dễ lấy điểm nhất)</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
                  <li>Học đầy đủ các câu hỏi trong kho đề.</li>
                  <li>Làm đi làm lại nhiều lần để ghi nhớ.</li>
                  <li>Khi luyện, cố gắng nhìn câu hỏi là nhận ra đáp án thay vì đọc lại từ đầu.</li>
                  <li>Mục tiêu là tạo phản xạ nhanh khi gặp những dạng câu hỏi quen thuộc.</li>
                </ul>
              </div>

              {/* Part 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 2</span>
                  Text cohesion (Sắp xếp đoạn văn)
                </h4>
                <p className="text-xs font-semibold text-slate-500">Tiếp tục học theo kho câu hỏi</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
                  <li>Học đầy đủ các câu hỏi trong kho.</li>
                  <li>Luyện nhiều lần để ghi nhớ đáp án.</li>
                  <li>Chú ý những câu dễ nhầm để tránh lặp lại lỗi.</li>
                  <li>Việc luyện tập thường xuyên sẽ giúp bạn tăng tốc độ xử lý khi làm bài.</li>
                </ul>
              </div>

              {/* Part 3 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 3</span>
                  Luyện nhận diện đáp án
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
                  <li>Học kỹ từng câu hỏi và ghi nhớ cách tìm đáp án.</li>
                  <li>Làm lại nhiều lần để tạo phản xạ.</li>
                  <li>Đừng chỉ ghi nhớ đáp án, hãy hiểu vì sao đáp án đó đúng để áp dụng khi gặp câu hỏi tương tự.</li>
                </ul>
              </div>

              {/* Part 4 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 4</span>
                  Opinion matching
                </h4>
                <p className="text-xs font-semibold text-slate-500">Không quá khó nếu ôn tập đầy đủ</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
                  <li>Học đầy đủ các câu hỏi trong kho đề.</li>
                  <li>Luyện nhiều lần để ghi nhớ cách làm bài.</li>
                  <li>Chú ý những câu có nội dung dễ gây nhầm lẫn.</li>
                </ul>
              </div>

              {/* Part 5 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="bg-[#CC1C01] text-white text-xs px-2.5 py-0.5 rounded-md">Part 5</span>
                  Long reading
                </h4>
                <p className="text-xs font-semibold text-slate-500">Học theo Keyword (Part khó nhất)</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1 font-medium">
                  <li>Học theo keyword chính thay vì cố học thuộc cả đoạn văn.</li>
                  <li>Ghi nhớ ý chính của từng bài thay vì học thuộc từng câu.</li>
                  <li>Cách học này sẽ giúp bạn xử lý câu hỏi nhanh hơn khi gặp đoạn văn tương tự.</li>
                </ul>
              </div>

              {/* Strategy Summary Table */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 text-base">Tóm tắt mẹo học Reading</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Part</th>
                        <th className="p-3">Mẹo học trọng tâm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      <tr>
                        <td className="p-3 font-bold text-[#CC1C01]">Part 1</td>
                        <td className="p-3">Học đầy đủ kho câu hỏi và luyện phản xạ nhanh</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#CC1C01]">Part 2</td>
                        <td className="p-3">Học kỹ các câu hỏi, ôn lại nhiều lần tránh nhầm lẫn</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#CC1C01]">Part 3</td>
                        <td className="p-3">Ghi nhớ cách tìm đáp án và luyện thường xuyên</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#CC1C01]">Part 4</td>
                        <td className="p-3">Học đầy đủ, chú ý các câu dễ gây bẫy</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-[#CC1C01]">Part 5</td>
                        <td className="p-3">Học theo keyword, nắm chắc ý chính từng bài</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setShowTipsModal(false)}
                className="bg-[#CC1C01] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#b51901] transition-colors shadow-xs cursor-pointer"
              >
                Đã hiểu, đóng cửa sổ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL B: Part Updating Notice Modal */}
      {showUpdatingModalPart && (
        <div
          onClick={() => setShowUpdatingModalPart(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4 cursor-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-black">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Bộ đề {showUpdatingModalPart} đang cập nhật
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tính năng đang được hoàn thiện
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Bộ đề làm bài dành riêng cho <strong>{showUpdatingModalPart}</strong> đang được hệ thống cập nhật nội dung. Vui lòng chọn tab <strong>Part 1 – Sentence comprehension</strong> để trải nghiệm bộ đề thi chuẩn nhé!
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUpdatingModalPart(null);
                  setActivePartTab('part1');
                }}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Chuyển sang Part 1
              </button>
              <button
                onClick={() => setShowUpdatingModalPart(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
