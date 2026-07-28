'use client';

import React, { useState, useEffect, useMemo } from 'react';

export interface ExamPracticeLayoutProps {
  moduleName: string; // e.g. "Reading", "Listening", "Writing", "Speaking"
  partTitle: string; // e.g. "Part 1 – Gap Fill"
  getPartTitle?: (questionIndex: number) => string;
  testTitle: string; // e.g. "Đề 01"
  totalQuestions: number; // e.g. 5
  timeAllowedSeconds: number; // e.g. 360 (6 mins)
  maxScore?: number; // e.g. 10 (default totalQuestions * 2)
  instructionsText?: React.ReactNode;
  initialStep?: 'start' | 'instructions' | 'questions';
  unlimitedTime?: boolean;
  customScore?: number;
  customTotalSubQuestions?: number;
  getSubQuestionWeight?: (subIndex: number) => number;
  getCefrLevel?: (score: number, maxScore: number) => string;
  isFullExam?: boolean;
  isAnswerCorrect?: (questionIndex: number, answerValue: any) => boolean;
  onExit: () => void;

  // Custom question render prop
  renderQuestions: (props: {
    currentQuestionIndex: number;
    userAnswers: Record<number, any>;
    onAnswer: (questionIndex: number, value: any) => void;
    isReviewMode: boolean;
    showExplanation: boolean;
  }) => React.ReactNode;

  // Optional custom detailed answers render prop for Card 2 in Results Page
  renderDetailedAnswers?: (props: {
    userAnswers: Record<number, any>;
  }) => React.ReactNode;
}

