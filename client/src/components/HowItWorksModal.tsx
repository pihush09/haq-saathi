import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { X, CheckCircle, HelpCircle, Shield, FileCheck } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onStart: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose, onStart }) => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';

  const steps = [
    {
      num: 1,
      title: isHi ? 'सरल प्रश्नों के उत्तर दें' : 'Answer 5 Quick Screening Questions',
      desc: isHi
        ? 'अपने काम, आयु, राज्य और अनुमानित आय का चयन करें। हम कभी भी आधार, बैंक पासवर्ड या संवेदनशील जानकारी नहीं मांगते।'
        : 'Select your occupation, age, state, and approximate income. We never ask for Aadhaar numbers, OTPs, or bank passwords.',
      icon: <HelpCircle className="w-5 h-5 text-forest-700" />,
    },
    {
      num: 2,
      title: isHi ? 'सत्यापित नियमों से मिलान' : 'Deterministic Rule Matching',
      desc: isHi
        ? 'हमारा सिस्टम सरकारी गजट के सटीक नियमों से आपके उत्तरों की तुलना करता है और संभावित योजनाओं की पहचान करता है।'
        : 'Our engine cross-checks official government eligibility rules directly from our verified catalogue to find potential matches.',
      icon: <CheckCircle className="w-5 h-5 text-forest-700" />,
    },
    {
      num: 3,
      title: isHi ? 'तैयारी चेकलिस्ट व आधिकारिक लिंक' : 'Personalized Checklist & Official Link',
      desc: isHi
        ? 'आवेदन करने से पहले साथ ले जाने वाले दस्तावेजों की सूची देखें, चेकलिस्ट कॉपी करें और सीधे आधिकारिक पोर्टल पर जाएं।'
        : 'See exactly what documents to carry to your nearest CSC or bank, copy the checklist to your phone, and visit official portals.',
      icon: <FileCheck className="w-5 h-5 text-forest-700" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-[#f9f6f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-accent-lime">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold text-forest-950">
              {t('howItWorks')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-200/60 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {steps.map((st) => (
            <div key={st.num} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-2xl bg-forest-100 flex items-center justify-center font-bold text-forest-900 text-sm shrink-0 mt-0.5 border border-forest-200">
                {st.num}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-forest-950 mb-1">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
            <strong>{isHi ? 'ध्यान रखें: ' : 'Please Note: '}</strong>
            {t('trustNotice')}
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-stone-100 bg-[#f9f6f0] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-200 transition"
          >
            {t('close')}
          </button>
          <button
            onClick={() => {
              onClose();
              onStart();
            }}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 text-cream-50 hover:bg-forest-800 transition shadow-sm"
          >
            {t('ctaFind')}
          </button>
        </div>
      </div>
    </div>
  );
};
