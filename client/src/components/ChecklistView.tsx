import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { fetchSchemeChecklist } from '../utils/api.js';
import { SchemeChecklist } from '../types/scheme.js';
import {
  X,
  ListChecks,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Loader2,
  FileCheck2,
} from 'lucide-react';

interface ChecklistViewProps {
  schemeId: string;
  onClose: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ schemeId, onClose }) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<SchemeChecklist | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const isHi = language === 'hi';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchSchemeChecklist(schemeId).then((data) => {
      if (isMounted) {
        setChecklist(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [schemeId]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleCopy = () => {
    if (!checklist) return;

    const docs = (isHi && checklist.documentsToPrepareHi ? checklist.documentsToPrepareHi : checklist.documentsToPrepare)
      .map((d, i) => `  [ ] ${i + 1}. ${d}`)
      .join('\n');

    const steps = checklist.steps
      .map((s, i) => {
        const text = isHi && s.detailHi ? s.detailHi : s.detail;
        const done = completedSteps[s.id] ? '[x]' : '[ ]';
        return `  ${done} Step ${i + 1}: ${text}`;
      })
      .join('\n');

    const fullText = `📋 Haq Saathi / हक़ साथी Readiness Checklist\n` +
      `Scheme: ${checklist.schemeName}\n` +
      `Portal: ${checklist.officialUrl}\n\n` +
      `📄 Documents to Carry:\n${docs}\n\n` +
      `🚶 Action Steps:\n${steps}\n\n` +
      `⚠️ Disclaimer: ${checklist.disclaimer}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-[#f9f6f0] print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 flex items-center justify-center text-accent-lime shadow-sm print:hidden">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-forest-950">
                {t('checklistModalTitle')}
              </h2>
              {checklist && (
                <p className="text-xs font-bold text-forest-800">
                  {checklist.schemeName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-200/60 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition min-h-[44px] min-w-[44px] print:hidden"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-forest-800 animate-spin mb-3" />
              <p className="text-sm font-semibold text-forest-950">Preparing verified checklist...</p>
            </div>
          ) : checklist ? (
            <>
              {/* Documents to bring */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck2 className="w-4 h-4 text-forest-800" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                    {t('docsToBring')}
                  </h3>
                </div>
                <div className="space-y-2">
                  {(isHi && checklist.documentsToPrepareHi ? checklist.documentsToPrepareHi : checklist.documentsToPrepare).map((doc, idx) => {
                    const docId = `doc-${idx}`;
                    const isChecked = Boolean(completedSteps[docId]);
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
                          isChecked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleStep(docId)}
                          className="w-5 h-5 rounded border-stone-300 text-forest-800 focus:ring-forest-800 shrink-0 mt-0.5"
                        />
                        <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {doc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Ordered Steps to Apply */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-forest-800" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                    {t('stepsToApply')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {checklist.steps.map((stepItem, idx) => {
                    const isChecked = Boolean(completedSteps[stepItem.id]);
                    return (
                      <div
                        key={stepItem.id}
                        className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                          isChecked ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-stone-200 shadow-sm'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleStep(stepItem.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-stone-400 bg-white hover:border-forest-800'
                          }`}
                          aria-label={`Toggle step ${idx + 1}`}
                        >
                          {isChecked && <Check className="w-4 h-4" />}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-forest-900">
                              {isHi && stepItem.titleHi ? stepItem.titleHi : stepItem.title}
                            </span>
                            {idx === 0 && (
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {language === 'hi' ? 'पहला कदम' : 'First Step'}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isChecked ? 'line-through text-stone-500' : 'text-stone-700'}`}>
                            {isHi && stepItem.detailHi ? stepItem.detailHi : stepItem.detail}
                          </p>

                          {stepItem.actionUrl && (
                            <a
                              href={stepItem.actionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-forest-800 hover:text-forest-950 underline"
                            >
                              <span>{language === 'hi' ? 'सीधे पोर्टल पर जाएं' : 'Go directly to portal'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{t('officialDisclaimer')}: </span>
                  <span>{checklist.disclaimer}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer controls */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#f9f6f0] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition min-h-[44px] ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
              <span>{copied ? t('copiedAlert') : t('btnCopyChecklist')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 transition min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">{t('checklistPrint')}</span>
            </button>
          </div>

          {checklist?.officialUrl && (
            <a
              href={checklist.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-95 shadow-sm transition min-h-[44px]"
            >
              <span>{t('btnOfficial')}</span>
              <ExternalLink className="w-4 h-4 text-accent-lime" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
