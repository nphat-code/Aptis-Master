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
