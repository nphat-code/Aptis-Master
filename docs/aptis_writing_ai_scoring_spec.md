# Quy Chuẩn & Tài Liệu Triển Khai Chấm Điểm Aptis Writing Bằng AI (AI Scoring Specification)

Tài liệu này định nghĩa chi tiết tiêu chí, thang điểm, cấu trúc Prompt và định dạng phản hồi (JSON Response) cho tính năng **AI Chấm điểm bài thi Aptis Writing**.

---

## 1. Thang Điểm & Tiêu Chí Đánh Giá Theo Khung CEFR

Bài thi **Aptis Writing** bao gồm 4 phần thi với trọng số và tiêu chí chấm điểm như sau:

| Part | Tên Part | Số lượng task | Độ dài yêu cầu | Tiêu chí chính | Trọng số điểm |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Part 1** | Short answers | 5 câu hỏi ngắn | 1–5 từ / câu | Đúng trọng tâm câu hỏi, đúng từ loại, ngữ pháp & chính tả chuẩn | 5 điểm (hoặc quy đổi /30) |
| **Part 2** | Social media response | 1 đoạn văn | 20–30 từ | Hoàn thành nhiệm vụ đề bài, viết câu hoàn chỉnh, tránh lỗi chính tả | 6 điểm |
| **Part 3** | Three questions | 3 tin nhắn chat | 30–40 từ / câu | Trả lời đủ 3 người, phát triển ý rõ ràng, dùng từ nối liên kết | 15 điểm |
| **Part 4** | Informal & Formal email | 2 email (ngắn & dài) | Email 1: ≈50 từ<br>Email 2: 120–150 từ | Phân biệt văn phong (Informal vs Formal), cấu trúc email chuẩn, từ vựng phong phú | 24 điểm |

**Tổng điểm quy đổi:** 50 điểm ➔ Băng điểm CEFR (A1, A2, B1, B2, C1).

---

## 2. Cấu Trúc Phản Hồi Chấm Điểm Chuẩn (AI Feedback Format)

Mỗi lần AI chấm bài sẽ trả về **3 phân mục phản hồi chính**:

1. **Điểm số (Score)**: Số điểm đạt được trên thang điểm của Part (hoặc thang điểm quy đổi).
2. **Hoàn thành nhiệm vụ (Task Completion)**: Đánh giá mức độ trả lời đúng trọng tâm đề bài, xử lý đủ các câu hỏi/yêu cầu.
3. **Ngữ pháp & Chính tả (Grammar & Spelling)**: Kiểm tra cấu trúc câu, thì của động từ, cách chia từ và lỗi sai chính tả.
4. **Từ vựng (Vocabulary & Range)**: Đánh giá độ phong phú của từ vựng, mức độ phù hợp với ngữ cảnh và văn phong.

---

## 3. Nhật Ký Thử Nghiệm Chấm Điểm AI Thực Tế (Live Testing Log)

### 📌 Quy chuẩn Định dạng Log Test (Test Log Standard Rule)
Tất cả các lượt test thực tế (Live Test Runs) thuộc mọi Part (Part 1, 2, 3, 4) bắt buộc phải tuân theo cấu trúc định dạng chuẩn duy nhất gồm **2 phần chính**:
1. **Đề bài & Bài làm thử nghiệm**: Liệt kê context đề bài, câu hỏi chi tiết, bài làm thực tế của User và số từ *(Word Count)*.
2. **🤖 AI Output Trả Về Thực Tế**: Trích dẫn chính xác 100% phản hồi thực tế từ hệ thống AI Scoring, bao gồm đầy đủ các trường:
   - **Điểm số:** `[Số điểm]/[Tổng điểm]`
   - **Hoàn thành nhiệm vụ (Task Completion):** *[Đánh giá của AI]*
   - **Ngữ pháp & chính tả (Grammar & Spelling):** *[Đánh giá của AI]*
   - **Từ vựng (Vocabulary & Range):** *[Đánh giá của AI]*
   - **Mạch lạc (Coherence & Cohesion):** *[Đánh giá của AI]*
   - **Gợi ý nâng cao (Advanced Suggestions):** *[Gợi ý nâng cao nếu có, hoặc "Không có"]*
   - **Thẻ lỗi cần sửa (Corrections):** *[Danh sách lỗi chi tiết nếu có, hoặc "Không có (0 lỗi)"]*
   - **Kết luận rút ra (Key Takeaway):** *[Quy luật rút ra về cơ chế chấm điểm AI]*

---

### 📌 PART 1 – Short answers (Test Run #1 - Beautiful homes club - 1 Lạc đề & 1 Lỗi ngữ pháp):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm:**
  - Q1: *What is your favorite time of the year?* ➔ `I love autumn.` *(3 từ - Đúng)*
  - Q2: *What is your favorite sport?* ➔ `Tennis is my favorite.` *(4 từ - Đúng)*
  - Q3: *Where do you wanna go on holiday?* ➔ `I want to go Tokyo.` *(5 từ - Thiếu giới từ "to")*
  - Q4: *What is the weather today?* ➔ `It is hot and sunny.` *(5 từ - Đúng)*
  - Q5: *What do you like to do in the evening?* ➔ `I like blue colors.` *(4 từ - Lạc đề)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng yêu cầu của 4/5 câu hỏi. Tuy nhiên, câu 5 trả lời chưa đúng với câu hỏi về hoạt động yêu thích vào buổi tối.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Bạn có một lỗi nhỏ về ngữ pháp khi thiếu giới từ "to" trước tên địa điểm trong câu 3. Các câu còn lại đúng ngữ pháp và chính tả.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng bạn sử dụng đơn giản, phù hợp với Part 1 của bài thi.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời ngắn gọn, phù hợp với Part 1.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Chú ý đọc kỹ câu hỏi ở câu 5 để trả lời đúng hoạt động thay vì màu sắc.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"I want to go Tokyo."` ➔ *Correction:* `"I want to go to Tokyo."`  
  - *Lỗi ngữ pháp:* Thiếu giới từ "to" trước tên địa điểm.
- **Kết luận rút ra (Key Takeaway):** Trả lời đúng 4/5 câu nhưng có 1 câu lạc đề và 1 lỗi ngữ pháp khiến điểm bị hạ xuống `18/30`.

---

### 📌 PART 1 – Short answers (Test Run #2 - Book club - Perfect 30/30):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm:**
  - Q1: *What's your favorite hobby?* ➔ `I enjoy reading fantasy books.` *(5 từ - Đúng)*
  - Q2: *How do you get to work?* ➔ `I commute by public bus.` *(5 từ - Đúng)*
  - Q3: *What do you like to do in the evening?* ➔ `I read books at home.` *(5 từ - Đúng)*
  - Q4: *What kinds of movies do you like?* ➔ `I prefer watching action films.` *(5 từ - Đúng)*
  - Q5: *What's your favorite food?* ➔ `My favorite food is pizza.` *(5 từ - Đúng)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đầy đủ và trực tiếp cho cả 5 câu hỏi, thể hiện rõ sở thích và thông tin cá nhân.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Các câu trả lời đều đúng ngữ pháp và không có lỗi chính tả.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn sử dụng từ vựng phù hợp và rõ ràng để diễn đạt ý.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời tự nhiên và chính xác.*
- **Gợi ý nâng cao (Advanced Suggestions):** Không có.
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Trả lời chuẩn xác 5/5 câu hỏi Part 1 đạt điểm tối đa `30/30`.

---

### 📌 PART 1 – Short answers (Test Run #3 - Music club - 2 Lỗi chính tả & 1 Lỗi ngữ pháp):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm:**
  - Q1: *How many people in your family?* ➔ `There are four people.` *(4 từ - Đúng)*
  - Q2: *What is your hobby?* ➔ `I love listning music.` *(4 từ - Sai chính tả 'listning' & thiếu 'to')*
  - Q3: *What did you eat for lunch?* ➔ `I ate delicious piza.` *(4 từ - Sai chính tả 'piza')*
  - Q4: *How do you get to work?* ➔ `I go by motorbike.` *(4 từ - Đúng)*
  - Q5: *What kind of music do you like?* ➔ `I love pop music.` *(4 từ - Đúng)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Học viên đã trả lời đầy đủ 5 câu hỏi và các câu trả lời đều bám sát nội dung yêu cầu của đề bài.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Có một vài lỗi nhỏ về chính tả và ngữ pháp. Cụ thể, học viên đã mắc lỗi chính tả ở từ "listening" và "pizza". Ngoài ra, câu thứ hai còn thiếu giới từ "to" sau "listening".*
- **Từ vựng (Vocabulary & Range):**  
  *Học viên sử dụng từ vựng đơn giản, phù hợp với Part 1 của bài thi.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Diễn đạt dễ hiểu.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Chú ý kiểm tra kỹ chính tả trước khi nộp bài.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Lỗi ngữ pháp:* `"I love listning music."` ➔ `"I love listening to music."` *(Thiếu giới từ 'to' sau 'listening')*
  - *Lỗi chính tả:* `"listning"` ➔ `"listening"` *(Sai chính tả từ 'listening')*
  - *Lỗi chính tả:* `"piza"` ➔ `"pizza"` *(Sai chính tả từ 'pizza')*
- **Kết luận rút ra (Key Takeaway):** Trả lời đủ 5 câu nhưng mắc 2 lỗi chính tả và 1 lỗi ngữ pháp bị hạ điểm xuống `18/30`.

---

### 📌 PART 1 – Short answers (Test Run #4 - Business club - Single-word answers 30/30):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm:**
  - Q1: *What is your hobby?* ➔ `Reading` *(1 từ - Đúng)*
  - Q2: *What is your favourite food?* ➔ `Pizza` *(1 từ - Đúng)*
  - Q3: *What is your favourite time of a day?* ➔ `Evening` *(1 từ - Đúng)*
  - Q4: *How do you get to work?* ➔ `Bus` *(1 từ - Đúng)*
  - Q5: *Where are you from?* ➔ `Tokyo` *(1 từ - Đúng)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng và đầy đủ các câu hỏi được đưa ra.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Các câu trả lời không có lỗi ngữ pháp hay chính tả.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn đã sử dụng từ vựng phù hợp và chính xác cho từng câu trả lời.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời 1 từ đáp ứng chuẩn yêu cầu Part 1.*
- **Gợi ý nâng cao (Advanced Suggestions):** Không có.
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Trong Part 1, câu trả lời dạng 1 từ (Single-word answers) đạt điểm tối đa `30/30`, không bắt buộc viết thành câu đầy đủ (*I live in...*).

---

### 📌 PART 1 – Short answers (Test Run #5 - Car club - 3/5 câu, để trống 2 câu):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm:**
  - Q1: *What is your favourite color?* ➔ `Blue is my favourite.` *(4 từ - Đúng)*
  - Q2: *What is the weather today?* ➔ `It is hot and sunny.` *(5 từ - Đúng)*
  - Q3: *How are you today?* ➔ `I am fine, thanks.` *(4 từ - Đúng)*
  - Q4: *Question 4* ➔ ` ` *(Để trống)*
  - Q5: *Question 5* ➔ ` ` *(Để trống)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn mới trả lời 3/5 câu hỏi, để trống 2 câu cuối.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Tất cả các câu trả lời đều đúng ngữ pháp và không có lỗi chính tả.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng đơn giản, phù hợp với ngữ cảnh và yêu cầu của phần 1.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu đã làm đều đạt.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Cần hoàn thành đủ cả 5 câu để tối đa hóa điểm số.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Trả lời đúng 3/5 câu và để trống 2 câu nhận điểm quy đổi chính xác `18/30` ($3/5 = 60\% = 18/30$).

---

### 📌 PART 1 – Short answers (Test Run #6 - Car club - Over-length 12-14 words per answer):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** Club application - Short answers (1-5 từ/câu)
- **Bài làm thử nghiệm (Viết quá dài 12–14 từ/câu):**
  - Q1 (*What is your favourite colour?*):  
    `My most favorite color in the whole world is dark navy blue.` *(12 từ - Vượt mốc 1-5 từ)*
  - Q2 (*What is the weather like today?*):  
    `The weather today in my city is extremely hot, bright, and sunny.` *(12 từ - Vượt mốc 1-5 từ)*
  - Q3 (*How are you?*):  
    `I am feeling very happy and energetic today because of the nice day.` *(13 từ - Vượt mốc 1-5 từ)*
  - Q4 (*Which is your favorite season?*):  
    `My absolute favorite season of the year is definitely autumn because of cool breezes.` *(14 từ - Vượt mốc 1-5 từ)*
  - Q5 (*What do you do on the weekend?*):  
    `I usually go shopping and hang out with my close friends on weekends.` *(13 từ - Vượt mốc 1-5 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30` *(Điểm tuyệt đối)*
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đầy đủ và đúng trọng tâm tất cả các câu hỏi được đưa ra.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Các câu trả lời của bạn không có lỗi ngữ pháp hay chính tả nào đáng kể.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn sử dụng từ vựng đa dạng và phù hợp để diễn tả các ý của mình.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời mạch lạc, diễn đạt ý rõ ràng.*
- **Gợi ý nâng cao (Advanced Suggestions):** Không có.
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):**  
  1. Trong Part 1, việc **viết câu dài (12-14 từ)** KHÔNG BỊ TRỪ ĐIỂM (vẫn đạt điểm tuyệt đối `30/30` nếu đúng ngữ pháp, chính tả và bám sát câu hỏi).  
  2. **Chiến thuật tối ưu nhất cho thí sinh Part 1:** Trả lời từ **1–3 từ ngắn gọn** (ví dụ: `Blue`, `Hot and sunny`, `Fine`, `Autumn`, `Go shopping`) vừa đạt điểm tuyệt đối `30/30` vừa tiết kiệm 90% thời gian làm bài mà không bao giờ lo mắc lỗi ngữ pháp!

