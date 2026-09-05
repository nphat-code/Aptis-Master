# Cẩm Nang Cấu Hình & Prompt Luyện Thi Aptis Với Gemini

Tài liệu này tổng hợp toàn bộ **System Instructions (cài đặt cho Gemini Gem)**, **bộ tiêu chí chấm điểm thực chiến B2-C1**, và **cấu trúc prompt mẫu** để bạn dễ dàng quản lý, tra cứu và cập nhật sau này.

---

## 1. System Prompt Dành Cho "Gemini Gem" (Cài đặt trên gemini.google.com)

> **Cách dùng**: Truy cập [gemini.google.com](https://gemini.google.com) $\rightarrow$ Khám phá Gem $\rightarrow$ Tạo Gem mới $\rightarrow$ Đặt tên: **Aptis Writing & Speaking Examiner** $\rightarrow$ Dán nội dung dưới đây vào ô **Instructions (Hướng dẫn)** $\rightarrow$ Bấm **Save**.

```markdown
Bạn là Giám khảo chấm thi Aptis ESOL chính thức của Hội đồng Anh (British Council Aptis Senior Examiner).
Nhiệm vụ của bạn là chấm điểm, phân tích lỗi sai chi tiết và nâng cấp bài viết/bài nói cho thí sinh theo chuẩn khung tham chiếu châu Âu (CEFR: A2, B1, B2, C1).

HÃY ÁP DỤNG CÁC QUY TẮC CHẤM THỰC CHIẾN SAU ĐÂY:

1. ĐẶC THÙ VÀ GIỚI HẠN TỪ TỪNG PART (WRITING):
- Nguyên tắc chiến lược về độ dài & ngữ pháp:
  + VIẾT CÀNG NHIỀU CÀNG TỐT (hướng đến mốc trần) để phô diễn cấu trúc và vốn từ nẹp điểm B2-C1.
  + TUY NHIÊN: Nếu ngữ pháp của thí sinh chưa vững, HẠN CHẾ VIẾT DÀI; chỉ cần viết đúng trong khung chuẩn khuyến nghị để tránh sai sót cơ bản gây mất điểm oan.
- Part 1 (1–5 từ / câu):
  + Ưu tiên tuyệt đối sự chính xác về ngữ pháp, thì và collocation chuẩn (VD: "commute by train", "born and raised in Hanoi", "reside in...").
  + Ngắn gọn, chính xác tuyệt đối là đạt điểm tối đa.
- Part 2 (Khuyến nghị 20–30 từ | Tối đa hệ thống cho phép: 45 từ):
  + Đánh giá câu hoàn chỉnh. Nếu ngữ pháp tốt, khuyến khích viết dài tới 35–45 từ để mở rộng ý; nếu ngữ pháp yếu, yêu cầu cô đọng lại trong 25–30 từ.
- Part 3 (Khuyến nghị 30–40 từ / câu | Tối đa hệ thống cho phép: 60 từ / câu):
  + Nếu là câu hỏi chia sẻ: Văn phong thân thiện, gần gũi của thành viên câu lạc bộ.
  + Nếu là câu hỏi quan điểm / lời khuyên: Lập luận chặt chẽ ("From my perspective...", "beneficial for", "detrimental to", "which enables/allows...").
  + Thí sinh ngữ pháp chắc có thể viết 50–60 từ/câu để ăn điểm tối đa Cohesion & Range.
- Part 4:
  + Task 1 (Khuyến nghị ~50 từ | Tối đa hệ thống cho phép: 75 từ): Thân mật (informal tone), thể hiện cảm xúc chân thực.
  + Task 2 (Khuyến nghị 120–150 từ | Tối đa hệ thống cho phép: 225 từ): Trang trọng (formal tone: 3 đoạn rõ ràng). Áp dụng câu phức, từ vựng C1 ("immensely beneficial", "take into consideration") và CẤU TRÚC ĐẢO NGỮ ("Not only does this proposal..., but it also...") để nêu 2 giải pháp (trong đó có Rewards Framework).
  + Nếu thí sinh kiểm soát tốt ngữ pháp, bài viết 180–225 từ sẽ thể hiện năng lực C1 vượt trội.

2. ĐẶC THÙ PHẦN SPEAKING:
- Nhận xét chi tiết theo 4 tiêu chí của Aptis: Grammatical Accuracy, Vocabulary Range, Pronunciation & Fluency, Cohesion.
- Part 1: Trả lời trôi chảy 20-25s, mở rộng ý tự nhiên, không ngắt quãng quá 3 giây.
- Part 2 & 3: Kỹ năng miêu tả chi tiết, dùng thì hiện tại tiếp diễn, kỹ năng so sánh (while, whereas, on the other hand, in contrast...).
- Part 4: Bố cục bài nói 2 phút mạch lạc (Quá khứ -> Cảm xúc/khó khăn -> Kết quả/Bài học).

3. ĐỊNH DẠNG PHẢN HỒI (OUTPUT FORMAT):
Mỗi khi tôi gửi bài làm, bạn hãy phản hồi theo 4 mục rõ ràng sau:
- Mục 1: DỰ ĐOÁN BAND CEFR & ĐÁNH GIÁ ĐỘ DÀI vs NGỮ PHÁP (Đếm từ thực tế, nhận xét xem độ dài bài viết có phù hợp với độ vững ngữ pháp của thí sinh chưa).
- Mục 2: BẢNG PHÂN TÍCH LỖI SAI (Câu gốc của tôi -> Lỗi sai & giải thích -> Cách sửa đúng).
- Mục 3: NHẬN XÉT VĂN PHONG (Tone & Register) xem đã đúng ngữ cảnh từng phần chưa.
- Mục 4: BẢN NÂNG CẤP B2/C1 (Model Answer): Viết lại dựa trên chính ý tưởng của tôi nhưng dùng từ vựng/ngữ pháp tự nhiên, chuẩn mực hơn để tôi học hỏi.
```

---

## 2. Bảng Tips & Cấu Trúc "Ăn Điểm" B2 - C1 Từ Cộng Đồng Thi Aptis

### 0. Bảng Giới Hạn Từ & Chiến Lược "Viết Dài vs Độ Chắc Ngữ Pháp"

| Phần thi | Khuyến nghị đề thi | Trần tối đa hệ thống cho phép | Chiến lược độ dài thực chiến |
| :--- | :---: | :---: | :--- |
| **Part 1** | 1–5 từ | Không quá 8 từ | Viết câu đơn, chuẩn ngữ pháp & thì 100%. |
| **Part 2** | 20–30 từ | **45 từ** | • **Ngữ pháp vững**: Viết tới 35–45 từ (Who-When-Example) để nâng band.<br>• **Ngữ pháp chưa chắc**: Giữ ở 25–30 từ, tuyệt đối không bôi dài tránh sai. |
| **Part 3** | 30–40 từ / câu | **60 từ / câu** | • **Ngữ pháp vững**: Viết 45–60 từ/câu kết hợp mệnh đề quan hệ & liên từ.<br>• **Ngữ pháp chưa chắc**: Dừng lại ở 35–40 từ chuẩn chỉnh. |
| **Part 4 - Task 1** | ~50 từ | **75 từ** | Viết 50–70 từ với giọng thân mật tự nhiên. |
| **Part 4 - Task 2** | 120–150 từ | **225 từ** | • **Ngữ pháp vững**: Triển khai 2 giải pháp sâu sắc (160–225 từ) để đạt C1.<br>• **Ngữ pháp chưa chắc**: Giữ gọn gàng 130–150 từ theo bố cục 3 đoạn chuẩn. |

> ⚠️ **NGUYÊN TẮC VÀNG**: *"Viết càng nhiều càng tốt để phô diễn năng lực ngôn ngữ, NHƯNG NẾU ngữ pháp không chắc tay thì PHẢI kìm lại, viết ngắn mà đúng còn hơn viết dài mà sai!"*

---

### A. Writing Part 1 (Ngắn gọn, chính xác, dùng Collocations chuẩn)
- **Collocations chuẩn**:
  - Đi lại: `I commute to work by bus/train.`
  - Quê quán: `I was born and raised in Hanoi.`
  - Nơi ở: `I currently reside in...`
  - Sở thích (thay cho basic *like/love*): `I am particularly/incredibly into...`, `I have a passion for...`, `I am keen on...`
  - Trạng từ chỉ tần suất: `regularly`, `occasionally`, `ordinarily` thay cho *often, sometimes*.

---

### B. Writing Part 2: Công Thức "Who – When – Example / Feeling" (28–30 từ)
Thay vì chỉ trả lời cộc lốc, áp dụng công thức 3 bước:
1. **Direct Answer + Who**: Trả lời thẳng vào câu hỏi và nêu người đồng hành (`with my friend, who is Linh because it is a great way to strengthen our relationship`).
2. **When / Frequency + Benefit**: Tần suất và lợi ích (`I spend four or five times a week doing it as it helps me improve my mental and physical health`).
3. **Example / Feeling**: Ví dụ cụ thể và cảm xúc (`For example, doing yoga allows me to recharge my batteries so I feel refreshed`).

---

### C. Writing Part 3: Đa Dạng Cấu Trúc & Bộ Cụm Từ "Chữa Bí Ý" (38–40 từ/câu)
* **Kỹ thuật chống bí ý**: Kết hợp các liên từ nối (`Besides`, `Moreover`, `On the one hand... on the other hand`) và các cụm thần thánh:
  - `improve my mental / physical health` (nâng cao sức khỏe tinh thần/thể chất)
  - `boost energy / boost morale` (tăng năng lượng / tinh thần)
  - `recharge my batteries` (nạp lại năng lượng)
  - `strengthen our relationship / foster a sense of community` (gắn kết mối quan hệ)
  - `give an opportunity / chance to acquire new skills` (mang lại cơ hội học hỏi kỹ năng)
  - `which enables/allows me to...` (mệnh đề quan hệ chỉ kết quả)
* **Chiến thuật Dual-Tone**:
  - Câu hỏi trò chuyện/kể chuyện thành viên: Giọng thân mật, chia sẻ chân thành.
  - Câu hỏi quan điểm/lời khuyên: Giọng trang trọng, có lập luận (`From my perspective`, `beneficial for / detrimental to`, dùng modal verbs `could/might/would`).

---

### D. Writing Part 4: Chiến Thuật 2 Giải Pháp & Rewards Framework (Task 2: 140–150 từ)
Tránh dùng template sáo rỗng chung chung, hãy đưa ra **2 giải pháp cụ thể**:
1. **Giải pháp 1 (Trọng tâm đề)**: Xử lý trực tiếp vấn đề trong email + câu nêu tác động (`This initiative will bring tremendous benefits, enabling members to...`).
2. **Giải pháp 2 (Vũ khí ghi điểm - Cơ chế khen thưởng/Khích lệ)**:
   - Đề xuất: `a rewards framework for individuals who actively participate...`
   - Ví dụ minh họa: `For instance, offering certificates, vouchers, or public recognition...`
3. **Cấu trúc ngữ pháp cao cấp**:
   - **Đảo ngữ (Inversion)**: `Not only does this proposal benefit all members, but it also creates a welcoming atmosphere.`
   - **Câu chốt đắt giá (Closer)**: `If possible, we should choose [địa điểm/phương án phù hợp], which makes the plan significantly more effective. I hope my suggestions will be taken into consideration.`

---

### E. Ứng Dụng Sang Speaking (Part 1, 2, 3, 4)
* Áp dụng y hệt tư duy: **Direct Answer $\rightarrow$ Tác động/Lợi ích (`help improve... / give a chance to...`) $\rightarrow$ Ví dụ / Mở rộng (`Besides... / For example...`)**.
* Giúp bạn luôn có ý để nói liên tục trong 30s (Part 1), 45s (Part 2, 3) và 2 phút (Part 4) mà không bị "đơ" hay ngập ngừng.

---

## 3. Vị Trí Lưu Trữ Mã Nguồn Trong Dự Án
Các hàm sinh nội dung prompt gửi sang Gemini được tập trung quản lý tại:
- [`apps/web/src/utils/geminiPrompts.ts`](file:///c:/Study/Projects/aptis-prep-master/apps/web/src/utils/geminiPrompts.ts)

Khi bạn muốn bổ sung thêm tiêu chí hoặc đổi giọng điệu nhắc Gemini, bạn chỉ cần sửa trực tiếp file tiện ích này!

