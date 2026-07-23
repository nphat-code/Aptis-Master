/**
 * APTISKEY SCRAPER
 * Tự động đăng nhập và tải toàn bộ dữ liệu câu hỏi từ aptiskey.com
 * Lưu kết quả ra scraped_data.json
 * 
 * Cách chạy: node scrape_aptiskey.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// =====================================================
// CONFIG
// =====================================================
const BASE_URL = 'aptiskey.com';
const OUTPUT_FILE = path.join(__dirname, 'scraped_data.json');
const CREDENTIALS = {
  email: 'nguyenphat13112006',
  password: 'scm5g2'
};

// =====================================================
// HTTP HELPERS
// =====================================================
function httpPost(apiPath, body, cookie) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: BASE_URL, port: 443, path: apiPath, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Cookie': cookie || '',
        'User-Agent': 'Mozilla/5.0 (Scraper)',
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function httpGet(apiPath, cookie) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: BASE_URL, port: 443, path: apiPath, method: 'GET',
      headers: {
        'Cookie': cookie || '',
        'User-Agent': 'Mozilla/5.0 (Scraper)',
        'Accept': 'application/json, text/html, */*',
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =====================================================
// TIPS PARSING HELPERS
// =====================================================
function parseReadingQ5Tips(jsText) {
  const tips = [];
  const optPat = /const options_(\d+)\s*=\s*\[([\s\S]*?)\];/g;
  let m;
  while ((m = optPat.exec(jsText)) !== null) {
    const id = parseInt(m[1]);
    const optStr = m[2];
    const options = optStr.split(',')
      .map(s => s.trim().replace(/^['"`]|['"`]$/g, '').trim())
      .filter(s => s.length > 0);
      
    const kwPat = new RegExp(`const question5_keyword_${id}\\s*=\\s*['"\\\`]([\\s\\S]*?)['"\\\`];`, 'i');
    const kwMatch = kwPat.exec(jsText);
    const keyword = kwMatch ? kwMatch[1].trim() : '';
    
    const meoPat = new RegExp(`const question5_meo_${id}\\s*=\\s*['"\\\`]([\\s\\S]*?)['"\\\`];`, 'i');
    const meoMatch = meoPat.exec(jsText);
    const meo = meoMatch ? meoMatch[1].trim() : '';
    
    tips.push({ id, options, keyword, meo });
  }
  return tips;
}

function parseListeningQ15Method2(jsText) {
  const startIdx = jsText.indexOf('const meocau15_data = [');
  if (startIdx === -1) return [];
  let depth = 1;
  let idx = startIdx + 23;
  while (depth > 0 && idx < jsText.length) {
    if (jsText[idx] === '[') depth++;
    else if (jsText[idx] === ']') depth--;
    if (depth === 0) break;
    idx++;
  }
  const arrayStr = jsText.substring(startIdx + 22, idx + 1);
  try {
    const fn = new Function(`return ${arrayStr};`);
    return fn();
  } catch (e) {
    console.error("Lỗi parse Listening Q15 Method 2:", e.message);
    return [];
  }
}

function parseListeningQ15Method1(html) {
  const tableStart = html.indexOf('<table');
  const tableEnd = html.indexOf('</table>');
  if (tableStart === -1 || tableEnd === -1) return [];
  const tableHtml = html.substring(tableStart, tableEnd + 8);

  const trPat = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  const rows = [];
  while ((m = trPat.exec(tableHtml)) !== null) {
    rows.push(m[1]);
  }
  const bodyRows = rows.slice(1);

  const parsedData = [];
  let currentTopic = null;

  const stripTags = (s) => s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ').trim();

  for (let i = 0; i < bodyRows.length; i++) {
    const rowHtml = bodyRows[i];
    const tdPat = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tm;
    while ((tm = tdPat.exec(rowHtml)) !== null) {
      cells.push({ html: tm[1], text: stripTags(tm[1]) });
    }
    
    if (cells.length === 5) {
      const tt = cells[0].text;
      const topicText = cells[1].text;
      const topicHtml = cells[1].html;
      const englishMatch = topicHtml.match(/<\/i>\s*([A-Za-z\s&]+)\s*<br>/i) || topicHtml.match(/<\/i>\s*([A-Za-z\s&]+)/i);
      const english = englishMatch ? englishMatch[1].trim() : topicText;
      const vietnameseMatch = topicHtml.match(/<small[^>]*>([\s\S]*?)<\/small>/i);
      const vietnamese = vietnameseMatch ? stripTags(vietnameseMatch[1]) : '';

      currentTopic = {
        tt: parseInt(tt),
        topic_en: english,
        topic_vi: vietnamese,
        voices: []
      };
      currentTopic.voices.push({
        voice: cells[2].text,
        key: cells[3].text,
        note: cells[4].text
      });
      parsedData.push(currentTopic);
    } else if (cells.length === 3 && currentTopic) {
      currentTopic.voices.push({
        voice: cells[0].text,
        key: cells[1].text,
        note: cells[2].text
      });
    }
  }
  return parsedData;
}

function parseSpeakingQ2Tips(jsText) {
  const startIdx = jsText.indexOf('const questions = [');
  if (startIdx === -1) return [];
  let depth = 1;
  let idx = startIdx + 19;
  while (depth > 0 && idx < jsText.length) {
    if (jsText[idx] === '[') depth++;
    else if (jsText[idx] === ']') depth--;
    if (depth === 0) break;
    idx++;
  }
  const arrayStr = jsText.substring(startIdx + 18, idx + 1);
  try {
    const fn = new Function(`return ${arrayStr};`);
    return fn();
  } catch (e) {
    console.error("Lỗi parse Speaking Q2 tips:", e.message);
    return [];
  }
}

// =====================================================
// STEP 1: LOGIN
// =====================================================
async function login() {
  console.log('[1/5] Đăng nhập vào aptiskey.com...');
  const res = await httpPost('/login', CREDENTIALS);
  if (res.status !== 200) {
    throw new Error('Đăng nhập thất bại! Status: ' + res.status);
  }
  
  const setCookie = res.headers['set-cookie'] || [];
  const tokenCookie = setCookie.find(c => c.startsWith('auth_token='));
  if (!tokenCookie) {
    throw new Error('Không tìm thấy auth_token trong cookie sau khi đăng nhập!');
  }
  
  const token = tokenCookie.split(';')[0]; // lấy phần "auth_token=xxx"
  console.log('    ✅ Đăng nhập thành công. Cookie token nhận được.');
  return token;
}

// =====================================================
// STEP 2: FETCH DATA FROM ALL KNOWN ENDPOINTS
// =====================================================
async function fetchAllData(cookie) {
  console.log('\n[2/5] Tải dữ liệu từ các API endpoint...');
  
  const result = {
    scrapedAt: new Date().toISOString(),
    source: 'https://aptiskey.com',
    reading: {},
    listening: {},
    grammar: {},
  };

  // --- READING QUESTION 1 ---
  console.log('   Đang tải Reading Question 1...');
  const rq1 = await httpGet('/api/reading-question1-data', cookie);
  if (rq1.status === 200) {
    result.reading.question1 = JSON.parse(rq1.body);
    console.log(`   ✅ Reading Q1: ${Array.isArray(result.reading.question1) ? result.reading.question1.length : '?'} sets loaded`);
  }
  await sleep(500);

  // --- READING QUESTION 2 ---
  console.log('   Đang tải Reading Question 2...');
  const rq2 = await httpGet('/api/reading-question2-data', cookie);
  if (rq2.status === 200) {
    result.reading.question2 = JSON.parse(rq2.body);
    console.log('   ✅ Reading Q2 loaded');
  }
  await sleep(500);

  // --- READING QUESTION 4 (Part 3/4) ---
  console.log('   Đang tải Reading Question 4...');
  const rq4 = await httpGet('/api/reading-question4-data', cookie);
  if (rq4.status === 200) {
    result.reading.question4 = JSON.parse(rq4.body);
    console.log('   ✅ Reading Q4 loaded');
  }
  await sleep(500);

  // --- READING QUESTION 5 ---
  console.log('   Đang tải Reading Question 5...');
  const rq5 = await httpGet('/api/reading-question5-data', cookie);
  if (rq5.status === 200) {
    result.reading.question5 = JSON.parse(rq5.body);
    console.log('   ✅ Reading Q5 loaded');
  }
  await sleep(500);

  // --- Probe more reading endpoints (Q3, Q6-Q10) ---
  for (let i = 3; i <= 10; i++) {
    if (i === 4 || i === 5) continue; // already fetched
    const r = await httpGet(`/api/reading-question${i}-data`, cookie);
    if (r.status === 200) {
      result.reading[`question${i}`] = JSON.parse(r.body);
      console.log(`   ✅ Reading Q${i} loaded`);
    }
    await sleep(300);
  }

  // --- LISTENING (discovered endpoints) ---
  const listeningEndpoints = [
    '/api/listening-question1-13-data',
    '/api/listening-question14-data',
    '/api/listening-question15-data',
    '/api/listening-question16-17-data',
    // Probe others
    '/api/listening-question-data',
    '/api/listening-bode-data',
  ];
  for (const ep of listeningEndpoints) {
    const r = await httpGet(ep, cookie);
    if (r.status === 200) {
      const key = ep.replace('/api/', '').replace('-data', '').replace(/-/g, '_');
      result.listening[key] = JSON.parse(r.body);
      const parsed = JSON.parse(r.body);
      const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
      console.log(`   ✅ Listening: ${ep} (${count} items)`);
    }
    await sleep(400);
  }

  // --- GRAMMAR: using discovered /api/grammar-data/:id endpoints ---
  console.log('   Tải dữ liệu Grammar (5 bộ đề)...');
  result.grammar = {};
  for (let i = 1; i <= 5; i++) {
    const r = await httpGet(`/api/grammar-data/${i}`, cookie);
    if (r.status === 200) {
      result.grammar[`test${i}`] = JSON.parse(r.body);
      console.log(`   \u2705 Grammar Test ${i} loaded (keyid: ${JSON.parse(r.body).keyid})`);
    }
    await sleep(400);
  }
  // Probe for more grammar tests
  for (let i = 6; i <= 20; i++) {
    const r = await httpGet(`/api/grammar-data/${i}`, cookie);
    if (r.status === 200) {
      result.grammar[`test${i}`] = JSON.parse(r.body);
      console.log(`   \u2705 Grammar Test ${i} loaded`);
    }
    await sleep(300);
  }


  // --- WRITING: using discovered /api/writingkey-data/:id endpoints ---
  console.log('   Tải dữ liệu Writing (40 bộ đề)...');
  result.writing = {};
  for (let i = 1; i <= 40; i++) {
    const r = await httpGet(`/api/writingkey-data/${i}`, cookie);
    if (r.status === 200) {
      result.writing[`test${i}`] = JSON.parse(r.body);
      console.log(`   ✅ Writing Test ${i} loaded (club_name: ${JSON.parse(r.body).club_name})`);
    }
    await sleep(400);
  }

  // --- READING BỘ ĐỀ: /api/reading-test-data/:id ---
  console.log('   Tải dữ liệu Reading Test (bộ đề)...');
  result.reading_tests = {};
  for (let i = 1; i <= 40; i++) {
    const r = await httpGet(`/api/reading-test-data/${i}`, cookie);
    if (r.status === 200) {
      result.reading_tests[`test${i}`] = JSON.parse(r.body);
      console.log(`   ✅ Reading Test ${i} loaded (label: ${JSON.parse(r.body).label})`);
    }
    await sleep(300);
  }

  // --- LISTENING BỘ ĐỀ: /api/listeningkey-data/:id ---
  console.log('   Tải dữ liệu Listening Test (bộ đề)...');
  result.listening_tests = {};
  for (let i = 1; i <= 20; i++) {
    const r = await httpGet(`/api/listeningkey-data/${i}`, cookie);
    if (r.status === 200) {
      result.listening_tests[`test${i}`] = JSON.parse(r.body);
      console.log(`   ✅ Listening Test ${i} loaded`);
    }
    await sleep(300);
  }

  // --- MẸO READING: /js/reading_question/reading_question5_meo.js ---
  console.log('   Tải dữ liệu Mẹo Reading (Q5)...');
  const rMeo = await httpGet('/js/reading_question/reading_question5_meo.js', cookie);
  if (rMeo.status === 200) {
    result.reading_tips = parseReadingQ5Tips(rMeo.body);
    console.log('   ✅ Mẹo Reading Q5 loaded');
  }
  await sleep(300);

  // --- MẸO LISTENING: /listening_meo_cau15.html & /js/listening_question/listening_meo_cau15_method2.js ---
  console.log('   Tải dữ liệu Mẹo Listening...');
  const lMeo1 = await httpGet('/listening_meo_cau15.html', cookie);
  const lMeo2 = await httpGet('/js/listening_question/listening_meo_cau15_method2.js', cookie);
  result.listening_tips = {
    method1: lMeo1.status === 200 ? parseListeningQ15Method1(lMeo1.body) : [],
    method2: lMeo2.status === 200 ? parseListeningQ15Method2(lMeo2.body) : []
  };
  console.log('   ✅ Mẹo Listening loaded');
  await sleep(300);

  // --- MẸO SPEAKING: /js/speaking/speaking_question2_meo.js ---
  console.log('   Tải dữ liệu Mẹo Speaking (Q2)...');
  const sMeo = await httpGet('/js/speaking/speaking_question2_meo.js', cookie);
  if (sMeo.status === 200) {
    result.speaking_tips = parseSpeakingQ2Tips(sMeo.body);
    console.log('   ✅ Mẹo Speaking Q2 loaded');
  }
  await sleep(300);

  // --- MẸO WRITING: /writing_meo.html (HTML tĩnh, cần parse) ---
  console.log('   Tải dữ liệu Mẹo Writing...');
  const wMeo = await httpGet('/writing_meo.html', cookie);
  if (wMeo.status === 200) {
    const html = wMeo.body;
    const stripHtml = (s) => s
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
      .replace(/\n{3,}/g, '\n\n').trim();
    const extractCard = (id) => {
      const pat = new RegExp(`id="${id}"[^>]*>[\\s\\S]*?<div class="card-body">([\\s\\S]*?)</div>`, 'i');
      const m = pat.exec(html);
      return m ? stripHtml(m[1]) : null;
    };

    // Intro section
    const introMatch = html.match(/<div class="meo-hero">([\s\S]*?)<\/div>/i);
    const noteMatch = html.match(/<section id="gioi-thieu"[\s\S]*?<div class="note">([\s\S]*?)<\/div>/i);

    // Forms
    const formFriend = extractCard('formFriend');
    const formManager = extractCard('formManager');

    // Opinion words
    const badgePat = /<span class="badge badge-(pos|neg)[^"]*">[^<]*<\/span>\s*([^<]*)/gi;
    const opinionWords = { positive: [], negative: [] };
    let bm;
    while ((bm = badgePat.exec(html)) !== null) {
      opinionWords[bm[1] === 'pos' ? 'positive' : 'negative'].push(bm[2].trim());
    }

    // Vocab titles
    const vocabTitlePat = /<div class="vocab-title">([\s\S]*?)<\/div>/gi;
    const vocabTitles = [];
    while ((bm = vocabTitlePat.exec(html)) !== null) vocabTitles.push(stripHtml(bm[1]));

    // Example section
    const topicNotePat = /<div class="note topic-note[^"]*">([\s\S]*?)<\/div>/i;
    const topicMatch = topicNotePat.exec(html);
    const exFriend = extractCard('exFriend');
    const exManager = extractCard('exManager');

    result.writing_tips = {
      source: 'https://aptiskey.com/writing_meo.html',
      intro: {
        title: introMatch ? stripHtml(introMatch[1]) : null,
        note: noteMatch ? stripHtml(noteMatch[1]) : null
      },
      forms: {
        friend_template: formFriend,
        manager_template: formManager,
        vocab_titles: vocabTitles,
        opinion_words: opinionWords
      },
      example: {
        topic: topicMatch ? stripHtml(topicMatch[1]) : null,
        friend_example: exFriend,
        manager_example: exManager
      }
    };
    console.log('   ✅ Mẹo Writing loaded');
  }
  await sleep(300);

  return result;
}

// =====================================================
// STEP 3: SCRAPE LISTENING FROM HTML (fallback)
// =====================================================
async function scrapeListeningFromHtml(cookie) {
  console.log('\n[3/5] Scraping Listening pages for audio URLs...');
  const listeningPages = [];

  const bode = await httpGet('/listening_bode.html', cookie);
  if (bode.status === 200) {
    // Extract all listening links from bode page
    const linkPat = /href="([^"]*listening[^"]+\.html)"/g;
    let m;
    const links = new Set();
    while ((m = linkPat.exec(bode.body)) !== null) {
      if (!m[1].startsWith('http')) links.add('/' + m[1].replace(/^\//, ''));
    }

    for (const link of [...links].slice(0, 20)) {
      await sleep(400);
      const page = await httpGet(link, cookie);
      if (page.status === 200) {
        // Extract audio URLs
        const audioUrls = [];
        const audioPat = /src="([^"]+\.(mp3|wav|ogg|m4a))"/g;
        let am;
        while ((am = audioPat.exec(page.body)) !== null) audioUrls.push(am[1]);

        // Extract script src for JS data
        const scriptPat = /src="(js\/listening[^"]+\.js)"/g;
        const scripts = [];
        let sm;
        while ((sm = scriptPat.exec(page.body)) !== null) scripts.push(sm[1]);

        listeningPages.push({ url: link, audioUrls, scripts });
        if (audioUrls.length > 0) {
          console.log(`   ✅ ${link}: ${audioUrls.length} audio files found`);
        }
      }
    }
  }

  return listeningPages;
}

