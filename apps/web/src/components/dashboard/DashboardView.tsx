'use client';

import React, { useState, useEffect } from 'react';

interface DashboardViewProps {
  onSelectSkill: (skillId: string) => void;
  onStartMockTest: () => void;
}

interface SkillMeta {
  id: string;
  name: string;
  code: string;
  icon: string;
  totalSets: number;
  stripeColor: string;
  durationText: string;
  description: string;
}

const SKILLS_LIST: SkillMeta[] = [
  {
    id: 'reading',
    name: 'Reading',
    code: 'Đọc hiểu',
    icon: 'menu_book',
    totalSets: 14,
    stripeColor: '#059669', // Emerald
    durationText: '35 phút',
    description: 'Gap-fill, Cohesion, Opinion Matching & Long Text Comprehension.',
  },
  {
    id: 'listening',
    name: 'Listening',
    code: 'Nghe hiểu',
    icon: 'headphones',
    totalSets: 14,
    stripeColor: '#d97706', // Gold Amber
    durationText: '40 phút',
    description: '17 đoạn audio: Độc thoại, đối thoại, thông báo & bài phát biểu.',
  },
  {
    id: 'writing',
    name: 'Writing',
    code: 'Viết luận',
    icon: 'edit_note',
    totalSets: 10,
    stripeColor: '#4f46e5', // Indigo
    durationText: '50 phút',
    description: 'Chat ngắn, form mẫu, phản hồi CLB & thư Formal / Informal (AI chấm).',
  },
  {
    id: 'speaking',
    name: 'Speaking',
    code: 'Nói',
    icon: 'mic',
    totalSets: 10,
    stripeColor: '#e11d48', // Rose
    durationText: '12 phút',
    description: 'Phỏng vấn cá nhân, mô tả tranh, so sánh ảnh & thảo luận chủ đề trừu tượng.',
  },
  {
    id: 'grammar',
    name: 'Grammar & Vocabulary',
    code: 'Ngữ pháp & Từ vựng',
    icon: 'spellcheck',
    totalSets: 14,
    stripeColor: '#2563eb', // Cobalt
    durationText: '25 phút',
    description: '25 câu trắc nghiệm ngữ pháp & 25 câu nhận diện từ vựng collocations.',
  },
];

