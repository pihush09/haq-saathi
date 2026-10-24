export interface EligibilityRules {
  minAge?: number | null;
  maxAge?: number | null;
  allowedOccupations?: string[];
  maxIncome?: number | null;
  isTaxPayer?: boolean | null;
  hasEpfoEsic?: boolean | null;
  minWorkDays?: number | null;
  requiresBankAccount?: boolean | null;
}

export interface Scheme {
  id: string;
  officialName: string;
  shortName: string;
  shortNameHi?: string;
  category: string;
  categoryHi?: string;
  shortDescription: string;
  shortDescriptionHi?: string;
  plainLanguageDescription: string;
  plainLanguageDescriptionHi?: string;
  officialUrl: string;
  sourceUrl: string;
  sourceTitle: string;
  lastVerifiedDate: string;
  scope: string;
  eligibilityRules: EligibilityRules;
  exclusions: string[];
  exclusionsHi?: string[];
  requiredDocuments: string[];
  requiredDocumentsHi?: string[];
  applicationSteps: string[];
  applicationStepsHi?: string[];
  disclaimer: string;
  disclaimerHi?: string;
}

export interface UserProfile {
  occupation: string;
  age: number;
  state?: string;
  monthlyIncome: number;
  isTaxPayer: boolean;
  hasEpfoEsic: boolean;
  hasBankAccount: boolean;
  isUrbanStreetVendor?: boolean;
  constructionDaysWorked?: number;
}

export type MatchStatus = 'POTENTIAL_MATCH' | 'MORE_INFO_NEEDED' | 'NOT_ELIGIBLE';

export interface SchemeMatch {
  schemeId: string;
  scheme: Scheme;
  status: MatchStatus;
  reasons: string[];
  reasonsHi: string[];
  whatToVerify: string[];
  whatToVerifyHi: string[];
}

export interface ExplainResponse {
  simpleExplanation: string;
  whyItMayBeRelevant: string;
  whatToVerify: string[];
  nextSteps: string[];
  uncertainties: string[];
  officialUrl: string;
  isFallback?: boolean;
  sourceTitle: string;
  lastVerifiedDate: string;
}

export interface ChecklistItem {
  id: string;
  step: number;
  title: string;
  titleHi?: string;
  detail: string;
  detailHi?: string;
  actionUrl?: string;
  isMandatory: boolean;
}

export interface SchemeChecklist {
  schemeId: string;
  schemeName: string;
  documentsToPrepare: string[];
  documentsToPrepareHi?: string[];
  steps: ChecklistItem[];
  officialUrl: string;
  disclaimer: string;
}
