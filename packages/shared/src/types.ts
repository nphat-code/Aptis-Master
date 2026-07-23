export type UserRole = 'admin' | 'teacher' | 'student';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  price: number;
  status: 'draft' | 'published';
  createdAt: Date;
}

export type SkillType = 'reading' | 'listening' | 'speaking' | 'writing' | 'grammar';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  contentType: SkillType;
  contentData: any; // JSON payload containing specific exercise questions
  orderIndex: number;
  createdAt: Date;
}

export type QuestionType = 'multiple_choice' | 'drag_drop' | 'speaking_record' | 'essay';

export interface Question {
  id: string;
  part: string; // e.g. reading_part1, listening_part2
  type: QuestionType;
  instructions: string;
  passage?: string; // Long passage text for reading
  audioUrl?: string; // URL to Amazon S3/Cloudinary audio track
  mediaUrl?: string; // Optional images
  options: string[]; // Options array for MCQs
  correctAnswer: any; // Correct option indexes or keys
  explanation?: string;
  tip?: string;
  points: number;
  createdAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  createdBy: string;
  isMockTest: boolean;
  createdAt: Date;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  status: 'in_progress' | 'completed';
  score?: number;
  listeningScore?: number;
  readingScore?: number;
  grammarScore?: number;
  userAnswers: Record<string, any>;
  generalFeedback?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessedAt: Date;
  completedAt?: Date;
}

export interface Review {
  id: string;
  userId: string;
  fullName?: string; // resolved relation
  title: string;
  content: string;
  examDate: string; // YYYY-MM-DD format
  rating: number;
  approved: boolean;
  createdAt: Date;
}

export interface Changelog {
  id: string;
  title: string;
  description: string;
  category: 'exams' | 'lessons' | 'general';
  updateDate: string;
  createdBy: string;
  createdAt: Date;
}
