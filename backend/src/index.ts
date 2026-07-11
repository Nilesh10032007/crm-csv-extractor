import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import path from 'path';
import { parseCSVString } from './services/csvService';
import { processCSVData } from './services/aiService';
import { jobManager } from './services/jobManager';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration based on user feedback
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// In-memory Multer for CSV uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

app.post('/api/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvString = req.file.buffer.toString('utf-8');
    const rawData = parseCSVString(csvString);

    if (rawData.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }

    const jobId = randomUUID();
    jobManager.createJob(jobId, rawData.length);

    // Start background processing
    processCSVData(jobId, rawData).catch(err => {
      console.error(`Job ${jobId} failed completely:`, err);
      jobManager.updateJob(jobId, { status: 'failed' }, [], [], [err.message]);
    });

    res.status(202).json({ jobId, message: 'File accepted for processing' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/import/:jobId/progress', (req, res) => {
  const { jobId } = req.params;
  const job = jobManager.getJob(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Setup SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  jobManager.addSSEClient(jobId, res);

  req.on('close', () => {
    jobManager.removeSSEClient(jobId, res);
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
