/**
 * Gemini Prompts Builder Utility
 * Tập trung toàn bộ logic định dạng prompt gửi cho Gemini (Writing & Speaking)
 * Dễ dàng tùy chỉnh, cập nhật các tips thực chiến và tiêu chí chấm điểm tại một nơi duy nhất.
 */

// --- WRITING PART 1 ---
export interface WritingPart1PromptInput {
  clubName: string;
  instruction: string;
  questions: Array<{
    num: number;
    text: string;
    userAnswer: string;
    sampleAnswer: string;
  }>;
}

export function buildWritingPart1GeminiPrompt(input: WritingPart1PromptInput): string {
  return `ĐỀ THI WRITING APTIS - PART 1 (Word-level Writing)
Chủ đề: ${input.clubName || 'Club'}
Hướng dẫn: ${input.instruction}

NỘI DUNG CÂU HỎI VÀ BÀI LÀM CỦA TÔI:
${input.questions
  .map(
    (q) =>
      `Câu ${q.num}: ${q.text}\n- Bài làm của tôi: ${q.userAnswer || '(Chưa điền)'}\n- Bài mẫu tham khảo: ${q.sampleAnswer || 'N/A'}`
  )
  .join('\n\n')}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis ESOL (British Council Examiner):
1. Đánh giá độ dài (yêu cầu 1–5 từ) và tính chính xác tuyệt đối về thì, ngữ pháp và lỗi chính tả.
2. Nhận xét về collocation (ví dụ: commute by, born and raised in).
3. Gợi ý các cách trả lời tự nhiên, ngắn gọn, chuẩn xác để đạt điểm tối đa.`;
}

// --- WRITING PART 2 ---
export interface WritingPart2PromptInput {
  clubName: string;
  instruction: string;
  questionText: string;
  userAnswer: string;
  sampleAnswer: string;
}

export function buildWritingPart2GeminiPrompt(input: WritingPart2PromptInput): string {
  return `ĐỀ THI WRITING APTIS - PART 2 (Short Text Writing)
Chủ đề: ${input.clubName || 'Club'}
Hướng dẫn: ${input.instruction}

NỘI DUNG CÂU HỎI VÀ BÀI LÀM CỦA TÔI:
Câu hỏi: ${input.questionText}
- Bài làm của tôi: ${input.userAnswer || '(Chưa điền)'}
- Bài mẫu tham khảo: ${input.sampleAnswer || 'N/A'}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis ESOL (British Council Examiner):
1. Kiểm tra số lượng từ (chuẩn 20–30 từ), ngữ pháp, mạo từ và sự liên kết câu.
2. Đánh giá mức độ tự nhiên khi chia sẻ sở thích/hoạt động cá nhân.
3. Cung cấp 1 phiên bản viết lại (Model Answer) dựa trên chính ý tưởng của tôi đạt chuẩn CEFR B1–B2.`;
}

// --- WRITING PART 3 ---
export interface WritingPart3PromptInput {
  clubName: string;
  instruction?: string;
  questions: Array<{
    num: number;
    text: string;
    userAnswer: string;
    sampleAnswer: string;
  }>;
}

export function buildWritingPart3GeminiPrompt(input: WritingPart3PromptInput): string {
  return `ĐỀ THI WRITING APTIS - PART 3 (Social Club Chat)
Câu lạc bộ: "${input.clubName || 'Club'}"
${input.instruction ? `Hướng dẫn: ${input.instruction}\n` : ''}
Yêu cầu: Trả lời 3 câu hỏi (mỗi câu 30–40 từ. Khuyến nghị thực chiến: viết gần kịch trần 38–40 từ/câu, đa dạng hóa cấu trúc).

${input.questions
  .map(
    (q) => `---
CÂU HỎI ${q.num}: "${q.text}"
- Bài làm của tôi:
${q.userAnswer || '(Chưa điền)'}

- Gợi ý mẫu:
${q.sampleAnswer || 'N/A'}`
  )
  .join('\n\n')}

---
YÊU CẦU CHO GEMINI (TIÊU CHÍ CHẤM B2–C1 THỰC CHIẾN):
Hãy đóng vai trò Giám khảo Aptis ESOL:
1. Đếm số từ từng câu (mục tiêu: 38–40 từ/câu).
2. Kiểm tra tính ĐA DẠNG CẤU TRÚC & LIÊN TỪ (Who-When-Reason, Besides, Moreover, Which enables...):
   - Câu hỏi xã giao/thành viên: giọng thân mật, chia sẻ trải nghiệm cá nhân, sử dụng các cụm "give a chance/opportunity to", "recharge my batteries", "improve mental/physical health".
   - Câu hỏi thảo luận/quan điểm/lời khuyên: giọng văn có lập luận, dùng liên từ liên kết và mệnh đề quan hệ.
3. Chỉ ra lỗi sai và viết lại từng câu đạt chuẩn C1 (đạt 38–40 từ) dựa trên đúng ý tưởng của tôi.`;
}

