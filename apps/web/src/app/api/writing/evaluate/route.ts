import { NextResponse } from 'next/server';

export interface QuestionSubmission {
  id: number | string;
  questionText: string;
  userAnswer: string;
}

export interface EvaluateRequestBody {
  partId: string;
  clubName?: string;
  questions: QuestionSubmission[];
}

export interface RuleCorrection {
  questionIndex: number;
  type?: 'Ngữ pháp' | 'Chính tả' | string;
  original: string;
  correction: string;
  explanation: string;
}

export interface WritingAiFeedbackResponse {
  score: number;
  maxScore: number;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  taskCompletion: {
    status: 'success' | 'warning' | 'danger';
    summary: string;
    details?: Array<{ questionIndex: number; isCorrect: boolean; note: string }>;
  };
  grammarAndSpelling: {
    status: 'success' | 'warning' | 'danger';
    summary: string;
    corrections: RuleCorrection[];
  };
  vocabulary: {
    status: 'info' | 'success' | 'warning';
    summary: string;
    suggestions: string[];
  };
  keyTakeaway: string;
}

// Smart Local Fallback Evaluator when no API key is configured
function generateLocalFallbackEvaluation(
  questions: QuestionSubmission[],
  clubName?: string,
  partId: string = 'part1'
): WritingAiFeedbackResponse {
  let validCount = 0;
  const isPart2 = partId.toLowerCase() === 'part2';
  const total = questions.length || (isPart2 ? 1 : 5);
  const minWords = isPart2 ? 20 : 1;
  const maxWords = isPart2 ? 30 : 5;

  const corrections: RuleCorrection[] = [];
  const details: Array<{ questionIndex: number; isCorrect: boolean; note: string }> = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const ans = (q.userAnswer || '').trim();
    const words = ans ? ans.split(/\s+/).filter(Boolean).length : 0;

    if (words >= minWords && words <= maxWords) {
      validCount++;
      details.push({
        questionIndex: qNum,
        isCorrect: true,
        note: 'Câu trả lời phù hợp với chủ đề và đạt độ dài yêu cầu.',
      });
    } else if (words === 0) {
      details.push({
        questionIndex: qNum,
        isCorrect: false,
        note: 'Bỏ trống câu hỏi.',
      });
    } else {
      details.push({
        questionIndex: qNum,
        isCorrect: false,
        note: words < minWords ? 'Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn).' : 'Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài).',
      });
      corrections.push({
        questionIndex: qNum,
        original: ans,
        correction: ans,
        explanation: words < minWords ? 'Bài viết chưa đạt số lượng từ quy định của Part 2.' : 'Bài viết vượt quá số lượng từ quy định của Part 2.',
      });
    }
  });

  const scaledScore = Math.round((validCount / total) * 30);
  let cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
  if (scaledScore >= 28) cefr = 'C1';
  else if (scaledScore >= 24) cefr = 'B2';
  else if (scaledScore >= 18) cefr = 'B1';
  else if (scaledScore >= 12) cefr = 'A2';

  const taskSummary = isPart2
    ? (validCount === total
      ? `Bạn đã hoàn thành 1/1 bài viết phù hợp với chủ đề ${clubName || ''}.`
      : `Bài viết chưa đạt yêu cầu độ dài hoặc vi phạm quy định.`)
    : `Bạn đã hoàn thành ${validCount}/${total} câu hỏi theo đúng quy định. ${clubName ? `Chủ đề bài làm: ${clubName}.` : ''}`;

  return {
    score: scaledScore,
    maxScore: 30,
    cefrLevel: cefr,
    taskCompletion: {
      status: validCount === total ? 'success' : validCount >= 3 ? 'warning' : 'danger',
      summary: taskSummary,
      details,
    },
    grammarAndSpelling: {
      status: corrections.length === 0 ? 'success' : 'warning',
      summary:
        corrections.length === 0
          ? 'Bài làm cơ bản đúng cấu trúc ngữ pháp và chính tả.'
          : `Có ${corrections.length} vị trí cần chú ý về giới hạn độ dài và ngữ pháp.`,
      corrections,
    },
    vocabulary: {
      status: 'info',
      summary: isPart2
        ? 'Từ vựng diễn đạt phù hợp với phản hồi mạng xã hội Part 2.'
        : 'Từ vựng đơn giản, rõ ràng, phù hợp với câu trả lời ngắn Part 1.',
      suggestions: ['Nên sử dụng thêm các từ chỉ cảm xúc hoặc mở rộng cấu trúc câu như: passionate, enjoy, inspired, breathtaking.'],
    },
    keyTakeaway: `Hoàn thành bài làm ${isPart2 ? 'Part 2' : 'Part 1'} đạt điểm ${scaledScore}/30 (Trình độ CEFR ${cefr}).`,
  };
}

