import { Scheme, UserProfile, ExplainResponse } from '../types.js';
import { getSchemeById } from './matchingService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Ensure .env is loaded if not already initialized
if (!process.env.GEMINI_API_KEY) {
  const candidateEnvPaths = [
    path.resolve(process.cwd(), 'server/.env'),
    path.resolve(process.cwd(), '.env'),
  ];
  for (const envPath of candidateEnvPaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      break;
    }
  }
}

// Official Gemma 4 on Gemini API model identifier from https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api
const DEFAULT_MODEL = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';

export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

export function getConfiguredModel(): string {
  return process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
}

/**
 * Generate a verified deterministic fallback explanation directly from local scheme facts.
 * Used when GEMINI_API_KEY is not configured, or if the API call times out or errors.
 */
export function generateFallbackExplanation(
  scheme: Scheme,
  language: 'en' | 'hi' = 'en',
  profile?: Partial<UserProfile>
): ExplainResponse {
  const isHi = language === 'hi';

  const simpleExplanation = isHi && scheme.plainLanguageDescriptionHi
    ? scheme.plainLanguageDescriptionHi
    : scheme.plainLanguageDescription;

  let whyItMayBeRelevant = '';
  if (isHi) {
    whyItMayBeRelevant = `यह योजना ${scheme.categoryHi || scheme.category} के अंतर्गत असंगठित कामगारों को वित्तीय और सामाजिक सुरक्षा देने के लिए शुरू की गई है।`;
    if (profile?.occupation) {
      whyItMayBeRelevant += ` आपके बताए व्यवसाय (${profile.occupation}) और आय समूह के अनुसार यह योजना आपके लिए उपयोगी हो सकती है।`;
    }
  } else {
    whyItMayBeRelevant = `This scheme provides vital ${scheme.category.toLowerCase()} support for informal workers.`;
    if (profile?.occupation) {
      whyItMayBeRelevant += ` Based on your stated work profile (${profile.occupation}), you may be eligible to apply.`;
    }
  }

  const whatToVerify = isHi && scheme.exclusionsHi
    ? [
        ...scheme.exclusionsHi.map((e) => `शर्त: ${e}`),
        'जांचें कि आपके पास सभी आवश्यक मूल दस्तावेज (जैसे आधार व बैंक खाता) उपलब्ध हैं।'
      ]
    : [
        ...scheme.exclusions.map((e) => `Condition: ${e}`),
        'Confirm you have all required original documents and active bank details.'
      ];

  const nextSteps = isHi && scheme.applicationStepsHi
    ? scheme.applicationStepsHi
    : scheme.applicationSteps;

  const uncertainties = isHi
    ? [
        'यह केवल प्राथमिक पात्रता आकलन है। अंतिम स्वीकृति संबंधित सरकारी कार्यालय या बैंक द्वारा दस्तावेजों की जांच के बाद ही होगी।',
        'आवेदन करने से पहले आधिकारिक वेबसाइट पर नवीनतम दिशा-निर्देश अवश्य जांचें।'
      ]
    : [
        'This is a screening assessment. Final approval depends on formal scrutiny of documents by the designated government authority.',
        'Always verify the latest state-specific rules and deadlines on the official portal before applying.'
      ];

  return {
    simpleExplanation,
    whyItMayBeRelevant,
    whatToVerify,
    nextSteps,
    uncertainties,
    officialUrl: scheme.officialUrl, // Authoritative URL from catalogue only
    isFallback: true,
    sourceTitle: scheme.sourceTitle,
    lastVerifiedDate: scheme.lastVerifiedDate,
  };
}

/**
 * Generate guarded, plain-language scheme explanation using Gemini/Gemma.
 * If API fails or is not configured, gracefully falls back to verified catalogue template.
 */