export default function ExamPracticeLayout({
  moduleName = 'Reading',
  partTitle = 'Part 1 – Gap Fill',
  getPartTitle,
  testTitle = 'Đề 01',
  totalQuestions = 5,
  timeAllowedSeconds = 360,
  maxScore = 10,
  instructionsText,
  initialStep = 'start',
  unlimitedTime = false,
  customScore,
  customTotalSubQuestions,
  getSubQuestionWeight,
  getCefrLevel,
  isFullExam = false,
  isAnswerCorrect,
  onExit,
  renderQuestions,
  renderDetailedAnswers,
}: ExamPracticeLayoutProps) {
  // Steps: 'start' (Start Assessment) -> 'instructions' (Instructions) -> 'questions' (Actual Exam) -> 'results' (Results Screen)
  const [examStep, setExamStep] = useState<'start' | 'instructions' | 'questions' | 'results'>(initialStep);

  // States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [showQuestionReviewModal, setShowQuestionReviewModal] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showMarathonTocDrawer, setShowMarathonTocDrawer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasExamStarted, setHasExamStarted] = useState(initialStep === 'questions');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(timeAllowedSeconds);

  const activePartTitle = useMemo(() => {
    if (examStep === 'start' || examStep === 'instructions') {
      return partTitle;
    }
    return getPartTitle ? getPartTitle(currentQuestionIndex) : partTitle;
  }, [examStep, partTitle, getPartTitle, currentQuestionIndex]);
  const displayTotalSubCount = customTotalSubQuestions !== undefined ? customTotalSubQuestions : totalQuestions;
  const subPerPart = totalQuestions > 0 ? Math.max(1, Math.round(displayTotalSubCount / totalQuestions)) : 1;

  const reviewGroups = useMemo(() => {
    if (customTotalSubQuestions === 29 && totalQuestions === 5) {
      return [
        { title: 'Part 1 – Gap Fill', startIndex: 0, count: 5, targetPartIndex: 0 },
        { title: 'Part 2 – Text cohesion', startIndex: 5, count: 5, targetPartIndex: 1 },
        { title: 'Part 3 – Text cohesion', startIndex: 10, count: 5, targetPartIndex: 2 },
        { title: 'Part 4 – Opinion matching', startIndex: 15, count: 7, targetPartIndex: 3 },
        { title: 'Part 5 – Long reading', startIndex: 22, count: 7, targetPartIndex: 4 },
      ];
    }
    if (customTotalSubQuestions === 25 && totalQuestions === 17) {
      return [
        { title: 'Part 1 – Word recognition', startIndex: 0, count: 13, targetPartIndex: 0 },
        { title: 'Part 2 – Matching information', startIndex: 13, count: 4, targetPartIndex: 13 },
        { title: 'Part 3 – Short conversations', startIndex: 17, count: 4, targetPartIndex: 14 },
        { title: 'Part 4 – Monologues', startIndex: 21, count: 4, targetPartIndex: 15 },
      ];
    }
    return [
      { title: activePartTitle, startIndex: 0, count: displayTotalSubCount, targetPartIndex: 0 },
    ];
  }, [customTotalSubQuestions, totalQuestions, activePartTitle, displayTotalSubCount]);

  const getPartIndexForSubQuestion = (subIdx: number): number => {
    if (customTotalSubQuestions === 29 && totalQuestions === 5) {
      if (subIdx <= 4) return 0;
      if (subIdx <= 9) return 1;
      if (subIdx <= 14) return 2;
      if (subIdx <= 21) return 3;
      return 4;
    }
    if (customTotalSubQuestions === 25 && totalQuestions === 17) {
      if (subIdx <= 12) return subIdx;
      if (subIdx <= 16) return 13;
      if (subIdx <= 20) return 14;
      if (subIdx <= 22) return 15;
      return 16;
    }
    if (totalQuestions > 1) {
      return Math.min(totalQuestions - 1, Math.floor(subIdx / subPerPart));
    }
    return 0;
  };

  // Set hasExamStarted to true when entering 'questions' step for the first time
  useEffect(() => {
    if (examStep === 'questions' && !hasExamStarted) {
      setHasExamStarted(true);
    }
  }, [examStep, hasExamStarted]);

  // Reset showExplanation to false whenever switching to another question/part during active test (not in review mode)
  useEffect(() => {
    if (!reviewMode) {
      setShowExplanation(false);
    }
  }, [currentQuestionIndex, reviewMode]);

  // Timer countdown - starts when hasExamStarted is true and continues continuously
  useEffect(() => {
    if (!hasExamStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasExamStarted, isSubmitted]);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Handle Answer Selection
  const handleAnswer = (index: number, value: any) => {
    if (reviewMode) return;
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Handle click on round [-> icon button in footer
  const handleNextSectionIconClick = () => {
    if (examStep === 'instructions' || examStep === 'start') {
      setShowProceedModal(true);
    } else if (examStep === 'questions') {
      setShowQuestionReviewModal(true);
    }
  };

  // Handle Submit Exam -> Transitions to 'results' page
  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowQuestionReviewModal(false);
    setShowProceedModal(false);
    setExamStep('results');
  };

  // Handle Reset / Retake Test
  const handleRetakeExam = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setReviewMode(false);
    setShowExplanation(false);
    setTimeLeftSeconds(timeAllowedSeconds);
    setCurrentQuestionIndex(0);

    if (totalQuestions > 1) {
      // Full Part Test: return to 'start' screen
      setHasExamStarted(false);
      setExamStep('start');
    } else {
      // Single Part Practice: return directly to 'questions'
      setHasExamStarted(true);
      setExamStep('questions');
    }
  };

  // Calculate answered count
  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[Number(k)] !== undefined && userAnswers[Number(k)] !== ''
  ).length;

  const pointsPerSubQuestion = maxScore / displayTotalSubCount;

  // Calculate correct answers count if isAnswerCorrect callback is provided
  const correctSubQuestionsCount = isAnswerCorrect
    ? Object.keys(userAnswers).filter((k) => {
        const idx = Number(k);
        const val = userAnswers[idx];
        return val !== undefined && val !== '' && isAnswerCorrect(idx, val);
      }).length
    : answeredCount;

  const calculatedScore = useMemo(() => {
    if (customScore !== undefined) return customScore;
    if (!isAnswerCorrect) return Math.round(correctSubQuestionsCount * pointsPerSubQuestion);

    let rawTotal = 0;
    Object.keys(userAnswers).forEach((k) => {
      const idx = Number(k);
      const val = userAnswers[idx];
      if (val !== undefined && val !== '' && isAnswerCorrect(idx, val)) {
        const weight = getSubQuestionWeight ? getSubQuestionWeight(idx) : pointsPerSubQuestion;
        rawTotal += weight;
      }
    });

    return Math.round(rawTotal);
  }, [customScore, isAnswerCorrect, userAnswers, getSubQuestionWeight, pointsPerSubQuestion, correctSubQuestionsCount]);

  // Compute CEFR Level (ONLY rendered if getCefrLevel prop is explicitly provided by the skill component)
  const cefrLevel = useMemo(() => {
    if (getCefrLevel) return getCefrLevel(calculatedScore, maxScore);
    return null;
  }, [getCefrLevel, calculatedScore, maxScore]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F4F4F6] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#CC1C01] selection:text-white">
      
      {/* 1. Top Header Bar (Dark Purple Header rgb(36, 8, 90) - Compact Height & Size 14 Buttons) */}
      <header className="bg-[#24085A] text-white px-6 sm:px-10 py-2 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex flex-col leading-tight">
          <span className="text-slate-400 text-xs font-normal">{moduleName}</span>
          <span className="font-bold text-sm sm:text-base tracking-tight text-white mt-0.5">{activePartTitle}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Header Back to Results Button if reviewing detailed questions */}
          {examStep !== 'results' && reviewMode && (
            <button
              onClick={() => setExamStep('results')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border border-white/15 active:scale-95 shadow-2xs"
            >
              <span>←</span>
              <span>Quay lại kết quả</span>
            </button>
          )}

          <button
            onClick={() => setShowExitConfirm(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border border-white/15 active:scale-95 shadow-2xs"
          >
            <span>[→</span>
            <span>Thoát</span>
          </button>
        </div>
      </header>

      {/* Top Right Timer Box (Visibly active across all screens once test has started) */}
      {!unlimitedTime && hasExamStarted && examStep !== 'results' && (
        <div className="absolute right-6 sm:right-10 top-20 text-center min-w-[120px] z-20 animate-in fade-in duration-300">
          <div className="text-2xl font-black text-slate-900 tracking-wider">
            {formatTime(timeLeftSeconds)}
          </div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider -mt-0.5">
            Time remaining
          </div>
          <div className="h-1 bg-slate-200/80 rounded-full mt-1.5 w-full overflow-hidden">
            <div
              className="h-full bg-[#24085A] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, (timeLeftSeconds / timeAllowedSeconds) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. Main Workspace Body */}
      {examStep === 'start' && (
        /* STEP 1: START ASSESSMENT SCREEN */
        <main className="w-full px-6 sm:px-10 py-6 sm:py-8 flex-1">
          <div className="max-w-xl space-y-5">
            
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">
                Aptis General Practice Test
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {moduleName} Practice Test
              </h1>
              <p className="text-slate-500 text-sm font-normal">
                {testTitle}
              </p>
            </div>

            {/* Stat Row */}
            <div className="flex items-center gap-14 py-2">
              <div>
                <div className="text-slate-400 text-xs font-medium mb-1">
                  Number of Questions
                </div>
                <div className="text-slate-900 text-base font-black">
                  {totalQuestions}
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-xs font-medium mb-1">
                  Time Allowed
                </div>
                <div className="text-slate-900 text-base font-black">
                  {Math.ceil(timeAllowedSeconds / 60)} min
                </div>
              </div>
            </div>

            {/* Start Assessment Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (hasExamStarted) {
                    setExamStep('questions');
                  } else {
                    setExamStep('instructions');
                  }
                }}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white text-sm font-bold px-7 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <span>{hasExamStarted ? 'Resume Test' : 'Start Assessment'}</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {examStep === 'instructions' && (
        /* STEP 2: INSTRUCTIONS SCREEN */
        <main className="w-full px-8 sm:px-14 py-8 sm:py-10 flex-1">
          <div className="max-w-3xl space-y-6">
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Aptis General {moduleName} Instructions
            </h1>

            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold text-slate-900">
                {moduleName}
              </h2>

              {instructionsText || (
                <>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    You have {Math.ceil(timeAllowedSeconds / 60)} minutes to complete this part.
                  </p>

                  <p className="text-sm font-medium text-slate-700 leading-relaxed pt-2">
                    When you click on the &apos;Next&apos; button, the test will begin.
                  </p>
                </>
              )}
            </div>

          </div>
        </main>
      )}

      {examStep === 'questions' && (
        /* STEP 3: ACTUAL QUESTIONS EXAM WORKSPACE */
        <main className="w-full px-6 sm:px-10 py-6 flex-1 relative">
          
          {/* Centered Main Content Area (max-w-3xl mx-auto) */}
          <div className="max-w-3xl mx-auto space-y-6 pt-2">
            
            {/* Top Subheader: Question Counter (Left) & Bookmark Button (Right) */}
            <div className="flex items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
              <div className="text-left">
                <span className="text-xs font-normal text-slate-500 block">{moduleName}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </h1>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`px-4 py-2 rounded-lg border text-[#24085A] text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${isBookmarked ? 'text-amber-600 fill-amber-500' : 'text-slate-600'}`}
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Bookmark</span>
              </button>
            </div>

            {/* Custom Question Content Injected Here */}
            <div key={currentQuestionIndex} className="animate-slide-question">
              {renderQuestions({
                currentQuestionIndex,
                userAnswers,
                onAnswer: handleAnswer,
                isReviewMode: reviewMode,
                showExplanation,
              })}
            </div>
          </div>

          {/* Left Floating "Hiện đáp án" Button (Hidden during review mode) */}
          {!reviewMode && (
            <div className="fixed bottom-24 left-6 z-40">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="bg-white border border-slate-300/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{showExplanation ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
              </button>
            </div>
          )}

          {/* Right Floating "Mục lục" Button for Marathon Mode */}
          {unlimitedTime && (
            <div className="fixed bottom-24 right-6 z-40">
              <button
                onClick={() => setShowMarathonTocDrawer(true)}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/20"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>Mục lục</span>
              </button>
            </div>
          )}

        </main>
      )}

      {/* STEP 4: DEDICATED RESULTS PAGE SCREEN */}
      {examStep === 'results' && (
        <main className="max-w-3xl w-full mx-auto px-6 py-8 flex-1 space-y-6">
          <style>{`
            @keyframes resultPageFadeUp {
              0% {
                opacity: 0;
                transform: translateY(32px) scale(0.97);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .animate-result-appear {
              animation: resultPageFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          {/* Main Results View */}
          <div className="space-y-6">
            
            {/* Card 1: Kết quả Reading Summary Card (Hover Lift-up buttons + Fade-in animation) */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 text-center space-y-6 border border-slate-200/70 shadow-sm animate-result-appear">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Kết quả {moduleName}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {testTitle}
                </p>
              </div>

              {/* Score Grid (3 columns: Total Score | CEFR Level | Correct Questions) */}
              <div className="flex items-center justify-center gap-8 sm:gap-14 py-2">
                {/* Total Score */}
                <div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-black text-[#CC1C01]">
                      {calculatedScore}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-400 ml-0.5">
                      /{maxScore}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Điểm
                  </div>
                </div>

                {/* CEFR Level Column (Trình độ) */}
                {cefrLevel && (
                  <div>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl sm:text-5xl font-black text-[#24085A]">
                        {cefrLevel}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      Trình độ
                    </div>
                  </div>
                )}

                {/* Correct Questions Count */}
                <div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900">
                      {correctSubQuestionsCount}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-400 ml-0.5">
                      /{displayTotalSubCount}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Số câu đúng
                  </div>
                </div>
              </div>

              {/* Action Buttons Row with Hover Lift-up Effect */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onExit}
                  className="px-5 py-2.5 rounded-xl border border-[#CC1C01] text-[#CC1C01] font-bold text-sm bg-white hover:bg-orange-50 hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-[#CC1C01]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  <span>Quay lại</span>
                </button>

                <button
                  onClick={() => {
                    setReviewMode(true);
                    setShowExplanation(true);
                    setCurrentQuestionIndex(0);
                    setExamStep('questions');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-200/80 text-slate-800 font-bold text-sm hover:bg-slate-300/90 hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Xem lại từng câu</span>
                  <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  onClick={handleRetakeExam}
                  className="px-5 py-2.5 rounded-xl bg-[#CC1C01] hover:bg-[#b01801] text-white font-extrabold text-sm shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Làm lại</span>
                </button>
              </div>
            </div>

            {/* Card 2: Chi tiết bài làm Card (Static) */}
            {renderDetailedAnswers && renderDetailedAnswers({ userAnswers })}
          </div>

        </main>
      )}

      {/* 3. Bottom Sticky Controls Footer */}
      {(examStep === 'instructions' || examStep === 'questions' || (examStep === 'start' && hasExamStarted)) && (
        <footer className="bg-white border-t border-slate-200 px-6 sm:px-12 py-3.5 sticky bottom-0 z-30 flex items-center justify-between shadow-lg">
          
          {/* Left Side: 3 Helper Tool Icons */}
          <div className="flex items-center gap-3 pl-8">
            <button className="w-10 h-10 rounded-full border border-slate-300/80 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>

            <button className="w-10 h-10 rounded-full border border-slate-300/80 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button className="w-10 h-10 rounded-full border border-slate-300/80 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Right Side: Round [-> Button + Previous & Next Action Buttons */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={handleNextSectionIconClick}
              className="w-10 h-10 rounded-full border border-slate-300/90 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
              title={examStep === 'questions' ? "Question Review" : "Proceed to next section"}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

            {/* Previous Button: Visible in questions step even at question 1 (currentQuestionIndex >= 0), HIDDEN in instructions step to prevent exiting */}
            {examStep === 'questions' && (
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex((prev) => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    // Going back from Question 1 (index 0) returns to the Instructions screen
                    setExamStep('instructions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-300/90 bg-white text-slate-800 font-bold text-[14px] hover:bg-slate-50 transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                ← Previous
              </button>
            )}

            <button
              onClick={() => {
                if (examStep === 'start') {
                  setExamStep('instructions');
                } else if (examStep === 'instructions') {
                  setExamStep('questions');
                } else if (examStep === 'questions') {
                  if (currentQuestionIndex < totalQuestions - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleSubmitExam();
                  }
                }
              }}
              className="px-8 py-2.5 rounded-xl bg-[#24085A] hover:bg-[#1a0642] text-white font-extrabold text-[14px] shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Next</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </footer>
      )}

      {/* 4. MODAL A: Exit Confirmation Modal */}
      {showExitConfirm && (
        <div
          onClick={() => setShowExitConfirm(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4 cursor-default"
          >
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

      {/* 5. MODAL B: Proceed to Next Section Modal */}
      {showProceedModal && (
        <div
          onClick={() => setShowProceedModal(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4 cursor-default"
          >
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

      {/* 6. MODAL C: Question Review Modal */}
      {showQuestionReviewModal && (
        <div
          onClick={() => setShowQuestionReviewModal(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left space-y-5 max-h-[90vh] flex flex-col justify-between cursor-default"
          >
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">
                Question Review
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Please review the following questions
              </p>
            </div>

            {/* Grouped Accordion Cards for Questions Overview */}
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {reviewGroups.map((group: { title: string; startIndex: number; count: number; targetPartIndex: number }, gIdx: number) => (
                <div key={gIdx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{group.title}</div>
                      <div className="text-xs text-slate-400 font-medium">{group.count} Questions</div>
                    </div>
                    <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      -
                    </div>
                  </div>

                  {/* Questions Status List for this Part */}
                  <div className="space-y-2 pt-1">
                    {Array.from({ length: group.count }).map((_, offset) => {
                      const subIdx = group.startIndex + offset;
                      const hasAns = userAnswers[subIdx] !== undefined && userAnswers[subIdx] !== '';

                      return (
                        <div
                          key={subIdx}
                          onClick={() => {
                            const targetIndex = getPartIndexForSubQuestion(subIdx);
                            setCurrentQuestionIndex(targetIndex);
                            setShowQuestionReviewModal(false);
                          }}
                          className="bg-white p-3 rounded-xl border border-slate-200/70 flex items-center justify-between shadow-2xs hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          <div>
                            <div className="font-bold text-sm text-slate-900">
                              {subIdx + 1 < 10 ? '0' + (subIdx + 1) : subIdx + 1}
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
              ))}
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
                  setShowSubmitConfirmModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-300/70 text-slate-800 font-bold text-sm transition-all cursor-pointer"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6b. MODAL: Submit Test Confirmation Modal */}
      {showSubmitConfirmModal && (
        <div
          onClick={() => setShowSubmitConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left space-y-4 cursor-default"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                Submit Test?
              </h3>
              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                Once you submit your test you will no longer have access to the questions.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirmModal(false);
                  handleSubmitExam();
                }}
                className="bg-[#24085A] hover:bg-[#1a0642] text-white font-semibold text-sm px-6 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL D: Marathon Table of Contents Drawer */}
      {showMarathonTocDrawer && (
        <div
          onClick={() => setShowMarathonTocDrawer(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F8F9FA] w-full max-w-[300px] sm:max-w-[340px] h-full shadow-2xl border-l border-slate-200/80 p-5 flex flex-col justify-between cursor-default animate-in slide-in-from-right duration-300 text-left"
          >
            {/* Top Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Mục lục marathon
                </h3>
                <button
                  onClick={() => setShowMarathonTocDrawer(false)}
                  className="w-7 h-7 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-600 text-xs flex items-center justify-center font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Progress Line */}
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span>
                  Đã làm{' '}
                  {
                    Array.from({ length: totalQuestions }).filter((_, qIdx) => {
                      return Array.from({ length: subPerPart }).every(
                        (_, g) => userAnswers[qIdx * subPerPart + g] !== undefined && userAnswers[qIdx * subPerPart + g] !== ''
                      );
                    }).length
                  }
                  /{totalQuestions}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[#24085A] font-bold">
                  Đề {currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>

              {/* Legend Row */}
              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 border border-slate-400/60 inline-block"></span>
                  <span>đã làm</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-100 border border-blue-400 inline-block"></span>
                  <span>đang làm dở</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200 inline-block"></span>
                  <span>chưa làm</span>
                </div>
              </div>

              {/* Test Sets Grid (Chips 1 to totalQuestions - 7 cols) */}
              <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 max-h-[65vh] overflow-y-auto p-1 pt-2">
                {Array.from({ length: totalQuestions }).map((_, qIdx) => {
                  const isCurrent = qIdx === currentQuestionIndex;
                  const answeredGapsCount = Array.from({ length: subPerPart }).filter(
                    (_, g) => userAnswers[qIdx * subPerPart + g] !== undefined && userAnswers[qIdx * subPerPart + g] !== ''
                  ).length;
                  const isCompleted = answeredGapsCount === subPerPart;
                  const isInProgress = answeredGapsCount > 0 && answeredGapsCount < subPerPart;

                  return (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setCurrentQuestionIndex(qIdx);
                        setShowMarathonTocDrawer(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`h-8 sm:h-8.5 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-white text-[#24085A] border-2 border-blue-600 ring-2 ring-[#24085A] ring-inset shadow-xs font-black'
                          : isCompleted
                          ? 'bg-slate-300 text-slate-800 border border-slate-400/60 hover:bg-slate-400/80'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-900 border border-blue-400 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-200/60">
              <button
                onClick={() => setShowMarathonTocDrawer(false)}
                className="w-full py-2.5 rounded-xl bg-[#24085A] hover:bg-[#1a0642] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Đóng mục lục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
