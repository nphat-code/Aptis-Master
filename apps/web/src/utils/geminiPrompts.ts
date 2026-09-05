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
Quy định số từ: Khuyến nghị 20–30 từ | Hệ thống cho phép tối đa 45 từ.
Nguyên tắc chiến lược: Viết càng nhiều càng tốt (hướng tới 35–45 từ) nếu ngữ pháp vững để mở rộng ý và khoe từ vựng; hạn chế viết dài nếu ngữ pháp chưa chắc để tránh lỗi sai.

NỘI DUNG CÂU HỎI VÀ BÀI LÀM CỦA TÔI:
Câu hỏi: ${input.questionText}
- Bài làm của tôi: ${input.userAnswer || '(Chưa điền)'}
- Bài mẫu tham khảo: ${input.sampleAnswer || 'N/A'}

YÊU CẦU CHO GEMINI (TIÊU CHÍ CHẤM B2–C1 THỰC CHIẾN):
Hãy đóng vai trò Giám khảo Aptis ESOL (British Council Examiner):
1. Đếm chính xác số từ của bài làm (so sánh với mốc chuẩn 20–30 từ và trần 45 từ).
2. Đánh giá chiến lược độ dài vs ngữ pháp: Bài viết có đang bị "ham viết dài mà gãy ngữ pháp/sai cơ bản" không? Có áp dụng công thức Who - When - Example/Feeling tự nhiên không?
3. Sửa lỗi ngữ pháp/từ vựng (nếu có) và cung cấp 1 phiên bản viết lại chuẩn C1 (giữ nguyên ý tưởng của tôi).`;
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
Quy định số từ: Khuyến nghị 30–40 từ/câu | Hệ thống cho phép tối đa 60 từ/câu.
Nguyên tắc chiến lược: Viết càng nhiều càng tốt (45–60 từ) nếu ngữ pháp vững để đa dạng hóa cấu trúc câu; nếu ngữ pháp chưa chắc thì dừng ở 35–40 từ chuẩn chỉnh, tuyệt đối không bôi dài tránh sai sót.

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
1. Đếm số từ từng câu (so sánh với mức chuẩn 30–40 từ và mức trần 60 từ).
2. Đánh giá tính ĐA DẠNG CẤU TRÚC & ĐỘ AN TOÀN NGỮ PHÁP:
   - Thí sinh có kiểm soát tốt các câu phức, liên từ (Besides, Moreover, Which enables...), cụm từ tự nhiên ("recharge my batteries", "improve mental/physical health") không?
   - Có bị lỗi sai ngữ pháp do cố viết dài không? Nếu có, hãy khuyên thí sinh nên viết gọn câu nào.
3. Sửa lỗi chi tiết và viết lại từng câu đạt chuẩn C1 dựa trên đúng ý tưởng của tôi.`;
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
TASK 1: Email gửi bạn bè (Khuyến nghị ~50 từ | Tối đa hệ thống cho phép: 75 từ)
Yêu cầu: Bày tỏ cảm xúc về thông báo và dự định sẽ làm gì (văn phong thân mật, tự nhiên).
- Bài làm của tôi:
${input.userAnswer1 || '(Chưa điền)'}

- Bài mẫu tham khảo:
${input.sampleAnswer1 || 'N/A'}

---
TASK 2: Email gửi Ban quản lý / Chủ tịch CLB (Khuyến nghị 120–150 từ | Tối đa hệ thống cho phép: 225 từ)
Yêu cầu: Bày tỏ quan điểm và đề xuất 2 giải pháp (văn phong trang trọng).
Nguyên tắc chiến lược: Nếu ngữ pháp vững, viết 160–225 từ với 2 giải pháp sâu sắc để thể hiện band C1; nếu ngữ pháp chưa chắc thì giữ 130–150 từ để tránh lỗi sai.
- Bài làm của tôi:
${input.userAnswer2 || '(Chưa điền)'}

- Bài mẫu tham khảo:
${input.sampleAnswer2 || 'N/A'}

---
YÊU CẦU CHO GEMINI (TIÊU CHÍ CHẤM B2–C1 THỰC CHIẾN):
Hãy đóng vai trò Giám khảo Aptis ESOL (British Council Examiner):
1. Đếm từ thực tế của Task 1 và Task 2 (đối chiếu với khung khuyến nghị và trần tối đa 75 từ / 225 từ).
2. Đánh giá Task 2 theo CHIẾN THUẬT 2 GIẢI PHÁP & ĐỘ VỮNG NGỮ PHÁP:
   - Giải pháp 1: Trực diện vào vấn đề + câu phân tích tác động ("This will bring...", "This enables...").
   - Giải pháp 2 (Rewards Framework): Đề xuất cơ chế khen thưởng/khích lệ ("a rewards framework for participants...") kèm ví dụ minh họa.
   - Cấu trúc cao cấp: Áp dụng đảo ngữ ("Not only does this proposal..., but it also...") và câu chốt ("If possible, we should choose...").
   - Đánh giá xem độ dài có tương xứng với độ chắc ngữ pháp không (có bị dài dòng gây sai ngữ pháp không?).
3. Đưa ra bản sửa lỗi chi tiết và viết lại 2 email hoàn chỉnh đạt band C1 dựa trên ý tưởng của tôi.`;
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

