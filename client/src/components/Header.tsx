import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { ShieldCheck, HelpCircle, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onExploreClick: () => void;
  onHomeClick: () => void;
  aiConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onExploreClick,
  onHomeClick,
  aiConfigured,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#f9f6f0]/95 backdrop-blur-md border-b border-forest-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 rounded-lg p-1 -ml-1 transition"
          aria-label="Haq Saathi Home"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-accent-lime shadow-sm group-hover:bg-forest-800 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-forest-950 font-sans">
                {language === 'hi' ? 'हक़ साथी' : 'Haq Saathi'}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-100 text-forest-800 border border-forest-200">
                {language === 'hi' ? 'कामगार सेवा' : 'Worker First'}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium hidden xs:block">
              {t('tagline')}
            </p>
          </div>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Mode indicator pill */}
          <div
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              aiConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
            title={aiConfigured ? 'Gemini AI configured' : 'Using verified offline catalogue mode'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiConfigured ? 'Gemma AI Active' : 'Offline Verified Mode'}</span>
          </div>

          {/* Explore all schemes button */}
          <button
            onClick={onExploreClick}
            className="text-xs sm:text-sm font-semibold text-forest-900 hover:text-forest-700 px-3 py-2 rounded-lg hover:bg-forest-100/60 transition min-h-[44px] flex items-center"
          >
            {language === 'hi' ? 'योजनाएं' : 'Explore'}
          </button>

          {/* How it works modal trigger */}
          <button
            onClick={onOpenHowItWorks}
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-700 hover:text-forest-900 px-3 py-2 rounded-lg hover:bg-stone-200/50 transition min-h-[44px]"
            aria-label={t('howItWorks')}
          >
            <HelpCircle className="w-4 h-4 text-forest-700" />
            <span>{t('howItWorks')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-95 shadow-sm transition min-h-[44px] border border-forest-950/20"
            aria-label="Toggle language between English and Hindi"
          >
            <Globe className="w-4 h-4 text-accent-lime" />
            <span>{language === 'en' ? 'हिंदी में पढ़ें' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
