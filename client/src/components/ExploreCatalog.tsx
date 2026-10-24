import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { Scheme } from '../types/scheme.js';
import {
  Search,
  ExternalLink,
  Sparkles,
  ListChecks,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface ExploreCatalogProps {
  schemes: Scheme[];
  onExplainClick: (schemeId: string) => void;
  onChecklistClick: (schemeId: string) => void;
  onStartScreening: () => void;
}

export const ExploreCatalog: React.FC<ExploreCatalogProps> = ({
  schemes,
  onExplainClick,
  onChecklistClick,
  onStartScreening,
}) => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(schemes.map((s) => s.category)))];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const name = (isHi && s.shortNameHi ? s.shortNameHi : s.shortName).toLowerCase();
    const official = s.officialName.toLowerCase();
    const desc = (isHi && s.plainLanguageDescriptionHi ? s.plainLanguageDescriptionHi : s.plainLanguageDescription).toLowerCase();
    const cat = s.category.toLowerCase();

    return matchesCategory && (name.includes(query) || official.includes(query) || desc.includes(query) || cat.includes(query));
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-900 mb-3 border border-forest-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('exploreHeading')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mb-2">
          {language === 'hi' ? 'सभी 7 सत्यापित सरकारी योजनाएं' : 'All 7 Curated Informal Worker Schemes'}
        </h2>
        <p className="text-sm text-stone-600">
          {t('exploreSubheading')}
        </p>
      </div>

      {/* Search and Category Filter bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-sm mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 focus:border-forest-800 focus:outline-none text-sm text-stone-900 bg-stone-50/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition min-h-[40px] ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-cream-50 shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'ALL' ? t('allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100/70 px-2.5 py-1 rounded-lg">
                  {isHi ? (scheme.categoryHi || scheme.category) : scheme.category}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {scheme.scope}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-forest-950 mb-1">
                {isHi ? (scheme.shortNameHi || scheme.shortName) : scheme.shortName}
              </h3>
              <p className="text-xs text-stone-500 font-medium mb-3">
                {scheme.officialName}
              </p>

              <p className="text-sm text-stone-700 mb-4 leading-relaxed">
                {isHi ? (scheme.plainLanguageDescriptionHi || scheme.plainLanguageDescription) : scheme.plainLanguageDescription}
              </p>

              {/* Documents badge list */}
              <div className="mb-4">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1 mb-2">
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t('documentsTitle')}</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {(isHi && scheme.requiredDocumentsHi ? scheme.requiredDocumentsHi : scheme.requiredDocuments).map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <button
                  onClick={() => onExplainClick(scheme.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-forest-900 text-cream-50 hover:bg-forest-800 transition min-h-[44px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-lime" />
                  <span>{t('btnExplain')}</span>
                </button>
                <button
                  onClick={() => onChecklistClick(scheme.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-white text-forest-950 border border-stone-300 hover:bg-stone-50 transition min-h-[44px]"
                >
                  <ListChecks className="w-3.5 h-3.5 text-forest-700" />
                  <span>{t('btnChecklist')}</span>
                </button>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition min-h-[44px] min-w-[44px]"
                  title={t('btnOfficial')}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1 truncate max-w-[200px]" title={scheme.sourceTitle}>
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{scheme.sourceTitle}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{scheme.lastVerifiedDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Call to Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-cream-50 text-center max-w-2xl mx-auto shadow-lg">
        <ShieldCheck className="w-10 h-10 text-accent-lime mx-auto mb-3" />
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
          {language === 'hi' ? 'जानना चाहते हैं कि आप किसके पात्र हैं?' : 'Want to see which ones match you?'}
        </h3>
        <p className="text-sm text-stone-200 mb-5 max-w-lg mx-auto">
          {language === 'hi'
            ? 'हमारे 2 मिनट के सरल प्रोफाइल इंटरव्यू से अपनी पात्रता की मुफ्त स्क्रीनिंग करें।'
            : 'Take our 2-minute worker screening to get personalized potential matches and a next-step checklist.'}
        </p>
        <button
          onClick={onStartScreening}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-base bg-accent-lime text-forest-950 hover:bg-accent-limeHover transition shadow-md min-h-[48px]"
        >
          <span>{t('ctaFind')}</span>
        </button>
      </div>
    </section>
  );
};