export async function explainScheme(
  schemeId: string,
  language: 'en' | 'hi' = 'en',
  profile?: Partial<UserProfile>
): Promise<ExplainResponse> {
  const scheme = getSchemeById(schemeId);
  if (!scheme) {
    throw new Error(`Scheme with id "${schemeId}" not found in catalogue.`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return generateFallbackExplanation(scheme, language, profile);
  }

  const model = getConfiguredModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const langPrompt = language === 'hi' ? 'in simple conversational Hindi (हिंदी)' : 'in plain, clear, jargon-free English';

  const systemInstruction = `You are Haq Saathi, a trusted, honest, and caring public advisor helping Indian informal and daily-wage workers understand government schemes.
CRITICAL SAFETY & TRUTH RULES:
1. You MUST rely ONLY on the verified scheme facts supplied below.
2. DO NOT invent eligibility criteria, loan/pension amounts, benefits, documents, deadlines, or URLs.
3. NEVER promise guaranteed approval, money, or benefits. Always present potential eligibility and explain that official verification is required.
4. NEVER request or ask for Aadhaar numbers, OTPs, bank passwords, or sensitive personal data.
5. The official URL must be strictly the official government URL provided.
6. Provide your response in ${langPrompt}.
7. You must respond ONLY with a valid JSON object matching the exact schema below. Do not wrap in markdown or backticks if possible, or use standard JSON.`;

  const userPrompt = `Verified Scheme Facts:
- Scheme Name: ${scheme.officialName} (${scheme.shortName})
- Category: ${scheme.category}
- Scope: ${scheme.scope}
- Plain Description: ${scheme.plainLanguageDescription}
- Eligibility Rules: ${JSON.stringify(scheme.eligibilityRules)}
- Exclusions: ${scheme.exclusions.join('; ')}
- Required Documents: ${scheme.requiredDocuments.join('; ')}
- Official Steps: ${scheme.applicationSteps.join('; ')}
- Official Portal: ${scheme.officialUrl}
- Disclaimer: ${scheme.disclaimer}

User Context (Screening profile):
- Occupation: ${profile?.occupation || 'Informal unorganised worker'}
- Age: ${profile?.age ? `${profile.age} years` : 'Not specified'}
- Stated Monthly Income: ${profile?.monthlyIncome !== undefined ? `₹${profile.monthlyIncome}` : 'Not specified'}

Task:
Explain this scheme simply for a worker with limited digital literacy.
Do not output drafting notes or preamble. Provide your response strictly as valid JSON starting directly with '{':
{
  "simpleExplanation": "2-3 simple sentences explaining what this scheme actually offers in plain language without jargon",
  "whyItMayBeRelevant": "1-2 sentences on why this worker might find it helpful based on their profile",
  "whatToVerify": ["list of 2-3 specific conditions or documents the worker needs to double check"],
  "nextSteps": ["ordered list of 3-4 exact next physical/digital steps from the verified facts"],
  "uncertainties": ["1-2 honest statements noting that final approval requires official desk verification"],
  "officialUrl": "${scheme.officialUrl}"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35-second timeout for model reasoning

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.1, // Low temperature for high factual adherence
        maxOutputTokens: 1500
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[GeminiService] API returned status ${response.status}. Using verified fallback.`);
      return generateFallbackExplanation(scheme, language, profile);
    }

    const data: any = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('[GeminiService] Empty response from model. Using verified fallback.');
      return generateFallbackExplanation(scheme, language, profile);
    }

    // Clean any Gemma 4 thinking tokens or markdown formatting
    let cleanedText = candidateText.trim();
    cleanedText = cleanedText.replace(/<\|think\|>[\s\S]*?<\|\/think\|>/gi, '');
    cleanedText = cleanedText.replace(/<\|thought\|>[\s\S]*?<\|\/thought\|>/gi, '');
    cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    // Extract first JSON object if surrounded by extra commentary
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedText);

    // Validate structure
    if (
      typeof parsed.simpleExplanation === 'string' &&
      typeof parsed.whyItMayBeRelevant === 'string' &&
      Array.isArray(parsed.whatToVerify) &&
      Array.isArray(parsed.nextSteps)
    ) {
      return {
        simpleExplanation: parsed.simpleExplanation,
        whyItMayBeRelevant: parsed.whyItMayBeRelevant,
        whatToVerify: parsed.whatToVerify,
        nextSteps: parsed.nextSteps,
        uncertainties: Array.isArray(parsed.uncertainties) ? parsed.uncertainties : ['Final approval is subject to official verification.'],
        officialUrl: scheme.officialUrl, // Always guarantee official URL from catalogue
        isFallback: false,
        sourceTitle: scheme.sourceTitle,
        lastVerifiedDate: scheme.lastVerifiedDate
      };
    } else {
      console.warn('[GeminiService] Model response missing expected fields. Using fallback.');
      return generateFallbackExplanation(scheme, language, profile);
    }
  } catch (err: any) {
    console.warn(`[GeminiService] Error calling Gemini API: ${err.message}. Using verified fallback.`);
    return generateFallbackExplanation(scheme, language, profile);
  }
}
