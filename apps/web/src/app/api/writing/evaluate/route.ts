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
  const isPart1 = partId.toLowerCase() === 'part1';
  const isPart2 = partId.toLowerCase() === 'part2';
  const isPart3 = partId.toLowerCase() === 'part3';
  const isPart4 = partId.toLowerCase() === 'part4';
  const total = questions.length || (isPart2 ? 1 : isPart4 ? 2 : isPart3 ? 3 : 5);

  const corrections: RuleCorrection[] = [];
  const details: Array<{ questionIndex: number; isCorrect: boolean; note: string }> = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const ans = (q.userAnswer || '').trim();
    const words = ans ? ans.split(/\s+/).filter(Boolean).length : 0;
    const minWords = isPart4 ? (idx === 0 ? 40 : 120) : isPart3 ? 30 : isPart2 ? 20 : 1;
    const maxWords = isPart4 ? (idx === 0 ? 60 : 150) : isPart3 ? 40 : isPart2 ? 30 : 5;

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
        explanation: words < minWords ? `Bài viết chưa đạt số lượng từ quy định (${minWords}-${maxWords} từ).` : `Bài viết vượt quá số lượng từ quy định (${minWords}-${maxWords} từ).`,
      });
    }
  });

  let maxScore = 10;
  let scaledScore = isPart1 ? Math.max(0, 10 - (total - validCount)) : Math.round((validCount / total) * 10);
  let cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = scaledScore >= 9 ? 'C1' : scaledScore >= 7 ? 'B2' : scaledScore >= 5 ? 'B1' : scaledScore >= 3 ? 'A2' : 'A1';

  const partLabel = partId.toUpperCase();
  const taskSummary = `Bạn đã hoàn thành ${validCount}/${total} yêu cầu trong bài làm ${partLabel}. ${clubName ? `Chủ đề bài làm: ${clubName}.` : ''}`;
  const keyTakeaway = `Bài làm ${partLabel} đạt điểm ${scaledScore}/10 (Trình độ CEFR ${cefr}).`;

  return {
    score: scaledScore,
    maxScore,
    cefrLevel: cefr,
    taskCompletion: {
      status: validCount === total ? 'success' : validCount >= Math.ceil(total / 2) ? 'warning' : 'danger',
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
      summary: isPart3
        ? 'Từ vựng diễn đạt linh hoạt, phù hợp với phản hồi phòng chat Part 3.'
        : isPart2
        ? 'Từ vựng diễn đạt phù hợp với phản hồi mạng xã hội Part 2.'
        : 'Từ vựng đơn giản, rõ ràng, phù hợp với câu trả lời ngắn Part 1.',
      suggestions: ['Nên sử dụng thêm các từ chỉ cảm xúc hoặc mở rộng cấu trúc câu như: passionate, enjoy, inspired, breathtaking.'],
    },
    keyTakeaway,
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
  userAnswers: string[] = [],
  partId: string = 'part1'
): WritingAiFeedbackResponse {
  if (!data) return data;
  const isPart1 = partId.toLowerCase() === 'part1';
  const isPart2 = partId.toLowerCase() === 'part2';
  const isPart3 = partId.toLowerCase() === 'part3';
  const isPart4 = partId.toLowerCase() === 'part4';

  // Compute exact word counts from actual candidate input strings
  const wordCounts = userAnswers.map((ans) => (ans ? ans.trim().split(/\s+/).filter(Boolean).length : 0));
  const totalWordCount = wordCounts.reduce((sum, count) => sum + count, 0);
  const isEmptySubmission = totalWordCount === 0 || (userAnswers.length > 0 && userAnswers.every((ans) => !ans || !ans.trim()));

  if (isEmptySubmission) {
    return {
      ...data,
      score: 0,
      maxScore: 10,
      cefrLevel: 'A1',
      keyTakeaway: `Bài làm ${partId.toUpperCase()} chưa được thực hiện (Bỏ trống bài làm). Bạn đạt điểm 0/10 (Trình độ A0).`,
      taskCompletion: {
        status: 'danger',
        summary: 'Bài viết chưa được thực hiện (Bỏ trống bài làm).',
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
      exp.includes('nên viết') ||
      exp.includes('thay vì') ||
      exp.includes('để chỉ định') ||
      exp.includes('tự nhiên hơn') ||
      exp.includes('mô tả') ||
      exp.includes('thay cho') ||
      exp.includes('không có lỗi') ||
      exp.includes('đã đúng') ||
      exp.includes('không sai') ||
      exp.includes('tính đa dạng');

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
    const qIdx = d.questionIndex - 1;
    const ansText = (userAnswers[qIdx] || '').trim();
    const ansWords = ansText ? ansText.split(/\s+/).filter(Boolean).length : 0;
    const noteLower = (d.note || '').toLowerCase();
    const isSingleChar = ansText.length === 1 && !/^[0-9]$/.test(ansText);

    const minAllowedWords = isPart4 ? (qIdx === 0 ? 40 : 120) : isPart3 ? 30 : isPart2 ? 20 : 1;
    const maxAllowedWords = isPart4 ? (qIdx === 0 ? 60 : 150) : isPart3 ? 40 : isPart2 ? 30 : 5;

    const isLengthCompliant = ansWords >= minAllowedWords && ansWords <= maxAllowedWords;
    const isOffTopicItem = offTopicQuestionIndices.has(d.questionIndex);

    if (isLengthCompliant && !isOffTopicItem && !isSingleChar) {
      return {
        ...d,
        isCorrect: true,
        note: isPart2
          ? 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (20-30 từ).'
          : isPart3
          ? 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (30-40 từ).'
          : isPart4
          ? `Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (${minAllowedWords}-${maxAllowedWords} từ).`
          : 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (1-5 từ).',
      };
    }

    const isLengthErrorNote =
      ansWords < minAllowedWords ||
      ansWords > maxAllowedWords ||
      noteLower.includes('không đủ từ') ||
      noteLower.includes('chưa đủ từ') ||
      noteLower.includes('thiếu từ') ||
      noteLower.includes('quá ngắn') ||
      noteLower.includes('hơi ngắn') ||
      noteLower.includes('quá dài') ||
      noteLower.includes('hơi dài') ||
      noteLower.includes('vượt quá');

    if (isOffTopicItem || isLengthErrorNote || isSingleChar) {
      const lengthNote =
        ansWords < minAllowedWords
          ? 'Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn).'
          : ansWords > maxAllowedWords
          ? 'Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài).'
          : d.note;

      return {
        ...d,
        isCorrect: false,
        note: isSingleChar ? 'Câu trả lời quá ngắn và không rõ nghĩa.' : lengthNote,
      };
    }
    if (realCorrectionQuestionIndices.has(d.questionIndex) && ansText.length >= 2) {
      return {
        ...d,
        isCorrect: true,
        note: 'Câu trả lời phù hợp với chủ đề.',
      };
    }
    return d;
  });

  let blankErrorsCount = 0;
  let offTopicErrorsCount = 0;
  let lengthErrorsCount = 0;

  sanitizedTaskDetails.forEach((d) => {
    if (!d.isCorrect) {
      const qIdx = d.questionIndex - 1;
      const ansText = (userAnswers[qIdx] || '').trim();
      const ansWords = ansText ? ansText.split(/\s+/).filter(Boolean).length : 0;
      const noteLower = (d.note || '').toLowerCase();

      const isBlank =
        ansWords === 0 ||
        noteLower.includes('bỏ qua') ||
        noteLower.includes('bỏ trống') ||
        noteLower.includes('chưa trả lời') ||
        noteLower.includes('không có câu trả lời');

      const maxAllowedWords = isPart4 ? (qIdx === 0 ? 60 : 150) : isPart3 ? 40 : isPart2 ? 30 : 5;

      const isOverLength =
        ansWords > maxAllowedWords ||
        noteLower.includes('quá dài') ||
        noteLower.includes('hơi dài') ||
        noteLower.includes('vượt quá');

      if (isBlank) {
        blankErrorsCount++;
      } else if (isOverLength) {
        lengthErrorsCount++;
      } else {
        // Any incorrect non-blank question that is not over length is an off-topic error
        offTopicErrorsCount++;
      }
    }
  });

  const taskErrors = sanitizedTaskDetails.filter((d) => d.isCorrect === false).length;

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

  // Deterministic grammar scanner for common typos if LLM missed them
  userAnswers.forEach((ans, qIdx) => {
    const qNum = qIdx + 1;
    const hasExistingCorrection = realCorrections.some((c) => c.questionIndex === qNum);
    if (!hasExistingCorrection && ans) {
      // 1. Check adverb modification error e.g. "concentrate very good" -> "concentrate very well"
      const advMatch = ans.match(/\b(concentrate|speak|listen|read|write|perform|work)\s+(very\s+)?good\b/i);
      if (advMatch) {
        const wrongPhrase = advMatch[0];
        const correctPhrase = wrongPhrase.replace(/\bgood\b/i, 'well');
        realCorrections.push({
          questionIndex: qNum,
          type: 'Ngữ pháp',
          original: wrongPhrase,
          correction: correctPhrase,
          explanation: `Sử dụng phó từ '${correctPhrase}' thay cho tính từ '${wrongPhrase}' để bổ nghĩa cho động từ.`,
        });
      }

      // 2. Check Subject-Verb agreement error e.g. "the owner always serve" -> "the owner always serves"
      const svMatch = ans.match(/\b(the owner|the author|he|she|it|my friend)\s+(always\s+)?(serve|work|prefer|want|like|make|give|take|need|know|enjoy)\b/i);
      if (svMatch) {
        const wrongPhrase = svMatch[0];
        const verb = svMatch[3];
        const correctVerb = verb.endsWith('e') ? `${verb}s` : `${verb}es`;
        const correctPhrase = wrongPhrase.replace(new RegExp(`\\b${verb}\\b`, 'i'), correctVerb);
        realCorrections.push({
          questionIndex: qNum,
          type: 'Ngữ pháp',
          original: wrongPhrase,
          correction: correctPhrase,
          explanation: `Chủ ngữ ngôi thứ ba số ít cần chia động từ số ít '${correctPhrase}' thay cho '${wrongPhrase}'.`,
        });
      }
    }
  });

  const correctionsCount = realCorrections.length;
  const totalErrors = correctionsCount + taskErrors;

  let maxScore = 10;
  let score = 10;

  const correctTaskCount = Math.max(0, totalQuestionsCount - taskErrors);

  if (isPart1) {
    const blankPenalty = blankErrorsCount * 2;
    const offTopicPenalty = offTopicErrorsCount * 2;
    const lengthPenalty = lengthErrorsCount * 1;
    const grammarPenalty = correctionsCount * 1;
    score = Math.max(0, 10 - blankPenalty - offTopicPenalty - lengthPenalty - grammarPenalty);
  } else if (isPart2) {
    if (isOffTopic) {
      score = 2;
    } else if (totalErrors === 0 && !isSevereUnderlength) {
      score = 10;
    } else if (totalErrors === 1 || isSevereUnderlength) {
      score = 8;
    } else if (totalErrors === 2) {
      score = 6;
    } else if (totalErrors === 3) {
      score = 4;
    } else {
      score = 2;
    }
  } else if (isPart3) {
    if (isOffTopic) {
      score = 2;
    } else if (totalErrors === 0) {
      score = 10;
    } else if (totalErrors === 1) {
      score = 9;
    } else if (totalErrors === 2) {
      score = 7;
    } else if (totalErrors === 3) {
      score = 5;
    } else if (totalErrors === 4) {
      score = 4;
    } else {
      score = Math.max(0, 10 - totalErrors * 2);
    }
  } else if (isPart4) {
    if (isOffTopic) {
      score = 2;
    } else if (totalErrors === 0) {
      score = 10;
    } else if (totalErrors === 1) {
      score = 9;
    } else if (totalErrors === 2) {
      score = 8;
    } else if (totalErrors === 3) {
      score = 7;
    } else if (totalErrors === 4) {
      score = 5;
    } else if (totalErrors === 5) {
      score = 4;
    } else {
      score = Math.max(0, 10 - totalErrors * 2);
    }
  } else {
    score = Math.max(0, 10 - totalErrors * 2);
  }

  const cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' =
    score >= 9 ? 'C1' : score >= 7 ? 'B2' : score >= 5 ? 'B1' : score >= 3 ? 'A2' : 'A1';

  const taskStatus = taskErrors === 0 ? 'success' : (isOffTopic || isSevereUnderlength || taskErrors >= 2) ? 'danger' : 'warning';
  const taskSummary = isPart2
    ? (taskErrors === 0 && !isSevereUnderlength
      ? 'Bạn đã hoàn thành 1/1 bài viết theo đúng quy định độ dài (20-30 từ) và phù hợp với chủ đề.'
      : 'Bài viết chưa đạt quy định độ dài (20-30 từ) hoặc nội dung chưa hoàn toàn phù hợp với chủ đề.')
    : isPart1
    ? (taskErrors === 0
      ? 'Bạn đã trả lời đúng quy định độ dài (1-5 từ/câu) và phù hợp với tất cả 5 câu hỏi.'
      : `Bạn đã trả lời đúng yêu cầu ${correctTaskCount}/${totalQuestionsCount} câu hỏi. Có ${taskErrors} câu chưa phù hợp hoặc vi phạm số lượng từ.`)
    : isPart3
    ? (taskErrors === 0
      ? 'Bạn đã hoàn thành 3/3 phản hồi phòng chat theo đúng quy định độ dài (30-40 từ/câu) và đúng chủ đề.'
      : `Bạn đã hoàn thành ${correctTaskCount}/3 phản hồi phòng chat. Có ${taskErrors} câu chưa đạt số lượng từ quy định hoặc vi phạm nội dung.`)
    : isPart4
    ? (taskErrors === 0
      ? 'Bạn đã hoàn thành xuất sắc 2 bài viết email (Email 1: 40-60 từ, Email 2: 120-150 từ) theo đúng văn phong.'
      : `Bài viết email chưa đạt quy định số lượng từ hoặc vi phạm văn phong yêu cầu.`)
    : (taskErrors === 0
      ? 'Bạn đã trả lời đúng yêu cầu tất cả các câu hỏi, các câu trả lời ngắn gọn và phù hợp với chủ đề.'
      : `Bạn đã trả lời đúng yêu cầu ${correctTaskCount}/${totalQuestionsCount} câu hỏi. Có ${taskErrors} câu chưa phù hợp với chủ đề hoặc vi phạm độ dài.`);

  const keyTakeawayText = `Bài làm ${partId.toUpperCase()} đạt điểm ${score}/10 (Trình độ CEFR ${cefrLevel}). ${
    score >= 9
      ? 'Bạn đã hoàn thành xuất sắc bài viết, đáp ứng đầy đủ tiêu chí yêu cầu.'
      : score >= 7
      ? 'Bài làm đạt kết quả tốt. Hãy tiếp tục chú ý hạn chế một số lỗi nhỏ để đạt điểm tối đa.'
      : score >= 5
      ? 'Bài làm đạt yêu cầu cơ bản. Bạn cần rèn luyện thêm về cấu trúc câu và từ vựng.'
      : 'Bài làm gặp một số lỗi vi phạm độ dài hoặc ngữ pháp. Hãy chú ý chỉnh sửa để cải thiện điểm số.'
  }`;

  return {
    ...data,
    score,
    maxScore,
    cefrLevel,
    keyTakeaway: keyTakeawayText,
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
          : `Có ${realCorrections.length} vị trí cần chú ý về ngữ pháp và chính tả.`,
      corrections: realCorrections.map((c) => ({
        ...c,
        explanation: replaceThirdPersonPronouns(c.explanation),
      })),
    },
    vocabulary: {
      ...data.vocabulary,
      summary: replaceThirdPersonPronouns(data.vocabulary?.summary || ''),
      suggestions: sanitizeVocabularySuggestions(data.vocabulary?.suggestions || []),
    },
  };
}