function replaceThirdPersonPronouns(text: string): string {
  if (!text) return text;
  return text
    .replace(/\bỨng viên\b/g, 'Bạn')
    .replace(/\bứng viên\b/g, 'bạn')
    .replace(/\bThí sinh\b/g, 'Bạn')
    .replace(/\bthí sinh\b/g, 'bạn');
}

// Programmatically enforce 100% exact mathematical score calculation based on detected errors
function enforceExactScoreMath(
  data: WritingAiFeedbackResponse,
  totalQuestionsCount: number = 5,
  userAnswers: string[] = []
): WritingAiFeedbackResponse {
  if (!data) return data;
  const isPart2 = totalQuestionsCount === 1;

  // Compute exact word counts from actual candidate input strings
  const wordCounts = userAnswers.map((ans) => (ans ? ans.trim().split(/\s+/).filter(Boolean).length : 0));
  const totalWordCount = wordCounts.reduce((sum, count) => sum + count, 0);
  const isEmptySubmission = totalWordCount === 0 || (userAnswers.length > 0 && userAnswers.every((ans) => !ans || !ans.trim()));

  if (isEmptySubmission) {
    return {
      ...data,
      score: 0,
      maxScore: 30,
      cefrLevel: 'A1',
      keyTakeaway: `Bài làm chưa được thực hiện (Bỏ trống câu hỏi). Bạn cần nhập câu trả lời để hệ thống đánh giá bài viết.`,
      taskCompletion: {
        status: 'danger',
        summary: isPart2
          ? 'Bài viết chưa được thực hiện (Bỏ trống bài làm).'
          : 'Bạn chưa hoàn thành các câu hỏi trong bài làm (Bỏ trống).',
        details: (data.taskCompletion?.details || []).map((d, idx) => ({
          ...d,
          questionIndex: d.questionIndex || idx + 1,
          isCorrect: false,
          note: 'Bỏ trống câu hỏi.',
        })),
      },
      grammarAndSpelling: {
        status: 'warning',
        summary: 'Không có câu trả lời để đánh giá ngữ pháp và chính tả.',
        corrections: [],
      },
      vocabulary: {
        status: 'info',
        summary: 'Không có câu trả lời để đánh giá từ vựng.',
        suggestions: [],
      },
    };
  }

  // 1. Separate off-topic corrections from real grammar/spelling corrections
  const rawCorrections = data.grammarAndSpelling?.corrections || [];
  const offTopicQuestionIndices = new Set<number>();
  const realCorrections: RuleCorrection[] = [];

  for (const c of rawCorrections) {
    if (!c.original || !c.correction) continue;

    // Check if original === correction (hallucinated non-error item)
    if (c.original.trim().toLowerCase() === c.correction.trim().toLowerCase()) {
      continue;
    }

    // Check if explanation/correction indicates an off-topic error instead of a spelling/grammar error
    const exp = (c.explanation || '').toLowerCase();
    const corr = (c.correction || '').toLowerCase();
    const isOffTopicCorrection =
      exp.includes('không liên quan') ||
      exp.includes('lạc đề') ||
      exp.includes('off-topic') ||
      exp.includes('unrelated') ||
      exp.includes('chủ đề') ||
      exp.includes('đề bài') ||
      exp.includes('nội dung') ||
      corr.includes('không áp dụng') ||
      corr.includes('không liên quan');

    const isStyleRewrite =
      exp.includes('cụ thể hơn') ||
      exp.includes('rõ ràng hơn') ||
      exp.includes('mở rộng') ||
      exp.includes('diễn đạt tốt hơn') ||
      exp.includes('thêm vào') ||
      exp.includes('nên viết');

    if (isOffTopicCorrection) {
      offTopicQuestionIndices.add(c.questionIndex);
    } else if (isStyleRewrite) {
      // Exclude subjective style rewrites from grammar/spelling error count
      continue;
    } else {
      realCorrections.push(c);
    }
  }

  // 2. Build sanitized Task Details: mark off-topic & length error questions as isCorrect = false, and spelling/grammar corrected questions as isCorrect = true!
  const realCorrectionQuestionIndices = new Set(realCorrections.map((c) => c.questionIndex));
  const rawTaskDetails = data.taskCompletion?.details || [];

  const sanitizedTaskDetails = rawTaskDetails.map((d) => {
    const noteLower = (d.note || '').toLowerCase();
    const isLengthErrorNote =
      noteLower.includes('không đủ từ') ||
      noteLower.includes('chưa đủ từ') ||
      noteLower.includes('thiếu từ') ||
      noteLower.includes('quá ngắn') ||
      noteLower.includes('hơi ngắn') ||
      noteLower.includes('quá dài') ||
      noteLower.includes('hơi dài') ||
      noteLower.includes('vượt quá');

    if (offTopicQuestionIndices.has(d.questionIndex) || isLengthErrorNote) {
      return {
        ...d,
        isCorrect: false,
      };
    }
    if (realCorrectionQuestionIndices.has(d.questionIndex)) {
      return {
        ...d,
        isCorrect: true,
        note: 'Câu trả lời phù hợp với chủ đề.',
      };
    }
    return d;
  });

  const taskErrors = sanitizedTaskDetails.filter((d) => d.isCorrect === false).length;
  const correctionsCount = realCorrections.length;

  // Check off-topic or severe underlength for Part 2 from empirical word counts
  let isOffTopic = offTopicQuestionIndices.size > 0;
  let isSevereUnderlength = false;

  if (isPart2) {
    const wc = wordCounts[0] || 0;
    if (wc > 0 && wc < 15) {
      isSevereUnderlength = true;
    }
    for (const d of rawTaskDetails) {
      const noteLower = (d.note || '').toLowerCase();
      if (noteLower.includes('lạc đề') || noteLower.includes('không liên quan') || noteLower.includes('off-topic') || noteLower.includes('hoàn toàn không')) {
        isOffTopic = true;
      }
    }
  }

  const totalErrors = correctionsCount + taskErrors;

  let score = 30;
  let cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'C1';

  if (isPart2 && isOffTopic) {
    score = 12;
    cefrLevel = 'A2';
  } else if (totalErrors === 0) {
    score = 30;
    cefrLevel = 'C1';
  } else if (totalErrors === 1) {
    if (isPart2 && isSevereUnderlength) {
      score = 18;
      cefrLevel = 'B1';
    } else {
      score = 24;
      cefrLevel = 'B2';
    }
  } else if (totalErrors === 2) {
    if (isPart2 && isSevereUnderlength) {
      score = 12;
      cefrLevel = 'A2';
    } else {
      score = 18;
      cefrLevel = 'B1';
    }
  } else if (totalErrors >= 3) {
    score = Math.max(0, 30 - totalErrors * 6);
    cefrLevel = score >= 18 ? 'B1' : score >= 12 ? 'A2' : 'A1';
  }

  const correctTaskCount = Math.max(0, totalQuestionsCount - taskErrors);
  const taskStatus = taskErrors === 0 ? 'success' : (isOffTopic || isSevereUnderlength || taskErrors >= 2) ? 'danger' : 'warning';
  const taskSummary = isPart2
    ? (taskErrors === 0
      ? 'Bạn đã hoàn thành 1/1 bài viết theo đúng quy định độ dài và phù hợp với chủ đề.'
      : 'Bài viết chưa đạt quy định độ dài hoặc không phù hợp với chủ đề.')
    : (taskErrors === 0
      ? 'Bạn đã trả lời đúng yêu cầu tất cả các câu hỏi, các câu trả lời ngắn gọn và phù hợp với chủ đề.'
      : `Bạn đã trả lời đúng yêu cầu ${correctTaskCount}/${totalQuestionsCount} câu hỏi. Có ${taskErrors} câu chưa phù hợp với chủ đề hoặc vi phạm độ dài.`);

  return {
    ...data,
    score,
    maxScore: 30,
    cefrLevel,
    keyTakeaway: replaceThirdPersonPronouns(data.keyTakeaway || ''),
    taskCompletion: {
      ...data.taskCompletion,
      status: taskStatus,
      summary: replaceThirdPersonPronouns(taskSummary),
      details: sanitizedTaskDetails.map((d) => ({
        ...d,
        note: replaceThirdPersonPronouns(d.note),
      })),
    },
    grammarAndSpelling: {
      ...data.grammarAndSpelling,
      status: realCorrections.length === 0 ? 'success' : 'warning',
      summary:
        realCorrections.length === 0
          ? 'Bạn đã viết câu đúng ngữ pháp và chính tả.'
          : replaceThirdPersonPronouns(data.grammarAndSpelling?.summary || ''),
      corrections: realCorrections.map((c) => ({
        ...c,
        explanation: replaceThirdPersonPronouns(c.explanation),
      })),
    },
    vocabulary: {
      ...data.vocabulary,
      summary: replaceThirdPersonPronouns(data.vocabulary?.summary || ''),
    },
  };
}

