import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { explainScheme } from '../services/geminiService.js';
import { getSchemeById } from '../services/matchingService.js';

export const explainRouter = Router();

// Rate limiter for AI endpoint: 30 requests per minute per IP
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'Too many requests for scheme explanations. Please wait a moment before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

explainRouter.post('/', aiRateLimiter, async (req: Request, res: Response) => {
  const { schemeId, language = 'en', profile } = req.body || {};

  if (!schemeId || typeof schemeId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid schemeId in request body.' });
  }

  const scheme = getSchemeById(schemeId.trim());
  if (!scheme) {
    return res.status(404).json({ error: `Scheme '${schemeId}' does not exist in verified catalogue.` });
  }

  const selectedLang = language === 'hi' ? 'hi' : 'en';

  try {
    const explanation = await explainScheme(scheme.id, selectedLang, profile);
    return res.json(explanation);
  } catch (err: any) {
    console.error('[explainRouter] Error generating explanation:', err?.message || err);
    return res.status(500).json({
      error: 'Failed to generate scheme explanation. Please check the official catalogue directly.'
    });
  }
});