export default function DashboardView({
  onSelectSkill,
  onStartMockTest,
}: DashboardViewProps) {
  const [targetCefr, setTargetCefr] = useState<string>('B2');
  const [completedStats, setCompletedStats] = useState<Record<string, number>>({
    reading: 0,
    listening: 0,
    writing: 0,
    speaking: 0,
    grammar: 0,
  });
  const [studyStreak, setStudyStreak] = useState<number>(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Load target CEFR
      const savedCefr = localStorage.getItem('aptis_target_cefr');
      if (savedCefr) setTargetCefr(savedCefr);

      // 2. Load streak
      const savedStreak = localStorage.getItem('aptis_study_streak');
      if (savedStreak) setStudyStreak(parseInt(savedStreak, 10) || 1);

      // 3. Load completed tests per skill
      const stats: Record<string, number> = {};
      SKILLS_LIST.forEach((s) => {
        try {
          const raw = localStorage.getItem(`aptis_completed_${s.id}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              stats[s.id] = parsed.length;
            }
          }
        } catch {
          stats[s.id] = 0;
        }
      });
      setCompletedStats(stats);
    }
  }, []);

  const handleSetTargetCefr = (level: string) => {
    setTargetCefr(level);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aptis_target_cefr', level);
    }
  };

  const totalAllSets = SKILLS_LIST.reduce((acc, s) => acc + s.totalSets, 0);
  const totalCompleted = Object.values(completedStats).reduce((acc, val) => acc + (val || 0), 0);
  const overallProgressPercent = Math.min(100, Math.round((totalCompleted / totalAllSets) * 100));

  // Determine which skill needs the most attention (lowest % completed)
  const sortedSkillsByProgress = [...SKILLS_LIST].sort((a, b) => {
    const aDone = completedStats[a.id] || 0;
    const bDone = completedStats[b.id] || 0;
    return aDone / a.totalSets - bDone / b.totalSets;
  });
  const recommendedSkill = sortedSkillsByProgress[0] || SKILLS_LIST[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-16 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Welcome & Target CEFR Header Card */}
      <section className="bg-[#f3efe6] rounded-3xl p-6 sm:p-8 border border-[#e5ded3] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#162544]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-[#162544] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-[#e5ded3]">
                Bảng điều khiển cá nhân • Aptis ESOL 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#162544] tracking-tight">
              Trung tâm Luyện thi Cá nhân
            </h1>
            <p className="text-xs sm:text-sm text-[#6b6860] max-w-xl">
              Hệ thống theo dõi tiến độ, lưu vết bài làm và tối ưu hoá kỹ năng để đạt chuẩn CEFR theo đúng lộ trình của bạn.
            </p>
          </div>

          {/* Quick Metrics & CEFR Target Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Target CEFR Selector */}
            <div className="bg-white p-2.5 rounded-2xl border border-[#e5ded3] shadow-2xs flex items-center gap-2.5">
              <span className="text-xs text-[#6b6860] font-medium pl-1">Mục tiêu:</span>
              <div className="flex items-center gap-1">
                {['B1', 'B2', 'C1'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetTargetCefr(lvl)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      targetCefr === lvl
                        ? 'bg-[#162544] text-white shadow-xs'
                        : 'bg-[#faf8f5] text-[#6b6860] hover:text-[#162544] hover:bg-[#f3efe6]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Streak Counter */}
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#e5ded3] shadow-2xs flex items-center gap-2">
              <span className="text-base">🔥</span>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#6b6860] tracking-wider">Chuỗi học</div>
                <div className="text-xs font-bold text-[#162544]">{studyStreak} ngày liên tiếp</div>
              </div>
            </div>

            {/* Overall Sets Completed */}
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#e5ded3] shadow-2xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-xl">assignment_turned_in</span>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#6b6860] tracking-wider">Đã hoàn thành</div>
                <div className="text-xs font-bold text-[#162544]">{totalCompleted}/{totalAllSets} bộ đề</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#e5ded3] relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-[#162544] mb-2">
            <span>Tiến độ tổng thể hướng đến mục tiêu CEFR {targetCefr}</span>
            <span className="text-[#d97706] font-bold">{overallProgressPercent}% hoàn thành</span>
          </div>
          <div className="h-2.5 bg-white rounded-full overflow-hidden border border-[#e5ded3]">
            <div
              className="h-full bg-gradient-to-r from-[#162544] via-[#233760] to-[#d97706] transition-all duration-500 rounded-full"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Top Action Row: Quick Resume & Full Mock Exam Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card A: Quick Resume / Next Study Step (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#e5ded3] shadow-xs flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e5ded3] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-xl">bolt</span>
              <h2 className="font-serif font-bold text-lg text-[#162544]">Gợi ý ôn tập tiếp theo</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">
              Đề xuất thông minh
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                Kỹ năng: {recommendedSkill.name}
              </span>
              <span className="text-xs text-[#6b6860]">• Thời gian: {recommendedSkill.durationText}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-[#162544]">
              Luyện tiếp bộ đề {recommendedSkill.name} (Đã làm {completedStats[recommendedSkill.id] || 0}/{recommendedSkill.totalSets} đề)
            </h3>
            <p className="text-xs sm:text-sm text-[#6b6860] leading-relaxed">
              {recommendedSkill.description}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectSkill(recommendedSkill.id)}
              className="bg-[#162544] hover:bg-[#0f1a30] text-white font-medium px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer inline-flex items-center gap-2 border border-[#162544]"
            >
              <span>Vào làm ngay {recommendedSkill.name}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <button
              onClick={() => onSelectSkill('reading')}
              className="bg-[#f3efe6] hover:bg-[#e5ded3] text-[#162544] font-medium px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border border-[#e5ded3]"
            >
              Chọn kỹ năng khác
            </button>
          </div>
        </div>

        {/* Card B: Full Mock Exam Practice Room (5 cols) */}
        <div className="lg:col-span-5 bg-[#162544] text-white rounded-3xl p-6 sm:p-7 border border-[#233760] shadow-md flex flex-col justify-between space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d97706]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-[#233760] pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-xl">timer</span>
              <h2 className="font-serif font-bold text-lg text-white">Thi thử Full Exam 2026</h2>
            </div>
            <span className="text-[10px] font-bold text-white bg-[#d97706] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Bấm giờ thật
            </span>
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-serif font-bold text-white leading-snug">
              Trải nghiệm phòng thi thực tế với 4 kỹ năng tính giờ
            </h3>
            <p className="text-xs text-[#a3b3d1] leading-relaxed">
              Mô phỏng 100% giao diện thi Aptis ESOL chính thức. Chấm điểm tự động và xuất chứng chỉ dự đoán CEFR ngay khi kết thúc.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <button
              onClick={onStartMockTest}
              className="w-full bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-white font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Vào phòng thi Full Test</span>
              <span className="material-symbols-outlined text-base">play_arrow</span>
            </button>
          </div>
        </div>

      </section>

      {/* 3. Five Skills Practice Grid Hub (Interactive 5-Cards Matrix) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#162544]">
              Trung tâm 5 Kỹ năng
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6860]">
              Chọn kỹ năng để truy cập toàn bộ kho đề thi và luyện tập theo từng Part.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SKILLS_LIST.map((skill) => {
            const completed = completedStats[skill.id] || 0;
            const progress = Math.min(100, Math.round((completed / skill.totalSets) * 100));

            return (
              <div
                key={skill.id}
                onClick={() => onSelectSkill(skill.id)}
                className="bg-white rounded-2xl p-5 border border-[#e5ded3] shadow-xs hover:border-[#162544] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* 3px Top Skill Accent Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ backgroundColor: skill.stripeColor }}
                />

                <div className="space-y-3 pt-1">
                  {/* Skill Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: skill.stripeColor }}
                    >
                      <span className="material-symbols-outlined text-xl">{skill.icon}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6b6860] bg-[#f3efe6] px-2 py-0.5 rounded-full border border-[#e5ded3]">
                      {skill.totalSets} bộ đề
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#162544] group-hover:text-[#d97706] transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-[#6b6860] font-medium block">
                      {skill.code}
                    </span>
                  </div>

                  <p className="text-xs text-[#6b6860] line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Progress & CTA */}
                <div className="mt-5 pt-3 border-t border-[#e5ded3] space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[#162544]">
                      <span>Đã làm</span>
                      <span>{completed}/{skill.totalSets} ({progress}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#f3efe6] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: skill.stripeColor,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-[#f3efe6] text-[#162544] group-hover:bg-[#162544] group-hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Luyện đề ngay</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CEFR Scoring Band Guide & Tips */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5ded3] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e5ded3] pb-3">
          <span className="material-symbols-outlined text-[#162544] text-xl">analytics</span>
          <h2 className="font-serif font-bold text-lg text-[#162544]">
            Thang điểm & Chuẩn quy đổi CEFR Aptis ESOL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5ded3] space-y-1">
            <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">C1 – Advanced</span>
            <div className="text-lg font-bold text-[#162544]">160 – 200 điểm</div>
            <p className="text-[11px] text-[#6b6860]">Thành thạo tự nhiên, đáp ứng chuẩn giảng dạy và làm việc quốc tế.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5ded3] space-y-1">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">B2 – Vantage</span>
            <div className="text-lg font-bold text-[#162544]">120 – 159 điểm</div>
            <p className="text-[11px] text-[#6b6860]">Chuẩn đầu ra đại học, thạc sĩ và hầu hết các cơ quan doanh nghiệp.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5ded3] space-y-1">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">B1 – Threshold</span>
            <div className="text-lg font-bold text-[#162544]">80 – 119 điểm</div>
            <p className="text-[11px] text-[#6b6860]">Giao tiếp cơ bản, hiểu các ý chính trong công việc và học tập.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e5ded3] space-y-1">
            <span className="text-xs font-bold text-[#6b6860] uppercase tracking-wider">A2 / A1 – Basic</span>
            <div className="text-lg font-bold text-[#162544]">0 – 79 điểm</div>
            <p className="text-[11px] text-[#6b6860]">Cần củng cố ngữ pháp nền tảng và nhận diện từ vựng cơ bản.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