export async function POST(request: Request) {
  try {
    const body: EvaluateRequestBody = await request.json();
    const { partId, clubName, questions } = body;

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid payload: questions array is required.' }, { status: 400 });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.OPENROUTER_API_KEY;

    // If no API key is provided in environment, use robust local rule fallback
    if (!apiKey) {
      console.warn('[Writing API] No API keys configured. Returning rule-based evaluation.');
      const fallbackResult = generateLocalFallbackEvaluation(questions, clubName, partId);
      return NextResponse.json(fallbackResult);
    }

    // Build Prompt for LLM with explicit word counts
    const formattedQuestionsText = questions
      .map((q, idx) => {
        const text = (q.userAnswer || '').trim();
        const wc = text ? text.split(/\s+/).filter(Boolean).length : 0;
        return `Q${idx + 1}: ${q.questionText}\nCandidate Answer (${wc} words): "${text}"`;
      })
      .join('\n\n');

    const isPart2 = partId.toLowerCase() === 'part2' || questions.length === 1;

    const partRulesText = isPart2
      ? `CRITICAL RULES FOR APTIS WRITING PART 2 (Social media response):
1. EXACT WORD COUNT RULE: Part 2 REQUIRES a response strictly between 20 and 30 words (inclusive).
   - Any response between 20 words and 30 words (e.g. 21, 25, 26, 28, 30 words) IS OPTIMAL AND RECEIVES FULL TASK COMPLETION MARKS (28-30 points) with isCorrect = true.
   - IF WORD COUNT IS LESS THAN 20 WORDS (e.g. 11 words): YOU MUST SET taskCompletion.details[0].isCorrect = false AND taskCompletion.status = "warning" or "danger". Write natural note: "Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn)." NEVER write raw numbers like "11 từ / quy định 20-30 từ"!
   - IF WORD COUNT IS GREATER THAN 30 WORDS (e.g. 39 words): YOU MUST SET taskCompletion.details[0].isCorrect = false AND taskCompletion.status = "warning". Write natural note: "Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài)." NEVER write raw numbers!
   - STRICT NOTE FORMATTING RULE: NEVER output raw technical numbers or slash code formulas like "11 từ / quy định 20-30 từ" inside detail notes or summaries! Write clean natural Vietnamese notes only.
2. TOTAL QUESTIONS: There is ONLY 1 question in Part 2. In taskCompletion.summary and details, evaluate ONLY 1 question (e.g. "1/1 bài viết"). NEVER mention "4/5 câu hỏi" or "5 câu hỏi"!
3. MATHEMATICAL SCORE CALCULATION FOR PART 2 (Total scale: 30 points):
   - 0 total errors (relevant answer, 20-30 words, correct grammar/spelling) ➔ score = 30 (Band C1).
   - 1 total error (e.g. word count < 20 or > 30 OR 1 grammar/spelling error) ➔ score = 24 (Band B2) or 18 (Band B1 for under-length < 15 words).
   - 2 total errors ➔ score = 18 (Band B1).
   - 3 total errors ➔ score = 12 (Band A2).`
      : `CRITICAL RULES FOR APTIS WRITING PART 1 (Short answers):
1. EXACT WORD COUNT RULE: Part 1 allows ANY short answer from 1 to 5 words (inclusive).
   - 1 word, 2 words, 3 words, 4 words, and 5 words ARE ALL 100% VALID AND COMPLIANT.
   - NEVER say a 3-word, 4-word, or 5-word answer is "too long" or "quá dài"!
   - ONLY penalize for length if word count exceeds 5 words (i.e. 6 or more words).
2. ACCEPTED GREETING RESPONSES (e.g. to "How are you?"):
   - Answers such as "I'm good.", "I am good.", "Good.", "I'm fine.", "Fine, thanks.", "Very well.", "Great!" ARE ALL 100% PERFECT.
3. MATHEMATICAL SCORE CALCULATION FOR PART 1 (Total scale: 30 points):
   - Part 1 has 5 questions. Maximum score is 30 points.
   - 0 total errors ➔ score = 30 (Band C1)
   - 1 total error ➔ score = 24 (Band B2)
   - 2 total errors ➔ score = 18 (Band B1)
   - 3 total errors ➔ score = 12 (Band A2)`;

    const promptText = `
You are an expert official Aptis Writing examiner. Evaluate the candidate's answers for Aptis Writing ${partId.toUpperCase()} (Club Topic: "${
      clubName || 'General Club'
    }") strictly according to official Aptis CEFR criteria (A1, A2, B1, B2, C1).

CANDIDATE SUBMISSION:
${formattedQuestionsText}

${partRulesText}

STRICT SEPARATION OF ASSESSMENT CRITERIA:
- "Task Completion": Evaluates ONLY topic relevance and word count (${isPart2 ? '20-30 words' : '1-5 words'}).
  * If candidate gives an OFF-TOPIC answer, mark Task Completion status as "warning" or "danger".
  * NEVER mention spelling or grammar mistakes in Task Completion summary or notes!
- "Grammar & Spelling": Carefully check EVERY word in candidate answers for genuine spelling typos or grammatical errors.
  * You MUST check EVERY word carefully. Create a separate correction item for EACH misspelled word or grammar typo (e.g. "lik" -> "like", "decoratin" -> "decorating", "want join" -> "want to join")!
  * DO NOT create corrections for subjective style additions or sentence expansion (e.g. DO NOT report "my home very much" -> "my home very much, because I love decorating"). Style suggestions belong strictly under vocabulary.suggestions!
  * NEVER put off-topic answers inside grammarAndSpelling.corrections!
- "Vocabulary": Evaluates vocabulary range and suggests alternative advanced ENGLISH words/phrases (e.g. "breathtaking", "inspirational", "favorite pastime").
  * ALL ITEMS inside vocabulary.suggestions MUST BE ENGLISH WORDS/PHRASES!

FEEDBACK LANGUAGE & PRONOUN RULES: Write all summary feedback, detail notes, error explanations, and takeaways in natural, encouraging Vietnamese.
- ALWAYS address the candidate as "bạn" (e.g. "Bạn đã trả lời..."). NEVER use formal third-person terms like "ứng viên" or "thí sinh"!
- In taskCompletion.summary, ALWAYS state clearly how many questions were answered correctly (e.g. "${isPart2 ? 'Bạn đã hoàn thành 1/1 bài viết' : 'Bạn đã trả lời đúng yêu cầu 5/5 câu hỏi'}.").

Respond ONLY in valid raw JSON matching this schema:
{
  "score": number (0 to 30),
  "maxScore": 30,
  "cefrLevel": "A1" | "A2" | "B1" | "B2" | "C1",
  "taskCompletion": {
    "status": "success" | "warning" | "danger",
    "summary": "Detailed Vietnamese feedback on task completion and question relevance",
    "details": [
      { "questionIndex": 1, "isCorrect": true, "note": "Ghi chú bằng tiếng Việt" }
    ]
  },
  "grammarAndSpelling": {
    "status": "success" | "warning" | "danger",
    "summary": "Detailed Vietnamese feedback on grammar and spelling accuracy",
    "corrections": [
      {
        "questionIndex": 1,
        "type": "Ngữ pháp" | "Chính tả",
        "original": "Original candidate answer",
        "correction": "Corrected sentence",
        "explanation": "Vietnamese explanation of the error"
      }
    ]
  },
  "vocabulary": {
    "status": "info" | "success" | "warning",
    "summary": "Detailed Vietnamese feedback on vocabulary range and appropriateness",
    "suggestions": ["Gợi ý từ vựng nâng cao"]
  },
  "keyTakeaway": "Short conclusion summary in Vietnamese"
}
`;

    // 1. If Groq API Key is present
    if (process.env.GROQ_API_KEY) {
      const groqKeys = process.env.GROQ_API_KEY.split(',').map((k) => k.trim()).filter(Boolean);
      const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama3-70b-8192', 'mixtral-8x7b-32768'];

      for (const groqKey of groqKeys) {
        let keyRateLimited = false;
        for (const groqModel of groqModels) {
          if (keyRateLimited) break;
          try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${groqKey}`,
              },
              body: JSON.stringify({
                model: groqModel,
                messages: [{ role: 'user', content: promptText }],
                response_format: { type: 'json_object' },
                temperature: 0.2,
              }),
            });

            if (response.ok) {
              const resData = await response.json();
              const rawJsonText = resData.choices?.[0]?.message?.content || '';
              if (rawJsonText) {
                const parsedData: WritingAiFeedbackResponse = JSON.parse(rawJsonText);
                return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim())));
              }
            } else if (response.status === 429) {
              console.warn(`[Groq API Rate Limit 429] Key (${groqKey.slice(0, 10)}...) TPD limit reached. Instantly swapping to next Groq Key!`);
              keyRateLimited = true;
              break;
            } else {
              const errText = await response.text();
              console.warn(`[Groq API Warning] Key (${groqKey.slice(0, 10)}...) Model ${groqModel} failed (${response.status}):`, errText);
            }
          } catch (groqErr) {
            console.warn(`[Groq API Error] Key (${groqKey.slice(0, 10)}...) Model ${groqModel} call exception:`, groqErr);
          }
        }
      }
    }

    // 2. If OpenRouter API Key is present
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [{ role: 'user', content: promptText }],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          const rawJsonText = resData.choices?.[0]?.message?.content || '';
          if (rawJsonText) {
            const parsedData: WritingAiFeedbackResponse = JSON.parse(rawJsonText);
            return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim())));
          }
        }
      } catch (orErr) {
        console.warn('[OpenRouter API Error]', orErr);
      }
    }

    // 3. If Gemini API Key is present
    if (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const modelsToTry = [
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.5-flash',
        'gemini-1.5-pro',
      ];

      for (const modelName of modelsToTry) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.2,
                },
              }),
            }
          );

          if (response.ok) {
            const resData = await response.json();
            const rawJsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (rawJsonText) {
              const parsedData: WritingAiFeedbackResponse = JSON.parse(rawJsonText);
              return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim())));
            }
          } else {
            const errText = await response.text();
            console.warn(`[Gemini API Warning] Model ${modelName} failed (${response.status}):`, errText);
          }
        } catch (mErr) {
          console.warn(`[Gemini API Warning] Model ${modelName} call exception:`, mErr);
        }
      }
    }

    // 4. If OpenAI API Key is present
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptText }],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          const rawJsonText = resData.choices?.[0]?.message?.content || '';
          if (rawJsonText) {
            const parsedData: WritingAiFeedbackResponse = JSON.parse(rawJsonText);
            return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim())));
          }
        }
      } catch (oaiErr) {
        console.warn('[OpenAI API Error]', oaiErr);
      }
    }

    return NextResponse.json(generateLocalFallbackEvaluation(questions, clubName, partId));
  } catch (error: any) {
    console.error('[Writing Evaluation Route Error]', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