// --- WRITING PART 4 ---
export interface WritingPart4PromptInput {
  clubName: string;
  mainEmail: string;
  userAnswer1: string;
  sampleAnswer1: string;
  userAnswer2: string;
  sampleAnswer2: string;
}

export function buildWritingPart4GeminiPrompt(input: WritingPart4PromptInput): string {
  return `ĐỀ THI WRITING APTIS - PART 4 (Formal & Informal Writing)
Chủ đề: ${input.clubName || 'Club'}
Email thông báo từ câu lạc bộ:
"${input.mainEmail}"

---
TASK 1: Email gửi bạn bè (~50 từ - viết gần kịch trần 48–50 từ)
Yêu cầu: Bày tỏ cảm xúc về thông báo và dự định sẽ làm gì (giọng thân mật, tự nhiên).
- Bài làm của tôi:
${input.userAnswer1 || '(Chưa điền)'}

- Bài mẫu tham khảo:
${input.sampleAnswer1 || 'N/A'}

---
TASK 2: Email gửi Ban quản lý / Chủ tịch câu lạc bộ (120–150 từ - viết gần kịch trần 140–150 từ)
Yêu cầu: Bày tỏ quan điểm và đề xuất hướng giải quyết (giọng trang trọng).
- Bài làm của tôi:
${input.userAnswer2 || '(Chưa điền)'}

- Bài mẫu tham khảo:
${input.sampleAnswer2 || 'N/A'}

---
YÊU CẦU CHO GEMINI (TIÊU CHÍ CHẤM B2–C1 THỰC CHIẾN):
Hãy đóng vai trò Giám khảo Aptis ESOL (British Council Examiner):
1. Đếm từ Task 1 (mục tiêu ~50 từ) và Task 2 (mục tiêu 140–150 từ).
2. Đánh giá Task 2 theo CHIẾN THUẬT 2 GIẢI PHÁP THỰC CHIẾN:
   - Giải pháp 1: Trực diện vào vấn đề trong thông báo + câu phân tích tác động tích cực ("This will bring...", "This enables...").
   - Giải pháp 2 (Rewards Framework): Có đề xuất cơ chế khen thưởng/khích lệ ("a rewards framework for participants...") hoặc chính sách hỗ trợ kèm ví dụ minh họa không?
   - Cấu trúc ngữ pháp cao cấp: Áp dụng đảo ngữ ("Not only does this proposal..., but it also...") và câu chốt ("If possible, we should choose..., which makes the plan more effective").
3. Đưa ra bản sửa lỗi chi tiết và viết lại 2 email hoàn chỉnh đạt band C1 (Task 1: 50 từ, Task 2: 145 từ) dựa trên ý tưởng của tôi.`;
}

// --- SPEAKING PART 1 ---
export function buildSpeakingPart1GeminiPrompt(questionText: string): string {
  return `CÂU HỎI LUYỆN NÓI APTIS - SPEAKING PART 1 (Personal Information)
Câu hỏi: "${questionText}"
Thời gian chuẩn bị & trả lời: 30 giây

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc câu trả lời của tôi, sau đó:
1. Đánh giá phát âm, ngữ pháp, độ trôi chảy (fluency) theo khung CEFR.
2. Gợi ý 2 cách trả lời tự nhiên, mở rộng ý tốt để đạt band B2 - C1.`;
}

export function buildSpeakingPart1FullSetPrompt(setIndex: number, questions: Array<{ questionText: string; answer1: string; answer2: string }>): string {
  return `ĐỀ THI APTIS SPEAKING - PART 1 (Personal Information)
Đề số: ${setIndex + 1}
Thời gian: 3 câu hỏi (30 giây/câu)

DANH SÁCH CÂU HỎI:
${questions.map((q, idx) => `Câu ${idx + 1}: ${q.questionText}\n- Gợi ý câu trả lời 1: ${q.answer1}\n- Gợi ý câu trả lời 2: ${q.answer2}`).join('\n\n')}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lần lượt đặt từng câu hỏi trên cho tôi, chờ tôi nói/gõ câu trả lời, sau đó nhận xét phát âm, ngữ điệu, từ vựng và chỉ ra các lỗi cần khắc phục để đạt chuẩn B2/C1.`;
}

// --- SPEAKING PART 2 ---
export function buildSpeakingPart2GeminiPrompt(questionNum: number, questionText: string): string {
  return `CÂU HỎI LUYỆN NÓI APTIS - SPEAKING PART 2 (Describe a picture)
Câu hỏi ${questionNum}/3: "${questionText}"
Thời gian trả lời: 45 giây

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc câu trả lời của tôi, sau đó:
1. Đánh giá từ vựng miêu tả tranh, ngữ pháp, thì động từ (hiện tại tiếp diễn, các trạng từ miêu tả).
2. Gợi ý phiên bản câu trả lời trôi chảy, đạt điểm B2/C1.`;
}

