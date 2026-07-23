import { Request, Response } from 'express';
import { Review, Changelog } from '@aptis-prep/shared';

// Mock DB Reviews Store
const reviewsDb: Review[] = [
  {
    id: 'rev-001',
    userId: 'u-101',
    fullName: 'Hoàng Long',
    title: 'Trúng đề nghe phần 1',
    content: 'Đề thi thật Listening phần 1 có câu hỏi về Conference tương tự bài luyện của web! Đạt B2 dễ dàng.',
    examDate: '2026-07-22',
    rating: 5,
    approved: true,
    createdAt: new Date()
  },
  {
    id: 'rev-002',
    userId: 'u-102',
    fullName: 'Minh Thư',
    title: 'Speaking Part 3 Remote Work',
    content: 'Speaking Part 3 về so sánh 2 tranh hỏi về Remote Work. Nội dung giải thích của trang rất sát.',
    examDate: '2026-07-20',
    rating: 5,
    approved: true,
    createdAt: new Date()
  }
];

// Mock DB Changelog Store
const changelogsDb: Changelog[] = [
  {
    id: 'log-001',
    title: 'Cập nhật đề thi mới tháng 7',
    description: 'Bổ sung 2 bộ đề thi thử Reading Part 3 & 4 bám sát định dạng thi thực tế.',
    category: 'exams',
    updateDate: '2026-07-23',
    createdBy: 'admin-1',
    createdAt: new Date()
  },
  {
    id: 'log-002',
    title: 'Tối ưu hóa trình phát nghe Audio Player',
    description: 'Nâng cấp công cụ chạy timeline scrubbing giảm độ trễ đệm dữ liệu trên Mobile Safari.',
    category: 'general',
    updateDate: '2026-07-21',
    createdBy: 'admin-1',
    createdAt: new Date()
  }
];

export class ReviewsController {
  
  // GET /api/reviews
  static getApprovedReviews(req: Request, res: Response) {
    const approved = reviewsDb.filter(r => r.approved);
    res.json({ success: true, data: approved });
  }

  // POST /api/reviews
  static createReview(req: Request, res: Response) {
    const { title, content, examDate, rating, userId, fullName } = req.body;

    if (!title || !content || !examDate || !rating) {
      return res.status(400).json({ success: false, error: 'Missing required review fields.' });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: userId || 'anonymous',
      fullName: fullName || 'Anonymous Student',
      title,
      content,
      examDate,
      rating: Number(rating),
      approved: false, // Moderated by default
      createdAt: new Date()
    };

    reviewsDb.push(newReview);
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully. Pending administrator approval.',
      data: newReview 
    });
  }

  // GET /api/changelog
  static getChangelogs(req: Request, res: Response) {
    res.json({ success: true, data: changelogsDb });
  }
}
