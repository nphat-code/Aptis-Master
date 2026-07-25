'use client';

import React, { useState, useEffect } from 'react';
import scrapedData from '../../../../scraped_data.json';

interface Question {
  questionStart: string;
  answerOptions: string[];
  questionEnd: string;
  correctAnswer: string;
  translation?: string;
}

interface ReadingPart1PracticeProps {
  testIndex: number; // 0-based index for tests
  onExit: () => void;
}

// Translations lookup for demo scraped data
const translationsMap: Record<string, string[]> = {
  '0': [
    'Bạn có thể đón chuyến tàu tiếp theo ở ga gần trung tâm thành phố.',
    'Xe buýt số 5 dừng ngay trước nhà tôi.',
    'Hãy đợi cho đến khi đèn chuyển sang màu xanh trước khi qua đường.',
    'Gia đình tôi thích ăn tối cùng nhau vào buổi tối.',
    'Em trai tôi thích xem phim vào mỗi tối thứ Bảy.'
  ],
  '1': [
    'Cô ấy thích đi chạy bộ vào buổi sáng trước khi ăn sáng.',
    'Tất cả bạn bè của tôi đã đến dự buổi tiệc sinh nhật của tôi.',
    'Xin vui lòng đừng để giày của bạn ở hành lang.',
    'Rau củ tươi rất tốt cho trẻ em.',
    'Nhà hàng phục vụ đồ ăn thơm ngon với giá cả hợp lý.'
  ],
  '2': [
    'Mấy giờ bạn sẽ về nhà tối nay?',
    'Nhân viên cửa hàng rất lịch sự với khách hàng sáng nay.',
    'Chúng tôi đã mua vé trực tuyến để tránh xếp hàng.',
    'Vui lòng tắt đèn khi bạn rời khỏi phòng.',
    'Thời tiết hôm nay nắng đẹp và ấm áp.'
  ]
};

