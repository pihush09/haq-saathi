import test from 'node:test';
import assert from 'node:assert/strict';
import { getAllSchemes, getSchemeById, evaluateMatches } from '../src/services/matchingService.js';
import { generateFallbackExplanation } from '../src/services/geminiService.js';
import { generateChecklist } from '../src/services/checklistService.js';
import { UserProfile } from '../src/types.js';

test('Scheme Catalogue Verification', () => {
  const schemes = getAllSchemes();
  assert.ok(schemes.length >= 6, 'Catalogue must have at least 6 verified schemes');

  for (const scheme of schemes) {
    assert.ok(scheme.id, 'Scheme must have an id');
    assert.ok(scheme.officialName, `Scheme ${scheme.id} must have officialName`);
    assert.ok(scheme.shortName, `Scheme ${scheme.id} must have shortName`);
    assert.ok(scheme.officialUrl.startsWith('https://'), `Scheme ${scheme.id} officialUrl must start with https://`);
    assert.ok(Array.isArray(scheme.requiredDocuments), `Scheme ${scheme.id} must have requiredDocuments list`);
    assert.ok(scheme.requiredDocuments.length > 0, `Scheme ${scheme.id} must have at least 1 verified document`);
    assert.ok(Array.isArray(scheme.applicationSteps), `Scheme ${scheme.id} must have applicationSteps list`);
    assert.ok(scheme.applicationSteps.length >= 3, `Scheme ${scheme.id} must have at least 3 application steps`);
    assert.ok(scheme.disclaimer, `Scheme ${scheme.id} must have a clear disclaimer`);
  }
});

test('Matching Logic: Urban Street Vendor Profile', () => {
  const profile: UserProfile = {
    occupation: 'street_vendor',
    age: 32,
    state: 'Delhi',
    monthlyIncome: 12000,
    isTaxPayer: false,
    hasEpfoEsic: false,
    hasBankAccount: true,
  };

  const matches = evaluateMatches(profile);
  const svanidhi = matches.find((m) => m.schemeId === 'pmsvanidhi');
  assert.ok(svanidhi, 'PM SVANidhi must be evaluated');
  assert.equal(svanidhi.status, 'POTENTIAL_MATCH', 'Street vendor must potentially match PM SVANidhi');

  const pmsym = matches.find((m) => m.schemeId === 'pmsym');
  assert.ok(pmsym);
  assert.equal(pmsym.status, 'POTENTIAL_MATCH', '32yo earning <= 15k must potentially match PM-SYM');

  const bocw = matches.find((m) => m.schemeId === 'bocw');
  assert.ok(bocw);
  assert.equal(bocw.status, 'NOT_ELIGIBLE', 'Street vendor must not be eligible for BoCW construction card');
});

test('Matching Logic: Construction Worker Profile', () => {
  const profile: UserProfile = {
    occupation: 'construction_worker',
    age: 28,
    state: 'Uttar Pradesh',
    monthlyIncome: 10000,
    isTaxPayer: false,
    hasEpfoEsic: false,
    hasBankAccount: true,
  };

  const matches = evaluateMatches(profile);
  const bocw = matches.find((m) => m.schemeId === 'bocw');
  assert.ok(bocw);
  assert.equal(bocw.status, 'POTENTIAL_MATCH', 'Construction worker should potentially match BoCW card');

  const svanidhi = matches.find((m) => m.schemeId === 'pmsvanidhi');
  assert.ok(svanidhi);
  assert.equal(svanidhi.status, 'NOT_ELIGIBLE', 'Construction worker should not match PM SVANidhi');
});

test('Matching Logic: Tax Payer & Formal EPFO Exclusion', () => {
  const profile: UserProfile = {
    occupation: 'domestic_worker',
    age: 30,
    state: 'Maharashtra',
    monthlyIncome: 35000,
    isTaxPayer: true,
    hasEpfoEsic: true,
    hasBankAccount: true,
  };

  const matches = evaluateMatches(profile);
  const eshram = matches.find((m) => m.schemeId === 'eshram');
  assert.ok(eshram);
  assert.equal(eshram.status, 'NOT_ELIGIBLE', 'Income tax payer with EPFO must be NOT_ELIGIBLE for e-Shram');

  const pmsym = matches.find((m) => m.schemeId === 'pmsym');
  assert.ok(pmsym);
  assert.equal(pmsym.status, 'NOT_ELIGIBLE', 'Tax payer must be NOT_ELIGIBLE for PM-SYM');
});

test('Matching Logic: Age Exclusion on PM-SYM (entry 18-40)', () => {
  const profile: UserProfile = {
    occupation: 'domestic_worker',
    age: 48,
    state: 'Bihar',
    monthlyIncome: 9000,
    isTaxPayer: false,
    hasEpfoEsic: false,
    hasBankAccount: true,
  };

  const matches = evaluateMatches(profile);
  const pmsym = matches.find((m) => m.schemeId === 'pmsym');
  assert.ok(pmsym);
  assert.equal(pmsym.status, 'NOT_ELIGIBLE', 'Age 48 must be NOT_ELIGIBLE for PM-SYM (cutoff 40)');

  const eshram = matches.find((m) => m.schemeId === 'eshram');
  assert.ok(eshram);
  assert.equal(eshram.status, 'POTENTIAL_MATCH', 'Age 48 is within eShram (16-59)');

  const pmsby = matches.find((m) => m.schemeId === 'pmsby');
  assert.ok(pmsby);
  assert.equal(pmsby.status, 'POTENTIAL_MATCH', 'Age 48 is within PMSBY (18-70)');
});

test('Fallback Explanation Generation', () => {
  const scheme = getSchemeById('pmsym')!;
  const fallbackEn = generateFallbackExplanation(scheme, 'en', { occupation: 'Domestic worker' });

  assert.equal(fallbackEn.isFallback, true);
  assert.equal(fallbackEn.officialUrl, scheme.officialUrl);
  assert.ok(fallbackEn.simpleExplanation.length > 20);
  assert.ok(fallbackEn.whatToVerify.length > 0);
  assert.ok(fallbackEn.nextSteps.length > 0);

  const fallbackHi = generateFallbackExplanation(scheme, 'hi');
  assert.equal(fallbackHi.isFallback, true);
  assert.ok(fallbackHi.simpleExplanation.length > 20);
});

test('Checklist Generation from Verified Catalogue', () => {
  const checklist = generateChecklist('eshram');
  assert.ok(checklist);
  assert.equal(checklist.schemeId, 'eshram');
  assert.ok(checklist.steps.length >= 3);
  assert.ok(checklist.documentsToPrepare.length >= 2);
  assert.equal(checklist.officialUrl, 'https://eshram.gov.in/');
});
