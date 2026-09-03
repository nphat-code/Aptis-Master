# Aptis Writing Test Cases & Benchmark Dataset

Tài liệu này lưu trữ toàn bộ các bộ Test Case chuẩn dùng để kiểm thử (manual test & automated test) tính năng chấm thi AI cho kỹ năng **Writing (Part 1, Part 2, Part 3, Part 4)** theo chuẩn British Council CEFR (A0 – C1).

---

## 🎨 BỘ ĐỀ CHUẨN: Writing Part 1 – Topic: Art Club

> **Đề bài**: You want to join an art club. You have 5 messages from a member of the club. Write short answers (1–5 words) to each message. Recommended time: 3 minutes.
>
> - **Q1**: `How are you?`
> - **Q2**: `Which is your favorite season?`
> - **Q3**: `Which sports is the most popular in your country?`
> - **Q4**: `What are you wearing today?`
> - **Q5**: `What is your favorite kind of music?`

---

### 🏆 NHÓM 1: Thí Sinh Chuẩn Mực & Xuất Sắc (Band B2 – C1 | 9 – 10/10 Điểm)

#### 📋 TC-01: Câu hoàn chỉnh tự nhiên (Full Sentence, 3–5 từ)
* **Mục tiêu**: Kiểm tra khả năng nhận diện câu trả lời hoàn chỉnh, đúng ngữ pháp và trong giới hạn 1–5 từ.
* **Input**:
  - `Q1`: `I am very well.` (4 từ)
  - `Q2`: `Autumn.` (1 từ)
  - `Q3`: `Football is the most popular.` (5 từ)
  - `Q4`: `A white T-shirt and jeans.` (5 từ)
  - `Q5`: `Pop and classical music.` (4 từ)
* **Kỳ vọng**:
  - **Điểm**: `10/10` | **CEFR**: `C1` | **Star**: `Excellent`
  - **5 Tiêu chí**: `tf: 5`, `gra: 5`, `vra: 5`, `cc: 5`, `reg: 5`
  - **Lỗi**: `0 lỗi`

#### 📋 TC-02: Cụm từ ngắn gọn phong cách giao tiếp (Phrase Style, 1–4 từ)
* **Mục tiêu**: Kiểm tra câu trả lời dạng cụm danh từ/tính từ không cần đầy đủ chủ-vị nhưng tự nhiên.
* **Input**:
  - `Q1`: `Great, thanks!` (2 từ)
  - `Q2`: `Spring, because of flowers.` (4 từ)
  - `Q3`: `Definitely football.` (2 từ)
  - `Q4`: `Yellow dress and sneakers.` (4 từ)
  - `Q5`: `Indie acoustic pop.` (3 từ)
* **Kỳ vọng**:
  - **Điểm**: `10/10` | **CEFR**: `C1` | **Star**: `Excellent`
  - **5 Tiêu chí**: `tf: 5`, `gra: 5`, `vra: 5`, `cc: 5`, `reg: 5`
  - **Lỗi**: `0 lỗi`

#### 📋 TC-03: Thử thách 1 từ duy nhất (1-Word Challenge)
* **Mục tiêu**: Kiểm tra tính hợp lệ tối thiểu của quy định "1–5 words" (1 từ vẫn nhận điểm tối đa nếu đúng trọng tâm).
* **Input**:
  - `Q1`: `Good.` (1 từ)
  - `Q2`: `Winter.` (1 từ)
  - `Q3`: `Soccer.` (1 từ)
  - `Q4`: `Jeans.` (1 từ)
  - `Q5`: `Jazz.` (1 từ)
* **Kỳ vọng**:
  - **Điểm**: `10/10` | **CEFR**: `C1`
  - **Lỗi**: `0 lỗi` | 5/5 câu hợp lệ

---

### ⚠️ NHÓM 2: Vi Phạm Giới Hạn Độ Dài (Over-length Errors | 6 – 8.5/10 Điểm)

#### 📋 TC-04: Thí sinh giỏi nhưng viết quá dài (> 5 từ/câu)
* **Mục tiêu**: Kiểm tra logic phạt số từ khi thí sinh viết câu dài hơn 5 từ.
* **Input**:
  - `Q1`: `I am doing well, thank you.` (6 từ ❌ - Dư 1 từ)
  - `Q2`: `I really love spring weather.` (5 từ ✅)
  - `Q3`: `Football is the most popular sport in Vietnam.` (8 từ ❌ - Dư 3 từ)
  - `Q4`: `I am currently wearing a black shirt.` (7 từ ❌ - Dư 2 từ)
  - `Q5`: `My favorite music is pop.` (5 từ ✅)
* **Kỳ vọng**:
  - **Điểm**: `8.5/10` (dải `7 – 8.5/10`) | **CEFR**: `B2` | **Star**: `Good`
  - **Task Fulfillment**: Cảnh báo ở Q1, Q3, Q4 (`Câu trả lời vượt quá số lượng từ theo yêu cầu (hơi dài)`).
  - **Sửa lỗi**: Không báo lỗi ngữ pháp (vì câu đúng), chỉ lưu ý số từ.

---

### ❌ NHÓM 3: Lỗi Ngữ Pháp & Chính Tả Điển Hình (Band A1 – A2 | 3 – 6/10 Điểm)

