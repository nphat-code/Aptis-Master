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

## 3. Nhật Ký Thử Nghiệm Chấm Điểm AI Thực Tế (Live Testing Log - 5 Runs Per Part)

### 📌 PART 1 – Short answers (Test Run #1 - Beautiful homes club):

**Đề bài & Bài làm thử nghiệm:**
1. *What is your favorite time of the year?* ➔ **User:** `I love autumn.` *(Đúng)*
2. *What is your favorite sport?* ➔ **User:** `Tennis is my favorite.` *(Đúng)*
3. *Where do you wanna go on holiday?* ➔ **User:** `I want to go Tokyo.` *(Thiếu giới từ "to")*
4. *What is the weather today?* ➔ **User:** `It is hot and sunny.` *(Đúng)*
5. *What do you like to do in the evening?* ➔ **User:** `I like blue colors.` *(Lạc đề: hỏi hoạt động buổi tối, trả lời màu sắc)*

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng yêu cầu của 4/5 câu hỏi. Tuy nhiên, câu 5 trả lời chưa đúng với câu hỏi về hoạt động yêu thích vào buổi tối.*
- **Ngữ pháp & chính tả:**  
  *Bạn có một lỗi nhỏ về ngữ pháp khi thiếu giới từ "to" trước tên địa điểm trong câu 3. Các câu còn lại đúng ngữ pháp và chính tả.*
- **Từ vựng:**  
  *Từ vựng bạn sử dụng đơn giản, phù hợp với Part 1 của bài thi.*
- **Danh sách lỗi cần sửa (Grammar Correction Card):**  
  - *Original:* `"I want to go Tokyo."` ➔ *Correction:* `"I want to go to Tokyo."`  
  - *Lỗi ngữ pháp:* Thiếu giới từ "to" trước tên địa điểm.

---

### 📌 PART 1 – Short answers (Test Run #2 - Book club):

**Đề bài & Bài làm thử nghiệm:**
1. *What's your favorite hobby?* ➔ **User:** `I enjoy reading fantasy books.` *(Đúng)*
2. *How do you get to work?* ➔ **User:** `I commute by public bus.` *(Đúng)*
3. *What do you like to do in the evening?* ➔ **User:** `I read books at home.` *(Đúng)*
4. *What kinds of movies do you like?* ➔ **User:** `I prefer watching action films.` *(Đúng)*
5. *What's your favorite food?* ➔ **User:** `My favorite food is pizza.` *(Đúng)*

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đầy đủ và trực tiếp cho cả 5 câu hỏi, thể hiện rõ sở thích và thông tin cá nhân.*
- **Ngữ pháp & chính tả:**  
  *Các câu trả lời đều đúng ngữ pháp và không có lỗi chính tả.*
- **Từ vựng:**  
  *Bạn sử dụng từ vựng phù hợp và rõ ràng để diễn đạt ý.*
- **Danh sách lỗi cần sửa:** Không có (0 lỗi).

---

### 📌 PART 1 – Short answers (Test Run #3 - Music club):

**Đề bài & Bài làm thử nghiệm:**
1. *How many people in your family?* ➔ **User:** `There are four people.` *(Đúng)*
2. *What is your hobby?* ➔ **User:** `I love listning music.` *(Sai chính tả 'listning' & thiếu giới từ 'to')*
3. *What did you eat for lunch?* ➔ **User:** `I ate delicious piza.` *(Sai chính tả 'piza')*
4. *How do you get to work?* ➔ **User:** `I go by motorbike.` *(Đúng)*
5. *What kind of music do you like?* ➔ **User:** `I love pop music.` *(Đúng)*

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ:**  
  *Học viên đã trả lời đầy đủ 5 câu hỏi và các câu trả lời đều bám sát nội dung yêu cầu của đề bài.*
- **Ngữ pháp & chính tả:**  
  *Có một vài lỗi nhỏ về chính tả và ngữ pháp. Cụ thể, học viên đã mắc lỗi chính tả ở từ "listening" và "pizza". Ngoài ra, câu thứ hai còn thiếu giới từ "to" sau "listening".*
- **Từ vựng:**  
  *Học viên sử dụng từ vựng đơn giản, phù hợp với Part 1 của bài thi. Các từ được dùng đúng ngữ cảnh.*
- **Danh sách lỗi cần sửa (Grammar & Spelling Correction Cards):**  
  - *Lỗi ngữ pháp:* `"I love listning music."` ➔ `"I love listening to music."` *(Thiếu giới từ 'to' sau 'listening' và sửa 'listning' thành 'listening')*
  - *Lỗi chính tả:* `"listning"` ➔ `"listening"` *(Sai chính tả từ 'listening')*
  - *Lỗi chính tả:* `"piza"` ➔ `"pizza"` *(Sai chính tả từ 'pizza')*

---

### 📌 PART 1 – Short answers (Test Run #4 - Business club - Single-word answers):

