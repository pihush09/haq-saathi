import { Router, Request, Response } from 'express';
import { getAllSchemes, getSchemeById } from '../services/matchingService.js';

export const schemesRouter = Router();

schemesRouter.get('/', (_req: Request, res: Response) => {
  const schemes = getAllSchemes();
  res.json({
    total: schemes.length,
    schemes,
    sourceDisclaimer: 'Curated and manually verified against official portals (eshram.gov.in, maandhan.in, pmsvanidhi.mohua.gov.in, jansuraksha.gov.in, pmjay.gov.in, myscheme.gov.in).'
  });
});

schemesRouter.get('/:id', (req: Request, res: Response) => {
  const scheme = getSchemeById(req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found in verified catalogue.' });
  }
  res.json(scheme);
});
