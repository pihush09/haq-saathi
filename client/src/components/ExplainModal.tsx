import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { fetchSchemeExplanation } from '../utils/api.js';
import { ExplainResponse, UserProfile } from '../types/scheme.js';
import {
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
  Calendar,
  Building2,
} from 'lucide-react';

interface ExplainModalProps {
  schemeId: string;
  profile?: UserProfile;
  onClose: () => void;
  onOpenChecklist: (schemeId: string) => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  schemeId,
  profile,
  onClose,
  onOpenChecklist,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchSchemeExplanation(schemeId, language, profile)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('Could not load explanation. Please check the official catalogue directly.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [schemeId, language, profile]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-[#f9f6f0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 flex items-center justify-center text-accent-lime shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-forest-950">
                {t('aiExplanationModalTitle')}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                {data?.isFallback ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {t('fallbackBadgeText')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {t('aiBadgeText')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-200/60 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition min-h-[44px] min-w-[44px]"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-forest-800 animate-spin mb-3" />
              <p className="text-sm font-semibold text-forest-950">{t('loadingExplain')}</p>
              <p className="text-xs text-stone-500 mt-1">Cross-referencing verified official rules...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-sm">
              {error}
            </div>
          ) : data ? (
            <>
              {/* Simple Explanation */}
              <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-900/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
                  {language === 'hi' ? 'योजना क्या है (आसान शब्दों में):' : 'What this scheme does (In plain terms):'}
                </h3>
                <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-medium">
                  {data.simpleExplanation}
                </p>
              </div>

              {/* Why relevant to you */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>{language === 'hi' ? 'यह आपके लिए क्यों महत्वपूर्ण हो सकती है:' : 'Why it may be relevant for your profile:'}</span>
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed pl-5">
                  {data.whyItMayBeRelevant}
                </p>
              </div>

              {/* What to verify */}
              {data.whatToVerify && data.whatToVerify.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-700" />
                    <span>{language === 'hi' ? 'आवेदन से पहले क्या जांचना जरूरी है:' : 'What you must double-check:'}</span>
                  </h3>
                  <ul className="text-xs sm:text-sm text-amber-900 space-y-1.5 pl-5 list-disc marker:text-amber-700">
                    {data.whatToVerify.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              {data.nextSteps && data.nextSteps.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-forest-700" />
                    <span>{language === 'hi' ? 'आधिकारिक अगले कदम:' : 'Official next steps:'}</span>
                  </h3>
                  <ol className="text-xs sm:text-sm text-stone-800 space-y-2 pl-5 list-decimal marker:font-bold marker:text-forest-800">
                    {data.nextSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Uncertainties & Honesty */}
              {data.uncertainties && data.uncertainties.length > 0 && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-stone-100 text-stone-600 text-xs">
                  <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {data.uncertainties.map((u, idx) => (
                      <p key={idx}>{u}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification & Metadata */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                {data.sourceTitle && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{data.sourceTitle}</span>
                  </div>
                )}
                {data.lastVerifiedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{t('lastVerified')} {data.lastVerifiedDate}</span>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#f9f6f0] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenChecklist(schemeId);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-forest-950 border border-stone-300 hover:bg-stone-50 active:scale-95 transition min-h-[44px]"
          >
            <span>{t('btnChecklist')}</span>
            <ArrowRight className="w-4 h-4 text-forest-700" />
          </button>

          {data?.officialUrl && (
            <a
              href={data.officialUrl}
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
