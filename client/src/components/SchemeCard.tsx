import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { SchemeMatch } from '../types/scheme.js';
import {
  ExternalLink,
  Sparkles,
  ListChecks,
  Copy,
  Check,
  AlertTriangle,
  Calendar,
  Building2,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface SchemeCardProps {
  match: SchemeMatch;
  onExplainClick: (schemeId: string) => void;
  onChecklistClick: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  match,
  onExplainClick,
  onChecklistClick,
}) => {
  const { t, language } = useLanguage();
  const { scheme, status, reasons, reasonsHi, whatToVerify, whatToVerifyHi } = match;
  const isHi = language === 'hi';

  const [copied, setCopied] = useState(false);

  const handleCopyChecklist = () => {
    const title = isHi ? (scheme.shortNameHi || scheme.shortName) : scheme.shortName;
    const docs = (isHi && scheme.requiredDocumentsHi ? scheme.requiredDocumentsHi : scheme.requiredDocuments)
      .map((d, i) => `  ${i + 1}. ${d}`)
      .join('\n');
    const steps = (isHi && scheme.applicationStepsHi ? scheme.applicationStepsHi : scheme.applicationSteps)
      .map((s, i) => `  ${i + 1}. ${s}`)
      .join('\n');

    const textToCopy = `📋 Haq Saathi / हक़ साथी — ${title}\n` +
      `🌐 Official Portal: ${scheme.officialUrl}\n\n` +
      `📄 Documents to Carry:\n${docs}\n\n` +
      `🚶 Next Steps:\n${steps}\n\n` +
      `⚠️ Disclaimer: ${isHi && scheme.disclaimerHi ? scheme.disclaimerHi : scheme.disclaimer}\n` +
      `Source: ${scheme.sourceTitle} (Verified ${scheme.lastVerifiedDate})`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getStatusBadge = () => {
    if (status === 'POTENTIAL_MATCH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          {t('matchedBadge')}
        </span>
      );
    }
    if (status === 'MORE_INFO_NEEDED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          {t('moreInfoBadge')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
        {t('notEligibleBadge')}
      </span>
    );
  };

  return (
    <article className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Header: Category, Status Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100/70 px-2.5 py-1 rounded-lg">
            {isHi ? (scheme.categoryHi || scheme.category) : scheme.category}
          </span>
          {getStatusBadge()}
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-1 leading-snug">
          {isHi ? (scheme.shortNameHi || scheme.shortName) : scheme.shortName}
        </h3>
        <p className="text-xs text-stone-500 font-medium mb-4">
          {scheme.officialName}
        </p>

        {/* Short Description */}
        <p className="text-sm text-stone-700 mb-5 leading-relaxed font-normal">
          {isHi ? (scheme.plainLanguageDescriptionHi || scheme.plainLanguageDescription) : scheme.plainLanguageDescription}
        </p>

        {/* Why this might be relevant */}
        <div className="mb-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-900/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-950 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-forest-700" />
            <span>{t('whyRelevantTitle')}</span>
          </div>
          <ul className="text-xs text-stone-700 space-y-1 pl-4 list-disc marker:text-forest-700">
            {(isHi && reasonsHi?.length ? reasonsHi : reasons).map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* What to verify before applying */}
        {(whatToVerify?.length > 0 || (isHi && whatToVerifyHi?.length > 0)) && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('whatToVerifyTitle')}</span>
            </div>
            <ul className="text-xs text-amber-900 space-y-1 pl-4 list-disc marker:text-amber-700">
              {(isHi && whatToVerifyHi?.length ? whatToVerifyHi : whatToVerify).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Verified documents to prepare */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2">
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>{t('documentsTitle')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(isHi && scheme.requiredDocumentsHi ? scheme.requiredDocumentsHi : scheme.requiredDocuments).map((doc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-xs font-medium text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200"
              >
                ✓ {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons & Trust Footer */}
      <div className="pt-4 border-t border-stone-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {/* Explain in simple language */}
          <button
            onClick={() => onExplainClick(scheme.id)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-95 transition min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-accent-lime" />
            <span>{t('btnExplain')}</span>
          </button>

          {/* What should I do next? (Checklist) */}
          <button
            onClick={() => onChecklistClick(scheme.id)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-forest-950 border border-stone-300 hover:bg-stone-50 active:scale-95 transition min-h-[44px]"
          >
            <ListChecks className="w-4 h-4 text-forest-700" />
            <span>{t('btnChecklist')}</span>
          </button>

          {/* Open Official Website */}
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-forest-900 border border-stone-200 hover:bg-stone-50 active:scale-95 transition min-h-[44px]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>{t('btnOfficial')}</span>
          </a>

          {/* Copy Checklist */}
          <button
            onClick={handleCopyChecklist}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition min-h-[44px] ${
              copied
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50 active:scale-95'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? t('copiedAlert') : t('btnCopyChecklist')}</span>
          </button>
        </div>

        {/* Source metadata & verification date */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
          <div className="flex items-center gap-1 truncate max-w-xs" title={scheme.sourceTitle}>
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{scheme.sourceTitle}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{t('lastVerified')} {scheme.lastVerifiedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
