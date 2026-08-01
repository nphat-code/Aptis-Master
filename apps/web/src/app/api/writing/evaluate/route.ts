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
  clubName?: string
): WritingAiFeedbackResponse {
  let validCount = 0;
  const total = questions.length || 5;
  const corrections: RuleCorrection[] = [];
  const details: Array<{ questionIndex: number; isCorrect: boolean; note: string }> = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const ans = (q.userAnswer || '').trim();
    const words = ans ? ans.split(/\s+/).length : 0;

    if (words >= 1 && words <= 5) {
      validCount++;
      details.push({
        questionIndex: qNum,
        isCorrect: true,
        note: `Trả lời đúng trọng tâm (${words} từ).`,
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
        note: `Vượt quá giới hạn từ (${words} từ, quy định 1–5 từ).`,
      });
      corrections.push({
        questionIndex: qNum,
        original: ans,
        correction: ans.split(/\s+/).slice(0, 5).join(' '),
        explanation: 'Bài viết vượt quá giới hạn 5 từ quy định của Part 1.',
      });
    }
  });

  const scaledScore = Math.round((validCount / total) * 30);
  let cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
  if (scaledScore >= 28) cefr = 'C1';
  else if (scaledScore >= 24) cefr = 'B2';
  else if (scaledScore >= 18) cefr = 'B1';
  else if (scaledScore >= 12) cefr = 'A2';

  return {
    score: scaledScore,
    maxScore: 30,
    cefrLevel: cefr,
    taskCompletion: {
      status: validCount === total ? 'success' : validCount >= 3 ? 'warning' : 'danger',
      summary: `Bạn đã hoàn thành ${validCount}/${total} câu hỏi theo đúng quy định độ dài (1–5 từ). ${
        clubName ? `Chủ đề bài làm: ${clubName}.` : ''
      }`,
      details,
    },
    grammarAndSpelling: {
      status: corrections.length === 0 ? 'success' : 'warning',
      summary:
        corrections.length === 0
          ? 'Các câu trả lời cơ bản đúng cấu trúc ngữ pháp và chính tả.'
          : `Có ${corrections.length} câu cần chú ý về giới hạn độ dài và ngữ pháp.`,
      corrections,
    },
    vocabulary: {
      status: 'info',
      summary: 'Từ vựng đơn giản, rõ ràng, phù hợp với câu trả lời ngắn Part 1.',
      suggestions: ['Nên sử dụng thêm các từ chỉ cảm xúc hoặc sở thích như: passionate, enjoy, favorite.'],
    },
    keyTakeaway: `Hoàn thành ${validCount}/${total} câu hỏi Part 1 đạt điểm ${scaledScore}/30 (Trình độ CEFR ${cefr}).`,
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
function enforceExactScoreMath(data: WritingAiFeedbackResponse): WritingAiFeedbackResponse {
  if (!data) return data;

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
    if (
      exp.includes('không liên quan') ||
      exp.includes('lạc đề') ||
      exp.includes('off-topic') ||
      exp.includes('unrelated') ||
      corr.includes('không áp dụng') ||
      corr.includes('không liên quan')
    ) {
      offTopicQuestionIndices.add(c.questionIndex);
    } else {
      realCorrections.push(c);
    }
  }

  // 2. Build sanitized Task Details: mark off-topic questions as isCorrect = false, and spelling/grammar corrected questions as isCorrect = true!
  const realCorrectionQuestionIndices = new Set(realCorrections.map((c) => c.questionIndex));
  const rawTaskDetails = data.taskCompletion?.details || [];

  const sanitizedTaskDetails = rawTaskDetails.map((d) => {
    if (offTopicQuestionIndices.has(d.questionIndex)) {
      return {
        ...d,
        isCorrect: false,
        note: 'Câu trả lời không liên quan đến câu hỏi (Lạc đề).',
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

  const totalErrors = correctionsCount + taskErrors;

  let score = 30;
  let cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'C1';

  if (totalErrors === 0) {
    score = 30;
    cefrLevel = 'C1';
  } else if (totalErrors === 1) {
    score = 24;
    cefrLevel = 'B2';
  } else if (totalErrors === 2) {
    score = 18;
    cefrLevel = 'B1';
  } else if (totalErrors === 3) {
    score = 12;
    cefrLevel = 'A2';
  } else {
    score = Math.max(0, 30 - totalErrors * 6);
    cefrLevel = score >= 18 ? 'B1' : score >= 12 ? 'A2' : 'A1';
  }

  const correctTaskCount = Math.max(0, 5 - taskErrors);
  const taskStatus = taskErrors === 0 ? 'success' : taskErrors === 1 ? 'warning' : 'danger';
  const taskSummary = taskErrors === 0
    ? 'Bạn đã trả lời đúng yêu cầu 5/5 câu hỏi, các câu trả lời ngắn gọn và phù hợp với chủ đề.'
    : `Bạn đã trả lời đúng yêu cầu ${correctTaskCount}/5 câu hỏi. Có ${taskErrors} câu chưa phù hợp với chủ đề hoặc vi phạm độ dài.`;

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
      summary: replaceThirdPersonPronouns(data.grammarAndSpelling?.summary || ''),
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
      const fallbackResult = generateLocalFallbackEvaluation(questions, clubName);
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

    const promptText = `
You are an expert official Aptis Writing examiner. Evaluate the candidate's answers for Aptis Writing ${partId.toUpperCase()} (Club Topic: "${
      clubName || 'General Club'
    }") strictly according to official Aptis CEFR criteria (A1, A2, B1, B2, C1).

CANDIDATE SUBMISSION:
${formattedQuestionsText}

CRITICAL RULES FOR APTIS WRITING PART 1 (Short answers):
1. EXACT WORD COUNT RULE: Part 1 allows ANY short answer from 1 to 5 words (inclusive).
   - 1 word, 2 words, 3 words, 4 words, and 5 words ARE ALL 100% VALID AND COMPLIANT.
   - NEVER say a 3-word, 4-word, or 5-word answer is "too long" or "quá dài"! 4-word and 5-word answers (e.g. "I enjoy reading books.", "My favorite food is pizza.") are PERFECT 100% valid English answers!
   - ONLY penalize for length if word count exceeds 5 words (i.e. 6 or more words).
2. ACCEPTED GREETING RESPONSES (e.g. to "How are you?"):
   - Answers such as "I'm good.", "I am good.", "Good.", "I'm fine.", "Fine, thanks.", "Very well.", "Great!" ARE ALL 100% PERFECT, NATURAL, AND VALID ENGLISH RESPONSES for "How are you?".
   - YOU MUST ACCEPT "I'm good." and "I am good." as 100% CORRECT for "How are you?". NEVER mark "I'm good." as wrong, incorrect, or inappropriate!
3. MATHEMATICAL SCORE CALCULATION FOR PART 1 (Total scale: 30 points):
   - Part 1 has 5 questions. Maximum score is 30 points.
   - You MUST count the total number of errors (spelling mistakes + grammar errors + off-topic answers + empty answers):
     * 0 total errors ➔ score = 30 (Band C1)
     * EXACTLY 1 total error (e.g., 1 spelling error in the entire submission) ➔ score = 24 (Band B2)
     * EXACTLY 2 total errors ➔ score = 18 (Band B1)
     * EXACTLY 3 total errors (e.g. 2 spelling + 1 grammar) ➔ score = 12 (Band A2)
     * 4 or 5 total errors / empty questions ➔ score = 6 or 0 (Band A1)
   - CRITICAL REQUIREMENT: Match the score strictly to the number of items in grammarAndSpelling.corrections and off-topic questions. If there is ONLY 1 correction item and 0 off-topic questions, total errors = 1, so the score MUST BE 24! Do not output 12 when there is only 1 error!
4. STRICT SEPARATION OF ASSESSMENT CRITERIA:
   - "Task Completion": Evaluates ONLY topic relevance and word count (1-5 words).
     * If candidate gives an OFF-TOPIC answer (e.g. asked "How are you?" but answered "My friend is good" instead of answering about oneself), mark that question's Task Completion note as off-topic, and set Task Completion status to "warning" or "danger".
     * NEVER mention spelling or grammar mistakes in Task Completion summary or notes!
   - "Grammar & Spelling": Carefully check EVERY word in candidate answers for spelling or grammar mistakes (e.g. "Tokoyo" -> "Tokyo", "Japn" -> "Japan", "Footbal" -> "Football", "autum" -> "autumn", "sumer" -> "summer", "Englis" -> "English").
     * You MUST create a correction item for EVERY misspelled word or grammar mistake!
     * NEVER put off-topic answers inside grammarAndSpelling.corrections! Corrections list is RESERVED STRICTLY for spelling and grammar errors.
     * NEVER add non-error items where original === correction (e.g. "Autumn -> Autumn") to corrections! If an answer has no spelling/grammar error, DO NOT create a correction item for it!
   - "Vocabulary": Evaluates vocabulary range and suggests alternative advanced ENGLISH words/phrases (e.g. "lush greenery", "relaxing", "picturesque", "favorite pastime").
     * ALL ITEMS inside vocabulary.suggestions MUST BE ENGLISH WORDS/PHRASES (e.g. "Use 'lush greenery' to describe plants", "Use 'relaxing' for garden activities")! NEVER output pure Vietnamese words like 'xinh đẹp' or 'thư giãn' inside the suggestions array!
5. FEEDBACK LANGUAGE & PRONOUN RULES: Write all summary feedback, detail notes, error explanations, and takeaways in natural, encouraging Vietnamese.
   - ALWAYS address the candidate as "bạn" (e.g. "Bạn đã trả lời..."). NEVER use formal third-person terms like "ứng viên" or "thí sinh"!
   - In taskCompletion.summary, ALWAYS state clearly how many questions were answered correctly (e.g. "Bạn đã trả lời đúng yêu cầu 4/5 câu hỏi.").
   - All suggested vocabulary items in suggestions array MUST BE IN ENGLISH. NEVER tell candidate that a 3, 4, or 5-word English answer should be shortened or translated into Vietnamese.

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
                return NextResponse.json(enforceExactScoreMath(parsedData));
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
            return NextResponse.json(enforceExactScoreMath(parsedData));
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
              return NextResponse.json(enforceExactScoreMath(parsedData));
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
            return NextResponse.json(enforceExactScoreMath(parsedData));
          }
        }
      } catch (oaiErr) {
        console.warn('[OpenAI API Error]', oaiErr);
      }
    }

    return NextResponse.json(generateLocalFallbackEvaluation(questions, clubName));
  } catch (error: any) {
    console.error('[Writing Evaluation Route Error]', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