---

### 📌 PART 2 – Social media response (Test Run #1 - Art club - High quality 26 words):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *Now you've become a new member of the Art Club. Fill in the form. Write in sentences. Use 20-30 words. Tell me a painting or a photo that you like.*
- **Bài làm thử nghiệm:**  
  `I really like the painting Starry Night by Vincent van Gogh because the swirling stars and vibrant blue colors make me feel very peaceful and inspired.` *(26 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `28/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi, nêu rõ tác phẩm yêu thích và lý do rất cụ thể. Nội dung đầy đủ và mạch lạc.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá tốt, chỉ có một lỗi nhỏ về cách dùng dấu câu trước 'because' khiến câu hơi dài.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ rất hay và chính xác, đặc biệt là các từ như 'swirling', 'vibrant', 'peaceful' và 'inspired' giúp diễn tả cảm xúc rất tốt.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Nội dung gắn kết logic và mượt mà.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để câu văn mượt mà hơn, bạn có thể tách câu dài thành hai câu ngắn hoặc dùng dấu phẩy nếu muốn giữ nguyên cấu trúc.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"the painting Starry Night by Vincent van Gogh because"` ➔ *Correction:* `" 'Starry Night' by Vincent van Gogh. Because"`  
  - *Giải thích:* Nên tách mệnh đề chỉ nguyên nhân nếu câu quá dài.
- **Kết luận rút ra (Key Takeaway):** Viết chuẩn 26 từ trong khoảng 20-30 từ với từ vựng hay đạt `28/30` (trừ 2 điểm do cấu trúc câu hơi dài).

---

### 📌 PART 2 – Social media response (Test Run #2 - Beautiful homes club - Short response 11 words):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *Now you've become a new member of the Beautiful Homes Club. Fill in the form. Write in sentences. Use 20-30 words. Why do you want to join beautiful homes club?*
- **Bài làm thử nghiệm:**  
  `I want to join to make my house beautiful and clean.` *(11 từ - Dưới 20 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi. Tuy nhiên, câu trả lời của bạn hơi ngắn so với yêu cầu 20-30 từ của đề bài nhé. Mình cần phát triển thêm ý để đạt đủ số lượng từ.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp và chính tả của bạn đều tốt, không có lỗi sai nào.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng phù hợp và rõ nghĩa, dễ hiểu.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Ý văn rõ ràng.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Bổ sung thêm lý do cụ thể hoặc dự định trang trí nhà cửa để kéo dài câu lên 20-30 từ.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Viết đúng ngữ pháp nhưng thiếu độ dài (chỉ 11 từ / yêu cầu 20-30 từ) bị trừ điểm Task Completion xuống `18/30`.

---

### 📌 PART 2 – Social media response (Test Run #3 - Book club - Over-length 39 words):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *Now you've become a new member of the Book Club. Fill in the form. Write in sentences. Use 20-30 words. How do you find research materials?*
- **Bài làm thử nghiệm:**  
  `To find these resources, I usually search our university library catalogue and explore online databases such as Google Scholar. Additionally, I always ask my professors for recommendations on relevant academic journals and textbooks to support my final graduation thesis.` *(39 từ - Vượt quá 30 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng câu hỏi và cung cấp thông tin khá chi tiết về cách bạn tìm tài liệu. Các ý tưởng được phát triển hợp lý và rõ ràng. Tuy nhiên, bài viết của bạn hơi dài một chút so với giới hạn 20-30 từ cho Part 2.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn rất tốt, chỉ có một lỗi nhỏ về cách dùng từ "such as" ở đây, đáng lẽ nên dùng "like" sẽ tự nhiên hơn. Không có lỗi chính tả nào cả.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn đã dùng các từ vựng học thuật rất phù hợp và tự nhiên, cho thấy vốn từ của bạn khá tốt.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Bài viết của bạn rất mạch lạc, các câu được nối với nhau một cách tự nhiên và logic.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Ở Part 2, mình cần cố gắng viết thật ngắn gọn và súc tích để đạt được yêu cầu về số lượng từ nha. Bạn có thể thử kết hợp hoặc rút gọn một số ý.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"such as Google Scholar"` ➔ *Correction:* `"like Google Scholar"`  
  - *Giải thích:* Lỗi dùng từ chưa hoàn toàn tự nhiên khi đưa ra ví dụ.
- **Kết luận rút ra (Key Takeaway):** Viết dài hơn giới hạn (39 từ / 20-30 từ) dù từ vựng học thuật tốt vẫn bị hạ điểm xuống `25/30`.

---

### 📌 PART 2 – Social media response (Test Run #4 - Art club - Perfect 21 words 30/30):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *Now you've become a new member of the Art Club. Fill in the form. Write in sentences. Use 20-30 words. Tell me a painting or a photo that you like.*
- **Bài làm thử nghiệm:**  
  `I really like the Mona Lisa painting by Leonardo da Vinci because of her mysterious smile and the beautiful landscape background.` *(21 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi, nêu rõ bức tranh yêu thích (Mona Lisa) và lý do yêu thích. Nội dung đầy đủ và mạch lạc.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp và chính tả của bạn rất tốt, không có lỗi sai nào.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng phù hợp, chính xác và diễn đạt tự nhiên.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu liên kết mượt mà và logic.*
- **Gợi ý nâng cao (Advanced Suggestions):** Không có.
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Viết chuẩn 21 từ trong khoảng 20-30 từ, đúng ngữ pháp và đầy đủ ý nhận điểm tuyệt đối `30/30`.

---

### 📌 PART 2 – Social media response (Test Run #5 - Book club - Completely Off-topic 14/30):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *Now you've become a new member of the Book Club. Fill in the form. Write in sentences. Use 20-30 words.*
- **Bài làm thử nghiệm:**  
  `I really love eating delicious pepperoni pizza with extra cheese and drinking cold iced tea with my friends every weekend.` *(20 từ - Lạc đề hoàn toàn sang đồ ăn)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `14/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bài của bạn hoàn toàn lạc đề rồi. Đề bài yêu cầu bạn giới thiệu về lý do tham gia Book Club và nhu cầu tìm tài liệu cho việc học, chứ không phải nói về sở thích ăn uống, đi chơi nha.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp và chính tả của bạn không có lỗi sai nào.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng bạn dùng khá đơn giản và phù hợp với một cuộc trò chuyện thông thường.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Câu văn có tính liên kết nhưng không bám đề bài.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Cần tập trung trả lời đúng câu hỏi của đề bài.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Viết đúng ngữ pháp nhưng **hoàn toàn lạc đề** khiến điểm Task Completion giảm nghiêm trọng, tổng điểm hạ xuống `14/30`.

---

### 📌 PART 3 – Three questions (Test Run #1 - Art club - 31-33 words per answer):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Art Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm:**
  - Q1 (*Tell me a thing that you have had for a long time*):  
    `I have had an old wooden easel for over five years, which was a gift from my grandfather. It has survived many painting sessions and reminds me of my early passion for art.` *(33 từ)*
  - Q2 (*Should I take a course at my local college? Please, give me some advice*):  
    `Taking a course at a local college is a great idea. It offers structured learning, access to professional guidance, and an opportunity to meet other students who share your creative interests.` *(31 từ)*
  - Q3 (*Street art is becoming popular. However, some people criticize that it is bad. What is your opinion?*):  
    `In my opinion, street art is a valuable form of expression that brings color to dull urban walls. While some criticize it as vandalism, it makes art accessible to everyone in public.` *(32 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn trả lời trực tiếp và đủ ý cho cả 3 câu hỏi, rất tốt!*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Bài viết của bạn không có lỗi ngữ pháp hay chính tả đáng kể, thể hiện sự chắc chắn trong việc sử dụng tiếng Anh.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng rất tự nhiên và chính xác, có nhiều từ hay và phù hợp với từng ngữ cảnh.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời của bạn rất mạch lạc, dễ hiểu và có sự liên kết ý tưởng rõ ràng.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để đạt điểm cao hơn nữa, bạn có thể cố gắng mở rộng thêm một chút ý cho mỗi câu trả lời để đạt đủ 30-40 từ, chẳng hạn như thêm một ví dụ nhỏ hoặc một cảm xúc cá nhân.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Viết đúng trọng tâm, ngữ pháp và từ vựng chuẩn B2/C1 ở độ dài 31-33 từ đạt `25/30`. AI yêu cầu phát triển thêm ví dụ/cảm xúc cá nhân ở sát mức 35-40 từ để đạt điểm tuyệt đối `30/30`.

---

### 📌 PART 3 – Three questions (Test Run #2 - Book club - 36-39 words per answer):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Book Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm:**
  - Q1 (*Hi! Welcome to the club. When and where do you like reading books?*):  
    `I usually enjoy reading books late in the evening right before going to sleep, sitting comfortably in my quiet bedroom. During weekends, I also love spending hours reading novel books at a cozy local coffee shop near my house.` *(39 từ)*
  - Q2 (*Hi! I would like to give my friend a book. What would you suggest for me to buy?*):  
    `I strongly recommend buying "To Kill a Mockingbird" by Harper Lee because it is an inspiring classic novel with deep life lessons. I am sure your friend will truly appreciate such a thoughtful and meaningful gift.` *(36 từ)*
  - Q3 (*Online books replace traditional books? What do you think about that?*):  
    `Although online books are convenient and portable, I do not believe they will completely replace traditional printed books. For me, the tactile feeling of turning physical pages creates a unique reading experience that digital screens cannot duplicate.` *(37 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `24/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời trực tiếp và đầy đủ các câu hỏi, nội dung tương đối ổn và có phát triển ý tốt.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá chính xác, nhưng có một vài lỗi nhỏ về cách dùng từ và cấu trúc câu. Bạn nên chú ý hơn đến sự tự nhiên trong cách diễn đạt nhé.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng khá phong phú và phù hợp với ngữ cảnh. Điều này giúp bài viết của bạn trở nên hấp dẫn hơn đó.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời của bạn mạch lạc, ý tứ rõ ràng. Để bài viết mượt mà hơn, bạn có thể thử đa dạng hóa cấu trúc câu thêm một chút nhé.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Bạn có thể thử dùng các cấu trúc câu đa dạng hơn để bài viết trôi chảy và tự nhiên như người bản xứ hơn nhé. Ngoài ra, bạn nên cân nhắc cách diễn đạt 'I strongly recommend' vì nó hơi trang trọng một chút cho một cuộc trò chuyện thân mật.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"reading novel books"` ➔ *Correction:* `"reading novels"`  
  - *Giải thích:* Lỗi dùng từ chưa tự nhiên; dùng 'novel books' bị thừa từ (redundant), chỉ cần 'novels' là chuẩn tiếng Anh tự nhiên.
- **Kết luận rút ra (Key Takeaway):**  
  1. Trong group chat Part 3, dùng các cụm từ quá trang trọng như `"I strongly recommend"` sẽ bị nhắc nhở vì văn phong chưa tự nhiên với cuộc trò chuyện thân mật (nên dùng `"I'd recommend"` hoặc `"How about..."`).  
  2. Lỗi dùng từ dư thừa như `"novel books"` thay vì `"novels"` bị AI bắt lỗi ngữ pháp/dùng từ khiến điểm bị hạ xuống `24/30`.

---

### 📌 PART 3 – Three questions (Test Run #3 - Fitness club 2 - Informal chat & B2/C1 vocabulary):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Fitness Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm:**
  - Q1 (*I live in a tall building, I usually walk downstairs to exercise, how do you usually exercise?*):  
    `Hi! That is a great habit. Personally, I prefer going to a local gym near my apartment three times a week to lift heavy weights and run on the treadmill, which really helps me stay energetic.` *(36 từ)*
  - Q2 (*I usually get up early to run in the morning because I usually get tired in the evening. What about you?*):  
    `I am definitely an evening person! After finishing work, I usually go jogging in the nearby park around six p.m. because exercising after a long day helps me relieve stress and sleep much better at night.` *(36 từ)*
  - Q3 (*Nowadays, technology makes people's lives easier, but it also makes them lazy and dislike exercise. Do you agree with this opinion?*):  
    `I completely agree with you! Modern devices like smartphones encourage sedentary habits. However, if people use fitness trackers or workout applications wisely, technology can actually motivate us to exercise much more regularly and stay active.` *(35 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã hoàn thành tốt cả ba câu hỏi, trả lời đúng trọng tâm và phát triển ý khá đầy đủ. Mỗi câu trả lời đều thể hiện rõ quan điểm và thói quen của bạn.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn rất ổn, ít mắc lỗi và các câu đều được viết rõ ràng, dễ hiểu. Bạn cũng không có lỗi chính tả nào đáng kể.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng rất tốt, tự nhiên và đa dạng, phù hợp với từng ngữ cảnh. Ví dụ như 'lift heavy weights' hay 'sedentary habits' đều rất chuẩn xác.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Bài viết của bạn rất mạch lạc, các ý được sắp xếp hợp lý và có sự liên kết chặt chẽ. Người đọc dễ dàng theo dõi suy nghĩ của bạn.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để bài viết thêm ấn tượng, bạn có thể thử sử dụng thêm một vài cấu trúc câu phức tạp hơn một chút hoặc các thành ngữ (idioms) thông dụng liên quan đến chủ đề sức khỏe, thể thao để làm cho văn phong thêm tự nhiên và sinh động nhé. Ví dụ, thay vì chỉ nói 'stay energetic', bạn có thể nói 'keep fit and healthy' hoặc 'feel on top of the world' sau khi tập luyện.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Bài viết đúng 100% ngữ pháp, từ vựng B2/C1 chuẩn xác, văn phong chat thân mật và độ dài 35-36 từ đạt điểm `25/30`. Để kích hoạt điểm tuyệt đối `30/30`, AI đánh giá cao việc chèn các thành ngữ (idioms/collocations) tự nhiên của người bản xứ như `"feel on top of the world"` hay `"keep fit and healthy"`.

---

### 📌 PART 3 – Three questions (Test Run #4 - Language club 2 - Idioms & Collocations):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Language Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm:**
  - Q1 (*I used to learn French and found it very interesting. Tell me about a memory you have with a foreign language?*):  
    `When I traveled to Tokyo last year, speaking basic Japanese with local people was a wonderful memory. Successfully ordering food by myself made me feel over the moon and really motivated me to broaden my horizons.` *(36 từ)*
  - Q2 (*I am very forgetful. Can you give me some tips on how to remember new words?*):  
    `Don't worry, we all struggle with memory! Using digital flashcards like Anki is a brilliant method. Trying to put new vocabulary into daily short conversations really helps you remember words naturally because practice makes perfect.` *(35 từ)*
  - Q3 (*Some people learn English through videos and reading books. However, there are also many private classes and teachers. What do you think is the most effective way to learn?*):  
    `In my view, combining self-study through videos with live practice in private classes is the most effective approach. Watching English videos builds natural listening skills, while experienced tutors provide personalized feedback to boost your confidence.` *(35 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời rất tốt cả ba câu hỏi, các ý tưởng rõ ràng và được phát triển hợp lý.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá chắc chắn, chỉ có một vài lỗi nhỏ không đáng kể. Bạn nên tiếp tục duy trì sự cẩn thận này nhé.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng rất phong phú và tự nhiên, đặc biệt là các thành ngữ như 'over the moon' hay 'broaden my horizons' khiến bài viết của bạn ấn tượng hơn nhiều đó.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Bài viết của bạn rất mạch lạc, các câu từ được liên kết hợp lý, dễ đọc và dễ hiểu.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để bài viết thêm phần sinh động, bạn có thể thử thêm một vài ví dụ cá nhân hoặc cảm xúc cụ thể hơn nữa vào mỗi câu trả lời để tăng tính thuyết phục và gần gũi nhé. Ví dụ, thay vì chỉ nói 'made me feel over the moon', bạn có thể thêm một chút về cảm giác lúc đó thực sự như thế nào. Hoặc với lời khuyên, bạn có thể nói rõ hơn một chút về cách Anki hoặc 'daily short conversations' giúp bạn học từ vựng hiệu quả ra sao.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):** Sử dụng các thành ngữ (idioms) như `'over the moon'`, `'broaden my horizons'`, `'practice makes perfect'` được AI khen ngợi rất cao về vốn từ vựng. Tuy nhiên để đạt mốc `30/30`, AI yêu cầu chi tiết hóa ví dụ cá nhân/mô tả trải nghiệm thực tế cụ thể hơn (ví dụ kể rõ món ăn đã đặt hoặc con số từ vựng cụ thể học được).

---

### 📌 PART 3 – Three questions (Test Run #5 - Business club - Vivid Examples & Tone Analysis):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Business Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm:**
  - Q1 (*I know there are a lot of successful small businesses these days. Tell me about a successful small business in your area*):  
    `Hi everyone! Near my neighborhood, there is a cozy craft bakery named Sunbakes that opened two years ago. By serving fresh organic sourdough bread every morning, they quickly built a loyal customer base and tripled their profits.` *(37 từ)*
  - Q2 (*I have a friend who wants to open a second coffee shop. What advice do you have to help her be more successful in her second shop?*):  
    `That is exciting news! My key advice for her is to conduct thorough market research before choosing the new location. Furthermore, maintaining the same high coffee quality and friendly customer service will guarantee long-term business success.` *(36 từ)*
  - Q3 (*Can you tell me what qualities and skills are needed to create a successful small business?*):  
    `In my opinion, personal resilience and sound financial management skills are absolutely essential. A successful entrepreneur must be adaptable to rapid market changes, passionate about products, and capable of creating effective marketing strategies to attract target customers.` *(37 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã hiểu và trả lời đúng trọng tâm cả ba câu hỏi, cung cấp đủ thông tin và lời khuyên hữu ích. Các câu trả lời đều có độ dài phù hợp và phát triển ý khá tốt. Bạn đã xử lý phần này rất tốt!*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn tương đối vững vàng, chỉ có một vài lỗi nhỏ về cách dùng từ nối và dấu câu nhưng không đáng kể. Chính tả của bạn cũng rất tốt, không có lỗi nào.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn sử dụng từ vựng phong phú và phù hợp với ngữ cảnh informal. Các cụm từ như 'loyal customer base', 'sound financial management skills' cho thấy vốn từ của bạn khá đa dạng và được dùng chính xác.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời của bạn có sự liên kết chặt chẽ giữa các ý. Việc sử dụng các từ nối và cấu trúc câu giúp bài viết mạch lạc và dễ theo dõi.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để bài viết tự nhiên hơn nữa, bạn có thể chú ý thêm một chút đến cách dùng các cụm từ nối và đại từ sở hữu để câu văn mượt mà hơn nhé. Ví dụ, thay vì 'Furthermore', bạn có thể dùng 'Also' hoặc 'In addition' để giữ giọng văn informal. Ngoài ra, bạn nên dùng 'Hi there!' thay vì 'Hi everyone!' ở đầu thư để tạo không khí thân mật hơn.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"Hi everyone!"` ➔ *Correction:* `"Hi there!"`  
    *(Giải thích: 'Hi everyone!' nghe hơi trang trọng; 'Hi there!' thân mật và tự nhiên hơn trong informal group chat).*  
  - *Original:* `"built a loyal customer base and tripled their profits."` ➔ *Correction:* `"built a loyal customer base, tripling their profits."`  
    *(Giải thích: Dùng rút gọn mệnh đề hiện tại phân từ `, tripling their profits` mượt mà hơn về mặt ngữ pháp/phong cách).*  
  - *Original:* `"Furthermore, maintaining..."` ➔ *Correction:* `"Also, maintaining..."` hoặc `"In addition, maintaining..."`  
    *(Giải thích: Từ nối 'Furthermore' quá trang trọng/academic cho Part 3 group chat).*  
  - *Original:* `"passionate about products"` ➔ *Correction:* `"passionate about their products"`  
    *(Giải thích: Cần bổ sung đại từ sở hữu 'their' chỉ sản phẩm của chính doanh nhân đó).*
- **Kết luận rút ra (Key Takeaway):**  
  1. **Chào hỏi:** Trong Part 3 Group Chat, nên chào bằng `"Hi there!"` thay vì `"Hi everyone!"`.  
  2. **Từ nối (Transitions):** Tránh dùng từ nối trang trọng như `"Furthermore"` (dành cho Part 4 formal essay/email); nên dùng `"Also"` hoặc `"In addition"`.  
  3. **Ngữ pháp mượt mà:** Dùng rút gọn phân từ `, tripling their profits` thay cho `and tripled...`.  
  4. **Đại từ sở hữu:** Đừng quên đại từ sở hữu (`their products`).

---

### 📌 PART 3 – Three questions (Test Run #6 - Business club - Re-Test Cải Tiến 4/4 Lỗi):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Business Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm (Đã sửa cả 4 điểm từ Run #5):**
  - Q1 (*Tell me about a successful small business in your area*):  
    `Hi there! Near my neighborhood, there is a cozy craft bakery named Sunbakes that opened two years ago. By serving fresh organic sourdough bread every morning, they quickly built a loyal customer base, tripling their profits.` *(36 từ)*
  - Q2 (*What advice do you have to help her be more successful in her second shop?*):  
    `That is exciting news! My key advice for her is to conduct thorough market research before choosing the new location. Also, maintaining the same high coffee quality and friendly customer service will guarantee long-term business success.` *(36 từ)*
  - Q3 (*What qualities and skills are needed to create a successful small business?*):  
    `In my opinion, personal resilience and sound financial management skills are absolutely essential. A successful entrepreneur must be adaptable to rapid market changes, passionate about their products, and capable of creating effective marketing strategies to attract customers.` *(37 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đầy đủ và đúng trọng tâm cả ba câu hỏi. Nội dung các câu trả lời đều được phát triển tốt và cung cấp đủ thông tin theo yêu cầu của đề bài. Bạn đã kể về một doanh nghiệp nhỏ thành công, đưa ra lời khuyên hữu ích và liệt kê những phẩm chất cần thiết.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn nhìn chung là tốt, ít mắc lỗi và bạn có thể sử dụng các cấu trúc câu khá đa dạng. Tuy nhiên, đôi chỗ bạn có thể xem xét lại cách dùng dấu câu để câu văn tự nhiên hơn.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng rất phù hợp và tự nhiên cho bối cảnh informal, với nhiều cụm từ hay và chính xác như 'loyal customer base' hay 'sound financial management skills'.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời của bạn mạch lạc, rõ ràng, dễ hiểu và có sự liên kết tốt giữa các ý.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để câu văn thêm mượt mà và chuyên nghiệp hơn, bạn nên chú ý một chút đến cách dùng dấu câu và từ nối, ví dụ như có thể thay 'Also' bằng 'Additionally' hoặc các từ nối khác phù hợp hơn khi bắt đầu một câu mới. Bạn cũng có thể mở rộng thêm một chút về các ý bạn đã đưa ra để đạt số từ tối ưu cho mỗi câu trả lời.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):**  
  1. Bài làm đã khắc phục triệt để 100% các lỗi cũ của Run #5, không còn bất kỳ thẻ lỗi ngữ pháp/dùng từ nào.  
  2. Điểm số ổn định ở mức `25/30` (CEFR B2/C1). Phần gợi ý nâng cao của AI mang tính chất tư vấn phong cách mềm (khi đổi `Furthermore` sang `Also` ở Run 5 thì AI gợi ý dùng `Also`, khi dùng `Also` ở Run 6 thì AI lại gợi ý dùng `Additionally`).

---

### 📌 PART 3 – Three questions (Test Run #7 - Food club - Under-length 15-16 words per answer):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Food Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm (Thiếu độ dài 15–16 từ/câu):**
  - Q1 (*Tell me about the most memorable meal of your life*):  
    `My most memorable meal was my birthday dinner at a seaside seafood restaurant with my family.` *(16 từ)*
  - Q2 (*Some people like to eat out with friends, do you like eating out or eating at home?*):  
    `I prefer eating out with my friends because we can try different delicious dishes together.` *(15 từ)*
  - Q3 (*Nowadays, people in other countries have too many unhealthy food choices, should there be a tax on fast food to improve this situation, why?*):  
    `Yes, taxing fast food is a good idea to encourage people to eat healthier meals.` *(15 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `13/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng các câu hỏi nhưng bài viết quá ngắn, cần phát triển ý thêm để đạt độ dài 30-40 từ cho mỗi câu nhé. Bạn nên cung cấp thêm chi tiết và giải thích rõ ràng hơn cho mỗi câu trả lời.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá ổn, không mắc lỗi lớn. Tuy nhiên, bạn nên thử sử dụng các cấu trúc câu đa dạng hơn để bài viết thêm phần hấp dẫn.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng bạn dùng an toàn và dễ hiểu. Để bài viết đạt điểm cao hơn, bạn nên mở rộng vốn từ và sử dụng các từ miêu tả cụ thể, phong phú hơn.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Vì các câu trả lời của bạn khá ngắn nên tính mạch lạc chưa được thể hiện rõ ràng. Bạn nên cố gắng phát triển ý sâu hơn và dùng thêm các từ nối để các ý được liên kết chặt chẽ nhé.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Bạn có thể thử thêm các ví dụ hoặc trải nghiệm cá nhân vào câu trả lời để bài viết sinh động và thuyết phục hơn.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):**  
  Viết đúng trọng tâm và đúng 100% ngữ pháp/chính tả nhưng bị thiếu số lượng từ nghiêm trọng (chỉ 15-16 từ/câu so với quy định 30-40 từ) bị AI hạ điểm nặng xuống `13/30` ($13/30 = 43\%$).

---

### 📌 PART 3 – Three questions (Test Run #8 - Museum club - Off-topic 1 Question):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Museum Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm (Cố tình LẠC ĐỀ câu 2):**
  - Q1 (*Please talk about the first museum you visited when you were a child?*):  
    `Hi there! The first museum I visited was the History Museum in my hometown when I was seven years old. I was amazed by the ancient dinosaur fossils and historical artifacts.` *(31 từ - Đúng đề)*
  - Q2 (*What kind of museum do you like?*):  
    `I really love sunny weather because I can go to the beach and swim in the ocean with my friends every weekend during hot summer days.` *(26 từ - Lạc đề hoàn toàn sang thời tiết)*
  - Q3 (*Nowadays, many museums use technology to create online exhibitions. Do you think that will be successful?*):  
    `Yes, I believe online exhibitions will be very successful because they allow people worldwide to explore famous art collections conveniently from home without paying expensive travel costs.` *(27 từ - Đúng đề)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `24/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn trả lời tốt câu 1 và 3, nhưng câu 2 lại lạc đề hoàn toàn, khiến tổng thể bài viết bị ảnh hưởng. Bạn nên đọc kỹ câu hỏi để đảm bảo mình đang trả lời đúng trọng tâm nhé!*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá ổn, không có nhiều lỗi lớn. Chính tả thì chuẩn rồi.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn dùng từ vựng khá hay và phù hợp với chủ đề, ví dụ như 'ancient dinosaur fossils' hay 'explore famous art collections'.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Các câu trả lời của bạn mạch lạc, dễ hiểu, trình bày ý tưởng rõ ràng.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Ở câu 1, thay vì kể lại cảm xúc, bạn có thể thêm một chút chi tiết về điều gì đã làm bạn ấn tượng nhất. Với câu 2, hãy cố gắng nghĩ về các loại bảo tàng như bảo tàng lịch sử, bảo tàng khoa học, hay bảo tàng nghệ thuật.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"I really love sunny weather..."` ➔ *Correction:* `"I really love natural history museums because they help us learn about ancient creatures and fascinating artifacts."`  
  - *Giải thích:* Lỗi logic/lạc đề: Câu trả lời này hoàn toàn lạc đề so với câu hỏi 'What kind of museum do you like?'. Bạn cần tập trung vào các loại bảo tàng.
- **Kết luận rút ra (Key Takeaway):**  
  Bài làm có 2 câu trả lời xuất sắc (từ vựng C1, ngữ pháp chuẩn) nhưng 1 câu bị lạc đề hoàn toàn bị AI gắn thẻ `Lỗi logic/lạc đề` và bị hạ điểm xuống `24/30`.

---

### 📌 PART 3 – Three questions (Test Run #9 - Photography club - 5 Grammar & Spelling Errors):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Photography Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm (Cố tình lồng ghép 5 lỗi chính tả & ngữ pháp):**
  - Q1 (*Hi! Welcome to the club. How to have a beautiful picture?*):  
    `Hi there! To take a beautiful fotograph, you need to pay attention to natural lighting and composition. In addition, choosing a unique angle is focus on the main subject effectively.` *(30 từ - Mắc lỗi `fotograph` & `is focus`)*
  - Q2 (*I often save my photos as files on my computer or print them out. How do you save your photos?*):  
    `I usually upload all my photos to Google Drive because it is very convenient. I also create diferent folders cloud storage to organize my travel memories safely.` *(27 từ - Mắc lỗi `diferent` & thiếu giới từ `in`)*
  - Q3 (*What skills do you need to take good photos?*):  
    `To taking good picture, patience and creativity is require. You also need to understand how camera settings like aperture and shutter speed work together.` *(24 từ - Mắc lỗi `To taking`, `picture` & `is require`)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `20/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời đúng trọng tâm các câu hỏi. Tuy nhiên, một vài câu trả lời hơi ngắn, bạn nên cố gắng phát triển thêm ý để đạt được độ dài 30-40 từ cho mỗi câu nhé.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Bài viết của bạn có một số lỗi ngữ pháp cơ bản và chính tả. Bạn cần chú ý hơn đến cấu trúc câu, cách dùng giới từ, và thì của động từ để bài viết được chính xác hơn. Ví dụ, 'is focus' nên sửa thành 'helps to focus', 'diferent' sửa thành 'different'.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng bạn dùng khá phù hợp với chủ đề nhiếp ảnh. Tuy nhiên, bạn có thể thử đa dạng hóa cách diễn đạt và sử dụng các cụm từ tự nhiên hơn để bài viết mượt mà hơn.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Bài viết của bạn có sự liên kết giữa các ý, nhưng bạn có thể dùng thêm các từ nối hoặc cấu trúc câu phức tạp hơn một chút để các câu văn được liền mạch và trôi chảy hơn nhé.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Để câu trả lời thêm phần sinh động và dài hơn, bạn có thể thêm các ví dụ cụ thể hoặc giải thích chi tiết hơn về các kỹ thuật bạn đã đề cập.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Lỗi ngữ pháp (Original):* `"is focus on the main subject effectively."` ➔ *Correction:* `"helps to focus on the main subject effectively."` *(Giải thích: Sai cấu trúc câu và thiếu động từ. 'Is focus' không đúng).*  
  - *Lỗi ngữ pháp (Original):* `"I also create diferent folders cloud storage..."` ➔ *Correction:* `"I also create different folders in cloud storage..."` *(Giải thích: Thiếu giới từ 'in' trước 'cloud storage').*  
  - *Lỗi ngữ pháp (Original):* `"To taking good picture, patience and creativity is require."` ➔ *Correction:* `"To take good pictures, patience and creativity are required."` *(Giải thích: 'To taking' ➔ 'To take', 'picture' ➔ 'pictures', 'is require' ➔ 'are required' bị động số nhiều).*  
  - *Lỗi chính tả (Original):* `"fotograph"` ➔ *Correction:* `"photograph"` *(Giải thích: Sai chữ 'f' thành 'ph').*  
  - *Lỗi chính tả (Original):* `"diferent"` ➔ *Correction:* `"different"` *(Giải thích: Thiếu chữ 'f').*
- **Kết luận rút ra (Key Takeaway):**  
  Hệ thống AI Scoring tự động phân loại chính xác 100% từng lỗi thành 2 nhóm riêng biệt: **Lỗi ngữ pháp** và **Lỗi chính tả**. Việc mắc 5 lỗi ngữ pháp/chính tả khiến điểm số bị hạ xuống `20/30`.

---

### 📌 PART 3 – Three questions (Test Run #10 - Science club - Masterpiece Run 28/30 C1 Level):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context:** *You are speaking to fellow members of the Science Club in a group chat. Respond to them in full sentences (30-40 words per answer).*
- **Bài làm thử nghiệm (Tối ưu độ dài 38 từ/câu + ví dụ cụ thể + từ vựng C1):**
  - Q1 (*Why did you decide to join our Science Club? How often can you go to the club?*):  
    `Hi there! I decided to join our Science Club to satisfy my scientific curiosity and conduct exciting hands-on experiments. Also, I am able to actively participate in all club meetings twice a week on Tuesday and Thursday afternoons.` *(38 từ)*
  - Q2 (*In the past, you learnt about Science in school. Do you remember something about Science?*):  
    `Yes, I vividly remember making a colorful 3D solar system model back in eighth grade. Watching those planet models rotate smoothly around the glowing sun deeply fascinated me and inspired my lifelong passion for discovering astronomy and physics.` *(38 từ)*
  - Q3 (*Who is your favorite inventor or scientist? Why?*):  
    `My favorite scientist is Albert Einstein because his groundbreaking theory of relativity completely revolutionized modern physics. His immense curiosity, creative thinking, and total dedication to scientific truth continue to inspire millions of young researchers across the whole world.` *(38 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `28/30` *(CEFR C1 Level - Điểm cao kỷ lục)*
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã trả lời rất tốt cả ba câu hỏi, đưa ra thông tin cụ thể và phát triển ý một cách rõ ràng.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp của bạn khá ổn, nhưng có một vài chỗ cần lưu ý nhỏ về cách dùng từ để câu văn tự nhiên hơn nhé.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng của bạn rất phong phú và phù hợp với chủ đề khoa học. Bạn sử dụng nhiều cụm từ hay như 'scientific curiosity', 'hands-on experiments' hay 'groundbreaking theory'.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Bài viết của bạn rất mạch lạc và dễ hiểu, các ý được sắp xếp hợp lý, giúp người đọc dễ dàng theo dõi.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Bạn nên kiểm tra lại các lỗi nhỏ về mạo từ và cách dùng từ để bài viết tự nhiên và hoàn chỉnh hơn nữa nha. Việc dùng dấu câu cũng quan trọng đó!*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Lỗi dấu câu (Original):* `"conduct exciting hands-on experiments"` ➔ *Correction:* `"conduct exciting hands-on experiments."` *(Giải thích: Thiếu dấu chấm ở cuối câu 1).*  
  - *Lỗi dùng từ (Original):* `"passion for discovering astronomy and physics"` ➔ *Correction:* `"passion for astronomy and physics"` *(Giải thích: Bỏ từ 'discovering' để collocation tự nhiên hơn).*  
  - *Lỗi dùng từ (Original):* `"across the whole world"` ➔ *Correction:* `"across the world"` *(Giải thích: Cụm 'across the world' tự nhiên hơn 'across the whole world').*
- **Kết luận rút ra (Key Takeaway):**  
  Test Run #10 lập kỷ lục cao nhất **`28/30` (Cấp độ CEFR C1)**. Đạt độ dài chuẩn 38 từ/câu, đưa ra ví dụ cá nhân chi tiết sinh động (`3D solar system model in 8th grade`, `Albert Einstein`, `theory of relativity`) và sử dụng thuật ngữ khoa học C1 xuất sắc giúp điểm Task Completion và Từ vựng đạt mức điểm tuyệt đối.

---

### 📌 PART 4 – Informal & Formal email (Test Run #1 - Art club - Perfect 30/30 C1 Level):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *The Art Club is organizing a talk to the public to attract more attention. We are going to invite an artist to give a talk to the members. As a member of our club, could you give us an artist to join our talk and what topic should they share to gain more attention? Especially, we would like to have more both young and elderly members.*
- **Bài làm thử nghiệm:**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Sam,`  
    `Have you heard about the upcoming public talk organized by our Art Club? I feel thrilled about this event! I plan to suggest inviting Vincent, a famous local painter who specializes in modern street art. I think his passion will inspire both young and older members. Let's discuss this further soon!`  
    `Best,`  
    `Alex` *(55 từ - Cảm xúc hào hứng + đề xuất họa sĩ & kế hoạch cụ thể)*
  - **Task 2 (Formal Email to President - 120-150 words):**  
    `Dear President,`  
    `I am writing to express my enthusiastic support for the upcoming public talk organized by the Art Club. This initiative is a commendable opportunity to enhance our club's visibility and foster community engagement across all generations.`  
    `To attract both young and elderly audiences, I respectfully suggest inviting Mr. Arthur Pendelton, a renowned landscape painter with extensive expertise in traditional oil painting and digital illustration. Regarding the topic, I recommend "Bridging Generations Through Art," focusing on how classical artistic techniques harmoniously merge with modern digital mediums. This theme would resonate deeply with senior members while captivating younger art enthusiasts.`  
    `Furthermore, conducting an interactive live demonstration followed by an open Q&A session would ensure an engaging experience for all attendees.`  
    `Thank you for considering my suggestions. I look forward to contributing to the success of this meaningful event.`  
    `Yours sincerely,`  
    `Alex Morgan` *(142 từ - Văn phong formal chuyên nghiệp, bố cục 4 đoạn chuẩn mực)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30` *(CEFR C1 Level - Điểm tuyệt đối)*
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Bạn đã hoàn thành rất tốt cả hai yêu cầu của đề bài. Cả hai email đều đáp ứng đầy đủ các thông tin cần thiết và đúng trọng tâm.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Bài viết của bạn không có lỗi ngữ pháp hay chính tả nào đáng kể, thể hiện sự chắc chắn trong việc sử dụng ngôn ngữ.*
- **Từ vựng (Vocabulary & Range):**  
  *Bạn đã sử dụng từ vựng phong phú, chính xác và phù hợp với từng ngữ cảnh (thân mật cho email bạn bè và trang trọng cho email chủ tịch câu lạc bộ). Điều này giúp bài viết trở nên chuyên nghiệp và thuyết phục.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Cả hai email đều có cấu trúc rõ ràng, ý tưởng được trình bày mạch lạc và có sự liên kết chặt chẽ giữa các câu, đoạn văn.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Đối với email formal, bạn đã sử dụng rất tốt các cấu trúc câu phức và từ vựng trang trọng. Để email thêm phần chuyên nghiệp, bạn có thể cân nhắc thêm một câu ngắn gọn ở cuối để bày tỏ mong muốn được thảo luận chi tiết hơn hoặc hỗ trợ thêm nếu cần.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):**  
  Part 4 đạt điểm tuyệt đối **`30/30`** khi tuân thủ nghiêm ngặt:
  1. Phân biệt rõ rệt 2 văn phong (Informal cho bạn bè & Formal cho Chủ tịch).
  2. Đáp ứng chuẩn độ dài (Task 1: ~50-55 từ, Task 2: ~140-145 từ).
  3. Cấu trúc email Formal chuẩn 4 đoạn (`Dear President,` -> `Mở bài` -> `Nội dung đề xuất giải quyết đủ 2 đối tượng người trẻ & người già` -> `Đề xuất hoạt động Q&A` -> `Kết bài & Yours sincerely`).

---

### 📌 PART 4 – Informal & Formal email (Test Run #2 - Book club - Wrong Register in Task 2):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *Dear member, From next month we will no longer be able to continue our offer of one free book every month. Also, because of problems with our delivery service, please expect a wait 4-6 weeks before your order arrives.*
- **Bài làm thử nghiệm (Cố tình dùng SAI VĂN PHONGở Task 2):**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Ben, Have you read the terrible update from our Book Club? I am so frustrated about losing our monthly free book and waiting up to six weeks for delivery! I plan to switch to e-books and call customer service tomorrow to complain. What about you? Cheers, Alex` *(48 từ - Chuẩn văn phong informal)*
  - **Task 2 (Formal Email to President - CỐ TÌNH SAI VĂN PHONG / TIẾNG LÓNG - 126 words):**  
    `Hey boss, I am writing this because I am super annoyed about the new club rules lol! Cancelling the free monthly book offer is a total bummer, and waiting 4 to 6 weeks for delivery is just crazy. Most of my close friends in the club are really mad about this terrible situation. I think u guys gotta fix this right now ASAP. U should definitely switch to a much better courier company because 6 weeks is way too slow for shipping. Also, u gonna give us discount vouchers or free digital e-books instead of taking away our monthly free books. If u don't change these bad rules soon, lots of members gonna quit the club for sure. Hope u fix it fast! See ya, Alex` *(126 từ - Đủ độ dài nhưng vi phạm nghiêm trọng văn phong Formal)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `20/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Email informal đã hoàn thành tốt nhiệm vụ. Email formal đã trình bày được các vấn đề và đề xuất giải pháp, tuy nhiên giọng điệu và cách diễn đạt hoàn toàn không phù hợp với một email trang trọng, khiến hiệu quả truyền đạt bị giảm sút.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Email informal không có lỗi. Email formal mắc rất nhiều lỗi ngữ pháp cơ bản như thiếu chủ ngữ, chia động từ sai, dùng văn nói, viết tắt.*
- **Từ vựng (Vocabulary & Range):**  
  *Email formal sử dụng rất nhiều từ ngữ thân mật, tiếng lóng và viết tắt (super annoyed, lol, bummer, crazy, u guys gotta, gonna, See ya) không phù hợp.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Đối với email formal, nên bắt đầu bằng lý do viết thư, trình bày cảm xúc khách quan, đưa ra đề xuất mang tính xây dựng. Tránh hoàn toàn việc sử dụng tiếng lóng, từ viết tắt và văn nói.*
- **Thẻ lỗi cần sửa (8 Thẻ lỗi Register & Ngữ pháp chi tiết):**  
  - *Original:* `"I am writing this because I am super annoyed about the new club rules lol!"` ➔ *Correction:* `"I am writing to express my strong dissatisfaction with the new club rules."`  
  - *Original:* `"Cancelling the free monthly book offer is a total bummer, and waiting 4 to 6 weeks for delivery is just crazy."` ➔ *Correction:* `"The cancellation of the free monthly book offer is highly disappointing, and the extended waiting period of 4 to 6 weeks for delivery is unacceptable."`  
  - *Original:* `"Most of my close friends in the club are really mad..."` ➔ *Correction:* `"Many members, including myself, are deeply concerned about this regrettable situation."`  
  - *Original:* `"I think u guys gotta fix this right now ASAP."` ➔ *Correction:* `"I believe the club needs to address this issue promptly."`  
  - *Original:* `"Also, u gonna give us..."` ➔ *Correction:* `"Furthermore, I suggest providing..."`  
  - *Original:* `"If u don't change these bad rules soon, lots of members gonna quit..."` ➔ *Correction:* `"If these unsatisfactory changes are not reconsidered soon, there is a high risk of losing a significant number of club members."`  
  - *Original:* `"Hope u fix it fast!"` ➔ *Correction:* `"I hope this matter will be resolved swiftly."`  
  - *Original:* `"See ya,"` ➔ *Correction:* `"Sincerely,"`
- **Kết luận rút ra (Key Takeaway):**  
  Mặc dù bài làm đáp ứng 100% về độ dài (Task 1: 48 từ, Task 2: 126 từ) và giải quyết đúng yêu cầu đề bài, nhưng việc vi phạm quy chuẩn văn phong Formal Email (tiếng lóng, viết tắt, văn nói) khiến bài viết bị hạ điểm nặng từ `30/30` xuống `20/30` và bị AI gắn đồng loạt 8 Thẻ lỗi Register.

---

### 📌 PART 4 – Informal & Formal email (Test Run #3 - Fitness club - Under-length Task 2 62 words):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *Some equipment in the club is old and needs to be replaced. Our club is planning to hold a sponsorship event to raise money for the upgrade of sports equipment. On the other hand, there are also some opinions that the club should increase the membership fee to 50%.*
- **Bài làm thử nghiệm (Thiếu độ dài ở Task 2 - 62 từ):**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Emma, Did you see the message about upgrading our club equipment? I feel quite worried about the proposed 50% fee increase because it is too expensive! I plan to support holding the sponsorship event instead. Let me know what you think when we meet tomorrow. Best, Alex` *(48 từ - Đủ mốc ~50 từ)*
  - **Task 2 (Formal Email to President - CỐ TÌNH THIẾU ĐỘ DÀI - 62 words):**  
    `Dear President, I am writing regarding the upcoming equipment upgrade. While I agree that old equipment needs replacement, I am deeply concerned about increasing the membership fee by 50%, which might force members to leave. Instead, I strongly support holding a sponsorship event to raise funds without placing financial burdens on current members. Thank you for your consideration. Yours sincerely, Alex Morgan` *(62 từ - Thiếu ~60 từ so với mốc 120-150 từ)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `26/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Email informal hoàn thành tốt nhiệm vụ. Email formal thể hiện quan điểm và đề xuất giải pháp, tuy nhiên cần phát triển thêm ý để đạt độ dài và tính thuyết phục cao hơn.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Email informal không có lỗi. Email formal có một vài lỗi nhỏ về cách dùng từ và diễn đạt câu.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng được sử dụng phù hợp với từng văn phong. Để email formal thêm thuyết phục, nên sử dụng từ vựng đa dạng hơn.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Đối với email formal, nên cấu trúc lại các đoạn văn để mỗi đoạn tập trung vào một ý chính (Đoạn 1 nêu vấn đề & mối quan ngại, Đoạn 2 đề xuất giải pháp & lợi ích).*
- **Thẻ lỗi cần sửa (2 Lỗi diễn đạt tinh tế):**  
  - *Original:* `", which might force members to leave."` ➔ *Correction:* `", as this might force members to leave."` *(Giải thích: Dùng 'as' hoặc 'because' giải thích lý do thay cho 'which').*  
  - *Original:* `"holding a sponsorship event..."` ➔ *Correction:* `"the proposal of holding a sponsorship event... undue financial burdens"` *(Giải thích: Thêm 'the proposal of' và 'undue' để nhấn mạnh gánh nặng tài chính không đáng có).*
- **Kết luận rút ra (Key Takeaway):**  
  Khi Task 2 chỉ viết 62 từ (bị thiếu ~60 từ so me với mốc 120-150 từ) nhưng 100% đúng văn phong formal và đúng ngữ pháp, AI chỉ hạ nhẹ điểm xuống `26/30` (trừ 4 điểm ở Task Completion & độ dài).

---

### 📌 PART 4 – Informal & Formal email (Test Run #4 - Travel club - 5 Grammar & Spelling Errors in Task 2):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *Our club is planning to encourage tourists to visit an area. We also want visitors coming to our areas to behave politely. Please raise your voice and give some suggestions for this plan.*
- **Bài làm thử nghiệm (Mắc 5 lỗi Ngữ pháp & Chính tả ở Task 2):**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Lucas, Have you heard about our Travel Club's new plan to encourage tourism while promoting polite behavior among visitors? I feel very enthusiastic about this initiative! I plan to suggest creating colorful rule brochures for tourists. Let me know what you think when we meet tomorrow. Best, Alex` *(49 từ - Không mắc lỗi)*
  - **Task 2 (Formal Email to President - CỐ TÌNH MẮC 5 LỖI NGỮ PHÁP & CHÍNH TẢ - 120 words):**  
    `Dear President, I am write to express my enthusiastic support for the new campaign to attract more tourist to our area while encouraging respectful behavior. This project is a great opportunity to promote local culture and boost our economy effectively. To ensure visitors behave politely, I respectfully suggest creating informative guidebooks containing clear rules about local customs. These brochures should be distributed at airport visitor centers and popular hotels. In addition, placing polite signboards at famous historic sites is provide helpful informasion for international travelers. Furthermore, our club should consider organizing community workshops for discussing about cultural awareness before peak holiday seasons. Thank you for considering my suggestions. I look forward to supporting this meaningful project. Yours sincerely, Alex Morgan` *(120 từ - Đủ độ dài nhưng chứa 5 lỗi ngữ pháp & chính tả)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `24/30`
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Email informal hoàn thành tốt nhiệm vụ. Email formal đã đưa ra các đề xuất hợp lý nhưng cần phát triển thêm một số ý để đạt độ dài và chi tiết hơn.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Email formal mắc khá nhiều lỗi ngữ pháp cơ bản như chia động từ, dùng sai cấu trúc câu, thiếu mạo từ, dùng từ sai (informasion).*
- **Từ vựng (Vocabulary & Range):**  
  *Email formal đã có ý thức dùng từ trang trọng nhưng đôi chỗ còn chưa chính xác hoặc mắc lỗi chính tả.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Nên sử dụng các cụm từ trang trọng hơn để đưa ra đề xuất (vd: 'I would like to propose', 'It is imperative that...').*
- **Thẻ lỗi cần sửa (6 Thẻ lỗi Ngữ pháp & Chính tả chi tiết):**  
  - *Original:* `"I am write to express..."` ➔ *Correction:* `"I am writing to express..."` *(Giải thích: Sai thì, 'am' phải đi với V-ing).*  
  - *Original:* `"attract more tourist to our area"` ➔ *Correction:* `"attract more tourists to our area"` *(Giải thích: 'Tourist' đếm được sau 'more' phải dùng số nhiều).*  
  - *Original:* `"is a great opportunity..."` ➔ *Correction:* `"presents a great opportunity..."` *(Giải thích: Dùng 'presents' trang trọng hơn 'is').*  
  - *Original:* `"is provide helpful informasion..."` ➔ *Correction:* `"can provide helpful information..."` *(Giải thích: Sai cấu trúc 'is provide' & sai chính tả 'informasion').*  
  - *Original:* `"for discussing about cultural awareness"` ➔ *Correction:* `"to discuss cultural awareness"` *(Giải thích: Dùng 'to discuss', cụm 'discuss about' thừa 'about').*  
  - *Original:* `"informasion"` ➔ *Correction:* `"information"` *(Giải thích: Lỗi chính tả).*
- **Kết luận rút ra (Key Takeaway):**  
  Hệ thống AI Scoring phát hiện chính xác 100% tất cả các lỗi gài vào (*I am write*, *more tourist*, *is provide*, *discussing about*, *informasion*) và tự động đưa ra phương án đính chính chuẩn mực, hạ điểm xuống `24/30`.

---

### 📌 PART 4 – Informal & Formal email (Test Run #5 - Music club - Omitting Key Requirement):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *The club organizes music events for everyone who loves listening to music to join the club. We want this event to be accessible to both young and old, please give your thoughts and solutions for this idea.*
- **Bài làm thử nghiệm (Bỏ sót yêu cầu người lớn tuổi ở Task 2):**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Chloe, Have you heard about our Music Club's upcoming music event? I feel super thrilled about this idea! I plan to suggest including diverse music genres so that both young people and elderly members can enjoy it. Let's meet tomorrow to share more ideas! Best, Alex` *(47 từ - Đủ mốc ~50 từ, trả lời đủ 2 đối tượng)*
  - **Task 2 (Formal Email to President - CỐ TÌNH BỎ QUÊN NGƯỜI LỚN TUỔI - 127 words):**  
    `Dear President, I am writing to express my enthusiastic support for the upcoming music event organized by our Music Club. This initiative is a wonderful opportunity to enhance our club's vitality and attract dynamic music lovers. To maximize attendance, I respectfully suggest inviting popular youth indie bands and modern DJ performers who specialize in electronic dance music. Regarding ticketing and promotion, we should focus entirely on online platforms such as TikTok and Instagram, where young people spend most of their leisure time. Furthermore, scheduling the event late on Friday night with vibrant strobe lights will create an exciting party atmosphere that younger audiences will absolutely love. Thank you for considering my suggestions. I look forward to contributing to the success of this event. Yours sincerely, Alex Morgan` *(127 từ - Đủ độ dài & đúng văn phong formal nhưng hoàn toàn bỏ qua đối tượng người lớn tuổi)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `19/30` *(Mức hạ điểm nặng nhất khi bài 100% đúng ngữ pháp)*
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Email informal đáp ứng tốt. Tuy nhiên, email formal đã hoàn toàn đi sai trọng tâm. Đề bài yêu cầu sự kiện phải "accessible to both young and old", nhưng bạn lại tập trung hoàn toàn vào việc thu hút người trẻ tuổi, bỏ qua đối tượng người lớn tuổi.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Ngữ pháp trong cả 2 email rất tốt, không có lỗi đáng kể.*
- **Từ vựng (Vocabulary & Range):**  
  *Việc sử dụng các từ như "strobe lights" hay "electronic dance music" không phù hợp với mục tiêu bao quát cả người lớn tuổi của câu lạc bộ. Dùng từ "dynamic" chưa đúng ngữ cảnh.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Email formal có mạch lạc về mặt cấu trúc câu, nhưng vì nội dung đi sai trọng tâm nên tính mạch lạc tổng thể bị ảnh hưởng.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Đảm bảo các đề xuất phải hướng đến cả 2 đối tượng (trẻ và già). Có thể gợi ý các dòng nhạc đa dạng (cổ điển, dân gian, nhạc nhẹ), không gian thoải mái hoặc giao lưu liên thế hệ.*
- **Thẻ lỗi cần sửa (Corrections):**  
  - *Original:* `"To maximize attendance, I respectfully suggest inviting popular youth indie bands..."` ➔ *Correction:* `"To maximize attendance, I respectfully suggest inviting popular indie bands..."` *(Giải thích: Lỗi diễn đạt & không đáp ứng yêu cầu "accessible to both young and old").*
- **Kết luận rút ra (Key Takeaway):**  
  Khi bài làm 100% đúng ngữ pháp, 100% đúng văn phong formal và đúng độ dài (127 từ), nhưng **bỏ sót 1 yêu cầu trọng tâm của đề bài** (bỏ qua người lớn tuổi), AI Scoring lập tức phạt nặng điểm Task Completion và Từ vựng, khiến điểm số rơi xuống `19/30`!

---

### 📌 PART 4 – Informal & Formal email (Test Run #6 - Music club - Re-Test Masterpiece 30/30 C1 Level):

**1. Đề bài & Bài làm thử nghiệm:**
- **Context / Đề bài:**  
  *The club organizes music events for everyone who loves listening to music to join the club. We want this event to be accessible to both young and old, please give your thoughts and solutions for this idea.*
- **Bài làm thử nghiệm (Khắc phục hoàn toàn lỗi Run #5 + Cân bằng đủ 2 đối tượng):**
  - **Task 1 (Informal Email to a friend - ~50 words):**  
    `Hi Chloe, Have you heard about our Music Club's upcoming music event? I feel super thrilled about this idea! I plan to suggest including diverse music genres so that both young people and elderly members can enjoy it. Let's meet tomorrow evening to share more ideas! Best, Alex` *(52 từ - Thần thái hào hứng, ngắn gọn)*
  - **Task 2 (Formal Email to President - CẢI TIẾN MASTERPIECE - 145 words):**  
    `Dear President, I am writing to share my enthusiastic support for the upcoming music event organized by our Music Club. I believe this initiative is a wonderful opportunity to bring people of different generations together through music. To ensure the event is accessible to both young and elderly members, I respectfully propose featuring a diverse musical program that combines classical pieces, traditional folk songs, and gentle acoustic pop. Regarding the venue, we should choose an accessible location with comfortable seating, clear acoustics, and moderate volume levels to accommodate senior attendees. Furthermore, offering flexible ticketing options—both online for younger members and directly at the club desk for older guests—would ensure maximum convenience. Thank you for considering my suggestions. I look forward to contributing to the success of this meaningful occasion. Yours sincerely, Alex Morgan` *(145 từ - Văn phong formal chuẩn mực, đề xuất toàn diện cho cả 2 lứa tuổi)*

**2. 🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30` *(CEFR C1 Level - Điểm tuyệt đối)*
- **Hoàn thành nhiệm vụ (Task Completion):**  
  *Cả hai email đều hoàn thành tốt nhiệm vụ được giao. Email informal bày tỏ cảm xúc và kế hoạch rõ ràng. Email formal thể hiện sự ủng hộ và đưa ra các đề xuất chi tiết, phù hợp với yêu cầu về độ dài và văn phong.*
- **Ngữ pháp & chính tả (Grammar & Spelling):**  
  *Bài viết không mắc lỗi ngữ pháp hay chính tả nghiêm trọng nào, cho thấy khả năng sử dụng ngôn ngữ rất tốt.*
- **Từ vựng (Vocabulary & Range):**  
  *Từ vựng được sử dụng phong phú, chính xác và phù hợp với từng văn cảnh (thân mật cho email informal và trang trọng cho email formal). Sự lựa chọn từ ngữ rất tự nhiên và hiệu quả.*
- **Mạch lạc (Coherence & Cohesion):**  
  *Cả hai email đều có cấu trúc rõ ràng, các ý được sắp xếp hợp lý và liên kết chặt chẽ với nhau.*
- **Gợi ý nâng cao (Advanced Suggestions):**  
  *Sử dụng rất tốt các cụm từ trang trọng và cấu trúc câu phức tạp để thể hiện sự lịch sự và chuyên nghiệp.*
- **Thẻ lỗi cần sửa (Corrections):** Không có (0 lỗi).
- **Kết luận rút ra (Key Takeaway):**  
  Khắc phục triệt để lỗi bỏ sót của Run #5 bằng cách phát triển đề xuất toàn diện cho cả 2 nhóm đối tượng (`classical & folk music`, `comfortable seating`, `moderate volume`, `flexible online/desk ticketing`) giúp điểm số nhảy vọt từ **`19/30` trở lại điểm tuyệt đối `30/30`**.

---

## 4. Định Dạng Data JSON API Trả Về (AI Response JSON Schema)

Để Frontend render giao diện kết quả đẹp mắt và nhất quán, backend/AI Service sẽ trả về dữ liệu theo cấu trúc JSON chuẩn dưới đây:

```json
{
  "part": "part1",
  "score": 24,
  "maxScore": 30,
  "cefrLevel": "B1",
  "taskCompletion": {
    "status": "warning",
    "summary": "Bạn đã trả lời đầy đủ các câu hỏi được đưa ra, tuy nhiên câu trả lời cho câu số 2 chưa thực sự phù hợp với câu hỏi về loại hình nghệ thuật.",
    "details": [
      { "questionIndex": 1, "isCorrect": true, "note": "Trả lời đúng trọng tâm." },
      { "questionIndex": 2, "isCorrect": false, "note": "'Science' là môn khoa học, không phải loại hình nghệ thuật (gợi ý: Modern art, Painting, Sculpture...)." },
      { "questionIndex": 3, "isCorrect": true, "note": "Trả lời đúng mốc thời gian." },
      { "questionIndex": 4, "isCorrect": true, "note": "Trả lời đúng tên họa sĩ." },
      { "questionIndex": 5, "isCorrect": true, "note": "Trả lời đúng hoạt động giải trí." }
    ]
  },
  "grammarAndSpelling": {
    "status": "success",
    "summary": "Các câu trả lời của bạn đều đúng ngữ pháp và không mắc lỗi chính tả.",
    "corrections": []
  },
  "vocabulary": {
    "status": "info",
    "summary": "Bạn sử dụng từ vựng đơn giản, phù hợp với yêu cầu của phần này.",
    "suggestions": ["Có thể dùng các cụm từ phong phú hơn như 'I am passionate about drawing' hoặc 'Oil paintings'."]
  }
}
```

---

## 5. Cấu Trúc System Prompt Cho LLM (Prompt Engineering Template)

Dưới đây là mẫu System Prompt chuẩn để gửi yêu cầu chấm điểm đến OpenAI / Gemini / Claude API:

```markdown
SYSTEM PROMPT:
You are an expert Aptis Writing examiner. Analyze the user's responses for Aptis Writing [PART_NUMBER] and evaluate them strictly according to CEFR criteria (A1 to C1).

Provide the output in valid JSON format matching the schema below:
{
  "score": number (0 to MAX_SCORE),
  "maxScore": number,
  "cefrLevel": "A1" | "A2" | "B1" | "B2" | "C1",
  "taskCompletionSummary": "Detailed Vietnamese feedback on task completion and accuracy of answers",
  "grammarSummary": "Detailed Vietnamese feedback on grammar correctness and spelling",
  "vocabularySummary": "Detailed Vietnamese feedback on vocabulary choice, tone, and appropriateness"
}

EVALUATION RULES FOR PART 1:
1. Task completion: Check if each answer directly addresses the question asked.
2. Grammar & Spelling: Ensure words are spelled correctly and basic sentence structure is valid.
3. Vocabulary: Assess if vocabulary used is suitable for short personal responses.
```

---

## 6. Lộ Trình Triển Khai Tính Năng (Implementation Roadmap)

1. **Bước 1 (UI View & Layout)**: Thiết kế giao diện nhập liệu bài viết cho từng Part và màn hình hiển thị kết quả chấm điểm.
2. **Bước 2 (API & AI Service)**: Xây dựng endpoint API nhận bài làm từ Frontend, gửi cho LLM Engine (Gemini / OpenAI API) kèm System Prompt chuẩn.
3. **Bước 3 (Render Card Kết Quả)**: Nhận kết quả JSON từ AI và render 3 thẻ phản hồi (*Hoàn thành nhiệm vụ*, *Ngữ pháp & chính tả*, *Từ vựng*) kèm điểm số và cấp độ CEFR.
