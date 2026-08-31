# DESIGN.md - British Academic Elite Design System

> **Product**: Aptis Prep Master  
> **Brand Archetype**: Oxford & British Council Academic Elite  
> **Aesthetic Mood**: Academic Authority · Warm Paper Canvas · Focus-First · Precision Engineering

---

## 1. Master Color Palette

| Token | Hex | Role | Usage |
| :--- | :--- | :--- | :--- |
| `canvas` | `#faf8f5` | Main Warm Paper Background | Global page background, zero eye strain |
| `surface-light` | `#f3efe6` | Secondary Warm Tint | Bento cards, secondary containers, badge backgrounds |
| `surface-white` | `#ffffff` | Elevated White Card | Test practice cards, question containers, modals |
| `navy-primary` | `#162544` | Oxford Navy Brand Main | Header, primary brand titles, prominent cards |
| `navy-dark` | `#0f1a30` | Deep Oxford Chrome | Footer, exam room chrome, dark widgets |
| `gold-accent` | `#d97706` | Warm Gold / Amber Accent | Primary CTA buttons, key highlights, active tags |
| `gold-hover` | `#b45309` | Dark Gold Hover | Interactive hover states on gold buttons |
| `gold-light` | `#fef3c7` | Light Gold Highlight | Pill badges, trophy/CEFR seal backgrounds |
| `ink-primary` | `#141413` | Deep Academic Ink | Body copy, primary headlines on light canvas |
| `ink-muted` | `#6b6860` | Secondary Slate Ink | Subtitles, metadata, secondary instructions |
| `hairline` | `#e5ded3` | Warm Hairline Border | 1px clean separation borders |

### Skill Specific Accent Stripes
- 📖 **Reading**: `#059669` (Emerald Academic)
- 🎧 **Listening**: `#d97706` (Amber Gold)
- ✍️ **Writing**: `#4f46e5` (Indigo Quill)
- 🗣️ **Speaking**: `#e11d48` (Rose Voice)
- 🔤 **Grammar & Vocab**: `#2563eb` (Cobalt Structure)

### Semantic Answer Feedback (Strict AGENTS.md Rule 9 & 11)
- **Correct (Green)**: `bg-[#ecfdf5]` | `text-emerald-800` | `border-emerald-500`
- **Incorrect (Red)**: `bg-[#fef2f2]` | `text-red-700` | `border-red-400`

---

## 2. Typography Hierarchy

| Role | Font Family | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Display & H1/H2** | *Playfair Display* / *Fraunces* | `font-serif font-semibold` | Hero headlines, section headers, score cards |
| **Body & Questions** | *Plus Jakarta Sans* | `font-sans text-[14px]` | Question prompts, reading texts (Strict 14px) |
| **Data & Timers** | *JetBrains Mono* / *Font-Mono* | `font-mono font-bold` | Countdown timer, test IDs, question counters |

---

## 3. Component Geometry & Elevation
- **Card Corners**: `rounded-2xl` (16px) for major cards, `rounded-xl` (12px) for items/inputs.
- **Top Accent Stripe**: 3px colored accent bar across test and skill cards.
- **Shadows**: Subtle, crisp micro-shadows (`shadow-xs` / `shadow-sm`), avoiding muddy blurred shadows.