**Đề bài & Bài làm thử nghiệm:**
1. *What is your hobby?* ➔ **User:** `Reading` *(1 từ - Đúng)*
2. *What is your favourite food?* ➔ **User:** `Pizza` *(1 từ - Đúng)*
3. *What is your favourite time of a day?* ➔ **User:** `Evening` *(1 từ - Đúng)*
4. *How do you get to work?* ➔ **User:** `Bus` *(1 từ - Đúng)*
5. *Where are you from?* ➔ **User:** `Tokyo` *(1 từ - Đúng)*

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng và đầy đủ các câu hỏi được đưa ra.*
- **Ngữ pháp & chính tả:**  
  *Các câu trả lời không có lỗi ngữ pháp hay chính tả.*
- **Từ vựng:**  
  *Bạn đã sử dụng từ vựng phù hợp và chính xác cho từng câu trả lời.*
- **Kết luận rút ra:** Trong Part 1, câu trả lời dạng 1 từ (Short answers) hoàn toàn đạt điểm tối đa `30/30`, không bắt buộc phải viết thành câu đầy đủ (*I live in...*).

---

### 📌 PART 1 – Short answers (Test Run #5 - Car club - Blank/Empty answers):

**Đề bài & Bài làm thử nghiệm:**
1. *What is your favourite color?* ➔ **User:** `Blue is my favourite.` *(Đúng)*
2. *What is the weather today?* ➔ **User:** `It is hot and sunny.` *(Đúng)*
3. *How are you today?* ➔ **User:** `I am fine, thanks.` *(Đúng)*
4. *Question 4* ➔ **User:** ` ` *(Để trống)*
5. *Question 5* ➔ **User:** ` ` *(Để trống)*

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn mới trả lời 3/5 câu hỏi, để trống 2 câu cuối.*
- **Ngữ pháp & chính tả:**  
  *Tất cả các câu trả lời đều đúng ngữ pháp và không có lỗi chính tả.*
- **Từ vựng:**  
  *Từ vựng đơn giản, phù hợp với ngữ cảnh và yêu cầu của phần 1.*
- **Kết luận rút ra:** Trả lời đúng 3/5 câu và bỏ trống 2 câu còn lại nhận điểm quy đổi chính xác `18/30` ($3/5 = 60\% = 18/30$).

---

### 📌 PART 2 – Social media response (Test Run #1 - Art club - High quality 26 words):

**Đề bài:** *Now you've become a new member of the Art Club. Fill in the form. Write in sentences. Use 20-30 words. Tell me a painting or a photo that you like.*

**Bài làm thử nghiệm (26 từ):**  
`I really like the painting Starry Night by Vincent van Gogh because the swirling stars and vibrant blue colors make me feel very peaceful and inspired.`

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `28/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi, nêu rõ tác phẩm yêu thích và lý do rất cụ thể. Nội dung đầy đủ và mạch lạc.*
- **Ngữ pháp & chính tả:**  
  *Ngữ pháp của bạn khá tốt, chỉ có một lỗi nhỏ về cách dùng dấu câu trước 'because' khiến câu hơi dài. Các lỗi chính tả không đáng kể.*
- **Từ vựng:**  
  *Bạn dùng từ rất hay và chính xác, đặc biệt là các từ như 'swirling', 'vibrant', 'peaceful' và 'inspired' giúp diễn tả cảm xúc rất tốt.*
- **Gợi ý nâng cao (Advanced Suggestion):**  
  *Để câu văn mượt mà hơn, bạn có thể tách câu dài thành hai câu ngắn hoặc dùng dấu phẩy nếu muốn giữ nguyên cấu trúc.*
- **Thẻ lỗi cần sửa:**  
  - *Lỗi ngữ pháp:* `"the painting Starry Night by Vincent van Gogh because"` ➔ `" 'Starry Night' by Vincent van Gogh. Because"`  
  - *Giải thích:* Nên tách mệnh đề chỉ nguyên nhân nếu câu quá dài.

---

### 📌 PART 2 – Social media response (Test Run #2 - Beautiful homes club - Short response 11 words):

**Đề bài:** *Now you've become a new member of the Beautiful Homes Club. Fill in the form. Write in sentences. Use 20-30 words. Why do you want to join beautiful homes club?*

**Bài làm thử nghiệm (11 từ - Dưới 20 từ):**  
`I want to join to make my house beautiful and clean.`

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `18/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi. Tuy nhiên, câu trả lời của bạn hơi ngắn so với yêu cầu 20-30 từ của đề bài nhé. Mình cần phát triển thêm ý để đạt đủ số lượng từ.*
- **Ngữ pháp & chính tả:**  
  *Ngữ pháp và chính tả của bạn đều tốt, không có lỗi sai nào.*
- **Từ vựng:**  
  *Bạn dùng từ vựng phù hợp và rõ nghĩa, dễ hiểu.*
- **Kết luận rút ra:** Trong Part 2, viết đúng ngữ pháp nhưng thiếu độ dài (chỉ có 11 từ / yêu cầu 20-30 từ) sẽ bị trừ điểm Task Completion xuống còn `18/30`.