function sanitizeVocabularySuggestions(suggestions: string[]): string[] {
  if (!suggestions || !Array.isArray(suggestions)) return [];
  const vnDiacriticsRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

  return suggestions
    .map((s) => replaceThirdPersonPronouns(s || '').trim())
    .filter((s) => {
      if (!s) return false;

      // Extract quoted phrases inside quotes e.g. '...' or "..." or “...”
      const quotedMatches = s.match(/['"“‘]([^'"”’]+)['"”’]/g) || [];

      for (const qm of quotedMatches) {
        const rawContent = qm.replace(/['"“‘”’]/g, '').trim();
        // If the target replacement phrase inside quotes is a Vietnamese phrase, filter it out!
        if (vnDiacriticsRegex.test(rawContent)) {
          return false;
        }
      }

      return true;
    });
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

    const isPart3 = partId.toLowerCase() === 'part3';
    const isPart2 = partId.toLowerCase() === 'part2';

    const partRulesText = isPart3
      ? `CRITICAL RULES FOR APTIS WRITING PART 3 (Social media conversation):
1. EXACT WORD COUNT RULE: Part 3 REQUIRES responses strictly between 30 and 40 words (inclusive) per question.
   - Any response between 30 words and 40 words (e.g. 32, 35, 38, 40 words) IS OPTIMAL AND RECEIVES FULL TASK COMPLETION MARKS with isCorrect = true.
   - IF WORD COUNT IS LESS THAN 30 WORDS (e.g. 18 words): YOU MUST SET detail.isCorrect = false AND taskCompletion.status = "warning" or "danger". Write natural note: "Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn)."
   - IF WORD COUNT IS GREATER THAN 40 WORDS (e.g. 48 words): YOU MUST SET detail.isCorrect = false AND taskCompletion.status = "warning". Write natural note: "Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài)."
2. TOTAL QUESTIONS: There are 3 questions in Part 3. In taskCompletion.summary and details, evaluate all 3 questions (e.g. "3/3 câu hỏi").
3. MATHEMATICAL SCORE CALCULATION FOR PART 3 (Total scale: 30 points, 10 points per sub-question):
   - 0 total errors ➔ score = 30 (Band C1).
   - 1 total error ➔ score = 24 (Band B2).
   - 2 total errors ➔ score = 18 (Band B1).
   - 3 total errors ➔ score = 12 (Band A2).`
      : isPart2
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
3. MATHEMATICAL SCORE CALCULATION FOR PART 1 (Total scale: 10 points):
   - Part 1 has 5 questions. Maximum score is 10 points.
   - BLANK / MISSING ANSWER (e.g. "bỏ qua", "bỏ trống") OR OFF-TOPIC ANSWER (wrong topic / unrelated answer e.g. "không phù hợp với chủ đề"): Deduct EXACTLY 2 points per question (0/2 points for that question).
   - WORD COUNT ERROR (> 5 words) OR GRAMMAR/SPELLING ERROR: Deduct EXACTLY 1 point per error.
   - Example 1: 2 blank or off-topic errors ➔ score = 6/10.
   - Example 2: 2 length errors (> 5 words) ➔ score = 8/10.`;

    const promptText = `
You are an expert official Aptis Writing examiner. Evaluate the candidate's answers for Aptis Writing ${partId.toUpperCase()} (Club Topic: "${
      clubName || 'General Club'
    }") strictly according to official Aptis CEFR criteria (A1, A2, B1, B2, C1).

CANDIDATE SUBMISSION:
${formattedQuestionsText}

${partRulesText}

STRICT SEPARATION OF ASSESSMENT CRITERIA:
- "Task Completion": Evaluates ONLY topic relevance and word count (${isPart2 ? '20-30 words total' : isPart3 ? '30-40 words per response' : partId.toLowerCase() === 'part4' ? '40-60 words for Email 1 and 120-150 words for Email 2' : '1-5 words per answer'}).
  * If candidate gives an OFF-TOPIC answer, mark Task Completion status as "warning" or "danger".
  * NEVER mention spelling or grammar mistakes in Task Completion summary or notes!
  * STRICT WORD COUNT RULE FOR PART 2: The limit is 20-30 TOTAL words for the whole response. Do NOT evaluate length on a per-sentence basis! A response of 24 words is 100% compliant with 20-30 words. Do NOT say "1-5 từ/câu"!
- "Grammar & Spelling": RIGOROUS WORD-BY-WORD PROOFREADING PROTOCOL:
  You MUST proofread candidate answers word-by-word against this MANDATORY ERROR CHECKLIST:
  1. Subject-Verb Agreement: Check if 3rd-person singular subjects (he, she, it, single noun, the owner, my friend) match singular verbs with 's'/'es' (e.g. "he work" -> "he works", "the owner serve" -> "the owner serves").
  2. Adverb vs Adjective Misuse: Check if action verbs are modified by adverbs (well, fluently, quickly) instead of adjectives (good, fast) (e.g. "speak good" -> "speak well", "write good" -> "write well").
  3. Prepositions & Collocations: Check for missing or incorrect prepositions (e.g. "listen music" -> "listen to music", "interested on" -> "interested in", "good in" -> "good at").
  4. Verb Form / Tense Errors: Check verb patterns (e.g. "enjoy to play" -> "enjoy playing", "would like doing" -> "would like to do", "have keep" -> "have kept").
  5. Plural vs Singular Nouns: Check countability (e.g. "many friend" -> "many friends", "two year" -> "two years").
  6. Letter-level Spelling Typos: Check exact spelling of every single word (e.g. "favorate" -> "favorite", "beautifull" -> "beautiful").

  FEW-SHOT CORRECTION EXAMPLES TO FOLLOW:
  - Input: "I can speak English very good." -> Create correction: original: "speak English very good", correction: "speak English very well", explanation: "Sử dụng phó từ 'well' thay cho tính từ 'good' để bổ nghĩa cho động từ 'speak'."
  - Input: "The owner always serve delicious food." -> Create correction: original: "The owner always serve", correction: "The owner always serves", explanation: "Chủ ngữ số ít 'The owner' cần chia động từ 'serves'."

  STRICT PROHIBITION: NEVER report subjective style rewrites or optional clause rephrasing for sentences that are ALREADY 100% GRAMMATICALLY CORRECT! If the candidate's original sentence is grammatically correct, DO NOT put it inside grammarAndSpelling.corrections!
  NEVER put off-topic answers inside grammarAndSpelling.corrections!
- "Vocabulary": Evaluates vocabulary range and suggests alternative advanced ENGLISH words/phrases (e.g. "cutting-edge amenities", "inspirational", "favorite pastime", "urban aesthetics").
  * CRITICAL RULE FOR vocabulary.suggestions: EVERY replacement or alternative word MUST BE AN ENGLISH WORD/PHRASE!
  * CORRECT EXAMPLES:
    - "Nên sử dụng cụm từ tiếng Anh 'cutting-edge amenities' hoặc 'modern conveniences' để thay cho 'modern facilities'."
    - "Có thể dùng từ 'eco-friendly' hoặc 'sustainable' thay cho 'good for environment'."
  * STRICT PROHIBITION: NEVER recommend candidate to replace an English phrase with a Vietnamese phrase (e.g., NEVER write "Thay thế 'state-of-the-art facilities' bằng 'các tiện ích hiện đại'"!). Both the original phrase AND the suggested alternative MUST BE IN ENGLISH!

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
                return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId));
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
            return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId));
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
              return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId));
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
            return NextResponse.json(enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId));
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
