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
  questionIndex?: number;
  type?: 'Ngữ pháp' | 'Chính tả' | string;
  original: string;
  correction: string;
  explanation: string;
}

export interface WritingErrorItem {
  questionIndex?: number;
  original: string;
  corrected: string;
  explanation: string;
}

export interface WritingCefrBands {
  tf: number;  // Task Fulfillment (0 - 5)
  gra: number; // Grammatical Accuracy (0 - 5)
  vra: number; // Vocabulary Range & Accuracy (0 - 5)
  cc: number;  // Cohesion & Coherence (0 - 5)
  reg: number; // Register & Tone (0 - 5)
}

export interface WritingCriteriaAnalysis {
  tf: string;
  gra: string;
  vra: string;
  cc: string;
  reg: string;
}

export interface WritingAiFeedbackResponse {
  score: number;
  maxScore: number;
  cefrLevel: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  bands: WritingCefrBands;
  rawPart?: number;
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
  grammarErrors?: WritingErrorItem[];
  spellingErrors?: WritingErrorItem[];
  improvedVersion?: string;
  improvedAnswers?: Array<{ questionIndex: number; improvedText: string }>;
  criteriaAnalysis?: WritingCriteriaAnalysis;
  feedback?: string;
  keyTakeaway: string;
}

function replaceThirdPersonPronouns(text: string): string {
  if (!text) return text;
  return text
    .replace(/\bỨng viên\b/g, 'Bạn')
    .replace(/\bứng viên\b/g, 'bạn')
    .replace(/\bThí sinh\b/g, 'Bạn')
    .replace(/\bthí sinh\b/g, 'bạn')
    .replace(/冠\s*từ/g, 'mạo từ')
    .replace(/冠/g, 'mạo từ ');
}