// =====================================================
// STEP 4: SCRAPE GRAMMAR FROM HTML
// =====================================================
async function scrapeGrammarFromHtml(cookie) {
  console.log('\n[4/5] Scraping Grammar data from JS files...');
  const grammarData = {};

  // Get grammar bode page to find grammar question JS files
  const bode = await httpGet('/grammar_bode.html', cookie);
  if (bode.status !== 200) return grammarData;

  const linkPat = /href="([^"]*grammar[^"]+\.html)"/g;
  let m;
  const links = new Set();
  while ((m = linkPat.exec(bode.body)) !== null) links.add(m[1]);
  console.log(`   Found ${links.size} grammar pages`);

  for (const link of [...links].slice(0, 10)) {
    await sleep(400);
    const page = await httpGet('/' + link.replace(/^\//, ''), cookie);
    if (page.status === 200) {
      // Look for the script that loads data
      const scriptPat = /src="(js\/[^"]+\.js)"/g;
      let sm;
      while ((sm = scriptPat.exec(page.body)) !== null) {
        const jsPath = '/' + sm[1].replace(/^\//, '');
        const jsFile = await httpGet(jsPath, cookie);
        if (jsFile.status === 200 && !jsFile.body.includes('403')) {
          // Extract question data arrays from JS (simple heuristic)
          const apiPat = /\/api\/[\w-]+/g;
          let am;
          while ((am = apiPat.exec(jsFile.body)) !== null) {
            const apiPath = am[0];
            const apiRes = await httpGet(apiPath, cookie);
            if (apiRes.status === 200) {
              grammarData[apiPath] = JSON.parse(apiRes.body);
              console.log(`   ✅ Grammar API: ${apiPath}`);
            }
          }
        }
      }
    }
  }

  return grammarData;
}

// =====================================================
// STEP 4.5: SCRAPE SPEAKING FROM JS FILES
// =====================================================
function extractArray(code) {
  const arrayStartIdx = code.indexOf('[');
  if (arrayStartIdx === -1) return null;
  
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let commentType = '';
  
  for (let i = arrayStartIdx; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1];
    
    if (inComment) {
      if (commentType === 'single' && (char === '\n' || char === '\r')) {
        inComment = false;
      } else if (commentType === 'multi' && char === '*' && nextChar === '/') {
        inComment = false;
        i++;
      }
      continue;
    }
    
    if (inString) {
      if (char === '\\') {
        i++;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }
    
    if (char === '/' && nextChar === '/') {
      inComment = true;
      commentType = 'single';
      i++;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      inComment = true;
      commentType = 'multi';
      i++;
      continue;
    }
    
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (char === '[') {
      bracketCount++;
    } else if (char === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        return code.substring(arrayStartIdx, i + 1);
      }
    }
  }
  return null;
}

