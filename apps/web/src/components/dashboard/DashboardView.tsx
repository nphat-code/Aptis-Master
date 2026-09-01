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
  const [recentActivities, setRecentActivities] = useState<
    Array<{ skillId: string; skillName: string; keyName: string; color: string }>
  >([]);
  const [studyStreak, setStudyStreak] = useState<number>(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Load target CEFR
      const savedCefr = localStorage.getItem('aptis_target_cefr');
      if (savedCefr) setTargetCefr(savedCefr);

      // 2. Load streak
      const savedStreak = localStorage.getItem('aptis_study_streak');
      if (savedStreak) setStudyStreak(parseInt(savedStreak, 10) || 1);

      // 3. Load completed tests per skill & collect recent activities
      const stats: Record<string, number> = {};
      const activities: Array<{ skillId: string; skillName: string; keyName: string; color: string }> = [];

      SKILLS_LIST.forEach((s) => {
        try {
          const raw = localStorage.getItem(`aptis_completed_${s.id}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              stats[s.id] = parsed.length;
              parsed.slice(-3).forEach((itemKey: string) => {
                activities.push({
                  skillId: s.id,
                  skillName: s.name,
                  keyName: itemKey.replace('_', ' – Đề '),
                  color: s.stripeColor,
                });
              });
            }
          }
        } catch {
          stats[s.id] = 0;
        }
      });

      setCompletedStats(stats);
      setRecentActivities(activities.reverse().slice(0, 5));
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

  // Determine recommended skill (lowest % completed)
  const sortedSkillsByProgress = [...SKILLS_LIST].sort((a, b) => {
    const aDone = completedStats[a.id] || 0;
    const bDone = completedStats[b.id] || 0;
    return aDone / a.totalSets - bDone / b.totalSets;
  });
  const recommendedSkill = sortedSkillsByProgress[0] || SKILLS_LIST[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-12 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Compact Header Bar: CEFR Target & Live Stats */}
      <section className="bg-[#f3efe6] rounded-2xl p-5 sm:p-6 border border-[#e5ded3] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#162544] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#e5ded3]">
                Aptis ESOL 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#162544] tracking-tight">
              Bảng điều khiển học tập
            </h1>
          </div>

          {/* Quick Metrics & Target Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Target CEFR Selector */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-[#e5ded3] shadow-2xs flex items-center gap-2">
              <span className="text-xs text-[#6b6860] font-medium">Mục tiêu:</span>
              <div className="flex items-center gap-1">
                {['B1', 'B2', 'C1'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetTargetCefr(lvl)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            <div className="bg-white px-3 py-1.5 rounded-xl border border-[#e5ded3] shadow-2xs flex items-center gap-2">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-[#162544]">{studyStreak} ngày streak</span>
            </div>

            {/* Overall Sets Completed */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-[#e5ded3] shadow-2xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-base">assignment_turned_in</span>
              <span className="text-xs font-bold text-[#162544]">{totalCompleted}/{totalAllSets} đề ({overallProgressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-3 border-t border-[#e5ded3]">
          <div className="h-2 bg-white rounded-full overflow-hidden border border-[#e5ded3]">
            <div
              className="h-full bg-gradient-to-r from-[#162544] via-[#233760] to-[#d97706] transition-all duration-500 rounded-full"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Top Action Row: Quick Resume & Full Mock Room */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card A: Quick Resume / Next Study Step (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#e5ded3] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-lg">bolt</span>
              <h2 className="font-serif font-bold text-base text-[#162544]">Đề xuất ôn tập tiếp theo</h2>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              Ưu tiên {recommendedSkill.name}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-base font-serif font-bold text-[#162544]">
              Luyện tiếp {recommendedSkill.name} (Đã làm {completedStats[recommendedSkill.id] || 0}/{recommendedSkill.totalSets} bộ đề)
            </div>
            <p className="text-xs text-[#6b6860]">
              Thời gian tiêu chuẩn: {recommendedSkill.durationText} • Cấu trúc chuẩn Aptis ESOL 2026
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onSelectSkill(recommendedSkill.id)}
              className="bg-[#162544] hover:bg-[#0f1a30] text-white font-medium px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer inline-flex items-center gap-2 border border-[#162544]"
            >
              <span>Vào làm ngay {recommendedSkill.name}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card B: Full Mock Exam Practice Room (5 cols) */}
        <div className="lg:col-span-5 bg-[#162544] text-white rounded-2xl p-5 sm:p-6 border border-[#233760] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-lg">timer</span>
              <h2 className="font-serif font-bold text-base text-white">Thi thử Full Exam 2026</h2>
            </div>
            <span className="text-[10px] font-bold text-white bg-[#d97706] px-2 py-0.5 rounded-md uppercase">
              Bấm giờ
            </span>
          </div>

          <p className="text-xs text-[#a3b3d1]">
            Mô phỏng 100% giao diện thi thật 4 kỹ năng. Tự động chấm điểm và đánh giá trình độ CEFR.
          </p>

          <div>
            <button
              onClick={onStartMockTest}
              className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Vào phòng thi Full Test</span>
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            </button>
          </div>
        </div>

      </section>

      {/* 3. Five Skills Hub: Compact Cards without fluff text */}
      <section className="space-y-3">
        <h2 className="text-lg font-serif font-bold text-[#162544]">
          Trung tâm 5 Kỹ năng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SKILLS_LIST.map((skill) => {
            const completed = completedStats[skill.id] || 0;
            const progress = Math.min(100, Math.round((completed / skill.totalSets) * 100));

            return (
              <div
                key={skill.id}
                onClick={() => onSelectSkill(skill.id)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e5ded3] shadow-xs hover:border-[#162544] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* 3px Top Accent Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ backgroundColor: skill.stripeColor }}
                />

                <div className="space-y-3 pt-1">
                  {/* Skill Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: skill.stripeColor }}
                    >
                      <span className="material-symbols-outlined text-lg">{skill.icon}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6b6860] bg-[#f3efe6] px-2 py-0.5 rounded-full border border-[#e5ded3]">
                      {skill.totalSets} đề
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#162544] group-hover:text-[#d97706] transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-[#6b6860] font-medium">
                      {skill.code}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Compact Action Button */}
                <div className="mt-4 pt-3 border-t border-[#e5ded3] space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[#162544]">
                      <span>Tiến độ</span>
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
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#f3efe6] text-[#162544] group-hover:bg-[#162544] group-hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Luyện đề</span>
                    <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Recent Test Activity Log (Replaces static CEFR Guide) */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e5ded3] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e5ded3] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#162544] text-lg">history</span>
            <h2 className="font-serif font-bold text-base text-[#162544]">
              Lịch sử bài luyện gần đây
            </h2>
          </div>
          <span className="text-xs text-[#6b6860] font-medium">
            Tự động đồng bộ trên thiết bị của bạn
          </span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="divide-y divide-[#e5ded3]">
            {recentActivities.map((act, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-[#faf8f5] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: act.color }}
                  />
                  <div>
                    <span className="font-semibold text-[#162544]">{act.skillName}</span>
                    <span className="text-[#6b6860] ml-2 font-normal text-xs">{act.keyName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0]">
                    ✓ Đã làm
                  </span>
                  <button
                    onClick={() => onSelectSkill(act.skillId)}
                    className="text-xs text-[#162544] hover:text-[#d97706] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem lại</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#8e8b82]">
              checklist
            </span>
            <p className="text-xs text-[#6b6860]">
              Chưa có dữ liệu bài làm gần đây. Hãy chọn một kỹ năng bên trên để bắt đầu luyện tập!
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
