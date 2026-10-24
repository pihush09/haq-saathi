import { Router, Request, Response } from 'express';
import { generateChecklist } from '../services/checklistService.js';

export const checklistRouter = Router();

checklistRouter.post('/', (req: Request, res: Response) => {
  const { schemeId } = req.body || {};

  if (!schemeId || typeof schemeId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid schemeId in request body.' });
  }

  const checklist = generateChecklist(schemeId.trim());
  if (!checklist) {
    return res.status(404).json({ error: `Scheme '${schemeId}' not found.` });
  }

  return res.json(checklist);
});