async function scrapeSpeaking(cookie) {
  console.log('\n[4.5] Scraping Speaking data from JS files...');
  const speakingData = {};
  
  const files = {
    part1_practice: '/js/speaking/speaking_question1_practice.js',
    part1_total: '/js/speaking/speaking_question1_total.js',
    part2_practice: '/js/speaking/speaking_question2_practice.js',
    part3_practice: '/js/speaking/speaking_question3_practice.js',
    part4_practice: '/js/speaking/speaking_question4_practice.js',
  };
  
  const tempDir = __dirname;
  
  for (const [name, url] of Object.entries(files)) {
    const jsContent = await httpGet(url, cookie);
    if (jsContent.status !== 200) {
      console.log(`   ❌ Failed to fetch ${url}`);
      continue;
    }
    
    const arrayStr = extractArray(jsContent.body);
    if (!arrayStr) {
      console.log(`   ❌ Could not extract array from ${name}`);
      continue;
    }
    
    const tempFile = path.join(tempDir, `temp_speaking_${name}_${Date.now()}.js`);
    fs.writeFileSync(tempFile, `module.exports = ${arrayStr};`, 'utf8');
    
    try {
      speakingData[name] = require(tempFile);
      console.log(`   ✅ Speaking ${name} loaded: ${speakingData[name].length} items`);
      delete require.cache[require.resolve(tempFile)];
    } catch (e) {
      console.log(`   ❌ Error parsing ${name}:`, e.message);
    }
    
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
  
  return speakingData;
}

// =====================================================
// MAIN RUNNER
// =====================================================
async function main() {
  console.log('🚀 APTISKEY SCRAPER STARTED');
  console.log('================================\n');

  try {
    // 1. Login
    const cookie = await login();

    // 2. Fetch API data
    const data = await fetchAllData(cookie);

    // 3. Scrape Listening from HTML
    data.listening.pages = await scrapeListeningFromHtml(cookie);

    // 4. Scrape Grammar
    const grammarExtra = await scrapeGrammarFromHtml(cookie);
    Object.assign(data.grammar, grammarExtra);

    // 4.5. Scrape Speaking
    data.speaking = await scrapeSpeaking(cookie);

    // 5. Post-processing fixes
    if (data.reading && data.reading.question4 && data.reading.question4.question4Content && data.reading.question4.question4Content[0]) {
      const q4 = data.reading.question4;
      const correctAnswers = q4.correctAnswersQuestion4[0];
      q4.question4Content[0].forEach((item, index) => {
        item.answer = correctAnswers[index];
      });
      console.log('   🔧 Fixed missing answers in Reading Q4 Set 1');
    }

    // Fix Listening Q14 answers
    if (data.listening && data.listening.listening_question14) {
      data.listening.listening_question14.forEach(item => {
        if (item.options) {
          item.correctAnswers = item.options.slice(0, 4);
        }
      });
      console.log('   🔧 Injected correctAnswers for Listening Q14');
    }

    // Fix Listening Q16-17 answers
    if (data.listening && data.listening.listening_question16_17) {
      data.listening.listening_question16_17.forEach(item => {
        if (item.questions) {
          item.questions.forEach(q => {
            if (q.options) {
              q.correctAnswer = q.options[0];
            }
          });
        }
      });
      console.log('   🔧 Injected correctAnswer for Listening Q16-17');
    }

    // 6. Save output
    console.log('\n[5/5] Lưu dữ liệu ra file...');
    const orderedData = {
      scrapedAt: data.scrapedAt,
      source: data.source,
      reading: data.reading,
      reading_tips: data.reading_tips,
      reading_tests: data.reading_tests,
      listening: data.listening,
      listening_tips: data.listening_tips,
      listening_tests: data.listening_tests,
      speaking: data.speaking,
      speaking_tips: data.speaking_tips,
      writing: data.writing,
      writing_tips: data.writing_tips,
      grammar: data.grammar
    };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(orderedData, null, 2), 'utf-8');
    
    // Summary
    console.log('\n================================');
    console.log('✅ SCRAPING HOÀN THÀNH!');
    console.log(`📁 Đã lưu vào: ${OUTPUT_FILE}`);
    console.log('📊 Thống kê:');
    console.log(`   Reading sections: ${Object.keys(data.reading).length}`);
    console.log(`   Reading tips: ${data.reading_tips ? '✅' : '❌'}`);
    console.log(`   Reading tests (bộ đề): ${Object.keys(data.reading_tests).length}`);
    console.log(`   Listening sections: ${Object.keys(data.listening).length}`);
    console.log(`   Listening tips: ${data.listening_tips ? '✅' : '❌'}`);
    console.log(`   Listening tests (bộ đề): ${Object.keys(data.listening_tests).length}`);
    console.log(`   Grammar sections: ${Object.keys(data.grammar).length}`);
    console.log(`   Writing sections: ${Object.keys(data.writing).length}`);
    console.log(`   Writing tips: ${data.writing_tips ? '✅' : '❌'}`);
    console.log(`   Speaking sections: ${Object.keys(data.speaking).length}`);
    console.log(`   Speaking tips: ${data.speaking_tips ? '✅' : '❌'}`);

  } catch (err) {
    console.error('\n❌ LỖI:', err.message);
    process.exit(1);
  }
}

main();
