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
      process.env.OPENAI_API_KEY;

    // If no API key is provided in environment, use robust local rule fallback
    if (!apiKey) {
      console.warn('[Writing API] No GEMINI_API_KEY or OPENAI_API_KEY configured. Returning rule-based evaluation.');
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
2. STRICT SCORE DEDUCTION RULES FOR PART 1 (Total scale: 30 points):
   - Base max score: 30/30 (CEFR C1) for 5 on-topic answers with 0 errors.
   - Exact Heavy Point Deductions:
     * Each spelling mistake (e.g. "listning" -> "listening", "comdy" -> "comedy", "sculptur" -> "sculpture", "mouth" -> "month"): DEDUCT 6 POINTS.
     * Each grammar error (e.g. missing preposition "to" in "go work", "enjoy draw" -> "enjoy drawing"): DEDUCT 6 POINTS.
     * Each off-topic answer: DEDUCT 6 POINTS.
     * Each empty/unanswered question: DEDUCT 6 POINTS.
   - Mandatory Benchmark Score & CEFR Mapping:
     * 0 errors: 30/30 (Band C1)
     * 1 error: 24/30 (Band B2)
     * 2 errors: 18/30 (Band B1)
     * 3 errors (e.g. 2 spelling errors + 1 grammar error): STRICTLY 12/30 (Band A2). You MUST output score = 12 when candidate has 3 errors (2 spelling + 1 grammar)!
     * 4+ errors / empty questions: 6/30 or 0/30 (Band A1)
3. STRICT SEPARATION OF ASSESSMENT CRITERIA:
   - "Task Completion": Evaluates ONLY topic relevance and word count (1-5 words).
     * If candidate gives an OFF-TOPIC answer (e.g. asked "How are you?" but answered "My friend is good" instead of answering about oneself), mark that question's Task Completion note as off-topic, and set Task Completion status to "warning" or "danger".
     * NEVER mention spelling or grammar mistakes in Task Completion summary or notes!
   - "Grammar & Spelling": Evaluates ONLY spelling mistakes (e.g. "autum" -> "autumn", "Footbal" -> "Football") and grammar errors.
     * NEVER put off-topic answers inside grammarAndSpelling.corrections! Corrections list is RESERVED STRICTLY for spelling and grammar errors.
   - "Vocabulary": Evaluates vocabulary range and suggests alternative advanced words.
4. FEEDBACK LANGUAGE: Write all summary feedback, details notes, error explanations, and takeaways in natural, encouraging Vietnamese. NEVER tell candidate that a 3, 4, or 5-word English answer should be shortened or translated into Vietnamese.

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

    // 1. If Groq API Key is present (100% Free & Unlimited Rate Limits)
    if (process.env.GROQ_API_KEY) {
      const groqModels = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
      for (const groqModel of groqModels) {
        try {
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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
              return NextResponse.json(parsedData);
            }
          } else {
            const errText = await response.text();
            console.warn(`[Groq API Warning] Model ${groqModel} failed (${response.status}):`, errText);
          }
        } catch (groqErr) {
          console.warn(`[Groq API Error] Model ${groqModel} call exception:`, groqErr);
        }
      }
    }

    // 2. If OpenRouter API Key is present (Free models supported)
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
            return NextResponse.json(parsedData);
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
              return NextResponse.json(parsedData);
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

      if (!response.ok) {
        console.error('[OpenAI API Error]', await response.text());
        return NextResponse.json(generateLocalFallbackEvaluation(questions, clubName));
      }

      const resData = await response.json();
      const rawJsonText = resData.choices?.[0]?.message?.content || '';
      const parsedData: WritingAiFeedbackResponse = JSON.parse(rawJsonText);
      return NextResponse.json(parsedData);
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