#### 📋 TC-05: Lỗi chia động từ, thiếu to-be và sai chính tả
* **Mục tiêu**: Kiểm tra bộ bóc tách lỗi chi tiết (Error Inspector) phát hiện đúng từ gốc (`original`), từ sửa (`correction`) và giải thích tiếng Việt.
* **Input**:
  - `Q1`: `I feeling very good today.` (5 từ - ❌ Thiếu to-be: `I am feeling`)
  - `Q2`: `My favorit season is sumer.` (5 từ - ❌ Sai chính tả: `favorit` -> `favorite`, `sumer` -> `summer`)
  - `Q3`: `Footbal.` (1 từ - ❌ Sai chính tả: `Footbal` -> `Football`)
  - `Q4`: `I wear jean and shirt.` (5 từ - ❌ Sai thì & thiếu mạo từ: `wearing jeans and a shirt`)
  - `Q5`: `I likes listen pop music.` (5 từ - ❌ Chia sai động từ `likes` & thiếu `to`)
* **Kỳ vọng**:
  - **Điểm**: `4 – 5/10` | **CEFR**: `A2` | **Star**: `Satisfactory`
  - **Error Inspector**: Hiển thị rõ danh sách lỗi Ngữ pháp & Chính tả, đối chiếu gạch đỏ và sửa xanh ngọc bích.

---

### 🔀 NHÓM 4: Lạc Đề & Hiểu Sai Câu Hỏi (Off-topic | 3 – 4/10 Điểm)

#### 📋 TC-06: Trả lời lạc đề / Dịch sai nghĩa câu hỏi
* **Mục tiêu**: Kiểm tra khả năng phát hiện câu trả lời không liên quan tới ngữ cảnh câu hỏi.
* **Input**:
  - `Q1`: `I am 25 years old.` (❌ Lạc đề: hỏi thăm sức khỏe lại trả lời tuổi)
  - `Q2`: `In my home.` (❌ Lạc đề: hỏi mùa lại trả lời vị trí)
  - `Q3`: `Football.` (1 từ ✅ Đúng)
  - `Q4`: `It is very hot today.` (❌ Lạc đề: hỏi trang phục lại nói thời tiết)
  - `Q5`: `I like rock music.` (4 từ ✅ Đúng)
* **Kỳ vọng**:
  - **Điểm**: `3 – 4/10` | **CEFR**: `A2`
  - **Task Fulfillment**: Đánh dấu đỏ ❌ ở Q1, Q2, Q4 (`Nội dung chưa phù hợp với chủ đề câu hỏi`).
  - **Điểm Task**: 2/5 câu đạt yêu cầu.

---

### 🛑 NHÓM 5: Thí Sinh Yếu / Mất Gốc / Bỏ Trống (Band A0 – A1 | 0 – 3/10 Điểm)

#### 📋 TC-07: Bỏ trống 100% (Empty Submission)
* **Mục tiêu**: Kiểm tra hệ thống xử lý khi người dùng không gõ gì và bấm nộp bài.
* **Input**:
  - `Q1`: `` (Trống)
  - `Q2`: `` (Trống)
  - `Q3`: `` (Trống)
  - `Q4`: `` (Trống)
  - `Q5`: `` (Trống)
* **Kỳ vọng**:
  - **Điểm**: `0/10` | **CEFR**: `A0` | **Star**: `Needs Work`
  - **Task Fulfillment**: `danger` (0/5 câu), thông báo: `Bài làm PART1 chưa được thực hiện (Bỏ trống bài làm)`.
  - **Bands**: `tf: 0, gra: 0, vra: 0, cc: 0, reg: 0`

#### 📋 TC-08: Bỏ trống một phần (Partial Abandonment)
* **Mục tiêu**: Kiểm tra tính điểm khi chỉ hoàn thành 2 câu, bỏ 3 câu.
* **Input**:
  - `Q1`: `Fine, thanks.` (2 từ ✅)
  - `Q2`: `` (Trống ❌)
  - `Q3`: `Badminton.` (1 từ ✅)
  - `Q4`: `` (Trống ❌)
  - `Q5`: `` (Trống ❌)
* **Kỳ vọng**:
  - **Điểm**: `3 – 4/10` | **CEFR**: `A2`
  - **Task Fulfillment**: 2/5 câu đạt, Q2/Q4/Q5 báo `Bỏ trống câu hỏi`.

#### 📋 TC-09: Nhập tiếng Việt không dấu / có dấu
* **Mục tiêu**: Kiểm tra xử lý ngôn ngữ không hợp lệ.
* **Input**:
  - `Q1`: `toi khoe` (❌ Tiếng Việt)
  - `Q2`: `mua he` (❌ Tiếng Việt)
  - `Q3`: `bong da` (❌ Tiếng Việt)
  - `Q4`: `ao so mi` (❌ Tiếng Việt)
  - `Q5`: `nhac tre` (❌ Tiếng Việt)
* **Kỳ vọng**:
  - **Điểm**: `0 – 1/10` | **CEFR**: `A0` | Cảnh báo ngôn ngữ bài làm không phải tiếng Anh.

---

### 🔠 NHÓM 6: Edge Cases & Ký Tự Đặc Biệt

#### 📋 TC-10: Dùng chữ in hoa toàn bộ (ALL CAPS) & Dấu câu
* **Input**:
  - `Q1`: `I AM GOOD!` (3 từ ✅)
  - `Q2`: `SUMMER.` (1 từ ✅)
  - `Q3`: `FOOTBALL.` (1 từ ✅)
  - `Q4`: `JEANS & T-SHIRT.` (3 từ ✅)
  - `Q5`: `POP MUSIC.` (2 từ ✅)
* **Kỳ vọng**:
  - **Điểm**: `9 – 10/10` | **CEFR**: `C1` | Hệ thống chấm đúng nội dung và nhắc nhẹ về phong cách viết hoa.
