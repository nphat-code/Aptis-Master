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
      questionSets: any[];
    };
    question4: {
      question4Content: any[];
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
  const [questionInputVal, setQuestionInputVal] = useState<string>('1');
  const [selectedSubPart, setSelectedSubPart] = useState<string | null>(null);

  useEffect(() => {
    setQuestionInputVal(String(selectedItemIndex + 1));
  }, [selectedItemIndex]);

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [checked, setChecked] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [showResultModal, setShowResultModal] = useState(false);

  // Practice session countdown timer
  const [timeLeft, setTimeLeft] = useState(2100); // 35 minutes
  const [timerActive, setTimerActive] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Part 2 Sentence Ordering State & Handlers
  const [part2UserOrder, setPart2UserOrder] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedSubPart === 'part2' && data?.reading?.question2?.questionSets?.[selectedItemIndex]) {
      const orig = data.reading.question2.questionSets[selectedItemIndex] as string[];
      if (orig && orig.length > 1) {
        let shuffled = [...orig];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled.join('|||') === orig.join('|||')) {
          [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
        }
        setPart2UserOrder(shuffled);
      }
    }
  }, [selectedSubPart, selectedItemIndex, data]);

  const movePart2Item = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= part2UserOrder.length) return;
    const newArr = [...part2UserOrder];
    const [moved] = newArr.splice(fromIdx, 1);
    newArr.splice(toIdx, 0, moved);
    setPart2UserOrder(newArr);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    movePart2Item(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const calculateReadingScore = () => {
    if (!data?.reading) return { score: 0, total: 0 };
    let score = 0;
    let total = 0;

    if (selectedSubPart === 'part1') {
      const list = data.reading.question1[selectedItemIndex] || [];
      total = list.length * 2;
      list.forEach((q: any, idx: number) => {
        if (answers[`p1_${selectedItemIndex}_${idx}`] === q.correctAnswer) {
          score += 2;
        }
      });
    } else if (selectedSubPart === 'part2') {
      const orig = data.reading.question2.questionSets[selectedItemIndex] || [];
      total = orig.length;
      orig.forEach((origSentence: string, idx: number) => {
        if (part2UserOrder[idx] === origSentence) {
          score++;
        }
      });
    } else if (selectedSubPart === 'part4') {
      const list = data.reading.question4.question4Content[selectedItemIndex] || [];
      total = list.length * 2;
      list.forEach((q: any, idx: number) => {
        if (answers[`p4_${selectedItemIndex}_${idx}`] === q.answer) {
          score += 2;
        }
      });
    } else if (selectedSubPart === 'part5') {
      const list = data.reading.question5.paragraph_question5[selectedItemIndex] || [];
      const options = data.reading.question5.options[selectedItemIndex] || [];
      total = list.length * 2;
      list.forEach((_: any, idx: number) => {
        if (answers[`p5_${selectedItemIndex}_${idx}`] === options[idx]) {
          score += 2;
        }
      });
    }

    return { score, total };
  };

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
    setShowResultModal(false);
  }, [activeTab, subView, selectedItemIndex, selectedSubPart]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (activeTab === 'reading' && subView === 'practice' && selectedSubPart !== null) {
      setTimeLeft(2100); // 35:00
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [activeTab, subView, selectedSubPart, selectedItemIndex]);

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
      {/* Sidebar Navigation - Hidden during active practice session */}
      {!(subView === 'practice' && selectedSubPart !== null) && (
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm md:text-base font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#495057] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#495057]/60'
              }`}
            >
              <span className="text-sm">⚙️</span> Trang chủ
            </button>

            {/* Học Reading */}
            <div>
              <button
                onClick={() => setSidebarOpen({ ...sidebarOpen, reading: !sidebarOpen.reading })}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm md:text-base font-bold text-slate-300 hover:text-white hover:bg-[#495057]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">📖</span> Học reading
                </div>
                <span className={`text-[10px] text-slate-400 transform transition-transform duration-300 ${sidebarOpen.reading ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen.reading ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'reading' && subView === 'practice' && selectedSubPart === null ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'reading' && subView === 'tests' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'reading' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Mẹo học nhanh
                  </button>
                </div>
              </div>
            </div>

            {/* Học Listening */}
            <div>
              <button
                onClick={() => setSidebarOpen({ ...sidebarOpen, listening: !sidebarOpen.listening })}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm md:text-base font-bold text-slate-300 hover:text-white hover:bg-[#495057]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">🎧</span> Học Listening
                </div>
                <span className={`text-[10px] text-slate-400 transform transition-transform duration-300 ${sidebarOpen.listening ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen.listening ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'listening' && subView === 'practice' && selectedSubPart === null ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'listening' && subView === 'tests' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'listening' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Mẹo nhớ
                  </button>
                </div>
              </div>
            </div>

            {/* Học Writing */}
            <div>
              <button
                onClick={() => setSidebarOpen({ ...sidebarOpen, writing: !sidebarOpen.writing })}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm md:text-base font-bold text-slate-300 hover:text-white hover:bg-[#495057]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">✍️</span> Học Writing
                </div>
                <span className={`text-[10px] text-slate-400 transform transition-transform duration-300 ${sidebarOpen.writing ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen.writing ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'writing' && subView === 'practice' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học câu lạc bộ
                  </button>
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'writing' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Mẹo viết thư
                  </button>
                </div>
              </div>
            </div>

            {/* Học Speaking */}
            <div>
              <button
                onClick={() => setSidebarOpen({ ...sidebarOpen, speaking: !sidebarOpen.speaking })}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm md:text-base font-bold text-slate-300 hover:text-white hover:bg-[#495057]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">🗣️</span> Học speaking
                </div>
                <span className={`text-[10px] text-slate-400 transform transition-transform duration-300 ${sidebarOpen.speaking ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen.speaking ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-6 pr-2 py-1 space-y-1 bg-[#2b3035]/20 rounded-lg">
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'speaking' && subView === 'practice' && selectedSubPart === null ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className={`w-full text-left px-3 py-2 rounded text-xs md:text-sm font-semibold transition-all ${activeTab === 'speaking' && subView === 'tips' ? 'text-indigo-400 font-bold bg-[#495057]/40' : 'text-slate-400 hover:text-white hover:bg-[#495057]/20'}`}
                  >
                    • Mẹo học nhanh
                  </button>
                </div>
              </div>
            </div>

            {/* Học Grammar */}
            <button
              onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm md:text-base font-bold transition-all ${
                activeTab === 'grammar'
                  ? 'bg-[#495057] text-white shadow-sm'
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
      )}

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
          <div className="flex-1 overflow-y-auto p-8 max-w-none w-full space-y-8 bg-[#f3f4f6]">
            {/* Grid of categories matching reference image */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Column 1: Reading */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Reading</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    ❓ Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    📖 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('reading'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 2: Listening */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Listening</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    ❓ Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tests'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0dcaf0] text-slate-900 hover:bg-[#31d2f2] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    📖 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('listening'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#6c757d] text-white hover:bg-[#5c636a] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 3: Speaking */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Speaking</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('practice'); setSelectedSubPart(null); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    🎧 Học theo câu hỏi
                  </button>
                  <button
                    onClick={() => { setActiveTab('speaking'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    💡 Mẹo nhớ
                  </button>
                </div>
              </div>

              {/* Column 4: Writing */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Writing</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    📝 Học câu lạc bộ
                  </button>
                  <button
                    onClick={() => { setActiveTab('writing'); setSubView('tips'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
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
                <div className="space-y-4">
                  <button
                    onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    📕 Học theo bộ đề
                  </button>
                  <button
                    onClick={() => { setActiveTab('grammar'); setSubView('practice'); setSelectedItemIndex(0); }}
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    💡 Lưu ý về ngữ pháp
                  </button>
                </div>
              </div>

              {/* Column 2: Nhóm và trang */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Nhóm và trang</h3>
                <div className="space-y-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base text-center"
                  >
                    👥 Nhóm học Facebook
                  </a>
                  <a
                    href="https://aptiskey.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#198754] text-white hover:bg-[#157347] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base text-center"
                  >
                    📝 Trang thi mẫu Aptis
                  </a>
                </div>
              </div>

              {/* Column 3: Khác */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Khác</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => alert('Cảm ơn bạn! Học tập cá nhân không cần donate.')}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    ❤️ Donate cho web
                  </button>
                  <button
                    onClick={() => alert('Hướng dẫn học: Làm lần lượt các bài tập theo chủ đề ở menu bên trái!')}
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
                  >
                    📖 Hướng dẫn học
                  </button>
                </div>
              </div>

              {/* Column 4: Theo dõi tin cập nhật */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-700 text-center border-b border-slate-200 pb-2">Theo dõi tin cập nhật aptis</h3>
                <div className="space-y-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#0d6efd] text-white hover:bg-[#0b5ed7] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base text-center"
                  >
                    👥 Theo dõi fanpage
                  </a>
                  <button
                    onClick={() => alert('Cách tính điểm: Mỗi kỹ năng tính điểm thang 50, điểm quy đổi theo chuẩn Aptis ESOL.')}
                    className="w-full bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
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
                <div className="space-y-4">
                  <button
                    onClick={() => alert('Review đề thi được cập nhật thường xuyên trên trang chủ!')}
                    className="w-full bg-[#dc3545] text-white hover:bg-[#bb2d3b] font-bold py-5 px-6 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-base"
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
          <div className="flex-1 flex flex-col overflow-hidden bg-[#f8f9fa]">
            {/* If practicing a specific part, show Welcome Topbar Header */}
            {subView === 'practice' && selectedSubPart !== null && (
              <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10">
                <button
                  onClick={() => setSelectedSubPart(null)}
                  className="flex items-center gap-2 font-bold text-slate-800 text-sm hover:text-slate-600 transition-all"
                >
                  🏠 <span className="text-base font-bold text-indigo-600 font-sans">Aptis Keys</span>
                </button>
                <div className="text-center font-bold text-slate-700 text-sm tracking-wide font-sans">
                  Time remaining: <span className="text-[#dc3545] font-mono text-base font-extrabold">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-right font-bold text-slate-650 text-xs md:text-sm tracking-wide uppercase font-sans font-sans">
                  Reading Question {selectedSubPart === 'part1' ? '1' : selectedSubPart === 'part2' ? '2 & 3' : selectedSubPart === 'part4' ? '4' : '5'}
                </div>
              </header>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              {/* Practice mode sidebar selector - only show if subView is NOT practice or if selectedSubPart === null */}
              {subView !== 'practice' && (
                <div className="w-64 border-r border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0 font-sans">
                  {subView === 'tips' && (
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Chọn mẹo nhớ nhanh</span>
                      {data?.reading_tips.map((tip, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedItemIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedItemIndex === idx ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Chủ đề {tip.id}
                        </button>
                      ))}
                    </div>
                  )}

                  {subView === 'tests' && (
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Danh sách bộ đề</span>
                      {data && Object.keys(data.reading_tests).map((testKey, idx) => (
                        <button
                          key={testKey}
                          onClick={() => setSelectedItemIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedItemIndex === idx ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Bài thi mẫu {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Workspace for Reading */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between">
                {subView === 'practice' && selectedSubPart === null ? (
                  /* 1. Landing Grid Selection */
                  <div className="max-w-6xl mx-auto w-full py-10 space-y-10 font-sans">
                    <h3 className="text-center font-bold text-slate-500 text-2xl tracking-wide uppercase tracking-widest">
                      Reading Practice - by question
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
                      {/* Part 1 */}
                      <button
                        onClick={() => { setSelectedSubPart('part1'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0d6efd] text-white hover:bg-[#0b5ed7] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">📖</span> Part 1
                      </button>

                      {/* Part 2 & 3 */}
                      <button
                        onClick={() => { setSelectedSubPart('part2'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0dcaf0] text-slate-900 hover:bg-[#31d2f2] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🧩</span> Part 2 & 3
                      </button>

                      {/* Part 4 */}
                      <button
                        onClick={() => { setSelectedSubPart('part4'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">📋</span> Part 4
                      </button>

                      {/* Part 5 */}
                      <button
                        onClick={() => { setSelectedSubPart('part5'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#198754] text-white hover:bg-[#157347] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">💡</span> Part 5
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Render Practice Exercises workspaces or Mock test or Tips */
                  <div className="flex-1 flex flex-col justify-between min-h-[450px]">
                    <div className="w-full space-y-6 pb-24 font-sans text-left">
                      {subView === 'practice' && (
                        <>
                          {/* Heading structure */}
                          <div className="text-left space-y-3 py-6">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-850 flex items-center flex-wrap gap-2 md:gap-3">
                              <span>Reading Question</span>
                              <input
                                type="number"
                                min={1}
                                max={
                                  selectedSubPart === 'part1' ? data?.reading.question1.length
                                  : selectedSubPart === 'part2' ? data?.reading.question2.questionSets.length
                                  : selectedSubPart === 'part4' ? data?.reading.question4.question4Content.length
                                  : data?.reading.question5.paragraph_question5.length
                                }
                                value={questionInputVal}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  setQuestionInputVal(raw);
                                  const total = selectedSubPart === 'part1' ? (data?.reading.question1.length || 1)
                                    : selectedSubPart === 'part2' ? (data?.reading.question2.questionSets.length || 1)
                                    : selectedSubPart === 'part4' ? (data?.reading.question4.question4Content.length || 1)
                                    : (data?.reading.question5.paragraph_question5.length || 1);
                                  const val = parseInt(raw, 10);
                                  if (!isNaN(val) && val >= 1 && val <= total) {
                                    setSelectedItemIndex(val - 1);
                                    setAnswers({});
                                    setChecked(false);
                                  }
                                }}
                                onBlur={() => {
                                  const total = selectedSubPart === 'part1' ? (data?.reading.question1.length || 1)
                                    : selectedSubPart === 'part2' ? (data?.reading.question2.questionSets.length || 1)
                                    : selectedSubPart === 'part4' ? (data?.reading.question4.question4Content.length || 1)
                                    : (data?.reading.question5.paragraph_question5.length || 1);
                                  const val = parseInt(questionInputVal, 10);
                                  if (isNaN(val) || val < 1) {
                                    setSelectedItemIndex(0);
                                    setQuestionInputVal('1');
                                  } else if (val > total) {
                                    setSelectedItemIndex(total - 1);
                                    setQuestionInputVal(String(total));
                                  } else {
                                    setQuestionInputVal(String(val));
                                  }
                                }}
                                className="w-16 md:w-20 text-center font-extrabold bg-white border-2 border-indigo-600 rounded-xl py-0.5 px-1 text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 shadow-sm transition-all text-2xl md:text-3xl"
                              />
                              <span>of {
                                selectedSubPart === 'part1' ? data?.reading.question1.length
                                : selectedSubPart === 'part2' ? data?.reading.question2.questionSets.length
                                : selectedSubPart === 'part4' ? data?.reading.question4.question4Content.length
                                : data?.reading.question5.paragraph_question5.length
                              }</span>
                            </h2>
                            <p className="text-sm font-semibold text-slate-500">
                              {selectedSubPart === 'part1' && 'Choose the word that fits in the gap. The first one is done for you.'}
                              {selectedSubPart === 'part2' && 'The sentences below make a complete text. Put them in the correct order.'}
                              {selectedSubPart === 'part4' && 'Read the text and assign speaker statements to Speaker A, B, C or D.'}
                              {selectedSubPart === 'part5' && 'Read the text and choose the correct heading for each paragraph.'}
                            </p>
                          </div>

                          {/* Exercise workspace container styling */}
                          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
                            {/* Part 1 Content */}
                            {selectedSubPart === 'part1' && data && (
                              <div className="space-y-2">
                                {(data.reading.question1[selectedItemIndex] as any[] || []).map((q, qIdx) => {
                                  const qKey = `p1_${selectedItemIndex}_${qIdx}`;
                                  const isCorrect = answers[qKey] === q.correctAnswer;
                                  return (
                                    <div key={qIdx} className="py-2 border-b border-slate-100 last:border-0">
                                      <div className="flex-1 text-base text-slate-800 leading-relaxed flex flex-wrap items-center gap-2">
                                        <span>{q.questionStart}</span>
                                        <select
                                          value={answers[qKey] || ''}
                                          onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                          className={`px-3 py-1.5 rounded-lg border text-sm font-bold transition-all bg-white text-slate-805 focus:outline-none ${
                                            checked
                                              ? (isCorrect
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                                                : 'border-red-500 bg-red-50 text-red-700 font-bold')
                                              : 'border-slate-300 text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                          }`}
                                        >
                                          <option value=""></option>
                                          {(q.answerOptions as string[]).map((opt, oIdx) => (
                                            <option key={oIdx} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                        <span>{q.questionEnd}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Part 2 Content (Sentence Ordering Drag & Drop) */}
                            {selectedSubPart === 'part2' && data && (
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                                  <span>💡</span>
                                  <span>Gương mặt các câu đã được xáo trộn. Kéo biểu tượng <strong className="text-indigo-600">⋮⋮</strong> hoặc dùng các nút <strong className="text-indigo-600">▲ / ▼</strong> để sắp xếp thứ tự đoạn văn đúng từ trên xuống dưới.</span>
                                </p>
                                {part2UserOrder.map((sentence: string, idx: number) => {
                                  const orig = data.reading.question2.questionSets[selectedItemIndex] || [];
                                  const isCorrect = checked && sentence === orig[idx];
                                  const isDragging = draggedIndex === idx;

                                  return (
                                    <div
                                      key={sentence}
                                      draggable={true}
                                      onDragStart={(e) => handleDragStart(e, idx)}
                                      onDragOver={(e) => handleDragOver(e, idx)}
                                      onDrop={(e) => handleDrop(e, idx)}
                                      className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                                        isDragging ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50' : ''
                                      } ${
                                        checked
                                          ? (isCorrect
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                            : 'bg-red-50 border-red-500 text-red-800')
                                          : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                                      }`}
                                    >
                                      {/* Order Badge & Drag Handle */}
                                      <div className="flex items-center gap-2 select-none">
                                        <span className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 text-lg font-bold px-1" title="Kéo thả để sắp xếp">
                                          ⋮⋮
                                        </span>
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                                          checked
                                            ? (isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white')
                                            : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                          {idx + 1}
                                        </span>
                                      </div>

                                      {/* Sentence Content */}
                                      <div className="flex-1">
                                        <p className="text-sm font-medium leading-relaxed text-slate-800">{sentence}</p>
                                      </div>

                                      {/* Up / Down Controls */}
                                      <div className="flex flex-col gap-1 select-none">
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => movePart2Item(idx, idx - 1)}
                                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-20 text-xs font-bold transition-all"
                                          title="Chuyển lên"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          disabled={idx === part2UserOrder.length - 1}
                                          onClick={() => movePart2Item(idx, idx + 1)}
                                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-20 text-xs font-bold transition-all"
                                          title="Chuyển xuống"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Part 4 Content (Matching Speaker A, B, C, D) */}
                            {selectedSubPart === 'part4' && data && (
                              <div className="space-y-4">
                                {(data.reading.question4.question4Content[selectedItemIndex] || []).map((q: any, idx: number) => {
                                  const qKey = `p4_${selectedItemIndex}_${idx}`;
                                  const isCorrect = answers[qKey] === q.answer;
                                  return (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                      <p className="text-sm font-bold text-slate-800">{idx + 1}. {q.question}</p>
                                      <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map((person) => (
                                          <button
                                            key={person}
                                            onClick={() => setAnswers({ ...answers, [qKey]: person })}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                              answers[qKey] === person
                                                ? (checked
                                                  ? (isCorrect ? 'bg-emerald-100 text-emerald-700 border-emerald-500 font-bold' : 'bg-red-100 text-red-700 border-red-500 font-bold')
                                                  : 'bg-indigo-600 text-white border-indigo-500 shadow-sm')
                                                : 'bg-white text-slate-650 border-slate-300 hover:text-slate-800 hover:bg-slate-50'
                                            }`}
                                          >
                                            Speaker {person}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Part 5 Content */}
                            {selectedSubPart === 'part5' && data && (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Từ khóa lựa chọn</span>
                                  <div className="flex flex-wrap gap-2">
                                    {(data.reading.question5.options[selectedItemIndex] || []).map((opt, oIdx) => (
                                      <span key={oIdx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-750 shadow-sm">
                                        {opt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="lg:col-span-8 space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800">
                                  {(data.reading.question5.paragraph_question5[selectedItemIndex] || []).map((block, bIdx) => {
                                    const qKey = `p5_${selectedItemIndex}_${bIdx}`;
                                    const optionsList = data.reading.question5.options[selectedItemIndex] || [];
                                    const correctWord = optionsList[bIdx];
                                    const isCorrect = answers[qKey] === correctWord;
                                    return (
                                      <div key={bIdx} className="mb-5 space-y-2 border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                                        <p className="text-[#343a40] leading-relaxed">{block}</p>
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-bold text-slate-400">Ô trống {bIdx + 1}:</span>
                                          <select
                                            value={answers[qKey] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value })}
                                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all bg-white text-slate-850 focus:outline-none ${
                                              checked
                                                ? (isCorrect ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-red-500 text-red-700 bg-red-50')
                                                : 'border-slate-300 text-slate-700'
                                            }`}
                                          >
                                            <option value=""></option>
                                            {optionsList.map((opt, oIdx) => (
                                              <option key={oIdx} value={opt}>{opt}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Mock Reading tests */}
                      {subView === 'tests' && data && (
                        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
                          <h3 className="text-2xl font-bold text-slate-800">
                            {data.reading_tests[Object.keys(data.reading_tests)[selectedItemIndex]]?.label}
                          </h3>
                          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="text-xs text-indigo-500 uppercase tracking-widest font-bold">Simulator Mock Exam</span>
                              <h4 className="text-lg font-bold text-slate-850 mt-1">Trình mô phỏng bài thi đọc thực tế</h4>
                            </div>
                            <button
                              onClick={() => alert('Bản học tập cá nhân hỗ trợ luyện thi theo bộ câu hỏi chi tiết. Hãy sử dụng Học theo câu hỏi để luyện từng phần.')}
                              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all text-sm shadow"
                            >
                              Bắt đầu thi thử
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reading Tips */}
                      {subView === 'tips' && data && (
                        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
                          <h3 className="text-2xl font-bold text-slate-850">
                            Mẹo làm bài - Chủ đề {data.reading_tips[selectedItemIndex].id}
                          </h3>
                          <div 
                            className="prose max-w-none text-slate-700 text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.reading_tips[selectedItemIndex].meo }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Fixed/Sticky bottom toolbar bar for Practice Mode */}
                    {subView === 'practice' && selectedSubPart !== null && (
                      <div className="fixed bottom-0 left-0 right-0 bg-[#e9ecef] border-t border-slate-300 py-4 px-8 flex items-center justify-between z-30 font-sans">
                        <button
                          disabled={selectedItemIndex === 0}
                          onClick={() => { setSelectedItemIndex(prev => prev - 1); setAnswers({}); setChecked(false); }}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                            selectedItemIndex === 0
                              ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                              : 'bg-white text-slate-700 border-slate-450 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-sm'
                          }`}
                        >
                          Back
                        </button>
                        <button
                          onClick={() => {
                            setChecked(true);
                            setShowResultModal(true);
                          }}
                          className="px-8 py-3 rounded-xl bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-bold text-sm transition-all active:scale-95 shadow-md"
                        >
                          Check result
                        </button>
                        <button
                          disabled={
                            selectedItemIndex === (
                              selectedSubPart === 'part1' ? data?.reading.question1.length
                              : selectedSubPart === 'part2' ? data?.reading.question2.questionSets.length
                              : selectedSubPart === 'part4' ? data?.reading.question4.question4Content.length
                              : data?.reading.question5.paragraph_question5.length
                            ) - 1
                          }
                          onClick={() => { setSelectedItemIndex(prev => prev + 1); setAnswers({}); setChecked(false); }}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all text-white ${
                            selectedItemIndex === (
                              selectedSubPart === 'part1' ? data?.reading.question1.length
                              : selectedSubPart === 'part2' ? data?.reading.question2.questionSets.length
                              : selectedSubPart === 'part4' ? data?.reading.question4.question4Content.length
                              : data?.reading.question5.paragraph_question5.length
                            ) - 1
                              ? 'bg-emerald-300 cursor-not-allowed'
                              : 'bg-[#198754] hover:bg-[#157347] active:scale-95 shadow-md'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* LISTENING PRACTICE / MOCK / TIPS */}
        {activeTab === 'listening' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* If practicing a specific part, show Topbar Header */}
            {subView === 'practice' && selectedSubPart !== null && (
              <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10 font-sans">
                <button
                  onClick={() => setSelectedSubPart(null)}
                  className="flex items-center gap-2 font-bold text-white text-sm hover:text-slate-300 transition-all"
                >
                  🏠 <span className="text-base font-bold text-indigo-400 font-sans">Aptis Keys</span>
                </button>
                <div className="text-center font-bold text-slate-200 text-sm tracking-wide font-sans">
                  Listening Practice
                </div>
                <div className="text-right font-bold text-slate-400 text-xs md:text-sm tracking-wide uppercase font-sans">
                  {selectedSubPart === 'part1' ? 'Part 1: Nghe ngắn' : selectedSubPart === 'part2' ? 'Part 2: Nối ý kiến' : selectedSubPart === 'part3' ? 'Part 3: Hội thoại dài' : 'Part 4: Phân tích sâu'}
                </div>
              </header>
            )}

            <div className="flex-1 flex overflow-hidden">
              {/* Practice mode sidebar selector */}
              {subView === 'practice' && selectedSubPart !== null && (
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
                {subView === 'practice' && selectedSubPart === null && (
                  /* 1. Landing Grid Selection for Listening */
                  <div className="max-w-6xl mx-auto w-full py-10 space-y-10 font-sans">
                    <h3 className="text-center font-bold text-slate-500 text-2xl tracking-wide uppercase tracking-widest">
                      Listening Practice - by question
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
                      {/* Part 1 */}
                      <button
                        onClick={() => { setSelectedSubPart('part1'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0d6efd] text-white hover:bg-[#0b5ed7] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🎧</span> Part 1
                      </button>

                      {/* Part 2 */}
                      <button
                        onClick={() => { setSelectedSubPart('part2'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0dcaf0] text-slate-900 hover:bg-[#31d2f2] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🧩</span> Part 2
                      </button>

                      {/* Part 3 */}
                      <button
                        onClick={() => { setSelectedSubPart('part3'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🗣️</span> Part 3
                      </button>

                      {/* Part 4 */}
                      <button
                        onClick={() => { setSelectedSubPart('part4'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#198754] text-white hover:bg-[#157347] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">💡</span> Part 4
                      </button>
                    </div>
                  </div>
                )}

                {subView === 'practice' && selectedSubPart === 'part1' && (
                  <div className="w-full space-y-6 text-left">
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
                  <div className="w-full space-y-6 text-left">
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
                  <div className="w-full space-y-6 text-left">
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
                  <div className="w-full space-y-6 text-left">
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
            {/* If practicing a specific part, show Topbar Header */}
            {subView === 'practice' && selectedSubPart !== null && (
              <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10 font-sans">
                <button
                  onClick={() => setSelectedSubPart(null)}
                  className="flex items-center gap-2 font-bold text-white text-sm hover:text-slate-300 transition-all"
                >
                  🏠 <span className="text-base font-bold text-indigo-400 font-sans">Aptis Keys</span>
                </button>
                <div className="text-center font-bold text-slate-200 text-sm tracking-wide font-sans">
                  Speaking Practice
                </div>
                <div className="text-right font-bold text-slate-400 text-xs md:text-sm tracking-wide uppercase font-sans">
                  {selectedSubPart === 'part1' ? 'Part 1: Câu hỏi cá nhân' : selectedSubPart === 'part2' ? 'Part 2: Mô tả 1 ảnh' : selectedSubPart === 'part3' ? 'Part 3: So sánh 2 ảnh' : 'Part 4: Thảo luận sâu'}
                </div>
              </header>
            )}

            <div className="flex-1 flex overflow-hidden">
              {/* Practice mode sidebar selector */}
              {subView === 'practice' && selectedSubPart !== null && (
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
                {subView === 'practice' && selectedSubPart === null && (
                  /* 1. Landing Grid Selection for Speaking */
                  <div className="max-w-6xl mx-auto w-full py-10 space-y-10 font-sans">
                    <h3 className="text-center font-bold text-slate-500 text-2xl tracking-wide uppercase tracking-widest">
                      Speaking Practice - by question
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
                      {/* Part 1 */}
                      <button
                        onClick={() => { setSelectedSubPart('part1'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0d6efd] text-white hover:bg-[#0b5ed7] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🗣️</span> Part 1
                      </button>

                      {/* Part 2 */}
                      <button
                        onClick={() => { setSelectedSubPart('part2'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#0dcaf0] text-slate-900 hover:bg-[#31d2f2] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">🖼️</span> Part 2
                      </button>

                      {/* Part 3 */}
                      <button
                        onClick={() => { setSelectedSubPart('part3'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#ffc107] text-slate-900 hover:bg-[#ffca2c] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">⚖️</span> Part 3
                      </button>

                      {/* Part 4 */}
                      <button
                        onClick={() => { setSelectedSubPart('part4'); setSelectedItemIndex(0); setAnswers({}); setChecked(false); }}
                        className="bg-[#198754] text-white hover:bg-[#157347] py-5 px-6 rounded-xl shadow-md transition-all flex flex-col items-center justify-center gap-2 text-base font-bold hover:scale-105"
                      >
                        <span className="text-2xl">💡</span> Part 4
                      </button>
                    </div>
                  </div>
                )}

                {subView === 'practice' && selectedSubPart !== null && (
                  <div className="w-full space-y-6 text-left">
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
                  <div className="w-full space-y-8 text-left">
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
                    <div className="w-full space-y-8 text-left">
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

        {/* Result Modal Overlay */}
        {showResultModal && (
          <div
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 font-sans"
            onClick={() => setShowResultModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header: Part Title + Close 'X' Button in same row */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">
                  {selectedSubPart === 'part1' && 'Test and Answer Review Question 1'}
                  {selectedSubPart === 'part2' && 'Test and Answer Review Question 2 & 3'}
                  {selectedSubPart === 'part4' && 'Test and Answer Review Question 4'}
                  {selectedSubPart === 'part5' && 'Test and Answer Review Question 5'}
                </h3>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold px-2 py-1 transition-all rounded-lg hover:bg-slate-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Score and Compare Answers Table */}
              {(() => {
                let scoreText = '';
                let rowsData: { question?: string; yourAns: string; correctAns: string; isCorrect: boolean }[] = [];
                let hasQuestionCol = false;

                if (selectedSubPart === 'part1' && data?.reading.question1[selectedItemIndex]) {
                  const list = data.reading.question1[selectedItemIndex];
                  let correctCount = 0;
                  list.forEach((q: any, idx: number) => {
                    const uAns = answers[`p1_${selectedItemIndex}_${idx}`] || '(Chưa chọn)';
                    const cAns = q.correctAnswer;
                    const isCorr = uAns === cAns;
                    if (isCorr) correctCount++;
                    rowsData.push({ yourAns: uAns, correctAns: cAns, isCorrect: isCorr });
                  });
                  scoreText = `Your Score: ${correctCount * 2} / ${list.length * 2}`;
                  hasQuestionCol = false;
                } else if (selectedSubPart === 'part2' && data?.reading.question2.questionSets[selectedItemIndex]) {
                  const orig = data.reading.question2.questionSets[selectedItemIndex] || [];
                  let correctCount = 0;
                  orig.forEach((origSentence: string, idx: number) => {
                    const uSentence = part2UserOrder[idx] || '(Chưa sắp xếp)';
                    const cSentence = origSentence;
                    const isCorr = uSentence === cSentence;
                    if (isCorr) correctCount++;
                    rowsData.push({ question: `Câu ${idx + 1}`, yourAns: uSentence, correctAns: cSentence, isCorrect: isCorr });
                  });
                  scoreText = `Your Score: ${correctCount} / 5`;
                  hasQuestionCol = true;
                } else if (selectedSubPart === 'part4' && data?.reading.question4.question4Content[selectedItemIndex]) {
                  const list = data.reading.question4.question4Content[selectedItemIndex] || [];
                  let correctCount = 0;
                  list.forEach((q: any, idx: number) => {
                    const uVal = answers[`p4_${selectedItemIndex}_${idx}`];
                    const uAns = uVal ? `Speaker ${uVal}` : '(Chưa chọn)';
                    const cAns = `Speaker ${q.answer}`;
                    const isCorr = uVal === q.answer;
                    if (isCorr) correctCount++;
                    rowsData.push({ question: `Question ${idx + 1}`, yourAns: uAns, correctAns: cAns, isCorrect: isCorr });
                  });
                  scoreText = `Your Score: ${correctCount * 2} / ${list.length * 2}`;
                  hasQuestionCol = true;
                } else if (selectedSubPart === 'part5' && data?.reading.question5.paragraph_question5[selectedItemIndex]) {
                  const list = data.reading.question5.paragraph_question5[selectedItemIndex];
                  const optionsList = data.reading.question5.options[selectedItemIndex] || [];
                  let correctCount = 0;
                  list.forEach((_: any, idx: number) => {
                    const uAns = answers[`p5_${selectedItemIndex}_${idx}`] || '(Chưa chọn)';
                    const cAns = optionsList[idx] || '';
                    const isCorr = uAns === cAns;
                    if (isCorr) correctCount++;
                    rowsData.push({ question: `${idx + 1}`, yourAns: uAns, correctAns: cAns, isCorrect: isCorr });
                  });
                  scoreText = `Your Score: ${correctCount * 2} / ${list.length * 2}`;
                  hasQuestionCol = true;
                }

                return (
                  <div className="space-y-4 text-center">
                    {/* Your Score Header */}
                    <div className="text-emerald-600 font-extrabold text-xl tracking-wide text-center">
                      {scoreText}
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-center border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-center">
                            {hasQuestionCol && <th className="p-3 border-r border-slate-200 w-28 text-center">Question</th>}
                            <th className="p-3 border-r border-slate-200 text-center">Your Answer</th>
                            <th className="p-3 text-center">Correct Answer</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {rowsData.map((row, idx) => (
                            <tr key={idx}>
                              {hasQuestionCol && (
                                <td className="p-3 font-semibold text-slate-700 border-r border-slate-200 bg-slate-50 text-center">
                                  {row.question}
                                </td>
                              )}
                              <td className={`p-3 font-semibold border-r border-slate-200 text-center ${
                                row.isCorrect ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                              }`}>
                                {row.yourAns}
                              </td>
                              <td className="p-3 font-semibold text-emerald-700 bg-emerald-50 text-center">
                                {row.correctAns}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
