import localSchemes from '../data/schemes.json';
import { Scheme, UserProfile, SchemeMatch, ExplainResponse, SchemeChecklist } from '../types/scheme.js';

export async function fetchHealth(): Promise<{ status: string; aiConfigured: boolean; model: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check non-200');
    return await res.json();
  } catch (err) {
    return { status: 'fallback', aiConfigured: false, model: 'local-catalogue-fallback' };
  }
}

export async function fetchAllSchemes(): Promise<Scheme[]> {
  try {
    const res = await fetch('/api/schemes');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.schemes) && data.schemes.length > 0) {
        return data.schemes;
      }
    }
  } catch (err) {
    console.warn('[HaqSaathi] Using verified local schemes catalogue.');
  }
  return localSchemes as Scheme[];
}

export async function matchProfile(profile: UserProfile): Promise<{
  potentialMatches: SchemeMatch[];
  moreInfoNeeded: SchemeMatch[];
  notEligible: SchemeMatch[];
}> {
  try {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        potentialMatches: data.potentialMatches || [],
        moreInfoNeeded: data.moreInfoNeeded || [],
        notEligible: data.notEligible || [],
      };
    }
  } catch (err) {
    console.warn('[HaqSaathi] Server /api/match unavailable, running client matching engine.');
  }

  // Graceful client fallback using same deterministic rules
  return runClientSideMatching(profile);
}

export async function fetchSchemeExplanation(
  schemeId: string,
  language: 'en' | 'hi',
  profile?: Partial<UserProfile>
): Promise<ExplainResponse> {
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeId, language, profile }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[HaqSaathi] /api/explain unavailable, using client-side fallback.');
  }

  const scheme = (localSchemes as Scheme[]).find((s) => s.id === schemeId);
  if (!scheme) {
    throw new Error('Scheme not found in catalogue');
  }

  const isHi = language === 'hi';
  return {
    simpleExplanation: isHi && scheme.plainLanguageDescriptionHi
      ? scheme.plainLanguageDescriptionHi
      : scheme.plainLanguageDescription,
    whyItMayBeRelevant: isHi
      ? `यह योजना ${scheme.categoryHi || scheme.category} के अंतर्गत असंगठित कामगारों को सहायता देने के लिए है।`
      : `This scheme provides ${scheme.category.toLowerCase()} assistance to informal workers.`,
    whatToVerify: isHi && scheme.exclusionsHi
      ? scheme.exclusionsHi.map((e) => `शर्त: ${e}`)
      : scheme.exclusions.map((e) => `Condition: ${e}`),
    nextSteps: isHi && scheme.applicationStepsHi
      ? scheme.applicationStepsHi
      : scheme.applicationSteps,
    uncertainties: isHi
      ? ['यह प्राथमिक जांच है। अंतिम स्वीकृति संबंधित सरकारी कार्यालय या बैंक द्वारा होगी।']
      : ['This is a screening assessment. Final approval depends on formal scrutiny of documents by the official portal.'],
    officialUrl: scheme.officialUrl,
    isFallback: true,
    sourceTitle: scheme.sourceTitle,
    lastVerifiedDate: scheme.lastVerifiedDate,
  };
}

export async function fetchSchemeChecklist(schemeId: string): Promise<SchemeChecklist> {
  try {
    const res = await fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeId }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[HaqSaathi] /api/checklist unavailable, using local client generator.');
  }

  const scheme = (localSchemes as Scheme[]).find((s) => s.id === schemeId)!;
  return {
    schemeId: scheme.id,
    schemeName: scheme.shortName,
    documentsToPrepare: scheme.requiredDocuments,
    documentsToPrepareHi: scheme.requiredDocumentsHi,
    steps: scheme.applicationSteps.map((stepText, idx) => ({
      id: `${scheme.id}-step-${idx + 1}`,
      step: idx + 1,
      title: `Step ${idx + 1}`,
      titleHi: `चरण ${idx + 1}`,
      detail: stepText,
      detailHi: scheme.applicationStepsHi?.[idx],
      actionUrl: idx === 0 ? scheme.officialUrl : undefined,
      isMandatory: true,
    })),
    officialUrl: scheme.officialUrl,
    disclaimer: scheme.disclaimer,
  };
}