export function buildSpeakingPart2FullSetPrompt(setIndex: number, imageUrl: string, questions: Array<{ num: number; text: string; sampleAnswer: string }>): string {
  return `ĐỀ THI APTIS SPEAKING - PART 2 (Describe a picture)
Đề số: ${setIndex + 1}
Thời gian: 3 câu hỏi (45 giây/câu)
Link ảnh tranh (nếu có): ${imageUrl}

DANH SÁCH CÂU HỎI:
${questions.map((q) => `Câu ${q.num}: ${q.text}\n- Gợi ý câu trả lời mẫu: ${q.sampleAnswer}`).join('\n\n')}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lần lượt đặt từng câu hỏi trên cho tôi, chờ tôi nói/gõ câu trả lời, sau đó nhận xét phát âm, ngữ điệu, từ vựng và chỉ ra các lỗi cần khắc phục để đạt chuẩn B2/C1.`;
}

// --- SPEAKING PART 3 ---
export function buildSpeakingPart3GeminiPrompt(questionNum: number, questionText: string): string {
  return `CÂU HỎI LUYỆN NÓI APTIS - SPEAKING PART 3 (Compare two pictures)
Câu hỏi ${questionNum}/3: "${questionText}"
Thời gian trả lời: 45 giây

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc câu trả lời của tôi, sau đó:
1. Đánh giá khả năng so sánh, sử dụng liên từ (while, whereas, on the one hand, both pictures...), từ vựng và ngữ pháp.
2. Gợi ý phiên bản câu trả lời trôi chảy, đạt điểm B2/C1.`;
}

export function buildSpeakingPart3FullSetPrompt(setIndex: number, imageUrl1: string, imageUrl2: string, questions: Array<{ num: number; text: string; sampleAnswer: string }>): string {
  return `ĐỀ THI APTIS SPEAKING - PART 3 (Compare two pictures)
Đề số: ${setIndex + 1}
Thời gian: 3 câu hỏi (45 giây/câu)
Link ảnh 1: ${imageUrl1}
Link ảnh 2: ${imageUrl2}

DANH SÁCH CÂU HỎI:
${questions.map((q) => `Câu ${q.num}: ${q.text}\n- Gợi ý câu trả lời mẫu: ${q.sampleAnswer}`).join('\n\n')}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lần lượt đặt từng câu hỏi trên cho tôi, chờ tôi nói/gõ câu trả lời, sau đó nhận xét phát âm, khả năng so sánh, sử dụng liên từ và độ mạch lạc để đạt chuẩn B2/C1.`;
}

// --- SPEAKING PART 4 ---
export function buildSpeakingPart4GeminiPrompt(topic: string, sampleAnswerText?: string): string {
  return `CÂU HỎI LUYỆN NÓI APTIS - SPEAKING PART 4 (Personal Experience & Abstract Talk)
Chủ đề: "${topic}"
Cấu trúc: 1 phút chuẩn bị + 2 phút nói liên tục (Long turn)
${sampleAnswerText ? `\nDÀN Ý THAM KHẢO:\n${sampleAnswerText}\n` : ''}
YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc bài nói 2 phút của tôi về chủ đề trên, sau đó:
1. Đánh giá tính liên kết (coherence & cohesion), vốn từ vựng học thuật, ngữ pháp và cấu trúc kể chuyện (narrative tenses).
2. Gợi ý phiên bản bài nói mẫu hoàn chỉnh đạt band C1 Aptis.`;
}

export function buildSpeakingPart4FullSetPrompt(topic: string, sampleAnswer: string): string {
  return `ĐỀ THI APTIS SPEAKING - PART 4 (Personal Experience & Abstract Talk)
Chủ đề: "${topic}"
Cấu trúc thi: 1 phút chuẩn bị + 2 phút nói liên tục (Long turn)

DÀN Ý & BÀI NÓI MẪU THAM KHẢO:
${sampleAnswer}

YÊU CẦU CHO GEMINI:
Hãy đóng vai trò Giám khảo Aptis Speaking (Aptis Examiner).
Lắng nghe hoặc đọc bài nói 2 phút của tôi về chủ đề trên, sau đó:
1. Đánh giá phát âm, tính trôi chảy (fluency), vốn từ vựng học thuật, ngữ pháp và cấu trúc kể chuyện (narrative tenses).
2. Chỉ ra các lỗi ngữ pháp/phát âm và gợi ý phiên bản nói tự nhiên, đạt band C1 Aptis.`;
}

