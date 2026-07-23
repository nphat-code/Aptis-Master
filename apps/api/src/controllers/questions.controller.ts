import { Request, Response } from 'express';
import { Question } from '@aptis-prep/shared';

// Mock Database Question Bank
const listeningQuestions: Question[] = [
  {
    id: 'list-q1',
    part: 'listening_part1',
    type: 'multiple_choice',
    instructions: 'Listen to the recording and answer the question.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    options: ['9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
    correctAnswer: 1, // index 1 is 10:00 AM
    explanation: 'The speaker mentions that registration starts at 9:30 AM, but the conference opens at 10:00 AM.',
    tip: 'Listen to the transition word "but" to catch the actual start time instead of the registration time.',
    points: 5,
    createdAt: new Date()
  }
];

const readingQuestions: Question[] = [
  {
    id: 'read-q1',
    part: 'reading_part3',
    type: 'multiple_choice',
    instructions: 'Identify which speaker matches the given opinion.',
    passage: 'Speaker A believes traffic wastes hours. Speaker B is concerned that working longer hours causes burnout.',
    options: ['Speaker A', 'Speaker B', 'Speaker C'],
    correctAnswer: 1, // Speaker B
    explanation: 'Speaker B is worried that remote hours blur boundaries leading to burnout.',
    tip: 'Look for stress and well-being synonyms like "burnout".',
    points: 10,
    createdAt: new Date()
  }
];

export class QuestionsController {
  
  // GET /api/questions/listening
  static getListeningQuestions(req: Request, res: Response) {
    res.json({
      success: true,
      data: listeningQuestions
    });
  }

  // GET /api/questions/reading
  static getReadingQuestions(req: Request, res: Response) {
    res.json({
      success: true,
      data: readingQuestions
    });
  }

  // POST /api/questions/grade
  static gradeAttempt(req: Request, res: Response) {
    const { answers } = req.body as { answers: Record<string, any> };
    
    if (!answers) {
      return res.status(400).json({ success: false, error: 'Answers payload is required.' });
    }

    let earnedScore = 0;
    let totalScore = 0;
    const feedbackList: Array<{ questionId: string; isCorrect: boolean; correctAnswer: any; explanation?: string }> = [];

    // Combine all mock banks to validate
    const allQuestions = [...listeningQuestions, ...readingQuestions];

    allQuestions.forEach(q => {
      totalScore += q.points;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) {
        earnedScore += q.points;
      }

      feedbackList.push({
        questionId: q.id,
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      });
    });

    res.json({
      success: true,
      result: {
        score: earnedScore,
        totalPoints: totalScore,
        percentage: Math.round((earnedScore / totalScore) * 100),
        feedback: feedbackList
      }
    });
  }
}
