import schemesData from '../data/schemes.json' with { type: 'json' };
import { Scheme, UserProfile, SchemeMatch } from '../types.js';

export function getAllSchemes(): Scheme[] {
  return schemesData as Scheme[];
}

export function getSchemeById(id: string): Scheme | undefined {
  return (schemesData as Scheme[]).find((s) => s.id === id);
}

export function evaluateMatches(profile: UserProfile): SchemeMatch[] {
  const schemes = getAllSchemes();
  const results: SchemeMatch[] = [];

  for (const scheme of schemes) {
    const reasons: string[] = [];
    const reasonsHi: string[] = [];
    const whatToVerify: string[] = [];
    const whatToVerifyHi: string[] = [];
    let isEligible = true;
    let moreInfoNeeded = false;

    // Rule: Tax Payer Check
    if (scheme.eligibilityRules.isTaxPayer === false && profile.isTaxPayer) {
      isEligible = false;
      reasons.push('Excluded because you are an income tax payer.');
      reasonsHi.push('आयकर दाता होने के कारण इस योजना में शामिल नहीं हो सकते।');
    }

    // Rule: EPFO/ESIC Formal Employment Check
    if (scheme.eligibilityRules.hasEpfoEsic === false && profile.hasEpfoEsic) {
      isEligible = false;
      reasons.push('Excluded because you have formal EPFO / ESIC employee provident fund coverage.');
      reasonsHi.push('ईपीएफओ या ईएसआईसी सदस्य होने के कारण अपात्र हैं (यह असंगठित कामगारों के लिए है)।');
    }

    // Rule: Age Check
    if (scheme.eligibilityRules.minAge !== undefined && scheme.eligibilityRules.minAge !== null) {
      if (profile.age < scheme.eligibilityRules.minAge) {
        isEligible = false;
        reasons.push(`Minimum eligible age is ${scheme.eligibilityRules.minAge} years (your age: ${profile.age}).`);
        reasonsHi.push(`न्यूनतम आवश्यक आयु ${scheme.eligibilityRules.minAge} वर्ष है (आपकी आयु: ${profile.age})।`);
      }
    }

    if (scheme.eligibilityRules.maxAge !== undefined && scheme.eligibilityRules.maxAge !== null) {
      if (profile.age > scheme.eligibilityRules.maxAge) {
        isEligible = false;
        reasons.push(`Maximum eligible age is ${scheme.eligibilityRules.maxAge} years (your age: ${profile.age}).`);
        reasonsHi.push(`अधिकतम अनुमत आयु ${scheme.eligibilityRules.maxAge} वर्ष है (आपकी आयु: ${profile.age})।`);
      }
    }

    // Rule: Income Check
    if (scheme.eligibilityRules.maxIncome !== undefined && scheme.eligibilityRules.maxIncome !== null) {
      if (profile.monthlyIncome > scheme.eligibilityRules.maxIncome) {
        isEligible = false;
        reasons.push(`Monthly income must be ₹${scheme.eligibilityRules.maxIncome.toLocaleString('en-IN')} or below.`);
        reasonsHi.push(`मासिक आय ₹${scheme.eligibilityRules.maxIncome.toLocaleString('en-IN')} या उससे कम होनी चाहिए।`);
      }
    }

    // Scheme-specific occupation and condition handling
    if (scheme.id === 'eshram') {
      if (isEligible) {
        reasons.push('You are an unorganised informal worker aged 16–59 and not registered under EPFO/ESIC.');
        reasonsHi.push('आप 16-59 वर्ष के असंगठित कामगार हैं और EPFO/ESIC से नहीं जुड़े हैं।');
        whatToVerify.push('Verify that your mobile number is linked to your Aadhaar for OTP verification.');
        whatToVerifyHi.push('जांचें कि आपका मोबाइल नंबर आधार से जुड़ा है ताकि ओटीपी आ सके।');
        if (!profile.hasBankAccount) {
          moreInfoNeeded = true;
          whatToVerify.push('A valid bank account with IFSC is needed for registration and direct benefit transfer.');
          whatToVerifyHi.push('पंजीकरण और लाभ के लिए बैंक खाता और IFSC कोड जरूरी है।');
        }
      }
    } else if (scheme.id === 'pmsym') {
      if (isEligible) {
        reasons.push(`Age is within 18–40 years and monthly income (₹${profile.monthlyIncome.toLocaleString('en-IN')}) is within the ₹15,000 threshold.`);
        reasonsHi.push(`आपकी आयु 18-40 वर्ष और आय ₹15,000 की सीमा के भीतर है।`);
        whatToVerify.push('Verify readiness for regular monthly auto-debit contribution (₹55 - ₹200 based on age) until age 60.');
        whatToVerifyHi.push('60 वर्ष तक हर महीने उम्र के अनुसार ₹55 से ₹200 नियमित बैंक से कटवाने की सहमति आवश्यक है।');
        if (!profile.hasBankAccount) {
          moreInfoNeeded = true;
          whatToVerify.push('Requires an active savings bank account or Jan Dhan account for auto-debit mandate.');
          whatToVerifyHi.push('किस्त कटने के लिए बचत बैंक खाता या जन धन खाता होना अनिवार्य है।');
        }
      }
    } else if (scheme.id === 'pmsvanidhi') {
      if (profile.occupation === 'street_vendor') {
        if (isEligible) {
          reasons.push('You indicated your occupation as a street vendor, hawker, or market cart seller.');
          reasonsHi.push('आप रेहड़ी-पटरी, ठेला या फेरी लगाकर सामान बेचने का काम करते हैं।');
          whatToVerify.push('Must verify if you have a Vending Certificate, Municipal ID, or Letter of Recommendation (LoR) from your Town Vending Committee.');
          whatToVerifyHi.push('जांचें कि क्या आपके पास नगर पालिका का वेंडिंग प्रमाण पत्र, आईडी कार्ड या सिफारिश पत्र (LoR) है।');
          if (!profile.hasBankAccount) {
            moreInfoNeeded = true;
            whatToVerify.push('Bank account required for loan disbursement.');
            whatToVerifyHi.push('ऋण राशि प्राप्त करने के लिए बैंक खाता आवश्यक है।');
          }
        }
      } else {
        isEligible = false;
        reasons.push('This micro-loan scheme is specifically intended for street vendors and hawkers.');
        reasonsHi.push('यह विशेष ऋण योजना केवल रेहड़ी-पटरी विक्रेताओं के लिए है।');
      }
    } else if (scheme.id === 'pmsby') {
      if (isEligible) {
        reasons.push(`You are in the 18–70 age bracket and eligible for ₹2 Lakh accident insurance for ₹20/year.`);
        reasonsHi.push(`आप 18-70 वर्ष के बीच हैं और मात्र ₹20/वर्ष में ₹2 लाख दुर्घटना बीमा के पात्र हैं।`);
        if (!profile.hasBankAccount) {
          moreInfoNeeded = true;
          whatToVerify.push('A bank or post office savings account is mandatory for the ₹20 annual premium auto-debit.');
          whatToVerifyHi.push('₹20 वार्षिक प्रीमियम स्वतः कटने के लिए बैंक या डाकघर खाता होना जरूरी है।');
        } else {
          whatToVerify.push('Ensure your bank account maintains at least ₹20 balance before May 31 each year.');
          whatToVerifyHi.push('हर साल 31 मई से पहले खाते में कम से कम ₹20 बैलेंस बनाए रखें।');
        }
      }
    } else if (scheme.id === 'pmjjby') {
      if (isEligible) {
        reasons.push('You are in the 18–50 age bracket and eligible for ₹2 Lakh term life insurance for ₹436/year.');
        reasonsHi.push('आप 18-50 वर्ष के बीच हैं और ₹436/वर्ष में ₹2 लाख जीवन बीमा के पात्र हैं।');
        if (!profile.hasBankAccount) {
          moreInfoNeeded = true;
          whatToVerify.push('A bank or post office savings account is required for ₹436 annual auto-debit.');
          whatToVerifyHi.push('वार्षिक ₹436 प्रीमियम कटने के लिए बचत खाता होना अनिवार्य है।');
        } else {
          whatToVerify.push('Confirm your nominee details and maintain balance in May for automatic yearly renewal.');
          whatToVerifyHi.push('नॉमिनी का नाम तय करें और मई माह में नवीनीकरण के लिए खाते में राशि रखें।');
        }
      }
    } else if (scheme.id === 'bocw') {
      if (profile.occupation === 'construction_worker') {
        if (isEligible) {
          reasons.push('You work in building and construction (masonry, carpentry, painting, site labour, plumbing).');
          reasonsHi.push('आप भवन निर्माण, राजमिस्त्री, बढ़ई, पेंटर या मजदूरी का काम करते हैं।');
          whatToVerify.push('Must provide proof of at least 90 days of construction work in the preceding 12 months (certificate from contractor or union).');
          whatToVerifyHi.push('पिछले 12 महीनों में कम से कम 90 दिन निर्माण कार्य करने का प्रमाण पत्र (ठेकेदार या मजदूर यूनियन से) होना जरूरी है।');
        }
      } else {
        isEligible = false;
        reasons.push('BoCW Welfare Board registration is specifically for building and construction workers.');
        reasonsHi.push('यह कल्याण बोर्ड पंजीकरण विशेष रूप से निर्माण कामगारों के लिए है।');
      }
    } else if (scheme.id === 'pmjay') {
      if (isEligible) {
        reasons.push('Low-income unorganised household eligible to check hospital cashless health cover up to ₹5 Lakh/year.');
        reasonsHi.push('कम आय वाले असंगठित परिवार के रूप में प्रति वर्ष ₹5 लाख तक के कैशलेस इलाज के लिए पात्रता जांच सकते हैं।');
        whatToVerify.push('Check whether your family or ration card is listed in the SECC 2011 / Ayushman database at mera.pmjay.gov.in or by calling 14555.');
        whatToVerifyHi.push('जांचें कि क्या आपका राशन कार्ड mera.pmjay.gov.in या 14555 पर आयुष्मान सूची में शामिल है।');
      }
    }

    let status: 'POTENTIAL_MATCH' | 'MORE_INFO_NEEDED' | 'NOT_ELIGIBLE';
    if (!isEligible) {
      status = 'NOT_ELIGIBLE';
    } else if (moreInfoNeeded) {
      status = 'MORE_INFO_NEEDED';
    } else {
      status = 'POTENTIAL_MATCH';
    }

    results.push({
      schemeId: scheme.id,
      scheme,
      status,
      reasons,
      reasonsHi,
      whatToVerify,
      whatToVerifyHi,
    });
  }

  // Sort results: POTENTIAL_MATCH first, then MORE_INFO_NEEDED, then NOT_ELIGIBLE
  return results.sort((a, b) => {
    const priority = { POTENTIAL_MATCH: 1, MORE_INFO_NEEDED: 2, NOT_ELIGIBLE: 3 };
    return priority[a.status] - priority[b.status];
  });
}
