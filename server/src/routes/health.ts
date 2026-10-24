import { Router, Request, Response } from 'express';
import { isAiConfigured, getConfiguredModel } from '../services/geminiService.js';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Haq Saathi API',
    version: '1.0.0',
    aiConfigured: isAiConfigured(),
    model: getConfiguredModel(),
    timestamp: new Date().toISOString()
  });
});