// Client-side deterministic matching mirror
function runClientSideMatching(profile: UserProfile): {
  potentialMatches: SchemeMatch[];
  moreInfoNeeded: SchemeMatch[];
  notEligible: SchemeMatch[];
} {
  const schemes = localSchemes as Scheme[];
  const potentialMatches: SchemeMatch[] = [];
  const moreInfoNeeded: SchemeMatch[] = [];
  const notEligible: SchemeMatch[] = [];

  const age = typeof profile.age === 'number' ? profile.age : 0;
  const income = typeof profile.monthlyIncome === 'number' ? profile.monthlyIncome : 0;

  for (const scheme of schemes) {
    const reasons: string[] = [];
    const reasonsHi: string[] = [];
    const whatToVerify: string[] = [];
    const whatToVerifyHi: string[] = [];
    let isEligible = true;
    let needsInfo = false;

    if (scheme.eligibilityRules.isTaxPayer === false && profile.isTaxPayer) {
      isEligible = false;
      reasons.push('Excluded for income tax payers.');
      reasonsHi.push('आयकर दाता होने के कारण इस योजना में शामिल नहीं हो सकते।');
    }

    if (scheme.eligibilityRules.hasEpfoEsic === false && profile.hasEpfoEsic) {
      isEligible = false;
      reasons.push('Excluded because you have formal EPFO / ESIC PF deductions.');
      reasonsHi.push('ईपीएफओ या ईएसआईसी सदस्य होने के कारण अपात्र हैं।');
    }

    if (scheme.eligibilityRules.minAge && age < scheme.eligibilityRules.minAge) {
      isEligible = false;
      reasons.push(`Minimum age is ${scheme.eligibilityRules.minAge} years (your age: ${age}).`);
      reasonsHi.push(`न्यूनतम आवश्यक आयु ${scheme.eligibilityRules.minAge} वर्ष है।`);
    }

    if (scheme.eligibilityRules.maxAge && age > scheme.eligibilityRules.maxAge) {
      isEligible = false;
      reasons.push(`Maximum age is ${scheme.eligibilityRules.maxAge} years (your age: ${age}).`);
      reasonsHi.push(`अधिकतम अनुमत आयु ${scheme.eligibilityRules.maxAge} वर्ष है।`);
    }

    if (scheme.eligibilityRules.maxIncome && income > scheme.eligibilityRules.maxIncome) {
      isEligible = false;
      reasons.push(`Monthly income must be ₹${scheme.eligibilityRules.maxIncome.toLocaleString('en-IN')} or below.`);
      reasonsHi.push(`मासिक आय ₹${scheme.eligibilityRules.maxIncome.toLocaleString('en-IN')} या कम होनी चाहिए।`);
    }

    if (scheme.id === 'eshram' && isEligible) {
      reasons.push('You are an unorganised worker aged 16–59 and not registered under EPFO/ESIC.');
      reasonsHi.push('आप 16-59 वर्ष के असंगठित कामगार हैं और EPFO/ESIC से नहीं जुड़े हैं।');
      whatToVerify.push('Verify that your mobile number is linked to your Aadhaar for OTP verification.');
      whatToVerifyHi.push('जांचें कि आपका मोबाइल नंबर आधार से जुड़ा है ताकि ओटीपी आ सके।');
      if (!profile.hasBankAccount) {
        needsInfo = true;
        whatToVerify.push('A bank account is required for direct benefit deposits.');
        whatToVerifyHi.push('लाभ जमा करने के लिए बैंक खाता होना जरूरी है।');
      }
    } else if (scheme.id === 'pmsym' && isEligible) {
      reasons.push(`Age is within 18–40 and income is within ₹15,000 threshold.`);
      reasonsHi.push(`आपकी आयु 18-40 वर्ष और आय ₹15,000 की सीमा के भीतर है।`);
      whatToVerify.push('Requires regular monthly auto-debit contribution (₹55 - ₹200) until age 60.');
      whatToVerifyHi.push('60 वर्ष तक हर महीने ₹55 से ₹200 नियमित बैंक से कटवाने की सहमति आवश्यक है।');
      if (!profile.hasBankAccount) {
        needsInfo = true;
      }
    } else if (scheme.id === 'pmsvanidhi') {
      if (profile.occupation === 'street_vendor') {
        if (isEligible) {
          reasons.push('You work as a street vendor, hawker, or market cart seller.');
          reasonsHi.push('आप रेहड़ी-पटरी, ठेला या फेरी लगाकर सामान बेचने का काम करते हैं।');
          whatToVerify.push('Must have a Certificate of Vending (CoV), municipal vendor ID, or Letter of Recommendation (LoR).');
          whatToVerifyHi.push('जांचें कि क्या आपके पास नगर पालिका का वेंडिंग प्रमाण पत्र या सिफारिश पत्र (LoR) है।');
        }
      } else {
        isEligible = false;
        reasons.push('Specifically designed for street vendors and hawkers.');
        reasonsHi.push('यह विशेष ऋण योजना केवल रेहड़ी-पटरी विक्रेताओं के लिए है।');
      }
    } else if (scheme.id === 'bocw') {
      if (profile.occupation === 'construction_worker') {
        if (isEligible) {
          reasons.push('You work in building and construction.');
          reasonsHi.push('आप भवन निर्माण या मजदूरी का काम करते हैं।');
          whatToVerify.push('Must provide 90-day construction work proof from contractor or union.');
          whatToVerifyHi.push('कम से कम 90 दिन निर्माण कार्य करने का प्रमाण पत्र होना जरूरी है।');
        }
      } else {
        isEligible = false;
        reasons.push('Registration is specifically for building and construction workers.');
        reasonsHi.push('यह पंजीकरण विशेष रूप से निर्माण कामगारों के लिए है।');
      }
    } else if (scheme.id === 'pmsby' && isEligible) {
      reasons.push('Age between 18 and 70 with ₹2 Lakh accident insurance for ₹20/year.');
      reasonsHi.push('18-70 वर्ष के बीच ₹2 लाख दुर्घटना बीमा मात्र ₹20/वर्ष में।');
      if (!profile.hasBankAccount) needsInfo = true;
    } else if (scheme.id === 'pmjjby' && isEligible) {
      reasons.push('Age between 18 and 50 with ₹2 Lakh life insurance for ₹436/year.');
      reasonsHi.push('18-50 वर्ष के बीच ₹2 लाख जीवन बीमा मात्र ₹436/वर्ष में।');
      if (!profile.hasBankAccount) needsInfo = true;
    } else if (scheme.id === 'pmjay' && isEligible) {
      reasons.push('Low-income unorganised household eligible for cashless hospital cover up to ₹5 Lakh/year.');
      reasonsHi.push('कम आय वाले परिवार के रूप में ₹5 लाख तक के कैशलेस अस्पताल इलाज के पात्र।');
      whatToVerify.push('Check family name in Ayushman/SECC list at mera.pmjay.gov.in.');
      whatToVerifyHi.push('mera.pmjay.gov.in पर आयुष्मान सूची में नाम जांचें।');
    }

    const matchObj: SchemeMatch = {
      schemeId: scheme.id,
      scheme,
      status: !isEligible ? 'NOT_ELIGIBLE' : needsInfo ? 'MORE_INFO_NEEDED' : 'POTENTIAL_MATCH',
      reasons,
      reasonsHi,
      whatToVerify,
      whatToVerifyHi,
    };

    if (!isEligible) {
      notEligible.push(matchObj);
    } else if (needsInfo) {
      moreInfoNeeded.push(matchObj);
    } else {
      potentialMatches.push(matchObj);
    }
  }

  return { potentialMatches, moreInfoNeeded, notEligible };
}
