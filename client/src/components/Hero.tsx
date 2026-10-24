import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { Sparkles, ArrowRight, BookOpen, CheckCircle2, Lock, ShieldAlert } from 'lucide-react';

interface HeroProps {
  onStartInterview: () => void;
  onExploreSchemes: () => void;
  onLoadDemoProfile: (type: 'vendor' | 'construction') => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartInterview,
  onExploreSchemes,
  onLoadDemoProfile,
}) => {
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-forest-50/50 via-[#f9f6f0] to-[#f9f6f0]">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-limeLight/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Independent Prototype Banner */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-forest-900 text-cream-50 shadow-sm mb-6 border border-forest-800">
          <span className="w-2 h-2 rounded-full bg-accent-lime animate-pulse" />
          <span>{t('independentBadge')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-forest-950 tracking-tight leading-tight sm:leading-tight mb-4">
          {t('heroTitle')}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-700 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          <button
            onClick={onStartInterview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-base bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-[0.98] shadow-md hover:shadow-lg transition min-h-[52px]"
          >
            <span>{t('ctaFind')}</span>
            <ArrowRight className="w-5 h-5 text-accent-lime" />
          </button>

          <button
            onClick={onExploreSchemes}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base bg-white text-forest-950 hover:bg-forest-50 border border-forest-900/15 shadow-sm hover:shadow transition min-h-[52px]"
          >
            <BookOpen className="w-4 h-4 text-forest-700" />
            <span>{t('ctaExplore')}</span>
          </button>
        </div>

        {/* Judge Demo Quick Buttons */}
        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-stone-200/80 shadow-sm max-w-xl mx-auto mb-8 text-left">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-forest-700" />
            <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
              {language === 'hi' ? 'परीक्षकों के लिए डेमो प्रोफाइल (काल्पनिक डेटा)' : 'Judge Demo Profiles (Fictional Sample Data)'}
            </span>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            {language === 'hi'
              ? 'बिना फॉर्म भरे तुरंत परिणाम देखने के लिए नीचे दिए गए काल्पनिक कामगार प्रोफाइल चुनें:'
              : 'Test the deterministic screening engine immediately without filling out the form:'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onLoadDemoProfile('vendor')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cream-100 text-forest-950 hover:bg-cream-200 border border-stone-300 active:scale-95 transition"
            >
              <span>🛒 {language === 'hi' ? 'रमेश (रेहड़ी-पटरी विक्रेता, दिल्ली, ₹12k)' : 'Ramesh (Street Vendor, Delhi, ₹12k)'}</span>
            </button>
            <button
              onClick={() => onLoadDemoProfile('construction')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cream-100 text-forest-950 hover:bg-cream-200 border border-stone-300 active:scale-95 transition"
            >
              <span>🔨 {language === 'hi' ? 'सुनीता (निर्माण मजदूर, यूपी, ₹10k)' : 'Sunita (Construction Worker, UP, ₹10k)'}</span>
            </button>
          </div>
        </div>

        {/* Worker Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-stone-200/70">
            <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-forest-950">
                {language === 'hi' ? 'सत्यापित नियम' : 'Deterministic Rules'}
              </h2>
              <p className="text-[11px] text-stone-600 leading-normal">
                {language === 'hi' ? 'केवल सरकारी पोर्टल के नियमों से मिलान' : 'Matching based strictly on verified portal rules'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-stone-200/70">
            <Lock className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-forest-950">
                {language === 'hi' ? 'पूर्ण गोपनीयता' : 'Zero Sensitive Data'}
              </h2>
              <p className="text-[11px] text-stone-600 leading-normal">
                {language === 'hi' ? 'कोई आधार या बैंक नंबर कभी नहीं मांगा जाता' : 'Never asks for Aadhaar, OTPs, or bank passwords'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 border border-stone-200/70">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-forest-950">
                {language === 'hi' ? 'ईमानदार सलाह' : 'Zero False Promises'}
              </h2>
              <p className="text-[11px] text-stone-600 leading-normal">
                {language === 'hi' ? 'संभावित पात्रता और जरूरी दस्तावेजों की स्पष्ट जानकारी' : 'Clear distinction between screening and final approval'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