function sanitizeVocabularySummary(summary: string): string {
  if (!summary) return 'Từ vựng của bạn phù hợp với yêu cầu đề bài.';
  const vnDiacriticsRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

  let cleaned = replaceThirdPersonPronouns(summary);
  const quotedMatches = cleaned.match(/['"“‘]([^'"”’]+)['"”’]/g) || [];
  for (const qm of quotedMatches) {
    const rawContent = qm.replace(/['"“‘”’]/g, '').trim();
    if (vnDiacriticsRegex.test(rawContent)) {
      cleaned = cleaned.replace(qm, '');
    }
  }

  cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
  return cleaned || 'Bài viết sử dụng từ vựng phù hợp. Bạn có thể mở rộng thêm các từ vựng tiếng Anh nâng cao.';
}

function sanitizeVocabularySuggestions(suggestions: string[]): string[] {
  if (!suggestions || !Array.isArray(suggestions)) return [];
  const vnDiacriticsRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

  return suggestions
    .map((s) => replaceThirdPersonPronouns(s || '').trim())
    .filter((s) => {
      if (!s) return false;
      const quotedMatches = s.match(/['"“‘]([^'"”’]+)['"”’]/g) || [];
      for (const qm of quotedMatches) {
        const rawContent = qm.replace(/['"“‘”’]/g, '').trim();
        if (vnDiacriticsRegex.test(rawContent)) {
          return false;
        }
      }
      return true;
    });
}

function isNonEnglishAnswer(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  const vnDiacriticsRegex = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
  if (vnDiacriticsRegex.test(trimmed)) return true;

  const vnCommonWords = new Set([
    'toi', 'khoe', 'mua', 'he', 'dong', 'xuan', 'thu', 'bong', 'da', 'ao', 'quan',
    'so', 'mi', 'nhac', 'tre', 'viet', 'nam', 'khong', 'co', 'ban', 'em', 'anh', 'chi'
  ]);
  const tokens = trimmed.toLowerCase().split(/[\s,.'!?]+/).filter(Boolean);
  if (tokens.length > 0 && tokens.every((t) => vnCommonWords.has(t))) {
    return true;
  }
  return false;
}

// Deterministic Local Fallback Evaluator when no API key is configured or offline
function generateLocalFallbackEvaluation(
  questions: QuestionSubmission[],
  clubName?: string,
  partId: string = 'part1'
): WritingAiFeedbackResponse {
  let validCount = 0;
  let minorLengthViolationsCount = 0;
  let moderateLengthViolationsCount = 0;
  let severeLengthViolationsCount = 0;
  let emptyCount = 0;
  let nonEnglishCount = 0;

  const isPart1 = partId.toLowerCase() === 'part1';
  const isPart2 = partId.toLowerCase() === 'part2';
  const isPart3 = partId.toLowerCase() === 'part3';
  const isPart4 = partId.toLowerCase() === 'part4';
  const total = questions.length || (isPart2 ? 1 : isPart4 ? 2 : isPart3 ? 3 : 5);

  const corrections: RuleCorrection[] = [];
  const grammarErrors: WritingErrorItem[] = [];
  const spellingErrors: WritingErrorItem[] = [];
  const details: Array<{ questionIndex: number; isCorrect: boolean; note: string }> = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const ans = (q.userAnswer || '').trim();
    const words = ans ? ans.split(/\s+/).filter(Boolean).length : 0;
    const minWords = isPart4 ? (idx === 0 ? 40 : 120) : isPart3 ? 30 : isPart2 ? 20 : 1;
    const maxWords = isPart4 ? (idx === 0 ? 60 : 150) : isPart3 ? 40 : isPart2 ? 30 : 5;

    if (words === 0) {
      emptyCount++;
      details.push({
        questionIndex: qNum,
        isCorrect: false,
        note: 'Bỏ trống câu hỏi.',
      });
    } else if (isNonEnglishAnswer(ans)) {
      nonEnglishCount++;
      details.push({
        questionIndex: qNum,
        isCorrect: false,
        note: 'Bài làm không phải tiếng Anh hợp lệ.',
      });
    } else if (words >= minWords && words <= maxWords) {
      validCount++;
      details.push({
        questionIndex: qNum,
        isCorrect: true,
        note: isPart2
          ? 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (20-30 từ).'
          : isPart3
          ? 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (30-40 từ).'
          : isPart4
          ? `Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (${minWords}-${maxWords} từ).`
          : 'Câu trả lời phù hợp với chủ đề và đạt độ dài quy định (1-5 từ).',
      });
    } else {
      if (words < minWords) {
        const diff = minWords - words;
        if (diff <= 2) {
          minorLengthViolationsCount++;
          details.push({
            questionIndex: qNum,
            isCorrect: false,
            note: `Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn: ${words} từ).`,
          });
        } else {
          severeLengthViolationsCount++;
          details.push({
            questionIndex: qNum,
            isCorrect: false,
            note: `Câu trả lời quá ngắn (${words} từ, quy định tối thiểu ${minWords} từ).`,
          });
        }
      } else {
        const excess = words - maxWords;
        if (isPart1) {
          if (excess <= 3) {
            minorLengthViolationsCount++;
            details.push({
              questionIndex: qNum,
              isCorrect: false,
              note: `Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài: ${words} từ).`,
            });
          } else if (excess <= 6) {
            moderateLengthViolationsCount++;
            details.push({
              questionIndex: qNum,
              isCorrect: false,
              note: `Câu trả lời quá dài (${words} từ, quy định tối đa 5 từ).`,
            });
          } else {
            severeLengthViolationsCount++;
            details.push({
              questionIndex: qNum,
              isCorrect: false,
              note: `Câu trả lời quá dài (${words} từ, quy định 1-5 từ).`,
            });
          }
        } else {
          if (excess <= 5) {
            minorLengthViolationsCount++;
            details.push({
              questionIndex: qNum,
              isCorrect: false,
              note: `Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài: ${words} từ).`,
            });
          } else {
            severeLengthViolationsCount++;
            details.push({
              questionIndex: qNum,
              isCorrect: false,
              note: `Câu trả lời vượt quá số lượng từ quy định (${words} từ, tối đa ${maxWords} từ).`,
            });
          }
        }
      }
    }
  });

  const allEmpty = questions.every((q) => !(q.userAnswer || '').trim());
  let maxScore = 10;
  let scaledScore = 10;

  if (allEmpty) {
    scaledScore = 0;
  } else if (isPart1) {
    const emptyPenalty = emptyCount * 2.0;
    const nonEnglishPenalty = nonEnglishCount * 2.0;
    const severePenalty = severeLengthViolationsCount * 1.5;
    const modPenalty = moderateLengthViolationsCount * 1.0;
    const minorPenalty = Math.min(2.0, minorLengthViolationsCount * 0.5);
    const grammarPenalty = corrections.length * 1.0;

    scaledScore = Math.max(
      0,
      Math.round(
        (10 - emptyPenalty - nonEnglishPenalty - severePenalty - modPenalty - minorPenalty - grammarPenalty) * 2
      ) / 2
    );
  } else if (isPart2) {
    const q1Words = questions[0]?.userAnswer ? questions[0].userAnswer.trim().split(/\s+/).filter(Boolean).length : 0;
    if (q1Words === 0 || nonEnglishCount > 0) scaledScore = 0;
    else if (q1Words >= 20 && q1Words <= 30) scaledScore = Math.max(0, 10 - corrections.length * 1.5);
    else if (q1Words >= 16 && q1Words <= 35) scaledScore = Math.max(0, 8 - corrections.length * 1.5);
    else if (q1Words >= 12 && q1Words <= 40) scaledScore = Math.max(0, 6 - corrections.length * 1.5);
    else scaledScore = Math.max(0, 4 - corrections.length * 1.5);
  } else if (isPart3) {
    const emptyPenalty = emptyCount * 3.3;
    const nonEnglishPenalty = nonEnglishCount * 3.3;
    const minorPenalty = minorLengthViolationsCount * 0.7;
    const severePenalty = severeLengthViolationsCount * 1.5;
    scaledScore = Math.max(0, Math.round(10 - emptyPenalty - nonEnglishPenalty - minorPenalty - severePenalty - corrections.length * 1.0));
  } else if (isPart4) {
    const emptyPenalty = emptyCount * 5.0;
    const nonEnglishPenalty = nonEnglishCount * 5.0;
    const minorPenalty = minorLengthViolationsCount * 1.0;
    const severePenalty = severeLengthViolationsCount * 2.0;
    scaledScore = Math.max(0, Math.round(10 - emptyPenalty - nonEnglishPenalty - minorPenalty - severePenalty - corrections.length * 1.0));
  }

  let cefr: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' =
    scaledScore === 0
      ? 'A0'
      : scaledScore >= 9
      ? 'C1'
      : scaledScore >= 7
      ? 'B2'
      : scaledScore >= 5
      ? 'B1'
      : scaledScore >= 3
      ? 'A2'
      : 'A1';

  const calcTf = allEmpty || nonEnglishCount === total
    ? 0
    : Math.max(1, Math.min(5, Math.round(5 - (emptyCount * 2 + nonEnglishCount * 2 + severeLengthViolationsCount * 1.5 + moderateLengthViolationsCount * 1.0 + minorLengthViolationsCount * 0.5))));
  const calcGra = allEmpty ? 0 : Math.max(1, Math.min(5, 5 - corrections.length));
  const calcVra = allEmpty ? 0 : scaledScore >= 9 ? 5 : scaledScore >= 7 ? 4 : scaledScore >= 5 ? 3 : scaledScore >= 3 ? 2 : 1;
  const calcCc = allEmpty ? 0 : emptyCount > 0 ? Math.max(1, 4 - emptyCount) : 5;
  const calcReg = allEmpty ? 0 : 5;

  const bands: WritingCefrBands = {
    tf: calcTf,
    gra: calcGra,
    vra: calcVra,
    cc: calcCc,
    reg: isPart1 ? 5 : calcReg,
  };

  const partLabel = partId.toUpperCase();
  const totalLengthViolations = minorLengthViolationsCount + moderateLengthViolationsCount + severeLengthViolationsCount;
  const taskSummary = isPart1
    ? (validCount === total
      ? `Bạn đã trả lời đúng quy định độ dài (1-5 từ/câu) và phù hợp với tất cả 5 câu hỏi. ${clubName ? `Chủ đề: ${clubName}.` : ''}`
      : (emptyCount === 0 && nonEnglishCount === 0)
      ? `Bạn đã trả lời đúng chủ đề ${total}/${total} câu hỏi (trong đó có ${totalLengthViolations} câu hơi dài so với quy định 1–5 từ).`
      : `Bạn đã hoàn thành ${validCount}/${total} yêu cầu trong bài làm ${partLabel}.`)
    : `Bạn đã hoàn thành ${validCount}/${total} yêu cầu trong bài làm ${partLabel}. ${clubName ? `Chủ đề: ${clubName}.` : ''}`;
  const keyTakeaway = allEmpty
    ? `Bài làm ${partLabel} chưa được thực hiện (Bỏ trống bài làm). Bạn đạt điểm 0/10 (Trình độ A0).`
    : `Bài làm ${partLabel} đạt điểm ${scaledScore}/10 (Trình độ CEFR ${cefr}).`;

  let improvedVersion = '';
  const improvedAnswers: Array<{ questionIndex: number; improvedText: string }> = [];

  if (isPart1) {
    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      const rawAns = (q.userAnswer || '').trim();
      let polished = '';
      if (rawAns) {
        const cleaned = rawAns.replace(/[.!?]+$/, '').trim();
        const words = cleaned.split(/\s+/).filter(Boolean);
        if (words.length <= 5) {
          polished = cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + '.';
        } else if (/doing well|very well/i.test(cleaned)) {
          polished = 'Well, thank you.';
        } else if (/football/i.test(cleaned)) {
          polished = 'Football.';
        } else if (/wearing/i.test(cleaned)) {
          const match = cleaned.match(/wearing\s+(.+)$/i);
          polished = match ? (match[1].charAt(0).toUpperCase() + match[1].slice(1) + '.') : 'A black shirt.';
        } else if (/spring|summer|autumn|fall|winter/i.test(cleaned)) {
          const season = cleaned.match(/spring|summer|autumn|fall|winter/i)?.[0];
          polished = season ? (season.charAt(0).toUpperCase() + season.slice(1) + '.') : 'Spring weather.';
        } else if (/pop|rock|jazz|classical/i.test(cleaned)) {
          const music = cleaned.match(/pop|rock|jazz|classical/i)?.[0];
          polished = music ? (music.charAt(0).toUpperCase() + music.slice(1) + ' music.') : 'Pop music.';
        } else {
          polished = words.slice(0, 4).join(' ') + '.';
        }
      } else {
        polished = (q as any).sampleAnswer || 'Good, thanks!';
      }
      improvedAnswers.push({ questionIndex: qNum, improvedText: polished });
    });
    improvedVersion = improvedAnswers.map((a) => `${a.questionIndex}. ${a.improvedText}`).join('\n');
  } else if (isPart2) {
    const rawAns = (questions[0]?.userAnswer || '').trim();
    const sample = (questions[0] as any)?.sampleAnswer;
    const improved = rawAns.length > 20
      ? rawAns
      : (sample || `I joined this ${clubName || 'club'} because I have a great passion for it. I really hope to improve my skills and make new friends who share the same interest.`);
    improvedAnswers.push({ questionIndex: 1, improvedText: improved });
    improvedVersion = improved;
  } else if (isPart3) {
    questions.forEach((q, idx) => {
      const qNum = idx + 1;
      const rawAns = (q.userAnswer || '').trim();
      const sample = (q as any).sampleAnswer || 'I completely agree with your viewpoint. In my experience, participating regularly helps us broaden our knowledge.';
      const improved = rawAns.length > 20 ? rawAns : sample;
      improvedAnswers.push({ questionIndex: qNum, improvedText: improved });
    });
    improvedVersion = improvedAnswers.map((a) => `Speaker ${a.questionIndex}: ${a.improvedText}`).join('\n\n');
  } else if (isPart4) {
    const s1 = (questions[0]?.userAnswer || '').trim() || (questions[0] as any)?.sampleAnswer || 'Hi Alex, Have you heard the latest news about our club? I think it is quite surprising. Let us talk soon! Best, [Name]';
    const s2 = (questions[1]?.userAnswer || '').trim() || (questions[1] as any)?.sampleAnswer || 'Dear President, I am writing this email to express my thoughts regarding the recent announcement about our club activities...';
    improvedAnswers.push({ questionIndex: 1, improvedText: s1 });
    improvedAnswers.push({ questionIndex: 2, improvedText: s2 });
    improvedVersion = `[Email 1]\n${s1}\n\n[Email 2]\n${s2}`;
  }

  const partSpecificSuggestions = isPart1
    ? [
        'Ưu tiên câu trả lời ngắn gọn (1–5 từ), đúng trọng tâm để tiết kiệm thời gian làm bài.',
        'Chú ý viết hoa chữ cái đầu câu, đặt dấu chấm kết thúc câu và kiểm tra kỹ chính tả danh từ/tính từ.',
      ]
    : isPart2
    ? [
        'Nên sử dụng các liên từ cơ bản (because, so, and, but) để kết nối câu tự nhiên trong 20–30 từ.',
        'Bổ sung các tính từ chỉ sở thích và động lực tham gia: passionate, eager to learn, excited, fascinating.',
      ]
    : isPart3
    ? [
        'Sử dụng các cụm từ nêu quan điểm giao tiếp: In my opinion, Personally, I think, From my perspective.',
        'Kết hợp các liên từ mạch lạc: Furthermore, Moreover, However, For instance (duy trì 30–40 từ/câu).',
      ]
    : [
        'Email 1 (Thân mật, 40–50 từ): Sử dụng từ viết tắt (I\'m, can\'t), từ ngữ cảm xúc và cấu trúc rủ rê (Why don\'t we..., Let\'s...).',
        'Email 2 (Trang trọng, 120–150 từ): Sử dụng cấu trúc trang trọng (I am writing to express..., Furthermore, I would appreciate it if...), tuyệt đối KHÔNG viết tắt.',
      ];

  return {
    score: scaledScore,
    maxScore,
    cefrLevel: cefr,
    bands,
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
      summary: isPart4
        ? 'Từ vựng email trang trọng và tự nhiên, phân biệt rõ văn phong thân mật và trang trọng.'
        : isPart3
        ? 'Từ vựng diễn đạt linh hoạt, phù hợp với phản hồi phòng chat Part 3.'
        : isPart2
        ? 'Từ vựng diễn đạt phù hợp với phản hồi mạng xã hội Part 2.'
        : 'Từ vựng đơn giản, rõ ràng, phù hợp với câu trả lời ngắn Part 1.',
      suggestions: partSpecificSuggestions,
    },
    grammarErrors,
    spellingErrors,
    improvedVersion,
    improvedAnswers,
    criteriaAnalysis: {
      tf: allEmpty ? 'Bài làm bị bỏ trống hoàn toàn, không đáp ứng yêu cầu đề bài.' : `Bạn đã hoàn thành ${validCount}/${total} yêu cầu với độ dài phù hợp.`,
      gra: allEmpty ? 'Chưa có dữ liệu để đánh giá ngữ pháp.' : 'Cấu trúc câu cơ bản hoàn chỉnh, cần mở rộng thêm các thì và cấu trúc nâng cao.',
      vra: allEmpty ? 'Chưa có dữ liệu để đánh giá từ vựng.' : 'Vốn từ vựng tương đối đầy đủ, có thể bổ sung thêm collocations và từ vựng học thuật.',
      cc: allEmpty ? 'Chưa có dữ liệu để đánh giá tính liên kết.' : 'Các câu trả lời có tính mạch lạc và liên kết logic tốt.',
      reg: allEmpty ? 'Chưa có dữ liệu để đánh giá văn phong.' : 'Văn phong bài viết phù hợp với yêu cầu của đề bài.',
    },
    keyTakeaway,
  };
}

// Programmatically enforce 100% exact mathematical score calculation based on detected errors and CEFR standard
function enforceExactScoreMath(
  data: WritingAiFeedbackResponse,
  totalQuestionsCount: number = 5,
  userAnswers: string[] = [],
  partId: string = 'part1',
  clubName?: string
): WritingAiFeedbackResponse {
  if (!data) return data;
  const isPart1 = partId.toLowerCase() === 'part1';
  const isPart2 = partId.toLowerCase() === 'part2';
  const isPart3 = partId.toLowerCase() === 'part3';
  const isPart4 = partId.toLowerCase() === 'part4';

  const wordCounts = userAnswers.map((ans) => (ans ? ans.trim().split(/\s+/).filter(Boolean).length : 0));
  const totalWordCount = wordCounts.reduce((sum, count) => sum + count, 0);
  const isEmptySubmission = totalWordCount === 0 || (userAnswers.length > 0 && userAnswers.every((ans) => !ans || !ans.trim()));

  if (isEmptySubmission) {
    return {
      ...data,
      score: 0,
      maxScore: 10,
      cefrLevel: 'A0',
      bands: { tf: 0, gra: 0, vra: 0, cc: 0, reg: 0 },
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
      grammarErrors: [],
      spellingErrors: [],
      criteriaAnalysis: {
        tf: 'Bài viết bị bỏ trống hoàn toàn.',
        gra: 'Không có câu văn để đánh giá ngữ pháp.',
        vra: 'Không có từ vựng để đánh giá.',
        cc: 'Không có nội dung để đánh giá tính mạch lạc.',
        reg: 'Không có văn phong để đánh giá.',
      },
    };
  }

  // 1. Separate off-topic corrections from real grammar/spelling corrections
  const rawCorrections = data.grammarAndSpelling?.corrections || [];
  const offTopicQuestionIndices = new Set<number>();
  const realCorrections: RuleCorrection[] = [];

  for (const c of rawCorrections) {
    if (!c.original || !c.correction) continue;

    const origRaw = c.original.trim().toLowerCase();
    const corrRaw = c.correction.trim().toLowerCase();

    if (origRaw === corrRaw) continue;

    const exp = (c.explanation || '').toLowerCase();
    const isOffTopicCorrection =
      exp.includes('không liên quan') ||
      exp.includes('lạc đề') ||
      exp.includes('off-topic') ||
      exp.includes('unrelated') ||
      exp.includes('sai chủ đề') ||
      exp.includes('không đúng chủ đề') ||
      corrRaw.includes('không áp dụng') ||
      corrRaw.includes('không liên quan');

    const isStyleRewrite =
      exp.includes('không có lỗi') ||
      exp.includes('đã đúng') ||
      exp.includes('câu đã chuẩn') ||
      exp.includes('không sai') ||
      exp.includes('anh-anh') ||
      exp.includes('anh-mỹ') ||
      exp.includes('consider') ||
      exp.includes('có thể viết') ||
      exp.includes('có thể dùng') ||
      exp.includes('mượt mà') ||
      exp.includes('tự nhiên hơn');

    if (isOffTopicCorrection) {
      offTopicQuestionIndices.add(c.questionIndex || 1);
    } else if (!isStyleRewrite) {
      realCorrections.push(c);
    }
  }

  // 2. Sanitize task details
  let minorLengthErrors = 0;
  let moderateLengthErrors = 0;
  let severeLengthErrors = 0;
  let emptyErrors = 0;
  let nonEnglishErrors = 0;
  let offTopicErrors = 0;

  const rawTaskDetails = data.taskCompletion?.details || [];
  const sanitizedTaskDetails = rawTaskDetails.map((d) => {
    const qIdx = (d.questionIndex || 1) - 1;
    const ansText = (userAnswers[qIdx] || '').trim();
    const ansWords = ansText ? ansText.split(/\s+/).filter(Boolean).length : 0;
    const isSingleChar = ansText.length === 1 && !/^[0-9]$/.test(ansText);
    const isNonEnglish = isNonEnglishAnswer(ansText);

    const minAllowedWords = isPart4 ? (qIdx === 0 ? 40 : 120) : isPart3 ? 30 : isPart2 ? 20 : 1;
    const maxAllowedWords = isPart4 ? (qIdx === 0 ? 60 : 150) : isPart3 ? 40 : isPart2 ? 30 : 5;

    const isLengthCompliant = ansWords >= minAllowedWords && ansWords <= maxAllowedWords;
    const isOffTopicItem = offTopicQuestionIndices.has(d.questionIndex);

    if (ansWords === 0) {
      emptyErrors++;
      return {
        ...d,
        isCorrect: false,
        note: 'Bỏ trống câu hỏi.',
      };
    }

    if (isNonEnglish) {
      nonEnglishErrors++;
      return {
        ...d,
        isCorrect: false,
        note: 'Bài làm không phải tiếng Anh hợp lệ.',
      };
    }

    if (isOffTopicItem) {
      offTopicErrors++;
      return {
        ...d,
        isCorrect: false,
        note: 'Nội dung chưa phù hợp với chủ đề câu hỏi.',
      };
    }

    if (isSingleChar) {
      severeLengthErrors++;
      return {
        ...d,
        isCorrect: false,
        note: 'Câu trả lời quá ngắn và không rõ nghĩa.',
      };
    }

    if (isLengthCompliant) {
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

    if (ansWords < minAllowedWords) {
      const diff = minAllowedWords - ansWords;
      if (diff <= 2) {
        minorLengthErrors++;
        return {
          ...d,
          isCorrect: false,
          note: `Câu trả lời chưa đủ từ theo yêu cầu (hơi ngắn: ${ansWords} từ).`,
        };
      } else {
        severeLengthErrors++;
        return {
          ...d,
          isCorrect: false,
          note: `Câu trả lời quá ngắn (${ansWords} từ, quy định tối thiểu ${minAllowedWords} từ).`,
        };
      }
    } else {
      const excess = ansWords - maxAllowedWords;
      if (isPart1) {
        if (excess <= 3) {
          minorLengthErrors++;
          return {
            ...d,
            isCorrect: false,
            note: `Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài: ${ansWords} từ).`,
          };
        } else if (excess <= 6) {
          moderateLengthErrors++;
          return {
            ...d,
            isCorrect: false,
            note: `Câu trả lời quá dài (${ansWords} từ, quy định 1-5 từ).`,
          };
        } else {
          severeLengthErrors++;
          return {
            ...d,
            isCorrect: false,
            note: `Câu trả lời quá dài (${ansWords} từ, quy định 1-5 từ).`,
          };
        }
      } else {
        if (excess <= 5) {
          minorLengthErrors++;
          return {
            ...d,
            isCorrect: false,
            note: `Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài: ${ansWords} từ).`,
          };
        } else {
          severeLengthErrors++;
          return {
            ...d,
            isCorrect: false,
            note: `Câu trả lời vượt quá số lượng từ quy định (${ansWords} từ, tối đa ${maxAllowedWords} từ).`,
          };
        }
      }
    }
  });

  const taskErrors = sanitizedTaskDetails.filter((d) => d.isCorrect === false).length;
  const correctionsCount = realCorrections.length;
  const totalErrors = correctionsCount + taskErrors;

  let maxScore = 10;
  let score = 10;
  const correctTaskCount = Math.max(0, totalQuestionsCount - taskErrors);

  if (isPart1) {
    const emptyDeduction = emptyErrors * 2.0;
    const nonEnglishDeduction = nonEnglishErrors * 2.0;
    const offTopicDeduction = offTopicErrors * 2.0;
    const severeDeduction = severeLengthErrors * 1.5;
    const modDeduction = moderateLengthErrors * 1.0;
    const minorDeduction = Math.min(2.0, minorLengthErrors * 0.5);
    const grammarDeduction = correctionsCount * 1.0;

    score = Math.max(
      0,
      Math.round(
        (10 - emptyDeduction - nonEnglishDeduction - offTopicDeduction - severeDeduction - modDeduction - minorDeduction - grammarDeduction) * 2
      ) / 2
    );
  } else if (isPart2) {
    const wc = wordCounts[0] || 0;
    if (offTopicQuestionIndices.size > 0 || nonEnglishErrors > 0) {
      score = 0;
    } else if (wc > 0 && wc < 15) {
      score = Math.max(0, 4 - correctionsCount * 1);
    } else if (wc >= 15 && wc < 20) {
      score = Math.max(0, 7 - correctionsCount * 1);
    } else if (wc > 30 && wc <= 40) {
      score = Math.max(0, 8 - correctionsCount * 1);
    } else if (wc > 40) {
      score = Math.max(0, 4 - correctionsCount * 1);
    } else if (totalErrors === 0) {
      score = 10;
    } else if (totalErrors === 1) {
      score = 8;
    } else if (totalErrors === 2) {
      score = 6;
    } else if (totalErrors === 3) {
      score = 4;
    } else {
      score = 2;
    }
  } else if (isPart3) {
    if (offTopicQuestionIndices.size > 0 || nonEnglishErrors === totalQuestionsCount) {
      score = 0;
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
    if (offTopicQuestionIndices.size > 0 || nonEnglishErrors === totalQuestionsCount) {
      score = 0;
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

  const cefrLevel: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' =
    score === 0 ? 'A0' : score >= 9 ? 'C1' : score >= 7 ? 'B2' : score >= 5 ? 'B1' : score >= 3 ? 'A2' : 'A1';

  // Compute standard CEFR 5 criteria bands (0 to 5)
  const calcTfBand = Math.max(
    0,
    Math.min(
      5,
      Math.round(
        5 - (emptyErrors * 2 + nonEnglishErrors * 2 + offTopicErrors * 2 + severeLengthErrors * 1.5 + moderateLengthErrors * 1.0 + minorLengthErrors * 0.5)
      )
    )
  );
  const calcGraBand = Math.max(0, Math.min(5, 5 - Math.min(5, correctionsCount)));
  const calcVraBand = score >= 9 ? 5 : score >= 7 ? 4 : score >= 5 ? 3 : score >= 3 ? 2 : 1;
  const calcCcBand = emptyErrors > 0 ? Math.max(1, 4 - emptyErrors) : 5;
  const calcRegBand = isPart1 ? 5 : isPart4 ? (taskErrors === 0 ? 5 : 4) : 5;

  const resolvedBands: WritingCefrBands = {
    tf: calcTfBand,
    gra: calcGraBand,
    vra: calcVraBand,
    cc: calcCcBand,
    reg: isPart1 ? 5 : calcRegBand,
  };

  const taskStatus = taskErrors === 0 ? 'success' : taskErrors >= 2 ? 'danger' : 'warning';
  const taskSummary = isPart2
    ? (taskErrors === 0
      ? 'Bạn đã hoàn thành 1/1 bài viết theo đúng quy định độ dài (20-30 từ) và phù hợp với chủ đề.'
      : 'Bài viết chưa đạt quy định độ dài (20-30 từ) hoặc nội dung chưa hoàn toàn phù hợp với chủ đề.')
    : isPart1
    ? (taskErrors === 0
      ? 'Bạn đã trả lời đúng quy định độ dài (1-5 từ/câu) và phù hợp với tất cả 5 câu hỏi.'
      : (emptyErrors === 0 && offTopicErrors === 0 && nonEnglishErrors === 0)
      ? `Bạn đã trả lời đúng chủ đề ${totalQuestionsCount}/${totalQuestionsCount} câu hỏi (trong đó có ${minorLengthErrors + moderateLengthErrors + severeLengthErrors} câu hơi dài so với quy định 1–5 từ).`
      : `Bạn đã trả lời đúng yêu cầu ${correctTaskCount}/${totalQuestionsCount} câu hỏi. Có ${taskErrors} câu chưa phù hợp hoặc vi phạm số lượng từ.`)
    : isPart3
    ? (taskErrors === 0
      ? 'Bạn đã hoàn thành 3/3 phản hồi phòng chat theo đúng quy định độ dài (30-40 từ/câu) và đúng chủ đề.'
      : `Bạn đã hoàn thành ${correctTaskCount}/3 phản hồi phòng chat. Có ${taskErrors} câu chưa đạt số lượng từ quy định hoặc vi phạm nội dung.`)
    : (taskErrors === 0
      ? 'Bạn đã hoàn thành xuất sắc 2 bài viết email (Email 1: 40-50 từ, Email 2: 120-150 từ) theo đúng văn phong.'
      : `Bài viết email chưa đạt quy định số lượng từ hoặc vi phạm văn phong yêu cầu.`);

  const keyTakeawayText = `Bài làm ${partId.toUpperCase()} đạt điểm ${score}/10 (Trình độ CEFR ${cefrLevel}). ${
    score >= 9
      ? 'Bạn đã hoàn thành xuất sắc bài viết, đáp ứng đầy đủ tiêu chí yêu cầu.'
      : score >= 7
      ? 'Bài làm đạt kết quả tốt. Hãy tiếp tục chú ý hạn chế một số lỗi nhỏ để đạt điểm tối đa.'
      : score >= 5
      ? 'Bài làm đạt yêu cầu cơ bản. Bạn cần rèn luyện thêm về cấu trúc câu và từ vựng.'
      : 'Bài làm gặp một số lỗi vi phạm độ dài hoặc ngữ pháp. Hãy chú ý chỉnh sửa để cải thiện điểm số.'
  }`;

  // Build separate grammar & spelling error items
  const grammarErrors: WritingErrorItem[] =
    data.grammarErrors && data.grammarErrors.length > 0
      ? data.grammarErrors
      : realCorrections
          .filter((c) => !c.type || c.type.toLowerCase().includes('ngữ pháp'))
          .map((c) => ({
            questionIndex: c.questionIndex,
            original: c.original,
            corrected: c.correction,
            explanation: c.explanation,
          }));

  const spellingErrors: WritingErrorItem[] =
    data.spellingErrors && data.spellingErrors.length > 0
      ? data.spellingErrors
      : realCorrections
          .filter((c) => c.type && c.type.toLowerCase().includes('chính tả'))
          .map((c) => ({
            questionIndex: c.questionIndex,
            original: c.original,
            corrected: c.correction,
            explanation: c.explanation,
          }));

  return {
    ...data,
    score,
    maxScore,
    cefrLevel,
    bands: resolvedBands,
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
      summary: sanitizeVocabularySummary(data.vocabulary?.summary || ''),
      suggestions: sanitizeVocabularySuggestions(data.vocabulary?.suggestions || []),
    },
    grammarErrors,
    spellingErrors,
    improvedVersion: data.improvedVersion || generateLocalFallbackEvaluation(data.taskCompletion?.details?.map((_, idx) => ({ id: idx, questionText: '', userAnswer: userAnswers[idx] || '' })) || [], clubName, partId).improvedVersion,
    improvedAnswers: (() => {
      let resolved = data.improvedAnswers || [];
      if (resolved.length === 0 && data.improvedVersion) {
        const lines = data.improvedVersion.split('\n').map((l) => l.trim()).filter(Boolean);
        lines.forEach((line) => {
          const match = line.match(/^(\d+)[\.\)]\s*(.+)$/);
          if (match) {
            resolved.push({
              questionIndex: parseInt(match[1], 10),
              improvedText: match[2].trim(),
            });
          }
        });
      }
      if (resolved.length === 0) {
        const fallback = generateLocalFallbackEvaluation(
          userAnswers.map((ans, idx) => ({ id: idx + 1, questionText: '', userAnswer: ans })),
          clubName,
          partId
        );
        resolved = fallback.improvedAnswers || [];
      }
      return resolved;
    })(),
    criteriaAnalysis: data.criteriaAnalysis || {
      tf: `Đạt ${resolvedBands.tf}/5 điểm. ${taskSummary}`,
      gra: `Đạt ${resolvedBands.gra}/5 điểm. ${realCorrections.length === 0 ? 'Độ chính xác ngữ pháp tốt.' : `Phát hiện ${realCorrections.length} lỗi cần khắc phục.`}`,
      vra: `Đạt ${resolvedBands.vra}/5 điểm. Sử dụng từ vựng phong phú, phù hợp ngữ cảnh.`,
      cc: `Đạt ${resolvedBands.cc}/5 điểm. Bài viết có tính liên kết mạch lạc giữa các ý.`,
      reg: `Đạt ${resolvedBands.reg}/5 điểm. Văn phong phù hợp với đối tượng nhận tin.`,
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

    if (!apiKey) {
      console.warn('[Writing API] No API keys configured. Returning rule-based evaluation.');
      const fallbackResult = generateLocalFallbackEvaluation(questions, clubName, partId);
      return NextResponse.json(fallbackResult);
    }

    const formattedQuestionsText = questions
      .map((q, idx) => {
        const text = (q.userAnswer || '').trim();
        const wc = text ? text.split(/\s+/).filter(Boolean).length : 0;
        return `Q${idx + 1}: ${q.questionText}\nCandidate Answer (${wc} words): "${text}"`;
      })
      .join('\n\n');

    const isPart1 = partId.toLowerCase() === 'part1';
    const isPart2 = partId.toLowerCase() === 'part2';
    const isPart3 = partId.toLowerCase() === 'part3';
    const isPart4 = partId.toLowerCase() === 'part4';

    const partRulesText = isPart1
      ? `APTIS WRITING PART 1 (Personal Information / Short Answers):
- Exactly 5 short questions. Word limit: 1 to 5 words per answer.
- Focus: Direct answers, capitalization, punctuation, correct spelling.`
      : isPart2
      ? `APTIS WRITING PART 2 (Form Filling / Social Network Profile):
- 1 prompt. Word limit: STRICTLY 20 to 30 words total.
- Focus: Complete sentences, answering the why/what/how directly, accurate tense.`
      : isPart3
      ? `APTIS WRITING PART 3 (Social Club Chat Conversation):
- 3 separate questions from 3 club members. Word limit: STRICTLY 30 to 40 words PER response.
- Focus: Direct interaction, opinion/feeling, reason, example, informal conversational tone.`
      : `APTIS WRITING PART 4 (Two Emails - Informal & Formal):
- Email 1 (Informal to a friend): STRICTLY 40 to 50 words. Friendly greeting, contractions (I'm, can't), emotions & feelings.
- Email 2 (Formal to Club President): STRICTLY 120 to 150 words. Formal salutation/sign-off, NO contractions, polite structures (I am writing to express..., I would appreciate it if...), constructive suggestions.`;

    const promptText = `
You are an expert official British Council Aptis ESOL Writing Examiner and English Language Assessor.
Your task is to evaluate and grade the student's Aptis Writing submission with strict adherence to the official British Council CEFR rating scale (A0 to C1).

CANDIDATE SUBMISSION (Part: ${partId.toUpperCase()}, Club Topic: "${clubName || 'General Interest Club'}"):
${formattedQuestionsText}

SPECIFICATIONS FOR THIS PART:
${partRulesText}

EVALUATION CRITERIA (Band Scale 0 to 5 for each criterion):
1. Task Fulfillment (tf, 0-5): Answering all prompt elements, relevance to club topic, strict adherence to word limits.
2. Grammatical Accuracy (gra, 0-5): Tenses, subject-verb agreement, sentence structures, passive/active voice, punctuation.
3. Vocabulary Range & Accuracy (vra, 0-5): Lexical range, collocations, natural idioms, topic-specific vocabulary.
4. Cohesion & Coherence (cc, 0-5): Logical structure, linking words, paragraph flow.
5. Register (reg, 0-5): Appropriate tone (informal vs formal).

ERROR DETECTION PROTOCOL:
- Check EVERY word. Report specific grammarErrors and spellingErrors with original, corrected, and clear Vietnamese explanation.
- For vocabulary, suggest advanced English replacements (never suggest Vietnamese replacements).
- Provide an improvedVersion: a polished English rewrite demonstrating high CEFR B2/C1 standard.
- Write all feedback, criteria analysis, and notes in natural, encouraging Vietnamese using "bạn" (never "ứng viên" or "thí sinh").

OUTPUT JSON SCHEMA:
Respond ONLY with a single valid raw JSON object matching this structure:
{
  "score": number (0 to 10),
  "maxScore": 10,
  "cefrLevel": "A0" | "A1" | "A2" | "B1" | "B2" | "C1",
  "bands": {
    "tf": number (0 to 5),
    "gra": number (0 to 5),
    "vra": number (0 to 5),
    "cc": number (0 to 5),
    "reg": number (0 to 5)
  },
  "taskCompletion": {
    "status": "success" | "warning" | "danger",
    "summary": "Vietnamese summary of task completion",
    "details": [
      { "questionIndex": 1, "isCorrect": true, "note": "Vietnamese note" }
    ]
  },
  "grammarAndSpelling": {
    "status": "success" | "warning" | "danger",
    "summary": "Vietnamese summary of grammar/spelling",
    "corrections": [
      {
        "questionIndex": 1,
        "type": "Ngữ pháp" | "Chính tả",
        "original": "error string",
        "correction": "corrected string",
        "explanation": "Vietnamese explanation"
      }
    ]
  },
  "vocabulary": {
    "status": "info" | "success" | "warning",
    "summary": "Vietnamese vocabulary feedback",
    "suggestions": ["English vocabulary suggestions with Vietnamese explanation"]
  },
  "grammarErrors": [
    {
      "questionIndex": 1,
      "original": "error string",
      "corrected": "corrected string",
      "explanation": "Vietnamese explanation"
    }
  ],
  "spellingErrors": [
    {
      "questionIndex": 1,
      "original": "misspelled word",
      "corrected": "correct spelling",
      "explanation": "Vietnamese explanation"
    }
  ],
  "improvedVersion": "Complete polished English rewrite demonstrating high band standard",
  "improvedAnswers": [
    {
      "questionIndex": 1,
      "improvedText": "Polished high-band CEFR version strictly based on candidate's original content/facts and strictly respecting word limits"
    }
  ],
  "criteriaAnalysis": {
    "tf": "Detailed Vietnamese feedback for Task Fulfillment",
    "gra": "Detailed Vietnamese feedback for Grammatical Accuracy",
    "vra": "Detailed Vietnamese feedback for Vocabulary Range",
    "cc": "Detailed Vietnamese feedback for Cohesion & Coherence",
    "reg": "Detailed Vietnamese feedback for Register & Tone"
  },
  "keyTakeaway": "Conclusion summary in Vietnamese"
}
`;

    // 1. If Groq API Key is present
    if (process.env.GROQ_API_KEY) {
      const groqKeys = process.env.GROQ_API_KEY.split(',').map((k) => k.trim()).filter(Boolean);
      const groqModels = [
        'qwen/qwen3.8-27b',
        'qwen/qwen3.6-27b',
        'groq/compound-mini',
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
      ];

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
                return NextResponse.json(
                  enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId, clubName)
                );
              }
            } else if (response.status === 429) {
              console.warn(`[Groq API Rate Limit 429] Key (${groqKey.slice(0, 10)}...) limit reached.`);
              keyRateLimited = true;
              break;
            }
          } catch (groqErr) {
            console.warn('[Groq API Error]', groqErr);
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
            return NextResponse.json(
              enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId, clubName)
            );
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
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
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
              return NextResponse.json(
                enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId, clubName)
              );
            }
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
            return NextResponse.json(
              enforceExactScoreMath(parsedData, questions.length, questions.map((q) => (q.userAnswer || '').trim()), partId, clubName)
            );
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