---

### 📌 PART 2 – Social media response (Test Run #3 - Book club - Over-length 39 words):

**Đề bài:** *Now you've become a new member of the Book Club. Fill in the form. Write in sentences. Use 20-30 words. How do you find research materials?*

**Bài làm thử nghiệm (39 từ - Vượt quá 30 từ):**  
`To find these resources, I usually search our university library catalogue and explore online databases such as Google Scholar. Additionally, I always ask my professors for recommendations on relevant academic journals and textbooks to support my final graduation thesis.`

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `25/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng câu hỏi và cung cấp thông tin khá chi tiết về cách bạn tìm tài liệu. Các ý tưởng được phát triển hợp lý và rõ ràng. Tuy nhiên, bài viết của bạn hơi dài một chút so với giới hạn 20-30 từ cho Part 2.*
- **Ngữ pháp & chính tả:**  
  *Ngữ pháp của bạn rất tốt, chỉ có một lỗi nhỏ về cách dùng từ "such as" ở đây, đáng lẽ nên dùng "like" sẽ tự nhiên hơn. Không có lỗi chính tả nào cả.*
- **Từ vựng:**  
  *Bạn đã dùng các từ vựng học thuật rất phù hợp và tự nhiên, cho thấy vốn từ của bạn khá tốt.*
- **Mạch lạc (Coherence):**  
  *Bài viết của bạn rất mạch lạc, các câu được nối với nhau một cách tự nhiên và logic.*
- **Gợi ý nâng cao:**  
  *Ở Part 2, mình cần cố gắng viết thật ngắn gọn và súc tích để đạt được yêu cầu về số lượng từ nha. Bạn có thể thử kết hợp hoặc rút gọn một số ý để bài viết vừa đủ thông tin mà vẫn nằm trong giới hạn từ.*
- **Thẻ lỗi cần sửa:**  
  - *Lỗi ngữ pháp/dùng từ:* `"such as Google Scholar"` ➔ `"like Google Scholar"`  
  - *Giải thích:* Lỗi dùng từ sai nghĩa khi lấy ví dụ cụ thể.

---

### 📌 PART 2 – Social media response (Test Run #4 - Art club - Perfect 21 words 30/30):

**Đề bài:** *Now you've become a new member of the Art Club. Fill in the form. Write in sentences. Use 20-30 words. Tell me a painting or a photo that you like.*

**Bài làm thử nghiệm (21 từ - Đạt chuẩn 20-30 từ):**  
`I really like the Mona Lisa painting by Leonardo da Vinci because of her mysterious smile and the beautiful landscape background.`

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `30/30`
- **Hoàn thành nhiệm vụ:**  
  *Bạn đã trả lời đúng trọng tâm câu hỏi, nêu rõ bức tranh yêu thích (Mona Lisa) và lý do yêu thích. Nội dung đầy đủ và mạch lạc.*
- **Ngữ pháp & chính tả:**  
  *Ngữ pháp và chính tả của bạn rất tốt, không có lỗi sai nào.*
- **Từ vựng:**  
  *Bạn dùng từ vựng phù hợp, chính xác và diễn đạt tự nhiên.*
- **Mạch lạc:**  
  *Các câu liên kết mượt mà và logic.*
- **Kết luận rút ra:** Khi viết trong khoảng 20-30 từ (ở đây là 21 từ) với cấu trúc câu ngắn gọn, đúng ngữ pháp và trả lời đầy đủ ý thì đạt điểm tuyệt đối `30/30`.

---

### 📌 PART 2 – Social media response (Test Run #5 - Book club - Completely Off-topic 14/30):

**Đề bài:** *Now you've become a new member of the Book Club. Fill in the form. Write in sentences. Use 20-30 words. (Context: I am a final year student so I need to find a research a lot of materials such as books and scientific journals).*

**Bài làm thử nghiệm (20 từ - Lạc đề hoàn toàn về đồ ăn):**  
`I really love eating delicious pepperoni pizza with extra cheese and drinking cold iced tea with my friends every weekend.`

**🤖 AI Output Trả Về Thực Tế:**
- **Điểm số:** `14/30`
- **Hoàn thành nhiệm vụ:**  
  *Bài của bạn hoàn toàn lạc đề rồi. Đề bài yêu cầu bạn giới thiệu về lý do tham gia Book Club và nhu cầu tìm tài liệu cho việc học, chứ không phải nói về sở thích ăn uống, đi chơi nha.*
- **Ngữ pháp & chính tả:**  
  *Ngữ pháp và chính tả của bạn không có lỗi sai nào.*
- **Từ vựng:**  
  *Từ vựng bạn dùng khá đơn giản và phù hợp với một cuộc trò chuyện thông thường.*
- **Kết luận rút ra:** Khi bài làm viết đúng ngữ pháp nhưng **hoàn toàn lạc đề**, AI sẽ đánh giá nghiêm trọng phần Task Completion và hạ điểm xuống còn `14/30`.

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
