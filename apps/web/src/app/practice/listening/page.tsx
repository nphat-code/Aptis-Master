'use client';

import React, { useState, useRef, useEffect } from 'react';

// Interfaces for component props and data models
interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface ListeningLesson {
  id: string;
  title: string;
  part: string;
  audioUrl: string;
  description: string;
  questions: Question[];
  tips: string[];
}

// Sample listening mock data
const mockLesson: ListeningLesson = {
  id: 'list-001',
  title: 'Part 1: Information Gathering - Direct Messages',
  part: 'Listening Part 1',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample public MP3 URL
  description: 'Listen to a short phone message and answer the multiple-choice questions.',
  questions: [
    {
      id: 'q1',
      questionText: 'What time is the conference scheduled to start?',
      options: ['9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
      correctAnswer: 1, // '10:00 AM'
    },
    {
      id: 'q2',
      questionText: 'Which document must the participants bring?',
      options: ['Registration confirmation', 'Signed contract', 'Valid photo ID', 'Printed agenda'],
      correctAnswer: 2, // 'Valid photo ID'
    }
  ],
  tips: [
    'Read the questions and options quickly before the audio starts.',
    'Focus on keywords like times, dates, documents, and locations.',
    'Be careful with distractors: the speaker might mention multiple times but change their mind.'
  ]
};

export default function AptisListeningPlayer() {
  const [lesson] = useState<ListeningLesson>(mockLesson);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLInputElement | null>(null);

  // Synchronize audio element state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio Event Handlers
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Skip forward or backward by X seconds
  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + seconds;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Helper to format time (e.g., 01:24)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Select an option
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return; // Locked after grading
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Check answers
  const handleSubmit = () => {
    setShowResults(true);
  };

  // Reset exercise
  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 flex flex-col items-center">
      {/* Background Glows for Premium Vibe */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-6xl w-full">
        {/* Header Breadcrumbs & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-3">
              {lesson.part}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-200 via-indigo-200 to-fuchsia-200 bg-clip-text text-transparent">
              {lesson.title}
            </h1>
            <p className="text-slate-400 mt-1">{lesson.description}</p>
          </div>
          
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset Practice
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Player & Study Tips */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Custom Audio Player Container (Glassmorphic design) */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">Aptis Keys Simulator</h3>
                  <p className="text-xs text-slate-500">Audio playback engine</p>
                </div>
              </div>

              {/* HTML5 Native Audio (Hidden, controlled via custom UI) */}
              <audio
                ref={audioRef}
                src={lesson.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
                className="hidden"
              />

              {/* Custom Scrubbing Bar */}
              <div className="space-y-2 mb-6">
                <input
                  type="range"
                  ref={progressRef}
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${
                      duration ? (currentTime / duration) * 100 : 0
                    }%, rgb(30, 41, 59) ${
                      duration ? (currentTime / duration) * 100 : 0
                    }%, rgb(30, 41, 59) 100%)`
                  }}
                />
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls Panel */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center gap-5">
                  {/* Skip Backward 10s */}
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition-all"
                    title="Rewind 10s"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Play / Pause button */}
                  <button
                    onClick={handlePlayPause}
                    className="p-5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-violet-600/20 active:scale-95 transition-all"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 translate-x-[1px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    )}
                  </button>

                  {/* Skip Forward 10s */}
                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition-all"
                    title="Skip 10s"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                <hr className="border-slate-800/80" />

                {/* Speed & Volume Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Speed Controls */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Speed</label>
                    <div className="flex items-center gap-1.5">
                      {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setPlaybackRate(rate)}
                          className={`flex-1 py-1 rounded-md text-xs font-medium border transition-all ${
                            playbackRate === rate
                              ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/10'
                              : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border-slate-850'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Volume</label>
                    <div className="flex items-center gap-2 h-7">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Listening Tips Panel */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h4 className="font-bold text-violet-300 flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21m0 0-.813-5.096L3 14.25l5.096-.813a2.38 2.38 0 0 0 1.808-1.808L10.718 6.5l.813 5.096a2.38 2.38 0 0 0 1.808 1.808l5.096.813-5.096.813a2.38 2.38 0 0 0-1.808 1.808L9 21Zm7.5-13.5L15.75 9M21 12l-1.5 1.5M12 3l-1.5 1.5" />
                </svg>
                Study & Exam Tips
              </h4>
              <ul className="space-y-3">
                {lesson.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-950 border border-violet-850 flex items-center justify-center font-bold text-xs text-violet-400">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Question Panel & Interactive Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-4 mb-6 flex items-center justify-between">
                <span>Practice Questions</span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
                  {Object.keys(selectedAnswers).length} / {lesson.questions.length} answered
                </span>
              </h2>

              <div className="space-y-8">
                {lesson.questions.map((q, qIndex) => {
                  const hasAnswered = selectedAnswers[q.id] !== undefined;
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="space-y-4">
                      <h4 className="font-semibold text-slate-200 flex gap-2">
                        <span className="text-violet-400">Q{qIndex + 1}.</span>
                        <span>{q.questionText}</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((option, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          let optionStyle = 'bg-slate-800/30 hover:bg-slate-800 text-slate-350 border-slate-800';

                          if (isSelected) {
                            optionStyle = 'bg-violet-600/20 border-violet-500 text-violet-200';
                          }

                          // Post-submission validation styling
                          if (showResults) {
                            if (oIdx === q.correctAnswer) {
                              optionStyle = 'bg-emerald-600/25 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-600/5';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'bg-rose-600/25 border-rose-500 text-rose-300 shadow-md shadow-rose-600/5';
                            } else {
                              optionStyle = 'bg-slate-800/20 text-slate-500 border-slate-850 cursor-not-allowed';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={showResults}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${optionStyle}`}
                            >
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                                isSelected ? 'bg-violet-600 text-white' : 'bg-slate-850 text-slate-400'
                              } ${
                                showResults && oIdx === q.correctAnswer ? 'bg-emerald-600 text-white' : ''
                              } ${
                                showResults && isSelected && !isCorrect ? 'bg-rose-600 text-white' : ''
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Display correct/incorrect flags after submit */}
                      {showResults && (
                        <div className={`text-xs p-3 rounded-lg flex items-center gap-2 border ${
                          isCorrect 
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' 
                            : 'bg-rose-950/40 text-rose-400 border-rose-900/50'
                        }`}>
                          {isCorrect ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                              <span>Correct! The correct answer is <strong>{q.options[q.correctAnswer]}</strong>.</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                              <span>Incorrect. You selected {hasAnswered ? <strong>{q.options[selectedAnswers[q.id]]}</strong> : 'nothing'}. The correct answer is <strong>{q.options[q.correctAnswer]}</strong>.</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons Panel */}
              <div className="border-t border-slate-800 mt-8 pt-6 flex flex-wrap gap-4 items-center justify-between">
                {!showResults ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length < lesson.questions.length}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border-slate-850 disabled:cursor-not-allowed text-white font-semibold rounded-xl border border-violet-500/20 shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 hover:scale-[1.01] disabled:scale-100 transition-all"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 w-full justify-between">
                    <div className="text-sm">
                      Your Score:{' '}
                      <span className="text-lg font-bold text-violet-400">
                        {lesson.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length}
                      </span>
                      /{lesson.questions.length} (
                      {Math.round(
                        (lesson.questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length /
                          lesson.questions.length) *
                          100
                      )}
                      %)
                    </div>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-medium rounded-xl border border-violet-500/30 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
