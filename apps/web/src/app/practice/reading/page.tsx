'use client';

import React, { useState } from 'react';

// Interfaces for Reading/Grammar Question models
interface ReadingQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
  tip: string;
}

interface ReadingSection {
  id: string;
  title: string;
  part: string;
  passage: string; // HTML allowed or markdown string
  questions: ReadingQuestion[];
}

const mockReadingSection: ReadingSection = {
  id: 'read-001',
  part: 'Reading Part 3',
  title: 'Opinion Matching - The Future of Remote Work',
  passage: `
    <p class="mb-4 text-slate-305 leading-relaxed">
      <strong>Speaker A:</strong> Remote working has completely revolutionized our productivity metrics. Instead of wasting two hours in gridlock traffic, employees are starting their days refreshed. We have seen a 15% increase in output, and our team members report feeling more trusted. However, it requires a robust digital infrastructure to keep everyone aligned.
    </p>
    <p class="mb-4 text-slate-305 leading-relaxed">
      <strong>Speaker B:</strong> While the lack of commute is a clear benefit, the blurring of lines between personal and professional life is a major hazard. People are working longer hours, leading to burnout. Additionally, serendipitous collaboration—the quick office chats that lead to breakthrough ideas—cannot be simulated on messaging applications.
    </p>
    <p class="mb-4 text-slate-305 leading-relaxed">
      <strong>Speaker C:</strong> We adopted a hybrid model. The physical workspace is reserved for group brainstorms, client onboarding, and community building, while solitary work is done from home. This balances the flexibility that workers demand with the cultural cohesion that organizations require to survive.
    </p>
  `,
  questions: [
    {
      id: 'rq1',
      questionText: 'Which speaker is concerned about the negative impact of remote work on staff well-being?',
      options: ['Speaker A', 'Speaker B', 'Speaker C', 'None of them'],
      correctAnswer: 1, // Speaker B
      explanation: 'Speaker B explicitly mentions that "the blurring of lines between personal and professional life is a major hazard. People are working longer hours, leading to burnout."',
      tip: 'Look for synonyms: "well-being" relates to "burnout" and "personal and professional life hazard" mentioned by Speaker B.'
    },
    {
      id: 'rq2',
      questionText: 'Which speaker highlights a combined approach that integrates office collaboration with home flexibility?',
      options: ['Speaker A', 'Speaker B', 'Speaker C', 'All of them'],
      correctAnswer: 2, // Speaker C
      explanation: 'Speaker C explains they adopted a "hybrid model" where the office is for group brainstorming and home is for solitary work, balancing both flexibility and cohesion.',
      tip: 'The phrase "combined approach" maps directly to the "hybrid model" described in Speaker C\'s paragraph.'
    }
  ]
};

export default function AptisReadingGrammarPractice() {
  const [section] = useState<ReadingSection>(mockReadingSection);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'passage' | 'questions'>('passage'); // For mobile responsive layout

  // Answer selection handler
  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (submitted) return; // Lock inputs once submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Submit test and trigger calculations
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Reset state
  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  // Calculate scores
  const correctCount = section.questions.filter(
    q => selectedAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 flex flex-col items-center">
      {/* Background Glows for Premium Vibe */}
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl w-full">
        {/* Title Block */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              {section.part}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-200 via-indigo-200 to-violet-200 bg-clip-text text-transparent">
              {section.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-slate-350 hover:bg-slate-900 border border-slate-800 text-sm font-semibold rounded-xl transition-all"
            >
              Reset Attempt
            </button>
          </div>
        </div>

        {/* Mobile Tab Selectors (Hidden on md and up) */}
        <div className="flex md:hidden border-b border-slate-850 mb-4">
          <button
            onClick={() => setActiveTab('passage')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'passage'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400'
            }`}
          >
            Reading Passage
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400'
            }`}
          >
            Questions ({section.questions.length})
          </button>
        </div>

        {/* Desktop Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Passage Container (Left Pane) */}
          <div className={`md:col-span-6 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl ${
            activeTab === 'passage' ? 'block' : 'hidden md:block'
          }`}>
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 mb-5 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-450">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Read the Text
            </h3>
            
            {/* Displaying static HTML passage safe rendering wrapper */}
            <div 
              className="text-slate-300 text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: section.passage }}
            />
          </div>

          {/* Question Grid (Right Pane) */}
          <div className={`md:col-span-6 space-y-6 ${
            activeTab === 'questions' ? 'block' : 'hidden md:block'
          }`}>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 mb-6 flex items-center justify-between">
                <span>Select the Correct Answers</span>
                {submitted && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    correctCount === section.questions.length
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    Score: {correctCount}/{section.questions.length}
                  </span>
                )}
              </h3>

              <div className="space-y-8">
                {section.questions.map((q, qIdx) => {
                  const hasSelected = selectedAnswers[q.id] !== undefined;
                  const isAnswerCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="space-y-4 border-b border-slate-800/60 pb-6 last:border-0 last:pb-0">
                      <div className="flex gap-2.5">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-450 text-xs font-bold flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-250 leading-relaxed">
                          {q.questionText}
                        </h4>
                      </div>

                      {/* Options Grid */}
                      <div className="space-y-2.5 pl-8">
                        {q.options.map((option, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          let optionClass = 'bg-slate-800/30 hover:bg-slate-800 text-slate-350 border-slate-800';

                          if (isSelected) {
                            optionClass = 'bg-indigo-600/20 border-indigo-500 text-indigo-200';
                          }

                          if (submitted) {
                            if (oIdx === q.correctAnswer) {
                              optionClass = 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-600/5 cursor-default';
                            } else if (isSelected) {
                              optionClass = 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-md shadow-rose-600/5 cursor-default';
                            } else {
                              optionClass = 'bg-slate-800/10 text-slate-500 border-slate-850 cursor-default';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={submitted}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`w-full text-left py-3 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${optionClass}`}
                            >
                              <span>{option}</span>
                              {submitted && oIdx === q.correctAnswer && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-emerald-450">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                              )}
                              {submitted && isSelected && oIdx !== q.correctAnswer && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-rose-450">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Display explanation and tip after submission */}
                      {submitted && (
                        <div className="pl-8 space-y-3 mt-3 animate-fadeIn">
                          {/* Explanation Card */}
                          <div className="bg-slate-850/40 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed text-slate-350">
                            <span className="font-bold text-indigo-400 block mb-1">Explanation</span>
                            {q.explanation}
                          </div>

                          {/* Tip Badge / Card */}
                          <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 text-xs leading-relaxed text-slate-350">
                            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 1 1-3-3h3m-3-6h6a9 9 0 1 1-9 9V6Z" />
                              </svg>
                              <span>Aptis Tip</span>
                            </div>
                            {q.tip}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Footer controls */}
              <div className="border-t border-slate-800 mt-8 pt-6">
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length < section.questions.length}
                    className="w-full py-3 bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-600 hover:to-violet-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-indigo-500/10"
                  >
                    Finish and Grade Practice
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-slate-850 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-850"
                  >
                    Restart Practice Session
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
