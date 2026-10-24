import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-forest-950 text-cream-50 pt-12 pb-8 border-t border-forest-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-accent-lime">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                {language === 'hi' ? 'हक़ साथी' : 'Haq Saathi'}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed mb-4 max-w-sm">
              {t('heroSubtitle')}
            </p>
            <div className="inline-block text-[11px] font-semibold text-accent-limeLight bg-forest-900/80 px-3 py-1 rounded-lg border border-forest-800">
              {t('independentBadge')}
            </div>
          </div>

          {/* Privacy & Ethics */}
          <div>
            <h4 className="font-bold text-sm text-cream-100 uppercase tracking-wider mb-3">
              {t('privacyTitle')}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              {t('privacyText')}
            </p>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              ⚠️ {t('trustNotice')}
            </p>
          </div>

          {/* Official Verification Portals */}
          <div>
            <h4 className="font-bold text-sm text-cream-100 uppercase tracking-wider mb-3">
              {language === 'hi' ? 'प्रमुख आधिकारिक पोर्टल' : 'Key Official Portals'}
            </h4>
            <ul className="text-xs space-y-2 text-stone-300">
              <li>
                <a
                  href="https://www.myscheme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime flex items-center gap-1.5 transition"
                >
                  <span>myScheme National Platform</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://eshram.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime flex items-center gap-1.5 transition"
                >
                  <span>e-Shram Central Worker Register</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://maandhan.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime flex items-center gap-1.5 transition"
                >
                  <span>PM-SYM Pension Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmsvanidhi.mohua.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime flex items-center gap-1.5 transition"
                >
                  <span>PM SVANidhi Street Vendor Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmjay.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime flex items-center gap-1.5 transition"
                >
                  <span>Ayushman Bharat PM-JAY</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3">
          <p>{t('footerRights')}</p>
          <div className="flex items-center gap-1">
            <span>Built with care for India's unorganised workers</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
