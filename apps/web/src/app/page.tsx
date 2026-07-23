'use client';

import React, { useState, useEffect, useRef } from 'react';

// Unified types for Scraped Data
interface Question1Item {
  heading: string;
  audioUrl?: string;
  question?: string;
  options: string[];
  correctAnswer?: string;
  transcript?: string;
}

interface Question14Item {
  audioUrl: string;
  topic: string;
  options: string[];
  transcript: string;
  correctAnswers?: string[];
}

interface Question15Item {
  audioUrl: string;
  topic: string;
  transcript: string;
}

interface Question16_17Item {
  audioUrl: string;
  topic: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer?: string;
  }[];
  transcript: string;
}

interface AppData {
  scrapedAt: string;
  source: string;
  reading: {
    question1: {
      questionStart: string;
      answerOptions: string[];
      questionEnd: string;
      correctAnswer: string;
    }[][];
    question2: {
      questionSets: {
        paragraph: string;
        questions: { questionText: string; answer: string }[];
      }[];
    };
    question4: {
      question4Content: string[][];
    };
    question5: {
      options: string[][];
      paragraph_question5: string[][];
      meohoc: string[];
      topic_name: string[];
    };
  };
  reading_tips: {
    id: number;
    options: string[];
    keyword: string;
    meo: string;
  }[];
  reading_tests: Record<string, any>;
  listening: {
    listening_question1_13: Question1Item[];
    listening_question14: Question14Item[];
    listening_question15: Question15Item[];
    listening_question16_17: Question16_17Item[];
  };
  listening_tips: {
    method1: {
      tt: number;
      topic_en: string;
      topic_vi: string;
      voices: { voice: string; key: string; note: string }[];
    }[];
    method2: {
      topic: string;
      correctanswer: string;
      key: string;
      imgurl: string;
    }[];
  };
  listening_tests: Record<string, {
    q1_13: Question1Item[];
    q14: Question14Item;
    q15: Question15Item;
    q16_17: Question16_17Item[];
  }>;
  speaking: {
    part1_practice: { questions: string[] }[];
    part2_practice: { imgurl: string; questions: string[] }[];
    part3_practice: { imgurl1: string; imgurl2: string; questions: string[] }[];
    part4_practice: { questions: string[] }[];
  };
  speaking_tips: {
    urlpic1: string;
    question1: string;
    question1_answer: string;
    question2: string;
    question2_answer: string;
    question3: string;
    question3_answer: string;
  }[];
  writing: Record<string, {
    club_name: string;
    part1_questions: string[];
    part1_answers: string[];
    part2_question: string;
    part2_answer: string;
    part3_questions: string[];
    part3_answers: string[];
    part4_friend_question: string;
    part4_friend_answer: string;
    part4_manager_question: string;
    part4_manager_answer: string;
  }>;
  writing_tips: {
    forms: {
      friend_template: string;
      manager_template: string;
      vocab_titles: string[];
      opinion_words: { positive: string[]; negative: string[] };
    };
    example: {
      topic: string;
      friend_example: string;
      manager_example: string;
    };
  };
  grammar: Record<string, {
    keyid: string;
    question1_list?: {
      question_ask: string;
      question_answer: string[];
    }[];
    question2_list?: {
      question_orginal: string;
      question_answer: string[];
      correct_answer: string;
    }[];
    question3_list?: {
      question_orginal: string;
      question_answer: string[];
      correct_answer: string;
    }[];
    question4_list?: {
      question_start: string;
      question_answer: string[];
      question_end: string;
      correct_answer: string;
    }[];
    question5_list?: {
      question_orginal: string;
      question_answer: string[];
      correct_answer: string;
    }[];
    question6_list?: {
      question_orginal: string;
      question_answer: string[];
      correct_answer: string;
    }[];
  }>;
}

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reading' | 'listening' | 'speaking' | 'writing' | 'grammar'>('dashboard');
  const [subView, setSubView] = useState<'practice' | 'tests' | 'tips'>('practice');
  const [sidebarOpen, setSidebarOpen] = useState({
    reading: true,
    listening: true,
    writing: true,
    speaking: true
  });

  // Load state for currently selected item to practice
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [selectedSubPart, setSelectedSubPart] = useState<string>('part1');

  // User interaction states
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [checked, setChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Audio player global state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioRate, setAudioRate] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/scraped_data.json')
      .then(res => res.json())
      .then((jsonData: AppData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading scraped data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Reset answers when changing exercises
    setAnswers({});
    setChecked(false);
    setShowExplanation({});
    setAudioUrl(null);
  }, [activeTab, subView, selectedItemIndex, selectedSubPart]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      audioRef.current.playbackRate = audioRate;
    }
  }, [audioUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-sans">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-medium">Đang tải dữ liệu học tập...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-red-600 font-sans">
        <p className="text-xl font-bold">Không thể tải dữ liệu!</p>
        <p className="text-slate-500 mt-2">Vui lòng đảm bảo tệp scraped_data.json có trong thư mục public.</p>
      </div>
    );
  }

  const getAudioFullUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\.\//, '').replace(/^\//, '');
    return `https://aptiskey.com/${cleanPath}`;
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^\.\//, '').replace(/^\//, '');
    return `https://aptiskey.com/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#343a40] text-slate-200 flex flex-col flex-shrink-0 z-20 border-r border-[#2b3035]">
        <div className="p-5 border-b border-[#495057] flex items-center gap-3 bg-[#2d3238]">
          <div className="w-8 h-8 rounded-full border border-slate-400 bg-slate-600 flex items-center justify-center font-bold text-white shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-white tracking-wide">Aptis keys</h1>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto bg-[#343a40]">
          {/* Trang chủ / Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#495057] text-white'
                : 'text-slate-300 hover:text-white hover:bg-[#495057]/60'
            }`}
          >
            <span className="text-sm">⚙️</span> Trang chủ
          </button>

          {/* Học Reading */}
          <div>
            <button
              onClick={() => setSidebarOpen({ ...sidebarOpen, reading: !sidebarOpen.reading })}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#495057]/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📖</span> Học reading
              </div>
              <span className={`text-[10px] text-slate-400 transform transition-transform ${sidebarOpen.reading ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {sidebarOpen.reading && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                <button
                  onClick={() => { setActiveTab('reading'); setSubView('practice'); setSelectedSubPart('part1'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'reading' && subView === 'practice' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học theo câu hỏi
                </button>
                <button
                  onClick={() => { setActiveTab('reading'); setSubView('tests'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'reading' && subView === 'tests' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học theo bộ đề
                </button>
                <button
                  onClick={() => { setActiveTab('reading'); setSubView('tips'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'reading' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Mẹo học nhanh
                </button>
              </div>
            )}
          </div>

          {/* Học Listening */}
          <div>
            <button
              onClick={() => setSidebarOpen({ ...sidebarOpen, listening: !sidebarOpen.listening })}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#495057]/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎧</span> Học Listening
                <span className="px-1.5 py-0.2 rounded bg-slate-700 text-[9px] font-bold text-slate-300">3</span>
              </div>
              <span className={`text-[10px] text-slate-400 transform transition-transform ${sidebarOpen.listening ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {sidebarOpen.listening && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                <button
                  onClick={() => { setActiveTab('listening'); setSubView('practice'); setSelectedSubPart('part1'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'listening' && subView === 'practice' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học theo câu hỏi
                </button>
                <button
                  onClick={() => { setActiveTab('listening'); setSubView('tests'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'listening' && subView === 'tests' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học theo bộ đề
                </button>
                <button
                  onClick={() => { setActiveTab('listening'); setSubView('tips'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'listening' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Mẹo nhớ
                </button>
              </div>
            )}
          </div>

          {/* Học Writing */}
          <div>
            <button
              onClick={() => setSidebarOpen({ ...sidebarOpen, writing: !sidebarOpen.writing })}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#495057]/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">✍️</span> Học Writing
              </div>
              <span className={`text-[10px] text-slate-400 transform transition-transform ${sidebarOpen.writing ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {sidebarOpen.writing && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                <button
                  onClick={() => { setActiveTab('writing'); setSubView('practice'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'writing' && subView === 'practice' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học câu lạc bộ
                </button>
                <button
                  onClick={() => { setActiveTab('writing'); setSubView('tips'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'writing' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Mẹo viết thư
                </button>
              </div>
            )}
          </div>

          {/* Học Speaking */}
          <div>
            <button
              onClick={() => setSidebarOpen({ ...sidebarOpen, speaking: !sidebarOpen.speaking })}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#495057]/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🗣️</span> Học speaking
              </div>
              <span className={`text-[10px] text-slate-400 transform transition-transform ${sidebarOpen.speaking ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {sidebarOpen.speaking && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                <button
                  onClick={() => { setActiveTab('speaking'); setSubView('practice'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'speaking' && subView === 'practice' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Học theo câu hỏi
                </button>
                <button
                  onClick={() => { setActiveTab('speaking'); setSubView('tips'); setSelectedItemIndex(0); }}
                  className={`w-full text-left px-3 py-2 rounded text-2xs transition-all ${activeTab === 'speaking' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                >
                  • Mẹo học nhanh
                </button>
              </div>
            )}
          </div>

          {/* Học Grammar */}
          <button
            onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold transition-all ${
              activeTab === 'grammar'
                ? 'bg-[#495057] text-white'
                : 'text-slate-300 hover:text-white hover:bg-[#495057]/60'
            }`}
          >
            <span className="text-sm">✏️</span> Học ngữ pháp
          </button>
        </nav>

        <div className="p-4 border-t border-[#495057] text-center bg-[#2d3238]">
          <p className="text-[10px] text-slate-400 font-medium font-mono">Bản cập nhật 07/2026</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#f3f4f6] flex flex-col overflow-hidden relative text-slate-800">

        {/* Global Audio Controller bar if audio is active */}
        {audioUrl && (
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-indigo-400">🔊</span>
              <audio
                ref={audioRef}
                src={getAudioFullUrl(audioUrl)}
                controls
                autoPlay
                className="h-9 w-64 max-w-sm rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Tốc độ phát:</span>
              <div className="flex gap-1">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setAudioRate(rate);
                      if (audioRef.current) audioRef.current.playbackRate = rate;
                    }}
                    className={`px-2 py-1 rounded text-2xs font-bold border transition-all ${
                      audioRate === rate
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-205'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab view handler */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full space-y-8 bg-[#f3f4f6]">
            {/* Green Banner */}
            <div className="bg-[#0B4C35] text-white p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3 z-10">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  🌲 Aptis Keys (Green Aptis)
                </h2>
                <p className="text-sm text-slate-200 max-w-2xl font-light">
                  Khóa học Aptis online cùng giáo viên đồng hành, lộ trình rõ ràng theo mục tiêu B1/B2. Nhấn để xem chi tiết khóa học!
                </p>
              </div>
              <a
                href="https://aptiskey.com"
                target="_blank"
                rel="noopener noreferrer"
                className="z-10 bg-white text-[#0B4C35] px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                Xem khóa học <span>↗</span>
              </a>
            </div>

            {/* Grid of categories matching reference image */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Column 1: Reading */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Reading</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('practice'); setSelectedSubPart('part1'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    ❓ Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📖 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 2: Listening */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Listening</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('practice'); setSelectedSubPart('part1'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    ❓ Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0dcaf0] text-slate-900 hover:bg-[#31d2f2] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📖 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#6c757d] text-white hover:bg-[#5c636a] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 3: Speaking */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Speaking</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    🎧 Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 4: Writing */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Writing</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📝 Học câu lạc bộ
                  </button>
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    ❓ Mẹo viết thư
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row of categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
              {/* Column 1: Grammar */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Học ngữ pháp (Grammar)</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📕 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    💡 Lưu ý về ngữ pháp
                  </button>
                </div>
              </div>

              {/* Column 2: Nhóm và trang */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Nhóm và trang</h3>
                <div className="space-y-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs text-center"
                  >
                    👥 Nhóm học Facebook
                  </a>
                  <a
                    href="https://aptiskey.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs text-center"
                  >
                    📝 Trang thi mẫu Aptis
                  </a>
                </div>
              </div>

              {/* Column 3: Khác */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Khác</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Cảm ơn bạn! Học tập cá nhân không cần donate.')}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    ❤️ Donate cho web
                  </button>
                  <button
                    onClick={() => alert('Hướng dẫn học: Làm lần lượt các bài tập theo chủ đề ở menu bên trái!')}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📖 Hướng dẫn học
                  </button>
                </div>
              </div>

              {/* Column 4: Theo dõi tin cập nhật */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Theo dõi tin cập nhật aptis</h3>
                <div className="space-y-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs text-center"
                  >
                    👥 Theo dõi fanpage
                  </a>
                  <button
                    onClick={() => alert('Cách tính điểm: Mỗi kỹ năng tính điểm thang 50, điểm quy đổi theo chuẩn Aptis ESOL.')}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    🧮 Cách tính điểm Aptis
                  </button>
                </div>
              </div>
            </div>

            {/* Third Row of categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
              {/* Column 1: Review đề thi */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Review đề thi</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Review đề thi được cập nhật thường xuyên trên trang chủ!')}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    📕 Review đề thi mỗi ngày
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* READING PRACTICE / MOCK / TIPS */}
        {activeTab === 'reading' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab controls */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                {(['practice', 'tests', 'tips'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => { setSubView(view); setSelectedItemIndex(0); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      subView === view
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {view === 'practice' && 'Luyện tập câu hỏi'}
                    {view === 'tests' && 'Bộ đề đọc (14 bộ)'}
                    {view === 'tips' && 'Mẹo nhớ nhanh Q5'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Practice mode sidebar selector */}
              {subView === 'practice' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0">
                  <div className="p-4 space-y-1 border-b border-slate-900">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn phần học</span>
                    {['part1', 'part2', 'part4', 'part5'].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSelectedSubPart(p); setSelectedItemIndex(0); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold capitalize ${
                          selectedSubPart === p ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/60'
                        }`}
                      >
                        {p === 'part1' && 'Part 1: Điền khuyết'}
                        {p === 'part2' && 'Part 2: Đọc hiểu ý kiến'}
                        {p === 'part4' && 'Part 4: Sắp xếp đoạn'}
                        {p === 'part5' && 'Part 5: Điền từ nâng cao'}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Danh sách bài tập</span>
                    {selectedSubPart === 'part1' && data.reading.question1.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part2' && data.reading.question2.questionSets.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part4' && data.reading.question4.question4Content.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part5' && data.reading.question5.options.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        {data.reading.question5.topic_name[idx] || `Bài tập ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Test mode sidebar selector */}
              {subView === 'tests' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn bộ đề đọc</span>
                  {Object.keys(data.reading_tests).map((testKey, idx) => (
                    <button
                      key={testKey}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      {data.reading_tests[testKey].label || `Bộ đề Đọc #${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Reading Tips list selector */}
              {subView === 'tips' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn mẹo nhớ nhanh</span>
                  {data.reading_tips.map((tip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      Chủ đề {tip.id}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Content Workspace for Reading */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {subView === 'practice' && selectedSubPart === 'part1' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-bold text-slate-200">
                        Part 1: Điền khuyết câu ngắn - Bài {selectedItemIndex + 1}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium">Nhiệm vụ: Chọn từ thích hợp nhất điền vào chỗ trống để hoàn thành mỗi câu dưới đây.</p>
                      
                      <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-900">
                        {(data.reading.question1[selectedItemIndex] as any[]).map((q, qIdx) => {
                          const qKey = `p1_${selectedItemIndex}_${qIdx}`;
                          const isCorrect = answers[qKey] === q.correctAnswer;
                          return (
                            <div key={qIdx} className="flex flex-col md:flex-row md:items-center gap-3 py-3 border-b border-slate-900 last:border-0">
                              <span className="text-xs font-bold text-slate-500 min-w-[24px]">{qIdx + 1}.</span>
                              <div className="flex-1 text-sm text-slate-300 leading-relaxed flex flex-wrap items-center gap-1.5">
                                <span>{q.questionStart}</span>
                                <select
                                  value={answers[qKey] || ''}
                                  disabled={checked}
                                  onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                  className={`px-2 py-1 rounded bg-slate-900 border text-xs font-semibold transition-all ${
                                    checked
                                      ? (isCorrect
                                        ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400 font-bold'
                                        : 'border-red-500/80 bg-red-500/10 text-red-400 font-bold')
                                      : 'border-slate-800 text-indigo-300 focus:border-indigo-500'
                                  }`}
                                >
                                  <option value="">Chọn từ...</option>
                                  {(q.answerOptions as string[]).map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                                <span>{q.questionEnd}</span>
                              </div>
                              {checked && !isCorrect && (
                                <span className="text-3xs text-slate-500 md:ml-auto">
                                  Đáp án đúng: <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Kiểm tra kết quả
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part2' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-bold text-slate-200">Part 2: Đọc hiểu ý kiến</h3>
                      <p className="text-xs text-indigo-400 font-medium">Nhiệm vụ: Đọc đoạn văn và chọn đúng người đại diện cho từng quan điểm.</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Passage block */}
                        <div 
                          className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-900 text-xs leading-relaxed text-slate-300 max-h-[450px] overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: data.reading.question2.questionSets[selectedItemIndex].paragraph }}
                        />

                        {/* Questions list */}
                        <div className="lg:col-span-6 space-y-4">
                          {data.reading.question2.questionSets[selectedItemIndex].questions.map((q, idx) => {
                            const qKey = `p2_${selectedItemIndex}_${idx}`;
                            const isCorrect = answers[qKey] === q.answer;
                            return (
                              <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-2">
                                <p className="text-xs font-bold text-slate-300">{idx + 1}. {q.questionText}</p>
                                <div className="flex gap-2">
                                  {['A', 'B', 'C', 'D'].map((person) => (
                                    <button
                                      key={person}
                                      disabled={checked}
                                      onClick={() => setAnswers({ ...answers, [qKey]: person })}
                                      className={`flex-1 py-1.5 rounded text-2xs font-bold border transition-all ${
                                        answers[qKey] === person
                                          ? (checked
                                            ? (isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-red-500/20 text-red-400 border-red-500')
                                            : 'bg-indigo-600 text-white border-indigo-500')
                                          : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200'
                                      }`}
                                    >
                                      Speaker {person}
                                    </button>
                                  ))}
                                </div>
                                {checked && (
                                  <div className="text-3xs flex justify-between pt-1 border-t border-slate-850 mt-1">
                                    <span className="text-slate-400">Đáp án chuẩn: <span className="text-emerald-400 font-bold">{q.answer}</span></span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Display correct keys check */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Kiểm tra kết quả
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part4' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-bold text-slate-200">Part 4: Sắp xếp đoạn văn</h3>
                      <p className="text-xs text-indigo-400 font-medium">Nhiệm vụ: Chọn số thứ tự đúng cho từng câu để tạo thành đoạn văn logic hoàn chỉnh.</p>

                      <div className="space-y-3">
                        {data.reading.question4.question4Content[selectedItemIndex].map((sentence, idx) => {
                          const qKey = `p4_${selectedItemIndex}_${idx}`;
                          const isCorrect = parseInt(answers[qKey]) === idx;
                          return (
                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-start gap-4">
                              <select
                                value={answers[qKey] || ''}
                                disabled={checked}
                                onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                className={`px-3 py-1.5 rounded bg-slate-900 border text-xs font-bold transition-all ${
                                  checked
                                    ? (isCorrect ? 'border-emerald-500/80 text-emerald-400 bg-emerald-500/10' : 'border-red-500/80 text-red-400 bg-red-500/10')
                                    : 'border-slate-800 text-indigo-300'
                                }`}
                              >
                                <option value="">Chọn...</option>
                                {data.reading.question4.question4Content[selectedItemIndex].map((_, oIdx) => (
                                  <option key={oIdx} value={oIdx}>Câu {oIdx + 1}</option>
                                ))}
                              </select>
                              <div className="flex-1">
                                <p className="text-xs text-slate-200 leading-relaxed">{sentence}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Display correct keys check */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Kiểm tra kết quả
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>

                      {checked && (
                        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl mt-4 space-y-2">
                          <h4 className="font-bold text-xs text-emerald-400">Thứ tự đúng của đoạn văn:</h4>
                          <div className="space-y-2">
                            {data.reading.question4.question4Content[selectedItemIndex].map((sentence, idx) => (
                              <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                                <span className="font-bold text-indigo-400">Câu {idx + 1}:</span> {sentence}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part5' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-bold text-slate-200">
                        Part 5: {data.reading.question5.topic_name[selectedItemIndex] || 'Điền từ nâng cao'}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium">Nhiệm vụ: Đọc đoạn văn và điền từ thích hợp vào các ô trống.</p>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Options choices bank */}
                        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">Từ khóa lựa chọn</span>
                          <div className="flex flex-wrap gap-1.5">
                            {data.reading.question5.options[selectedItemIndex].map((opt, oIdx) => (
                              <span key={oIdx} className="px-2 py-1 rounded bg-slate-900 border border-slate-850 text-2xs font-semibold text-slate-300">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Passage with inputs */}
                        <div className="lg:col-span-8 space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-900 text-xs leading-relaxed text-slate-300">
                          {data.reading.question5.paragraph_question5[selectedItemIndex].map((block, bIdx) => {
                            const qKey = `p5_${selectedItemIndex}_${bIdx}`;
                            const optionsList = data.reading.question5.options[selectedItemIndex];
                            const correctWord = optionsList[bIdx];
                            const isCorrect = answers[qKey] === correctWord;
                            return (
                              <div key={bIdx} className="mb-4 space-y-2 border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                                <p className="text-slate-300">{block}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-slate-500">Ô trống {bIdx + 1}:</span>
                                  <select
                                    value={answers[qKey] || ''}
                                    disabled={checked}
                                    onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                    className={`px-3 py-1.5 rounded bg-slate-900 border text-2xs font-bold transition-all ${
                                      checked
                                        ? (isCorrect ? 'border-emerald-500/80 text-emerald-400 bg-emerald-500/10' : 'border-red-500/80 text-red-400 bg-red-500/10')
                                        : 'border-slate-800 text-indigo-300'
                                    }`}
                                  >
                                    <option value="">Chọn từ...</option>
                                    {optionsList.map((opt, oIdx) => (
                                      <option key={oIdx} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                  {checked && (
                                    <span className="text-[10px] text-slate-550">Đáp án đúng: <span className="text-emerald-400 font-bold">{correctWord}</span></span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Display correct keys check */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Kiểm tra kết quả
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>

                      {checked && data.reading.question5.meohoc[selectedItemIndex] && (
                        <div className="bg-amber-600/10 border border-amber-500/30 p-5 rounded-xl mt-4 space-y-2">
                          <h4 className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                            💡 Mẹo nhớ nhanh (AptisKey):
                          </h4>
                          <p 
                            className="text-xs text-amber-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.reading.question5.meohoc[selectedItemIndex] }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mock reading test render */}
                {subView === 'tests' && (
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Render Full Reading Exam Simulator */}
                    <div className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-2xs text-indigo-400 uppercase tracking-widest font-bold">Simulator Mock Exam</span>
                        <h3 className="text-2xl font-bold text-slate-100 mt-1">
                          {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].label}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Nộp bài & Chấm điểm
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>
                    </div>

                    {/* Part 1 */}
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h4 className="font-bold text-sm text-indigo-400">Part 1: Điền khuyết đoạn văn</h4>
                      <div className="text-xs text-slate-305 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900">
                        {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].questions1?.map((item: any, qIdx: number) => {
                          const qKey = `test_p1_${selectedItemIndex}_${qIdx}`;
                          return (
                            <div key={qIdx} className="mb-4 pb-3 border-b border-slate-900 last:border-0 last:pb-0">
                              <p className="mb-2 font-semibold text-slate-200">{qIdx + 1}. {item.question}</p>
                              <div className="flex flex-wrap gap-2">
                                {item.options.map((opt: string, oIdx: number) => {
                                  const isSelected = answers[qKey] === opt;
                                  const isCorrect = opt === item.correctAnswer;
                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={checked}
                                      onClick={() => setAnswers({ ...answers, [qKey]: opt })}
                                      className={`px-3 py-1.5 rounded text-2xs font-semibold border transition-all ${
                                        isSelected
                                          ? (checked
                                            ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400')
                                            : 'bg-indigo-600 border-indigo-500 text-white')
                                          : (checked && isCorrect
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205')
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Part 2 */}
                    {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question2Content && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h4 className="font-bold text-sm text-indigo-400">
                          Part 2: {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question2Topic || 'Đọc hiểu ý kiến'}
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-900 text-2xs leading-relaxed text-slate-350 max-h-[350px] overflow-y-auto">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question2Content.paragraph && (
                              <div dangerouslySetInnerHTML={{ __html: data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question2Content.paragraph }} />
                            )}
                          </div>
                          <div className="lg:col-span-6 space-y-3">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question2Content.questions?.map((q: any, qIdx: number) => {
                              const qKey = `test_p2_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.answer;
                              return (
                                <div key={qIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1.5">
                                  <p className="text-2xs font-semibold text-slate-200">{qIdx + 1}. {q.questionText}</p>
                                  <div className="flex gap-1.5">
                                    {['A', 'B', 'C', 'D'].map((person) => (
                                      <button
                                        key={person}
                                        disabled={checked}
                                        onClick={() => setAnswers({ ...answers, [qKey]: person })}
                                        className={`flex-1 py-1 rounded text-3xs font-bold border transition-all ${
                                          answers[qKey] === person
                                            ? (checked
                                              ? (isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-red-500/20 text-red-400 border-red-500')
                                              : 'bg-indigo-600 text-white border-indigo-500')
                                            : 'bg-slate-900 text-slate-400 border-slate-850 hover:text-slate-205'
                                        }`}
                                      >
                                        {person}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Part 3 */}
                    {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question3Content && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h4 className="font-bold text-sm text-indigo-400">
                          Part 3: {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question3Topic || 'Đọc hiểu ý kiến - Tập 2'}
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          <div className="lg:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-900 text-2xs leading-relaxed text-slate-355 max-h-[350px] overflow-y-auto">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question3Content.paragraph && (
                              <div dangerouslySetInnerHTML={{ __html: data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question3Content.paragraph }} />
                            )}
                          </div>
                          <div className="lg:col-span-6 space-y-3">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question3Content.questions?.map((q: any, qIdx: number) => {
                              const qKey = `test_p3_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.answer;
                              return (
                                <div key={qIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-1.5">
                                  <p className="text-2xs font-semibold text-slate-200">{qIdx + 1}. {q.questionText}</p>
                                  <div className="flex gap-1.5">
                                    {['A', 'B', 'C', 'D'].map((person) => (
                                      <button
                                        key={person}
                                        disabled={checked}
                                        onClick={() => setAnswers({ ...answers, [qKey]: person })}
                                        className={`flex-1 py-1 rounded text-3xs font-bold border transition-all ${
                                          answers[qKey] === person
                                            ? (checked
                                              ? (isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' : 'bg-red-500/20 text-red-400 border-red-500')
                                              : 'bg-indigo-600 text-white border-indigo-500')
                                            : 'bg-slate-900 text-slate-400 border-slate-850 hover:text-slate-205'
                                        }`}
                                      >
                                        {person}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Part 4 */}
                    {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question4Content && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h4 className="font-bold text-sm text-indigo-400">
                          Part 4: {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question4Topic || 'Sắp xếp đoạn văn'}
                        </h4>
                        <div className="space-y-3">
                          {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question4Content.map((sentence: string, sIdx: number) => {
                            const qKey = `test_p4_${selectedItemIndex}_${sIdx}`;
                            const correctOrder = data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].correctAnswersQuestion4[0][sIdx];
                            const isCorrect = answers[qKey] === correctOrder;
                            return (
                              <div key={sIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex gap-3 items-center">
                                <select
                                  value={answers[qKey] || ''}
                                  disabled={checked}
                                  onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                  className={`px-2 py-1 rounded bg-slate-900 border text-2xs font-semibold ${
                                    checked
                                      ? (isCorrect ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-400')
                                      : 'border-slate-800 text-indigo-455'
                                  }`}
                                >
                                  <option value="">Chọn...</option>
                                  {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question4Content.map((_: any, oIdx: number) => (
                                    <option key={oIdx} value={`Câu ${oIdx + 1}`}>Câu {oIdx + 1}</option>
                                  ))}
                                </select>
                                <span className="text-2xs text-slate-300">{sentence}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Part 5 */}
                    {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].paragraph_question5 && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h4 className="font-bold text-sm text-indigo-400">
                          Part 5: {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].question5Topic || 'Điền từ nâng cao'}
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-wrap gap-1.5 h-fit">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].options.map((opt: string, oIdx: number) => (
                              <span key={oIdx} className="px-2 py-1 rounded bg-slate-900 border border-slate-850 text-3xs font-semibold text-slate-400">
                                {opt}
                              </span>
                            ))}
                          </div>
                          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-900 text-2xs leading-relaxed text-slate-350 space-y-4">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].paragraph_question5.map((block: string, bIdx: number) => {
                              const qKey = `test_p5_${selectedItemIndex}_${bIdx}`;
                              const correctWord = data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].options[bIdx];
                              const isCorrect = answers[qKey] === correctWord;
                              return (
                                <div key={bIdx} className="border-b border-slate-900 pb-3 last:border-0 last:pb-0 space-y-2">
                                  <p>{block}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-3xs text-slate-500 font-bold">Đáp án ô {bIdx + 1}:</span>
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-2 py-1 rounded bg-slate-900 border text-3xs font-bold ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-400')
                                          : 'border-slate-800 text-indigo-400'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]].options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    {checked && (
                                      <span className="text-3xs text-slate-550">Đúng: <span className="text-emerald-400 font-bold">{correctWord}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reading Tips rendering */}
                {subView === 'tips' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-bold text-slate-200">
                        Mẹo sắp xếp Q5: Bộ {data.reading_tips[selectedItemIndex].id}
                      </h3>
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-3">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Các từ khóa thứ tự chuẩn:</span>
                        <div className="flex flex-wrap gap-2">
                          {data.reading_tips[selectedItemIndex].options.map((opt, oIdx) => (
                            <span key={oIdx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300">
                              {oIdx + 1}. {opt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 bg-amber-600/10 border border-amber-500/20 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-amber-400 block">💡 Keyword gợi nhớ nhanh:</span>
                        <p 
                          className="text-xs text-amber-300 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: data.reading_tips[selectedItemIndex].keyword }}
                        />
                      </div>

                      <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-indigo-400 block">📖 Nhớ cốt truyện theo đoạn văn:</span>
                        <p 
                          className="text-xs text-slate-300 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: data.reading_tips[selectedItemIndex].meo }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        {/* LISTENING PRACTICE / MOCK / TIPS */}
        {activeTab === 'listening' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab controls */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                {(['practice', 'tests', 'tips'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => { setSubView(view); setSelectedItemIndex(0); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      subView === view
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {view === 'practice' && 'Luyện tập câu hỏi'}
                    {view === 'tests' && 'Bộ đề nghe (15 bộ)'}
                    {view === 'tips' && 'Mẹo nhớ nhanh Q15'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Practice mode sidebar selector */}
              {subView === 'practice' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0">
                  <div className="p-4 space-y-1 border-b border-slate-900">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn phần học</span>
                    {['part1', 'part2', 'part3', 'part4'].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSelectedSubPart(p); setSelectedItemIndex(0); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold capitalize ${
                          selectedSubPart === p ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/60'
                        }`}
                      >
                        {p === 'part1' && 'Câu 1-13: Nghe ngắn'}
                        {p === 'part2' && 'Câu 14: Nối ý kiến'}
                        {p === 'part3' && 'Câu 15: Hội thoại dài'}
                        {p === 'part4' && 'Câu 16-17: Phân tích sâu'}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Danh sách bài tập</span>
                    {selectedSubPart === 'part1' && data.listening.listening_question1_13.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        {item.heading || `Câu hỏi ${idx + 1}`}
                      </button>
                    ))}

                    {selectedSubPart === 'part2' && data.listening.listening_question14.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        {item.topic || `Chủ đề ${idx + 1}`}
                      </button>
                    ))}

                    {selectedSubPart === 'part3' && data.listening.listening_question15.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        {item.topic || `Chủ đề ${idx + 1}`}
                      </button>
                    ))}

                    {selectedSubPart === 'part4' && data.listening.listening_question16_17.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        {item.topic || `Chủ đề ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Test mode sidebar selector */}
              {subView === 'tests' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn bộ đề nghe</span>
                  {Object.keys(data.listening_tests).map((testKey, idx) => (
                    <button
                      key={testKey}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      {`Bộ đề Nghe #${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Listening Tips list selector */}
              {subView === 'tips' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn mẹo nhớ nhanh</span>
                  <button
                    onClick={() => setSelectedSubPart('method1')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold block mb-3 ${
                      selectedSubPart === 'method1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                    }`}
                  >
                    Bảng mẹo nối (Method 1)
                  </button>
                  <button
                    onClick={() => setSelectedSubPart('method2')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold block ${
                      selectedSubPart === 'method2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                    }`}
                  >
                    Mẹo quy tắc số (Method 2)
                  </button>
                </div>
              )}

              {/* Main Content Workspace for Listening */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {subView === 'practice' && selectedSubPart === 'part1' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {(() => {
                      const item = data.listening.listening_question1_13[selectedItemIndex];
                      const qKey = `l1_${selectedItemIndex}`;
                      const isCorrect = answers[qKey] === item.correctAnswer;
                      return (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-855">
                            <div>
                              <span className="text-3xs text-indigo-400 uppercase tracking-wider font-bold">Listening Part 1</span>
                              <h3 className="text-xl font-bold text-slate-100">{item.heading}</h3>
                            </div>
                            <button
                              onClick={() => setAudioUrl(item.audioUrl || '')}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                              ▶️ Nghe bài tập
                            </button>
                          </div>

                          <div className="space-y-4">
                            <p className="text-sm font-semibold text-slate-200">{item.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {item.options.map((opt, oIdx) => {
                                const isSelected = answers[qKey] === opt;
                                return (
                                  <button
                                    key={oIdx}
                                    disabled={checked}
                                    onClick={() => setAnswers({ ...answers, [qKey]: opt })}
                                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center ${
                                      isSelected
                                        ? (checked
                                          ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400')
                                          : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10')
                                        : 'bg-slate-950 text-slate-400 border-slate-850 hover:text-slate-200'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Display correct keys check */}
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={() => setChecked(true)}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                            >
                              Kiểm tra kết quả
                            </button>
                            <button
                              onClick={() => { setAnswers({}); setChecked(false); }}
                              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                            >
                              Làm lại
                            </button>
                          </div>

                          {checked && (
                            <div className="space-y-4 border-t border-slate-850 pt-4 mt-4">
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                                <h4 className="font-bold text-xs text-indigo-400 mb-1">Đáp án đúng:</h4>
                                <p className="text-xs text-emerald-400 font-bold">{item.correctAnswer}</p>
                              </div>

                              {item.transcript && (
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                                  <h4 className="font-bold text-xs text-slate-400 mb-1.5">Transcript bài nghe:</h4>
                                  <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{item.transcript}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part2' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {(() => {
                      const item = data.listening.listening_question14[selectedItemIndex];
                      return (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-855">
                            <div>
                              <span className="text-3xs text-indigo-400 uppercase tracking-wider font-bold">Listening Part 2</span>
                              <h3 className="text-xl font-bold text-slate-100">{item.topic}</h3>
                            </div>
                            <button
                              onClick={() => setAudioUrl(item.audioUrl)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                              ▶️ Nghe bài tập
                            </button>
                          </div>

                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Nối 4 người nói với ý kiến tương ứng:</span>
                            
                            {['A', 'B', 'C', 'D'].map((person, pIdx) => {
                              const qKey = `l2_${selectedItemIndex}_${person}`;
                              const correctAns = item.correctAnswers ? item.correctAnswers[pIdx] : '';
                              const isCorrect = answers[qKey] === correctAns;
                              return (
                                <div key={person} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-300">Người nói {person}:</span>
                                    {checked && (
                                      <span className="text-3xs text-slate-550">Đúng: <span className="text-emerald-400 font-bold">{correctAns}</span></span>
                                    )}
                                  </div>
                                  <select
                                    value={answers[qKey] || ''}
                                    disabled={checked}
                                    onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                    className={`w-full px-3 py-2 rounded-lg bg-slate-900 border text-xs transition-all ${
                                      checked
                                        ? (isCorrect ? 'border-emerald-500/80 text-emerald-400 bg-emerald-500/10' : 'border-red-500/80 text-red-400 bg-red-500/10')
                                        : 'border-slate-800 text-indigo-300'
                                    }`}
                                  >
                                    <option value="">Chọn ý kiến tương ứng...</option>
                                    {item.options.map((opt, oIdx) => (
                                      <option key={oIdx} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>

                          {/* Display correct keys check */}
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={() => setChecked(true)}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                            >
                              Kiểm tra kết quả
                            </button>
                            <button
                              onClick={() => { setAnswers({}); setChecked(false); }}
                              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                            >
                              Làm lại
                            </button>
                          </div>

                          {checked && item.transcript && (
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mt-4 space-y-2">
                              <h4 className="font-bold text-xs text-slate-400 mb-1.5">Transcript bài nghe:</h4>
                              <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{item.transcript}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part3' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {(() => {
                      const item = data.listening.listening_question15[selectedItemIndex];
                      return (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-855">
                            <div>
                              <span className="text-3xs text-indigo-400 uppercase tracking-wider font-bold">Listening Part 3</span>
                              <h3 className="text-xl font-bold text-slate-100">{item.topic}</h3>
                            </div>
                            <button
                              onClick={() => setAudioUrl(item.audioUrl)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                              ▶️ Nghe bài tập
                            </button>
                          </div>

                          <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-4">
                            <h4 className="font-bold text-xs text-indigo-400">Gợi ý ôn luyện:</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Nghe đoạn hội thoại dài và xác định quan điểm của Nam hay Nữ về các khía cạnh khác nhau.
                            </p>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={() => setChecked(true)}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                            >
                              Xem Transcript & Đáp án
                            </button>
                          </div>

                          {checked && item.transcript && (
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mt-4 space-y-2">
                              <h4 className="font-bold text-xs text-slate-400 mb-1.5">Transcript bài nghe:</h4>
                              <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{item.transcript}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part4' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {(() => {
                      const item = data.listening.listening_question16_17[selectedItemIndex];
                      return (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-855">
                            <div>
                              <span className="text-3xs text-indigo-400 uppercase tracking-wider font-bold">Listening Part 4 (Q16-17)</span>
                              <h3 className="text-xl font-bold text-slate-100">{item.topic}</h3>
                            </div>
                            <button
                              onClick={() => setAudioUrl(item.audioUrl)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                              ▶️ Nghe bài tập
                            </button>
                          </div>

                          <div className="space-y-4">
                            {item.questions.map((q, qIdx) => {
                              const qKey = `l4_${selectedItemIndex}_${q.id}`;
                              const correctAns = q.correctAnswer || '';
                              const isCorrect = answers[qKey] === correctAns;
                              return (
                                <div key={q.id} className="bg-slate-950 p-5 rounded-xl border border-slate-900 space-y-3">
                                  <p className="text-xs font-bold text-slate-200">{q.id}. {q.question}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {q.options.map((opt, oIdx) => {
                                      const isSelected = answers[qKey] === opt;
                                      return (
                                        <button
                                          key={oIdx}
                                          disabled={checked}
                                          onClick={() => setAnswers({ ...answers, [qKey]: opt })}
                                          className={`py-2 px-3 rounded-lg border text-3xs font-semibold text-center transition-all ${
                                            isSelected
                                              ? (checked
                                                ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400')
                                                : 'bg-indigo-600 border-indigo-500 text-white')
                                              : (checked && opt === correctAns
                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205')
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Display correct keys check */}
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={() => setChecked(true)}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                            >
                              Kiểm tra kết quả
                            </button>
                            <button
                              onClick={() => { setAnswers({}); setChecked(false); }}
                              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                            >
                              Làm lại
                            </button>
                          </div>

                          {checked && item.transcript && (
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 mt-4 space-y-2">
                              <h4 className="font-bold text-xs text-slate-400 mb-1.5">Transcript bài nghe:</h4>
                              <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">{item.transcript}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Mock listening test render */}
                {subView === 'tests' && (
                  <div className="max-w-3xl mx-auto space-y-8">
                    {/* Simulator info box */}
                    <div className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-2xs text-indigo-400 uppercase tracking-widest font-bold">Simulator Mock Exam</span>
                        <h3 className="text-2xl font-bold text-slate-100 mt-1">
                          {`Bộ đề Listening #${selectedItemIndex + 1}`}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChecked(true)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                        >
                          Nộp bài & Chấm điểm
                        </button>
                        <button
                          onClick={() => { setAnswers({}); setChecked(false); }}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                        >
                          Làm lại
                        </button>
                      </div>
                    </div>

                    {/* Part 1 simulator */}
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                      <h4 className="font-bold text-sm text-indigo-400">Part 1: Câu 1-13 (Nghe ngắn)</h4>
                      <div className="space-y-4">
                        {data.listening_tests[Object.keys(data.listening_tests)[selectedItemIndex]].q1_13.slice(0, 5).map((q: any, idx: number) => {
                          const qKey = `test_l1_${selectedItemIndex}_${idx}`;
                          const isCorrect = answers[qKey] === q.correctAnswer;
                          return (
                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-2xs font-bold text-slate-405">Câu hỏi {idx + 1}</span>
                                <button
                                  onClick={() => setAudioUrl(q.audioUrl)}
                                  className="text-3xs px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-indigo-400 hover:text-indigo-300"
                                >
                                  🔊 Nghe
                                </button>
                              </div>
                              <p className="text-xs font-semibold text-slate-200">{q.question}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {q.options.map((opt: string, oIdx: number) => {
                                  const isSelected = answers[qKey] === opt;
                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={checked}
                                      onClick={() => setAnswers({ ...answers, [qKey]: opt })}
                                      className={`py-2 px-3 rounded-lg border text-3xs font-semibold transition-all ${
                                        isSelected
                                          ? (checked
                                            ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400')
                                            : 'bg-indigo-600 border-indigo-500 text-white')
                                          : (checked && opt === q.correctAnswer
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                            : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205')
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Listening Tips render */}
                {subView === 'tips' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {selectedSubPart === 'method1' && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h3 className="text-xl font-bold text-slate-200">Bảng mẹo nhớ nối theo giọng đọc (Method 1)</h3>
                        <div className="overflow-x-auto border border-slate-900 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-950 border-b border-slate-850 text-slate-400">
                                <th className="p-3">Topic</th>
                                <th className="p-3">Giọng trước</th>
                                <th className="p-3">Đáp án</th>
                                <th className="p-3">Mẹo nhớ gợi ý</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 text-slate-300">
                              {data.listening_tips.method1.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/20">
                                  <td className="p-3 font-semibold text-slate-100">
                                    {item.topic_en}
                                    <div className="text-[10px] text-slate-550 font-normal">{item.topic_vi}</div>
                                  </td>
                                  <td className="p-3">
                                    {item.voices.map((v, vIdx) => (
                                      <div key={vIdx} className="mb-1 last:mb-0">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                          v.voice === 'Nam' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                                        }`}>{v.voice}</span>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="p-3 font-mono font-bold text-indigo-400">
                                    {item.voices.map((v, vIdx) => (
                                      <div key={vIdx} className="mb-1 last:mb-0">{v.key}</div>
                                    ))}
                                  </td>
                                  <td className="p-3 text-[11px] text-slate-400">
                                    {item.voices.map((v, vIdx) => (
                                      <div key={vIdx} className="mb-1 last:mb-0">{v.note}</div>
                                    ))}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedSubPart === 'method2' && (
                      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <h3 className="text-xl font-bold text-slate-200">Mẹo quy tắc số cho Câu 15 (Method 2)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {data.listening_tips.method2.map((item, idx) => (
                            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                                <span className="text-xs font-bold text-slate-100">{item.topic}</span>
                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold">
                                  {item.correctanswer}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{item.key}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        {/* SPEAKING PRACTICE & TIPS */}
        {activeTab === 'speaking' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab controls */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                {(['practice', 'tips'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => { setSubView(view); setSelectedItemIndex(0); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      subView === view
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {view === 'practice' && 'Luyện tập Speaking'}
                    {view === 'tips' && 'Mẹo & Công thức chuẩn Q2'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Practice mode sidebar selector */}
              {subView === 'practice' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0">
                  <div className="p-4 space-y-1 border-b border-slate-900">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn phần học</span>
                    {['part1', 'part2', 'part3', 'part4'].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSelectedSubPart(p); setSelectedItemIndex(0); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold capitalize ${
                          selectedSubPart === p ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/60'
                        }`}
                      >
                        {p === 'part1' && 'Part 1: Câu hỏi cá nhân'}
                        {p === 'part2' && 'Part 2: Mô tả 1 ảnh'}
                        {p === 'part3' && 'Part 3: So sánh 2 ảnh'}
                        {p === 'part4' && 'Part 4: Thảo luận sâu'}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-505 uppercase tracking-wider block mb-2">Danh sách bài tập</span>
                    {selectedSubPart === 'part1' && data.speaking.part1_practice.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part2' && data.speaking.part2_practice.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part3' && data.speaking.part3_practice.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}

                    {selectedSubPart === 'part4' && data.speaking.part4_practice.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        Bài tập {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Speaking Tips selector */}
              {subView === 'tips' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn ảnh mẹo mẫu</span>
                  {data.speaking_tips.map((tip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      Bức tranh mẫu {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Content Workspace for Speaking */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {subView === 'practice' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                      <h3 className="text-xl font-bold text-slate-200 capitalize">
                        Speaking {selectedSubPart === 'part1' ? 'Part 1: Câu hỏi cá nhân' : selectedSubPart === 'part2' ? 'Part 2: Mô tả tranh' : selectedSubPart === 'part3' ? 'Part 3: So sánh 2 tranh' : 'Part 4: Thảo luận chủ đề'}
                      </h3>

                      {/* Display image for part 2 or 3 */}
                      {selectedSubPart === 'part2' && data.speaking.part2_practice[selectedItemIndex]?.imgurl && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-center">
                          <img
                            src={getImageUrl(data.speaking.part2_practice[selectedItemIndex].imgurl)}
                            alt="Speaking practice"
                            className="max-h-[300px] object-contain rounded-lg border border-slate-850"
                          />
                        </div>
                      )}

                      {selectedSubPart === 'part3' && data.speaking.part3_practice[selectedItemIndex]?.imgurl1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-900">
                          <img
                            src={getImageUrl(data.speaking.part3_practice[selectedItemIndex].imgurl1)}
                            alt="Speaking practice 1"
                            className="w-full h-48 object-cover rounded-lg border border-slate-850"
                          />
                          <img
                            src={getImageUrl(data.speaking.part3_practice[selectedItemIndex].imgurl2)}
                            alt="Speaking practice 2"
                            className="w-full h-48 object-cover rounded-lg border border-slate-850"
                          />
                        </div>
                      )}

                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Các câu hỏi nói:</span>
                        
                        {(() => {
                          let questionsList: string[] = [];
                          if (selectedSubPart === 'part1') questionsList = data.speaking.part1_practice[selectedItemIndex]?.questions || [];
                          else if (selectedSubPart === 'part2') questionsList = data.speaking.part2_practice[selectedItemIndex]?.questions || [];
                          else if (selectedSubPart === 'part3') questionsList = data.speaking.part3_practice[selectedItemIndex]?.questions || [];
                          else if (selectedSubPart === 'part4') questionsList = data.speaking.part4_practice[selectedItemIndex]?.questions || [];

                          return questionsList.map((q, idx) => (
                            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                              <p className="text-xs font-bold text-slate-200">Câu hỏi {idx + 1}: {q}</p>
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => setAnswers({ ...answers, [`sp_${selectedItemIndex}_${idx}`]: true })}
                                  className="text-3xs px-2.5 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                  Xem Gợi ý trả lời
                                </button>
                              </div>
                              {answers[`sp_${selectedItemIndex}_${idx}`] && (
                                <div className="text-3xs text-slate-400 bg-slate-900/60 p-3 rounded mt-2 border border-slate-850 leading-relaxed">
                                  Tự tin nói trong thời gian quy định (Part 1: 30s/câu, Part 2 & 3: 45s/câu, Part 4: 120s cho cả 3 câu). Đảm bảo phát âm rõ ràng, trôi chảy, sử dụng các từ liên kết cơ bản.
                                </div>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Speaking Tips render */}
                {subView === 'tips' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    {(() => {
                      const tip = data.speaking_tips[selectedItemIndex];
                      return (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                          <h3 className="text-xl font-bold text-slate-200">Mẹo mô tả tranh mẫu</h3>

                          {tip.urlpic1 && (
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex justify-center">
                              <img
                                src={getImageUrl(tip.urlpic1)}
                                alt="Speaking model pic"
                                className="max-h-[300px] object-contain rounded-lg border border-slate-850"
                              />
                            </div>
                          )}

                          <div className="space-y-4">
                            {/* Question 1 model */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                              <h4 className="text-xs font-bold text-indigo-400">Câu 1: {tip.question1}</h4>
                              <div
                                className="text-2xs text-slate-300 leading-relaxed space-y-2"
                                dangerouslySetInnerHTML={{ __html: tip.question1_answer }}
                              />
                            </div>

                            {/* Question 2 model */}
                            {tip.question2 && (
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                <h4 className="text-xs font-bold text-indigo-400">Câu 2: {tip.question2}</h4>
                                <div
                                  className="text-2xs text-slate-300 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: tip.question2_answer }}
                                />
                              </div>
                            )}

                            {/* Question 3 model */}
                            {tip.question3 && (
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                <h4 className="text-xs font-bold text-indigo-400">Câu 3: {tip.question3}</h4>
                                <div
                                  className="text-2xs text-slate-300 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: tip.question3_answer }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        {/* WRITING PRACTICE & TIPS */}
        {activeTab === 'writing' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab controls */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                {(['practice', 'tips'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => { setSubView(view); setSelectedItemIndex(0); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      subView === view
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {view === 'practice' && 'Luyện tập câu lạc bộ'}
                    {view === 'tips' && 'Mẹo viết email mẫu'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Practice list selector */}
              {subView === 'practice' && (
                <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn CLB luyện tập</span>
                  {Object.keys(data.writing).map((writeKey, idx) => (
                    <button
                      key={writeKey}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                      }`}
                    >
                      {data.writing[writeKey].club_name || `CLB ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Content Workspace for Writing */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {subView === 'practice' && (
                  <div className="max-w-4xl mx-auto space-y-8">
                    {(() => {
                      const item = data.writing[Object.keys(data.writing)[selectedItemIndex]];
                      return (
                        <>
                          <div className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl">
                            <span className="text-2xs text-indigo-400 uppercase tracking-widest font-bold">Writing Simulator</span>
                            <h3 className="text-2xl font-bold text-slate-100 mt-1">
                              Chủ đề CLB: {item.club_name}
                            </h3>
                          </div>

                          {/* Part 1 */}
                          {item.part1_questions && (
                            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                              <h4 className="font-bold text-sm text-indigo-400">Part 1: Trả lời 5 câu hỏi nhanh (1-5 từ)</h4>
                              <div className="space-y-4">
                                {item.part1_questions.map((q, qIdx) => {
                                  const ansKey = `w_p1_${selectedItemIndex}_${qIdx}`;
                                  return (
                                    <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                      <p className="text-xs font-semibold text-slate-200">{qIdx + 1}. {q}</p>
                                      <input
                                        type="text"
                                        value={answers[ansKey] || ''}
                                        disabled={checked}
                                        onChange={(e) => setAnswers({ ...answers, [ansKey]: e.target.value })}
                                        placeholder="Nhập câu trả lời..."
                                        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-indigo-300 focus:border-indigo-500"
                                      />
                                      {checked && (
                                        <div className="text-3xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
                                          Gợi ý đáp án: <span className="text-emerald-400 font-bold">{item.part1_answers ? item.part1_answers[qIdx] : ''}</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Part 2 */}
                          {item.part2_question && (
                            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                              <h4 className="font-bold text-sm text-indigo-400">Part 2: Viết đoạn văn CLB (20-30 từ)</h4>
                              <div className="bg-slate-955 p-4 rounded-xl border border-slate-900 space-y-3">
                                <p className="text-xs text-slate-350 leading-relaxed">{item.part2_question}</p>
                                <textarea
                                  value={answers[`w_p2_${selectedItemIndex}`] || ''}
                                  disabled={checked}
                                  onChange={(e) => setAnswers({ ...answers, [`w_p2_${selectedItemIndex}`]: e.target.value })}
                                  placeholder="Nhập nội dung viết..."
                                  rows={3}
                                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-indigo-300 focus:border-indigo-500"
                                />
                                <div className="flex justify-between items-center text-3xs text-slate-500">
                                  <span>Độ dài: <span className="text-indigo-400 font-bold">{((answers[`w_p2_${selectedItemIndex}`] || '').trim().split(/\s+/).filter(Boolean).length)}</span> từ (Khuyên dùng: 20-30 từ)</span>
                                </div>
                                {checked && (
                                  <div className="text-3xs text-slate-405 border-t border-slate-900 pt-2 mt-2">
                                    Bài mẫu gợi ý:<br />
                                    <p className="text-emerald-400 font-bold whitespace-pre-wrap mt-1">{item.part2_answer}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Part 3 */}
                          {item.part3_questions && (
                            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                              <h4 className="font-bold text-sm text-indigo-400">Part 3: Hội thoại nhóm (3 câu hỏi, 30-40 từ/câu)</h4>
                              <div className="space-y-4">
                                {item.part3_questions.map((q, qIdx) => {
                                  const ansKey = `w_p3_${selectedItemIndex}_${qIdx}`;
                                  return (
                                    <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                      <p className="text-xs font-semibold text-slate-200">{qIdx + 1}. {q}</p>
                                      <textarea
                                        value={answers[ansKey] || ''}
                                        disabled={checked}
                                        onChange={(e) => setAnswers({ ...answers, [ansKey]: e.target.value })}
                                        placeholder="Trả lời..."
                                        rows={3}
                                        className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-indigo-300 focus:border-indigo-500"
                                      />
                                      <div className="flex justify-between items-center text-3xs text-slate-505">
                                        <span>Độ dài: <span className="text-indigo-400 font-bold">{((answers[ansKey] || '').trim().split(/\s+/).filter(Boolean).length)}</span> từ (Khuyên dùng: 30-40 từ)</span>
                                      </div>
                                      {checked && (
                                        <div className="text-3xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
                                          Bài mẫu gợi ý:<br />
                                          <p className="text-emerald-400 font-bold whitespace-pre-wrap mt-1">{item.part3_answers ? item.part3_answers[qIdx] : ''}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Part 4 */}
                          {item.part4_friend_question && (
                            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                              <h4 className="font-bold text-sm text-indigo-400">Part 4: Viết email (email bạn bè & email quản lý)</h4>
                              
                              {/* Friend Email */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">1. Gửi cho bạn (≈50 từ)</span>
                                <p className="text-xs text-slate-350 leading-relaxed">{item.part4_friend_question}</p>
                                <textarea
                                  value={answers[`w_p4_friend_${selectedItemIndex}`] || ''}
                                  disabled={checked}
                                  onChange={(e) => setAnswers({ ...answers, [`w_p4_friend_${selectedItemIndex}`]: e.target.value })}
                                  placeholder="Nhập email..."
                                  rows={4}
                                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-indigo-300 focus:border-indigo-500"
                                />
                                <div className="flex justify-between items-center text-3xs text-slate-500">
                                  <span>Độ dài: <span className="text-indigo-400 font-bold">{((answers[`w_p4_friend_${selectedItemIndex}`] || '').trim().split(/\s+/).filter(Boolean).length)}</span> từ</span>
                                </div>
                                {checked && (
                                  <div className="text-3xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
                                    Bài mẫu gợi ý:<br />
                                    <p className="text-emerald-400 font-bold whitespace-pre-wrap mt-1">{item.part4_friend_answer}</p>
                                  </div>
                                )}
                              </div>

                              {/* Manager Email */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-2">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">2. Gửi cho quản lý CLB (120-150 từ)</span>
                                <p className="text-xs text-slate-350 leading-relaxed">{item.part4_manager_question}</p>
                                <textarea
                                  value={answers[`w_p4_manager_${selectedItemIndex}`] || ''}
                                  disabled={checked}
                                  onChange={(e) => setAnswers({ ...answers, [`w_p4_manager_${selectedItemIndex}`]: e.target.value })}
                                  placeholder="Nhập email trang trọng..."
                                  rows={6}
                                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-indigo-300 focus:border-indigo-500"
                                />
                                <div className="flex justify-between items-center text-3xs text-slate-500">
                                  <span>Độ dài: <span className="text-indigo-400 font-bold">{((answers[`w_p4_manager_${selectedItemIndex}`] || '').trim().split(/\s+/).filter(Boolean).length)}</span> từ</span>
                                </div>
                                {checked && (
                                  <div className="text-3xs text-slate-400 border-t border-slate-900 pt-2 mt-2">
                                    Bài mẫu gợi ý trang trọng:<br />
                                    <p className="text-emerald-400 font-bold whitespace-pre-wrap mt-1">{item.part4_manager_answer}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              onClick={() => setChecked(true)}
                              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                            >
                              Hoàn thành & So sánh bài mẫu
                            </button>
                            <button
                              onClick={() => { setAnswers({}); setChecked(false); }}
                              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                            >
                              Làm lại
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Writing Tips render */}
                {subView === 'tips' && data.writing_tips && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                      <h3 className="text-xl font-bold text-slate-200">Công thức viết email Part 4 chuẩn</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Friend template */}
                        <div className="bg-slate-955 p-5 rounded-xl border border-slate-905 space-y-2">
                          <span className="text-xs font-bold text-indigo-400 block">Form gửi cho bạn (≈50 từ):</span>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {data.writing_tips.forms.friend_template}
                          </p>
                        </div>

                        {/* Manager template */}
                        <div className="bg-slate-955 p-5 rounded-xl border border-slate-905 space-y-2">
                          <span className="text-xs font-bold text-indigo-400 block">Form gửi cho quản lý (120-150 từ):</span>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {data.writing_tips.forms.manager_template}
                          </p>
                        </div>
                      </div>

                      {/* Opinion word bank */}
                      <div className="bg-slate-955 p-5 rounded-xl border border-slate-905 space-y-3">
                        <span className="text-xs font-bold text-slate-200 block">💡 Ngân hàng từ vựng thể hiện quan điểm (Opinion Words):</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Tích cực:</span>
                            <div className="flex flex-wrap gap-1">
                              {data.writing_tips.forms.opinion_words.positive.map((words, wIdx) => (
                                <p key={wIdx} className="text-3xs text-slate-400 leading-relaxed bg-slate-900 px-2 py-1 rounded border border-slate-850">
                                  {words}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Tiêu cực:</span>
                            <div className="flex flex-wrap gap-1">
                              {data.writing_tips.forms.opinion_words.negative.map((words, wIdx) => (
                                <p key={wIdx} className="text-3xs text-slate-400 leading-relaxed bg-slate-900 px-2 py-1 rounded border border-slate-850">
                                  {words}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Book Club Example */}
                      <div className="bg-slate-955 p-5 rounded-xl border border-slate-905 space-y-4">
                        <span className="text-xs font-bold text-indigo-400 block">📖 Ví dụ thực hành: Book Club</span>
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-850 text-xs text-slate-400 whitespace-pre-wrap">
                          {data.writing_tips.example.topic}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-900/40 border border-slate-855 rounded text-3xs text-slate-350 space-y-1">
                            <span className="font-bold text-slate-200">Email viết cho bạn mẫu:</span>
                            <p className="whitespace-pre-wrap">{data.writing_tips.example.friend_example}</p>
                          </div>
                          <div className="p-3 bg-slate-900/40 border border-slate-855 rounded text-3xs text-slate-350 space-y-1">
                            <span className="font-bold text-slate-200">Email viết cho quản lý mẫu:</span>
                            <p className="whitespace-pre-wrap">{data.writing_tips.example.manager_example}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        {/* GRAMMAR PRACTICE */}
        {activeTab === 'grammar' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Grammar Test Sets</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-64 border-r border-slate-900 bg-slate-900/30 flex flex-col overflow-y-auto shrink-0 p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Chọn bộ đề ngữ pháp</span>
                {Object.keys(data.grammar).map((testKey: string, idx: number) => (
                  <button
                    key={testKey}
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedItemIndex === idx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900/40'
                    }`}
                  >
                    {data.grammar[testKey].keyid || `Grammar Test #${idx + 1}`}
                  </button>
                ))}
              </div>

              {/* Main Content Workspace for Grammar */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {(() => {
                  const item = data.grammar[Object.keys(data.grammar)[selectedItemIndex]];
                  
                  // Calculate score
                  let correctCount = 0;
                  let totalCount = 0;
                  
                  if (item.question1_list) {
                    item.question1_list.forEach((q: any, idx: number) => {
                      const qKey = `g_p1_${selectedItemIndex}_${idx}`;
                      if (answers[qKey] === q.question_answer[0]) correctCount++;
                      totalCount++;
                    });
                  }
                  
                  for (let p = 2; p <= 6; p++) {
                    const listKey = `question${p}_list` as const;
                    const list = (item as any)[listKey];
                    if (list) {
                      list.forEach((q: any, idx: number) => {
                        const qKey = `g_p${p}_${selectedItemIndex}_${idx}`;
                        if (answers[qKey] === q.correct_answer) correctCount++;
                        totalCount++;
                      });
                    }
                  }

                  return (
                    <div className="max-w-4xl mx-auto space-y-8">
                      <div className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-2xs text-indigo-400 uppercase tracking-widest font-bold">Grammar & Vocabulary Simulator</span>
                          <h3 className="text-2xl font-bold text-slate-100 mt-1">
                            {item.keyid}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setChecked(true)}
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all"
                          >
                            Nộp bài & Chấm điểm
                          </button>
                          <button
                            onClick={() => { setAnswers({}); setChecked(false); }}
                            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all text-slate-300"
                          >
                            Làm lại
                          </button>
                        </div>
                      </div>

                      {/* Display score inside test */}
                      {checked && (
                        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-350">Điểm số đạt được:</span>
                          <span className="text-lg font-bold text-emerald-400">
                            {correctCount} / {totalCount} câu đúng (Grammar: {item.question1_list ? item.question1_list.filter((q: any, idx: number) => answers[`g_p1_${selectedItemIndex}_${idx}`] === q.question_answer[0]).length : 0}/25, Vocabulary: {correctCount - (item.question1_list ? item.question1_list.filter((q: any, idx: number) => answers[`g_p1_${selectedItemIndex}_${idx}`] === q.question_answer[0]).length : 0)}/25)
                          </span>
                        </div>
                      )}

                      {/* Part 1: Grammar */}
                      {item.question1_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 1: Grammar (25 câu hỏi trắc nghiệm)</h4>
                          <div className="space-y-4">
                            {item.question1_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p1_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.question_answer[0];
                              const sortedOptions = [...q.question_answer].sort();
                              
                              return (
                                <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
                                  <p className="text-xs font-semibold text-slate-200">{qIdx + 1}. {q.question_ask}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {sortedOptions.map((opt: string, oIdx: number) => {
                                      const isSelected = answers[qKey] === opt;
                                      const isCorrectAnswer = opt === q.question_answer[0];
                                      return (
                                        <button
                                          key={oIdx}
                                          disabled={checked}
                                          onClick={() => setAnswers({ ...answers, [qKey]: opt })}
                                          className={`py-2 px-3 rounded-lg border text-3xs font-semibold text-center transition-all ${
                                            isSelected
                                              ? (checked
                                                ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-red-500/20 border-red-500 text-red-400 font-bold')
                                                : 'bg-indigo-600 border-indigo-500 text-white')
                                              : (checked && isCorrectAnswer
                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                                                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-205')
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Part 2: Vocabulary - Word Matching */}
                      {item.question2_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 2: Vocabulary - Word Matching (Nối từ đồng nghĩa)</h4>
                          <p className="text-[10px] text-slate-450 leading-relaxed">Nhiệm vụ: Chọn từ ở dropdown có ý nghĩa tương đồng nhất với từ gốc.</p>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                            {item.question2_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p2_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.correct_answer;
                              const options = (item.question2_list && item.question2_list[0]) ? item.question2_list[0].question_answer.filter(Boolean) : [];
                              
                              return (
                                <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-900 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-mono">{qIdx + 1}.</span>
                                    <span className="text-xs font-bold text-slate-200 capitalize">{q.question_orginal}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-3 py-1.5 rounded bg-slate-900 border text-xs font-semibold min-w-[150px] ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10')
                                          : 'border-slate-800 text-indigo-300'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    {checked && !isCorrect && (
                                      <span className="text-3xs text-slate-500">Đúng: <span className="text-emerald-400 font-bold">{q.correct_answer}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Part 3: Vocabulary - Definition Matching */}
                      {item.question3_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 3: Vocabulary - Definition Matching (Nối định nghĩa)</h4>
                          <p className="text-[10px] text-slate-450 leading-relaxed">Nhiệm vụ: Chọn từ phù hợp nhất với định nghĩa cho sẵn.</p>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                            {item.question3_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p3_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.correct_answer;
                              const options = (item.question3_list && item.question3_list[0]) ? item.question3_list[0].question_answer.filter(Boolean) : [];
                              
                              return (
                                <div key={qIdx} className="space-y-2 py-3 border-b border-slate-900 last:border-0">
                                  <p className="text-xs text-slate-300">{qIdx + 1}. {q.question_orginal}</p>
                                  <div className="flex items-center gap-3">
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-3 py-1.5 rounded bg-slate-900 border text-xs font-semibold min-w-[150px] ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10')
                                          : 'border-slate-800 text-indigo-300'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    {checked && !isCorrect && (
                                      <span className="text-3xs text-slate-500">Đúng: <span className="text-emerald-400 font-bold">{q.correct_answer}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Part 4: Vocabulary - Sentence Completion */}
                      {item.question4_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 4: Vocabulary - Sentence Completion (Điền từ hoàn chỉnh câu)</h4>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                            {item.question4_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p4_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.correct_answer;
                              const options = (item.question4_list && item.question4_list[0]) ? item.question4_list[0].question_answer.filter(Boolean) : [];
                              
                              return (
                                <div key={qIdx} className="space-y-2 py-3 border-b border-slate-900 last:border-0">
                                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-1.5 leading-relaxed">
                                    <span className="text-slate-500 font-mono mr-1">{qIdx + 1}.</span>
                                    <span>{q.question_start}</span>
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-2 py-1 rounded bg-slate-900 border text-xs font-semibold ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10')
                                          : 'border-slate-800 text-indigo-300'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    <span>{q.question_end}</span>
                                    {checked && !isCorrect && (
                                      <span className="text-3xs text-slate-500 font-mono ml-2">Đúng: <span className="text-emerald-400 font-bold">{q.correct_answer}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Part 5: Vocabulary - Synonym Matching */}
                      {item.question5_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 5: Vocabulary - Synonym Matching (Tìm từ đồng nghĩa)</h4>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                            {item.question5_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p5_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.correct_answer;
                              const options = (item.question5_list && item.question5_list[0]) ? item.question5_list[0].question_answer.filter(Boolean) : [];
                              
                              return (
                                <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-900 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-mono">{qIdx + 1}.</span>
                                    <span className="text-xs font-bold text-slate-200 capitalize">{q.question_orginal}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-3 py-1.5 rounded bg-slate-900 border text-xs font-semibold min-w-[150px] ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10')
                                          : 'border-slate-800 text-indigo-300'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    {checked && !isCorrect && (
                                      <span className="text-3xs text-slate-500">Đúng: <span className="text-emerald-400 font-bold">{q.correct_answer}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Part 6: Vocabulary - Collocation Matching */}
                      {item.question6_list && (
                        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                          <h4 className="font-bold text-sm text-indigo-400">Part 6: Vocabulary - Collocation Matching (Kết hợp từ)</h4>
                          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                            {item.question6_list.map((q: any, qIdx: number) => {
                              const qKey = `g_p6_${selectedItemIndex}_${qIdx}`;
                              const isCorrect = answers[qKey] === q.correct_answer;
                              const options = (item.question6_list && item.question6_list[0]) ? item.question6_list[0].question_answer.filter(Boolean) : [];
                              
                              return (
                                <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-900 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-mono">{qIdx + 1}.</span>
                                    <span className="text-xs font-bold text-slate-200 capitalize">{q.question_orginal} + ...</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <select
                                      value={answers[qKey] || ''}
                                      disabled={checked}
                                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                      className={`px-3 py-1.5 rounded bg-slate-900 border text-xs font-semibold min-w-[150px] ${
                                        checked
                                          ? (isCorrect ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-red-500 text-red-400 bg-red-500/10')
                                          : 'border-slate-800 text-indigo-300'
                                      }`}
                                    >
                                      <option value="">Chọn từ...</option>
                                      {options.map((opt: string, oIdx: number) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    {checked && !isCorrect && (
                                      <span className="text-3xs text-slate-500">Đúng: <span className="text-emerald-400 font-bold">{q.correct_answer}</span></span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
          )}
      </main>
    </div>
  );
}
