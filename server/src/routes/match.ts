import { Router, Request, Response } from 'express';
import { evaluateMatches } from '../services/matchingService.js';
import { UserProfile } from '../types.js';

export const matchRouter = Router();

const SENSITIVE_KEYS = ['aadhaarno', 'aadhaarnumber', 'aadhaar_no', 'otp', 'password', 'accountnumber', 'bankaccountnumber', 'account_no', 'cardnumber', 'cvv'];

matchRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body. Expected profile object.' });
  }

  // Security & Privacy Check: reject any sensitive identifiers immediately
  for (const key of Object.keys(body)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      return res.status(400).json({
        error: 'Security violation: Sensitive personal identifiers (such as Aadhaar or bank account numbers) must never be sent.'
      });
    }
  }

  const {
    occupation,
    age,
    state,
    monthlyIncome,
    isTaxPayer,
    hasEpfoEsic,
    hasBankAccount,
    isUrbanStreetVendor,
    constructionDaysWorked
  } = body;

  // Validation
  if (typeof occupation !== 'string' || occupation.trim().length === 0) {
    return res.status(400).json({ error: 'Occupation is required and must be a valid category.' });
  }

  const parsedAge = Number(age);
  if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
    return res.status(400).json({ error: 'Age must be a valid number between 0 and 120.' });
  }

  const parsedIncome = Number(monthlyIncome);
  if (isNaN(parsedIncome) || parsedIncome < 0) {
    return res.status(400).json({ error: 'Monthly income must be a non-negative number.' });
  }

  const profile: UserProfile = {
    occupation: occupation.trim(),
    age: parsedAge,
    state: typeof state === 'string' ? state.trim() : undefined,
    monthlyIncome: parsedIncome,
    isTaxPayer: Boolean(isTaxPayer),
    hasEpfoEsic: Boolean(hasEpfoEsic),
    hasBankAccount: Boolean(hasBankAccount),
    isUrbanStreetVendor: Boolean(isUrbanStreetVendor),
    constructionDaysWorked: typeof constructionDaysWorked === 'number' ? constructionDaysWorked : undefined
  };

  const matches = evaluateMatches(profile);

  return res.json({
    totalMatched: matches.length,
    potentialMatches: matches.filter((m) => m.status === 'POTENTIAL_MATCH'),
    moreInfoNeeded: matches.filter((m) => m.status === 'MORE_INFO_NEEDED'),
    notEligible: matches.filter((m) => m.status === 'NOT_ELIGIBLE'),
    disclaimer: 'This screening uses verified deterministic catalogue rules. It does not guarantee approval. Formal eligibility is determined solely by government authorities upon official application.'
  });
});