export default function ReadingPart1Practice({
  testIndex = 0,
  onExit,
}: ReadingPart1PracticeProps) {
  // Load questions for specified testIndex
  const rawQuestionsList = scrapedData?.reading?.question1 || [];
  const testQuestionsData: Question[] =
    rawQuestionsList[testIndex % rawQuestionsList.length] || rawQuestionsList[0] || [];

  // Steps: 'start' (Start Assessment) -> 'instructions' (Instructions) -> 'questions' (Actual Exam)
  const [examStep, setExamStep] = useState<'start' | 'instructions' | 'questions'>('start');

  // States
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false); // Modal when clicking [-> on Instructions
  const [showQuestionReviewModal, setShowQuestionReviewModal] = useState(false); // Modal when clicking [-> on Questions
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(360); // 6 minutes

  // Timer countdown - only starts when examStep === 'questions'
  useEffect(() => {
    if (examStep !== 'questions' || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          setShowExplanation(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStep, isSubmitted]);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Handle Answer Selection
  const handleSelectAnswer = (index: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Handle click on round [-> icon button in footer
  const handleNextSectionIconClick = () => {
    if (examStep === 'instructions') {
      setShowProceedModal(true);
    } else if (examStep === 'questions') {
      setShowQuestionReviewModal(true);
    }
  };

  // Calculate score
  const correctCount = testQuestionsData.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const testTitle = `Đề ${testIndex + 1 < 10 ? '0' + (testIndex + 1) : testIndex + 1}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F4F4F6] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#CC1C01] selection:text-white">
      
      {/* 1. Top Header Bar (Dark Purple Header rgb(36, 8, 90) - 2 Stacked Lines, NO Slash) */}
      <header className="bg-[#24085A] text-white px-6 sm:px-10 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex flex-col leading-tight">
          <span className="text-slate-400 text-xs font-normal">Reading</span>
          <span className="font-bold text-base tracking-tight text-white mt-0.5">Part 1 – Gap Fill</span>
        </div>

        <button
          onClick={() => setShowExitConfirm(true)}
          className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
        >
          <span>[→</span>
          <span>Thoát</span>
        </button>
      </header>

      {/* 2. Main Workspace Body */}
      {examStep === 'start' && (
        /* STEP 1: START ASSESSMENT SCREEN (Top-Left Aligned Flush matching aptiskytich.vn 100%) */
        <main className="w-full px-6 sm:px-10 py-6 sm:py-8 flex-1">
          <div className="max-w-xl space-y-5">
            
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">
                Aptis General Practice Test
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Reading Practice Test
              </h1>
              <p className="text-slate-500 text-sm font-normal">
                {testTitle} - Reading Part 1
              </p>
            </div>

            {/* Stat Row */}
            <div className="flex items-center gap-14 py-2">
              <div>
                <div className="text-slate-400 text-xs font-medium mb-1">
                  Number of Questions
                </div>
                <div className="text-slate-900 text-base font-black">
                  6
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-xs font-medium mb-1">
                  Time Allowed
                </div>
                <div className="text-slate-900 text-base font-black">
                  6 min
                </div>
              </div>
            </div>

            {/* Start Assessment Button (rgb(36, 8, 90) -> #24085A) */}
            <div className="pt-2">
              <button
                onClick={() => setExamStep('instructions')}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white text-sm font-bold px-7 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Start Assessment</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {examStep === 'instructions' && (
        /* STEP 2: APTIS GENERAL READING INSTRUCTIONS SCREEN (Matching aptiskytich.vn 100% pixel-perfect) */
        <main className="w-full px-8 sm:px-14 py-8 sm:py-10 flex-1">
          <div className="max-w-3xl space-y-6">
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Aptis General Reading Instructions
            </h1>

            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold text-slate-900">
                Reading
              </h2>

              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                You have 6 minutes to complete this part.
              </p>

              <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
                When you click on the &apos;Next&apos; button, the test will begin.
              </p>
            </div>

          </div>
        </main>
      )}

      {examStep === 'questions' && (
        /* STEP 3: ACTUAL QUESTIONS EXAM WORKSPACE */
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
          
          {/* Top Sub-Header Row: Question Title & Timer */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reading</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                Question 1 of 5
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Bookmark Button */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{isBookmarked ? '🔖' : '📑'}</span>
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              {/* Timer Box */}
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs text-center min-w-[120px]">
                <div className="text-lg sm:text-xl font-black text-slate-900 tracking-wider">
                  {formatTime(timeLeftSeconds)}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider -mt-0.5">
                  Time remaining
                </div>
              </div>
            </div>
          </div>

          {/* Practice Questions Block Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            
            {/* Question Instructions */}
            <div className="bg-slate-50 border-l-4 border-[#CC1C01] p-4 rounded-r-xl">
              <p className="text-sm font-extrabold text-slate-900">
                Choose the word that fits in the gap. The first one is done for you.
              </p>
            </div>

            {/* Example Item */}
            <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60 text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
              I saw some shows in the{' '}
              <span className="inline-block bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-md mx-1 border border-slate-300 text-sm">
                window
              </span>{' '}
              of one store.
            </div>

            {/* 5 Dynamic Sentences */}
            <div className="space-y-4 pt-2">
              {testQuestionsData.map((q, idx) => {
                const selectedValue = userAnswers[idx] || '';
                const isCorrect = selectedValue === q.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/60 border-emerald-300/80'
                          : selectedValue
                          ? 'bg-red-50/60 border-red-300/80'
                          : 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed flex flex-wrap items-center gap-1.5">
                      <span>{idx + 1}.</span>
                      <span>{q.questionStart}</span>

                      {/* Inline Select Dropdown */}
                      <select
                        value={selectedValue}
                        disabled={isSubmitted}
                        onChange={(e) => handleSelectAnswer(idx, e.target.value)}
                        className={`mx-1 px-3 py-1.5 bg-white border rounded-lg text-sm sm:text-base font-bold shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 ${
                          isSubmitted
                            ? isCorrect
                              ? 'border-emerald-500 text-emerald-700 bg-emerald-100/50'
                              : selectedValue
                              ? 'border-red-500 text-red-700 bg-red-100/50'
                              : 'border-amber-400 text-amber-700'
                            : 'border-slate-300 text-slate-900 focus:border-[#CC1C01] focus:ring-[#CC1C01]/20 hover:border-slate-400'
                        }`}
                      >
                        <option value="">—</option>
                        {q.answerOptions.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <span>{q.questionEnd}</span>
                    </div>

                    {/* Submission Status Indicator */}
                    {isSubmitted && (
                      <div className="mt-2.5 flex items-center gap-2 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <span>✓</span>
                            <span>Chính xác</span>
                          </span>
                        ) : (
                          <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <span>✕</span>
                            <span>Chưa đúng (Đáp án đúng: <strong className="underline">{q.correctAnswer}</strong>)</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Row: Toggle Answers & Report Bug */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>👁</span>
                <span>{showExplanation ? 'Ẩn giải thích' : 'Hiện đáp án & giải thích'}</span>
              </button>

              <button
                onClick={() => alert('Đã ghi nhận báo lỗi cho bộ đề này. Cảm ơn bạn!')}
                className="px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🚩</span>
                <span>Báo lỗi</span>
              </button>
            </div>

          </div>

          {/* Explanation Section (Đáp án & Dịch nghĩa Drawer) */}
          {showExplanation && (
            <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>💡</span>
                  <span>Đáp án & dịch nghĩa ({testTitle})</span>
                </h3>

                <div className="bg-[#FFF2EE] text-[#CC1C01] text-xs font-extrabold px-3 py-1 rounded-full border border-orange-200">
                  Điểm số: {correctCount} / 5 câu
                </div>
              </div>

              <div className="space-y-4">
                {testQuestionsData.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorr = userAns === q.correctAnswer;
                  const sentenceTranslation =
                    translationsMap[testIndex.toString()]?.[idx] ||
                    `Dịch nghĩa gợi ý cho câu ${idx + 1}.`;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5 text-sm"
                    >
                      <div className="font-bold text-slate-900">
                        {idx + 1}. {q.questionStart}
                        <u className="text-[#CC1C01] px-1 font-extrabold">{q.correctAnswer}</u>
                        {q.questionEnd}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {userAns ? (
                          <span
                            className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 ${
                              isCorr
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            <span>{isCorr ? '✓' : '✕'} Bạn chọn:</span>
                            <span>{userAns}</span>
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-bold border border-amber-300">
                            Chưa trả lời
                          </span>
                        )}

                        {!isCorr && (
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold border border-emerald-300 flex items-center gap-1">
                            <span>✓ Đáp án đúng:</span>
                            <span>{q.correctAnswer}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 font-medium italic pt-1 border-t border-slate-200/60">
                        Dịch: {sentenceTranslation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      )}

      {/* 3. Bottom Sticky Controls Footer (Shown for Instructions and Questions) */}
      {examStep !== 'start' && (
        <footer className="bg-white border-t border-slate-200 px-6 sm:px-12 py-3.5 sticky bottom-0 z-30 flex items-center justify-between shadow-lg">
          
          {/* Left Side: Báo lỗi + 3 Helper Tool Icons (Spaced out on the left) */}
          <div className="flex items-center gap-10 sm:gap-14">
            {/* 1. Far Left: Báo lỗi button */}
            <button
              onClick={() => alert('Đã ghi nhận báo lỗi cho bài thi này. Cảm ơn bạn!')}
              className="px-4 py-2 rounded-full border border-[#24085A]/30 text-[#24085A] hover:bg-[#24085A]/10 text-[14px] font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#24085A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span>Báo lỗi</span>
            </button>

            {/* 2. 3 Helper Tool Icons (List, Info, Accessibility) - Left side, spaced away */}
            <div className="flex items-center gap-3">
              {/* List Icon */}
              <button className="w-10 h-10 rounded-full border border-[#24085A]/30 text-[#24085A] hover:bg-[#24085A]/10 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>

              {/* Info Icon */}
              <button className="w-10 h-10 rounded-full border border-[#24085A]/30 text-[#24085A] hover:bg-[#24085A]/10 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Accessibility Icon */}
              <button className="w-10 h-10 rounded-full border border-[#24085A]/30 text-[#24085A] hover:bg-[#24085A]/10 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side: Round [-> Button + Previous & Next Action Buttons */}
          <div className="flex items-center gap-3.5 pr-12 lg:pr-[16vw]">
            {/* Round Next Section / Review Icon Button [-> */}
            <button
              onClick={handleNextSectionIconClick}
              className="w-10 h-10 rounded-full border border-slate-300/90 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
              title={examStep === 'instructions' ? "Proceed to next section" : "Question Review"}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (examStep === 'instructions') setExamStep('start');
                else setShowExitConfirm(true);
              }}
              className="px-6 py-2.5 rounded-xl border border-slate-300/90 bg-white text-slate-800 font-bold text-[14px] hover:bg-slate-50 transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              ← Previous
            </button>

            {examStep === 'instructions' ? (
              <button
                onClick={() => setExamStep('questions')}
                className="px-8 py-2.5 rounded-xl bg-[#24085A] hover:bg-[#1a0642] text-white font-extrabold text-[14px] shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Next</span>
                <span className="text-base">→</span>
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={() => {
                  setIsSubmitted(true);
                  setShowExplanation(true);
                }}
                className="px-8 py-2.5 rounded-xl bg-[#CC1C01] hover:bg-[#b01801] text-white font-extrabold text-[14px] shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Nộp bài</span>
                <span className="text-base">→</span>
              </button>
            ) : (
              <button
                onClick={onExit}
                className="px-8 py-2.5 rounded-xl bg-[#24085A] hover:bg-[#1a0642] text-white font-extrabold text-[14px] shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Hoàn thành & Về danh sách</span>
                <span className="text-base">→</span>
              </button>
            )}
          </div>
        </footer>
      )}

      {/* 4. MODAL A: Exit Confirmation Modal (Matching aptiskytich.vn 100%) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900">
                Thoát bài thi?
              </h3>
              <p className="text-sm text-slate-500 font-normal">
                Bài làm của bạn sẽ không được lưu.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Ở lại
              </button>
              <button
                onClick={onExit}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL B: Proceed to Next Section Modal (Triggered by [-> in Instructions phase) */}
      {showProceedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Proceed to the next section?
              </h3>
              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                The current section is timed and will be locked if you proceed. Please ensure you have reviewed each of your responses.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowProceedModal(false)}
                className="bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setShowProceedModal(false);
                  setExamStep('questions');
                }}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL C: Question Review Modal (Triggered by [-> in Questions phase) */}
      {showQuestionReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left space-y-5 max-h-[90vh] flex flex-col justify-between">
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">
                Question Review
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Please review the following questions
              </p>
            </div>

            {/* Accordion Card for Part 1 Questions Overview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 overflow-y-auto flex-1 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <div>
                  <div className="font-bold text-sm text-slate-900">Part 1 – Gap Fill</div>
                  <div className="text-xs text-slate-400 font-medium">5 Questions</div>
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                  -
                </div>
              </div>

              {/* Questions Status List */}
              <div className="space-y-2 pt-1">
                {testQuestionsData.map((_, qIdx) => {
                  const hasAns = !!userAnswers[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className="bg-white p-3 rounded-xl border border-slate-200/70 flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {qIdx + 1 < 10 ? '0' + (qIdx + 1) : qIdx + 1}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400">Seen</div>
                      </div>

                      <div className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        hasAns
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {hasAns ? 'Answered' : 'Not Attempted'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setShowQuestionReviewModal(false)}
                className="w-full py-3 rounded-xl bg-[#24085A] hover:bg-[#1a0642] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Review Questions
              </button>

              <button
                onClick={() => {
                  setShowQuestionReviewModal(false);
                  setIsSubmitted(true);
                  setShowExplanation(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300/70 text-slate-800 font-bold text-sm transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
