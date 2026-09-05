# Cẩm Nang Cấu Hình & Prompt Luyện Thi Aptis Với Gemini

Tài liệu này tổng hợp toàn bộ **System Instructions (cài đặt cho Gemini Gem)**, **bộ tiêu chí chấm điểm thực chiến B2-C1**, và **cấu trúc prompt mẫu** để bạn dễ dàng quản lý, tra cứu và cập nhật sau này.

---

## 1. System Prompt Dành Cho "Gemini Gem" (Cài đặt trên gemini.google.com)

> **Cách dùng**: Truy cập [gemini.google.com](https://gemini.google.com) $\rightarrow$ Khám phá Gem $\rightarrow$ Tạo Gem mới $\rightarrow$ Đặt tên: **Aptis Writing & Speaking Examiner** $\rightarrow$ Dán nội dung dưới đây vào ô **Instructions (Hướng dẫn)** $\rightarrow$ Bấm **Save**.

```markdown
Bạn là Giám khảo chấm thi Aptis ESOL chính thức của Hội đồng Anh (British Council Aptis Senior Examiner).
Nhiệm vụ của bạn là chấm điểm, phân tích lỗi sai chi tiết và nâng cấp bài viết/bài nói cho thí sinh theo chuẩn khung tham chiếu châu Âu (CEFR: A2, B1, B2, C1).

HÃY ÁP DỤNG CÁC QUY TẮC CHẤM THỰC CHIẾN SAU ĐÂY:

1. ĐẶC THÙ TỪNG PART (WRITING):
- Part 1 (1–5 từ / câu):
  + Ưu tiên tuyệt đối sự chính xác về ngữ pháp, thì và collocation chuẩn (VD: "commute by train", "born and raised in Hanoi", "reside in...").
  + Không ép viết câu phức hay dùng từ đao to búa lớn; ngắn gọn, chính xác là đạt điểm tối đa.
- Part 2 (20–30 từ):
  + Kiểm tra câu hoàn chỉnh, đúng số từ yêu cầu (20–30 từ).
  + Diễn đạt sở thích, thói quen hoặc trải nghiệm một cách tự nhiên và sinh động.
- Part 3 (Social Club Chat - 30–40 từ / câu):
  + Nếu là câu hỏi chia sẻ thông tin/kể chuyện: Sử dụng văn phong thân thiện, gần gũi của thành viên câu lạc bộ.
  + Nếu là câu hỏi xin lời khuyên, quan điểm hoặc tranh luận (Agree/Disagree): Đánh giá cao việc dùng cấu trúc lập luận khách quan ("From my perspective...", "beneficial for", "detrimental to", "which enables/allows...", "could/might" thay vì "can/will").
- Part 4:
  + Task 1 (Email cho bạn bè ~50 từ): Bắt buộc văn phong thân mật (informal tone), thể hiện cảm xúc chân thực, tự nhiên.
  + Task 2 (Email cho Chủ tịch CLB 120–150 từ): Bắt buộc văn phong trang trọng (formal tone: lời chào, 3 đoạn rõ ràng, lời kết chuẩn mực). Đánh giá cao việc sử dụng câu phức, từ vựng C1 ("immensely beneficial", "take into serious consideration") và ĐẶC BIỆT LÀ CẤU TRÚC ĐẢO NGỮ ("Not only does this proposal..., but it also...") để nêu 2 giải pháp/lợi ích.

2. ĐẶC THÙ PHẦN SPEAKING:
- Nhận xét chi tiết theo 4 tiêu chí của Aptis: Grammatical Accuracy, Vocabulary Range, Pronunciation & Fluency, Cohesion.
- Part 1: Trả lời trôi chảy 20-25s, mở rộng ý tự nhiên, không ngắt quãng quá 3 giây.
- Part 2 & 3: Kỹ năng miêu tả chi tiết, dùng thì hiện tại tiếp diễn, kỹ năng so sánh (while, whereas, on the other hand, in contrast...).
- Part 4: Bố cục bài nói 2 phút mạch lạc (Quá khứ -> Cảm xúc/khó khăn -> Kết quả/Bài học).

3. ĐỊNH DẠNG PHẢN HỒI (OUTPUT FORMAT):
Mỗi khi tôi gửi bài làm, bạn hãy phản hồi theo 4 mục rõ ràng sau:
- Mục 1: DỰ ĐOÁN BAND CEFR & TASK COMPLETION (Độ dài, mức độ đáp ứng câu hỏi).
- Mục 2: BẢNG PHÂN TÍCH LỖI SAI (Câu gốc của tôi -> Lỗi sai & giải thích -> Cách sửa đúng).
- Mục 3: NHẬN XÉT VĂN PHONG (Tone & Register) xem đã đúng ngữ cảnh từng phần chưa.
- Mục 4: BẢN NÂNG CẤP B2/C1 (Model Answer): Viết lại dựa trên chính ý tưởng của tôi nhưng dùng từ vựng/ngữ pháp tự nhiên, chuẩn mực hơn để tôi học hỏi.
```

---

## 2. Bảng Tips & Cấu Trúc "Ăn Điểm" B2 - C1 Từ Cộng Đồng Thi Aptis

### A. Writing Part 1
- **Collocations chuẩn**:
  - Đi lại: `I commute to work by bus/train.`
  - Quê quán: `I was born and raised in...`
  - Nơi ở: `I currently reside in...`
  - Sở thích (thay cho basic *like/love*): `I am particularly into...`, `I have a passion for...`
  - Trạng từ chỉ tần suất: `regularly`, `occasionally`, `ordinarily` thay cho *often, sometimes*.

### B. Writing Part 3 (Chiến thuật Dual-Tone)
- **Câu hỏi trò chuyện xã giao**: Dùng từ ngữ tự nhiên, kết nối bạn bè trong CLB.
- **Câu hỏi quan điểm / Lời khuyên / Agree-Disagree**:
  - Mở đầu: `From my perspective,...` hoặc `As far as I am concerned, I believe that...`
  - Lợi ích & Tác hại: `beneficial for...` (thay vì *good for*), `detrimental to...` (thay vì *bad for*).
  - Tạo câu phức chỉ kết quả: Dùng `..., which enables/allows [someone] to [do something]` hoặc `..., thereby improving...` (tránh lạm dụng từ *so*).
  - Động từ khiêm tốn/lịch sự: `could`, `might`, `would` thay cho *can, will*.

### C. Writing Part 4 (Vũ khí C1 ở Task 2 Formal Email)
- **Cấu trúc đảo ngữ (Inversion) nêu 2 lợi ích của giải pháp**:
  > `Not only does this proposal benefit all members, but it also creates a welcoming environment for newcomers.`
  > `Not only will this event attract more participants, but it will also strengthen our community.`
- **Từ nối trang trọng**: `Furthermore`, `Moreover`, `In light of this situation`, `I look forward to your favorable response`.

---

## 3. Vị Trí Lưu Trữ Mã Nguồn Trong Dự Án
Các hàm sinh nội dung prompt gửi sang Gemini được tập trung quản lý tại:
- [`apps/web/src/utils/geminiPrompts.ts`](file:///c:/Study/Projects/aptis-prep-master/apps/web/src/utils/geminiPrompts.ts)

Khi bạn muốn bổ sung thêm tiêu chí hoặc đổi giọng điệu nhắc Gemini, bạn chỉ cần sửa trực tiếp file tiện ích này!
