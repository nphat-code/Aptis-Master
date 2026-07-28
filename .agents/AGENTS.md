# Project Guidelines - Aptis Prep

## Standard Architecture Guidelines
1. **Gold Standard Skill Template**: Use the **Reading** module (`src/components/reading/`) as the exact gold standard template for all other skills (Listening, Writing, Speaking, Grammar).
2. **Component Folder Organization**:
   - Each skill must reside inside its dedicated folder under `src/components/<skill>/` (e.g. `src/components/listening/`, `src/components/writing/`, etc.).
   - Practice components must follow the exact structure and parameter conventions of Reading practice components (`isAllPractice = testIndex === -1;`, `totalSets`, `safeTestIndex`).
3. **Data Import & Parsing**:
   - Use standard alias import: `import scrapedData from '@/data/scraped_data.json';`
   - Extract data directly and cleanly without unnecessary code mutations or alterations to existing JSX structures.
4. **Preserve User Code & UI**:
   - Never alter pre-approved UI layouts, inline badge renderings, or detailed answer card structures.
5. **Font Size Standard**:
   - All question text, passage content, and option items across all parts of all skills must strictly use font size 14px (`text-[14px]`).
6. **Transition Animation Standard**:
   - Sub-question transitions within a Part must strictly use the slow right-to-left slide animation (`.animate-slide-question`, 0.55s `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Major Part transitions must use fast fade-in (`.animate-fast-fade`, 0.2s).
7. **Listening Part 1 & Audio Rules**:
   - Render 1 question per screen (`customTotalQuestions = 13` for single tests).
   - Audio Play/Stop button allows max 2 plays (Play 1 -> Stop -> Play 2 -> Stop -> Disabled), resetting time to 0:00 on Stop, with no browser click focus ring (`outline-none`).
   - Selected options use simple gray background (`bg-slate-200/90`) without colored border rings or checkmarks (`✓`).
8. **CEFR Level Calculation & Display Rule**:
   - `ExamPracticeLayout` must never hardcode internal CEFR scoring formulas.
   - CEFR level (`Trình độ`) is calculated and displayed exclusively when a skill's Full Practice component explicitly provides its own `getCefrLevel={(score, maxScore) => ...}` prop. Single Part practice tests omit this prop to keep CEFR level hidden.
9. **Answer Display Color Standard**:
   - All correct/incorrect answer boxes, review cards, inline option feedbacks, and detailed answer cards across all skills must strictly use `bg-[#ecfdf5]` for correct (green) and `bg-[#fef2f2]` for incorrect (red).
10. **Detailed Answers Subtitle & Layout Standard**:
    - If a Part has an instruction prompt, it must be provided as the `subtitle` prop directly below `Chi tiết bài làm` inside `DetailedAnswersCard` (just like Reading parts).
    - Detailed answer review cards must omit redundant topic titles and inner wrapper cards, placing the audio bar first (for listening), followed by speaker/question item boxes.
11. **Option Select Box Styling Standard**:
    - All `<select>` dropdown option boxes across all Reading and Listening parts when displaying answer feedback (`isChecked` / `isReviewMode`) must strictly use `font-normal` (`text-[14px]`).
    - Correct selected options must strictly use green text (`text-emerald-800`), 2px green border (`border-2 border-emerald-500`), green background (`bg-[#ecfdf5]`), and explicit disabled styling (`disabled:bg-[#ecfdf5] disabled:text-emerald-800 disabled:border-emerald-500 disabled:opacity-100`).
    - Incorrect selected options must strictly use red text (`text-red-700`), 2px red border (`border-2 border-red-400`), red background (`bg-[#fef2f2]`), and explicit disabled styling (`disabled:bg-[#fef2f2] disabled:text-red-700 disabled:border-red-400 disabled:opacity-100`).
    - Standard base text color (`text-slate-800`) must be placed in the `else` branch when not checked, avoiding static base class conflicts.
12. **Clean Subtitle Standard**:
    - All skill practice view tabs (`partTabContent` subtitles in Reading, Listening, etc.) must use clean, concise subtitles (`X bộ đề luyện tập`).
    - Avoid redundant parenthetical explanatory notes in Part subtitles (such as `(Ghép thông tin người nói)`, `(Hội thoại quan điểm & thái độ)`, or `(Bài phát biểu đơn)`).




