import { Scheme, SchemeChecklist, ChecklistItem } from '../types.js';
import { getSchemeById } from './matchingService.js';

export function generateChecklist(schemeId: string): SchemeChecklist | null {
  const scheme = getSchemeById(schemeId);
  if (!scheme) {
    return null;
  }

  const steps: ChecklistItem[] = scheme.applicationSteps.map((stepText, index) => {
    const stepNumber = index + 1;
    const title = `Step ${stepNumber}: ${extractStepTitle(stepText)}`;
    const titleHi = scheme.applicationStepsHi && scheme.applicationStepsHi[index]
      ? `चरण ${stepNumber}: ${extractStepTitle(scheme.applicationStepsHi[index])}`
      : undefined;

    return {
      id: `${scheme.id}-step-${stepNumber}`,
      step: stepNumber,
      title,
      titleHi,
      detail: stepText,
      detailHi: scheme.applicationStepsHi ? scheme.applicationStepsHi[index] : undefined,
      actionUrl: stepNumber === 1 ? scheme.officialUrl : undefined,
      isMandatory: true,
    };
  });

  return {
    schemeId: scheme.id,
    schemeName: scheme.shortName,
    documentsToPrepare: scheme.requiredDocuments,
    documentsToPrepareHi: scheme.requiredDocumentsHi,
    steps,
    officialUrl: scheme.officialUrl,
    disclaimer: scheme.disclaimer,
  };
}

function extractStepTitle(text: string): string {
  const clean = text.replace(/^Step\s*\d+:\s*/i, '').replace(/^चरण\s*\d+:\s*/i, '');
  const firstSentence = clean.split('.')[0];
  if (firstSentence.length > 50) {
    return firstSentence.substring(0, 47) + '...';
  }
  return firstSentence;
}
