import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { ShieldCheck, Lock, AlertTriangle, ExternalLink, Award } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { t, language } = useLanguage();

  const officialSources = [
    { name: 'e-Shram Portal', url: 'https://eshram.gov.in/', ministry: 'Ministry of Labour & Employment' },
    { name: 'PM-SYM (maandhan.in)', url: 'https://maandhan.in/', ministry: 'Ministry of Labour & Employment / LIC' },
    { name: 'PM SVANidhi Portal', url: 'https://pmsvanidhi.mohua.gov.in/', ministry: 'Ministry of Housing & Urban Affairs' },
    { name: 'Jan Suraksha (PMSBY / PMJJBY)', url: 'https://www.jansuraksha.gov.in/', ministry: 'Department of Financial Services, MoF' },
    { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in/', ministry: 'National Health Authority' },
    { name: 'Official myScheme National Portal', url: 'https://www.myscheme.gov.in/', ministry: 'Digital India / MeitY' },
  ];

  return (
    <section className="bg-cream-100 py-12 border-t border-forest-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Anti-Fraud Banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-900">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-base text-amber-950 mb-1">
              {language === 'hi' ? 'महत्वपूर्ण धोखाधड़ी रोकथाम चेतावनी' : 'Important Anti-Fraud Security Warning'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {t('trustNotice')}
            </p>
          </div>
        </div>

        {/* 3 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-forest-950 mb-2">
              {language === 'hi' ? '100% सत्यापित स्रोत' : '100% Verified Facts'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'सभी नियम सीधे केंद्रीय राजपत्र, आधिकारिक मंत्रालयों और सरकारी पोर्टलों से लिए गए हैं। कोई भी जानकारी काल्पनिक नहीं है।'
                : 'All criteria, benefit amounts, and exclusions are verified directly against published government gazettes and ministry portals.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-forest-950 mb-2">
              {language === 'hi' ? 'शून्य व्यक्तिगत डेटा संग्रह' : 'Zero Data Storage'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'हक़ साथी किसी भी डेटाबेस में आपका नाम, फोन या संवेदनशील जानकारी कभी स्टोर नहीं करता। आपकी स्क्रीनिंग पूरी तरह निजी है।'
                : 'No login required. We do not store your profile or log sensitive details. Your answers stay strictly in your device memory.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-forest-950 mb-2">
              {language === 'hi' ? 'स्पष्ट व पारदर्शी भाषा' : 'Careful Screening Status'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'हम कभी भी झूठे वादे नहीं करते। हम स्पष्ट रूप से बताते हैं कि क्या संभावित मिलान है और आपको आगे क्या जांचना है।'
                : 'We clearly differentiate between screening relevance and official approval. You are always guided to verified portals.'}
            </p>
          </div>
        </div>

        {/* Official Sources directory */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
          <h4 className="font-extrabold text-base text-forest-950 mb-4 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-forest-700" />
            <span>{t('footerSources')}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {officialSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-stone-50 hover:bg-forest-50/70 border border-stone-200/80 hover:border-forest-300 transition flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-xs text-forest-950 group-hover:text-forest-800 flex items-center gap-1">
                    {source.name}
                    <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-forest-700 inline" />
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">{source.ministry}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
