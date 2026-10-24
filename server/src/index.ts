import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { healthRouter } from './routes/health.js';
import { schemesRouter } from './routes/schemes.js';
import { matchRouter } from './routes/match.js';
import { explainRouter } from './routes/explain.js';
import { checklistRouter } from './routes/checklist.js';
import { isAiConfigured, getConfiguredModel } from './services/geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded whether running from project root or server folder
const candidateEnvPaths = [
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../server/.env'),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev/prototype mode
    }
  },
  credentials: true,
}));

// Strict payload size limit
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// Security & Privacy header
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/schemes', schemesRouter);
app.use('/api/match', matchRouter);
app.use('/api/explain', explainRouter);
app.use('/api/checklist', checklistRouter);

// Serve static frontend in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global safe error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ServerError]', err?.message || err);
  res.status(err.status || 500).json({
    error: 'An internal server error occurred. Please try again.',
  });
});

const isTestEnvironment =
  process.env.NODE_ENV === 'test' ||
  process.argv.some((a) => a.includes('test')) ||
  process.execArgv.some((a) => a.includes('test'));

if (!isTestEnvironment) {
  app.listen(PORT, () => {
    console.log(`[Haq Saathi Server] Listening on http://localhost:${PORT}`);
    console.log(`[Haq Saathi Server] Gemini AI Configured: ${isAiConfigured()}`);
    console.log(`[Haq Saathi Server] Configured Model: ${getConfiguredModel()}`);
  });
}

export default app;
