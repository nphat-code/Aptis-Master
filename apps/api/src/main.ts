import express from 'express';
import cors from 'cors';
import { QuestionsController } from './controllers/questions.controller';
import { ReviewsController } from './controllers/reviews.controller';

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes Registry
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Bind Controller Actions
app.get('/api/questions/listening', QuestionsController.getListeningQuestions);
app.get('/api/questions/reading', QuestionsController.getReadingQuestions);
app.post('/api/questions/grade', QuestionsController.gradeAttempt);

app.get('/api/reviews', ReviewsController.getApprovedReviews);
app.post('/api/reviews', ReviewsController.createReview);
app.get('/api/changelog', ReviewsController.getChangelogs);

// Start Service listener
app.listen(PORT, () => {
  console.log(`[Aptis Prep Master API] Running on http://localhost:${PORT}`);
});
