import React, { useState, useEffect } from 'react';
import { useLanguage } from './i18n/LanguageContext.js';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { InterviewFlow } from './components/InterviewFlow.js';
import { SchemeCard } from './components/SchemeCard.js';
import { ExplainModal } from './components/ExplainModal.js';
import { ChecklistView } from './components/ChecklistView.js';
import { ExploreCatalog } from './components/ExploreCatalog.js';
import { TrustSection } from './components/TrustSection.js';
import { FeedbackWidget } from './components/FeedbackWidget.js';
import { HowItWorksModal } from './components/HowItWorksModal.js';
import { Footer } from './components/Footer.js';

import { Scheme, UserProfile, SchemeMatch } from './types/scheme.js';
import { fetchHealth, fetchAllSchemes, matchProfile } from './utils/api.js';
import {
  RotateCcw,
  BookOpen,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type ViewMode = 'HOME' | 'INTERVIEW' | 'RESULTS' | 'EXPLORE';

export const App: React.FC = () => {
  const { t, language } = useLanguage();
  const isHi = language === 'hi';

  const [view, setView] = useState<ViewMode>('HOME');
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [aiConfigured, setAiConfigured] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Profile and Match State
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<SchemeMatch[]>([]);
  const [moreInfoNeeded, setMoreInfoNeeded] = useState<SchemeMatch[]>([]);
  const [notEligible, setNotEligible] = useState<SchemeMatch[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [showNotEligible, setShowNotEligible] = useState<boolean>(false);

  // Modals
  const [explainSchemeId, setExplainSchemeId] = useState<string | null>(null);
  const [checklistSchemeId, setChecklistSchemeId] = useState<string | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    fetchHealth().then((res) => setAiConfigured(res.aiConfigured));
    fetchAllSchemes().then((data) => setAllSchemes(data));
  }, []);

  // Handle Form Submission from Interview
  const handleProfileSubmit = async (profile: UserProfile) => {
    setActiveProfile(profile);
    setIsDemoActive(false);
    setLoadingResults(true);
    setView('RESULTS');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const matchData = await matchProfile(profile);
      setPotentialMatches(matchData.potentialMatches);
      setMoreInfoNeeded(matchData.moreInfoNeeded);
      setNotEligible(matchData.notEligible);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResults(false);
    }
  };

  // Demo profile loader for judges
  const handleLoadDemo = async (type: 'vendor' | 'construction') => {
    let demoProfile: UserProfile;

    if (type === 'vendor') {
      demoProfile = {
        occupation: 'street_vendor',
        age: 32,
        state: 'Delhi (NCT)',
        monthlyIncome: 12000,
        isTaxPayer: false,
        hasEpfoEsic: false,
        hasBankAccount: true,
      };
    } else {
      demoProfile = {
        occupation: 'construction_worker',
        age: 28,
        state: 'Uttar Pradesh',
        monthlyIncome: 10000,
        isTaxPayer: false,
        hasEpfoEsic: false,
        hasBankAccount: true,
      };
    }

    setActiveProfile(demoProfile);
    setIsDemoActive(true);
    setLoadingResults(true);
    setView('RESULTS');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const matchData = await matchProfile(demoProfile);
      setPotentialMatches(matchData.potentialMatches);
      setMoreInfoNeeded(matchData.moreInfoNeeded);
      setNotEligible(matchData.notEligible);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleRestart = () => {
    setActiveProfile(null);
    setIsDemoActive(false);
    setPotentialMatches([]);
    setMoreInfoNeeded([]);
    setNotEligible([]);
    setView('INTERVIEW');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f6f0] text-stone-900 font-sans selection:bg-forest-100 selection:text-forest-900">
      {/* Top Navigation */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onExploreClick={() => {
          setView('EXPLORE');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onHomeClick={() => {
          setView('HOME');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aiConfigured={aiConfigured}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {view === 'HOME' && (
          <>
            <Hero
              onStartInterview={() => {
                setView('INTERVIEW');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreSchemes={() => {
                setView('EXPLORE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoadDemoProfile={handleLoadDemo}
            />
            <TrustSection />
          </>
        )}

        {/* VIEW 2: INTERVIEW */}
        {view === 'INTERVIEW' && (
          <InterviewFlow
            initialProfile={activeProfile || undefined}
            onSubmit={handleProfileSubmit}
            onCancel={() => setView('HOME')}
          />
        )}

        {/* VIEW 3: RESULTS */}
        {view === 'RESULTS' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Top Bar for Results */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
                    {t('resultsTitle')}
                  </h1>
                  {isDemoActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {t('demoBadge')}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                  {t('resultsSubtitle')}
                </p>
                {activeProfile && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">
                      {isHi ? 'आपकी स्क्रीनिंग प्रोफाइल: ' : 'Screening Profile: '}
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      {activeProfile.occupation.replace(/_/g, ' ')}
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      {activeProfile.age} {isHi ? 'वर्ष' : 'yrs'}
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      ₹{activeProfile.monthlyIncome?.toLocaleString('en-IN')}/mo
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      {activeProfile.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-forest-50 text-forest-900 border border-forest-200 hover:bg-forest-100 transition min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4 text-forest-700" />
                  <span>{t('startOver')}</span>
                </button>
                <button
                  onClick={() => setView('EXPLORE')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-forest-900 text-cream-50 hover:bg-forest-800 transition min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4 text-accent-lime" />
                  <span>{t('ctaExplore')}</span>
                </button>
              </div>
            </div>

            {loadingResults ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-base font-bold text-forest-950">{t('loadingMatches')}</p>
              </div>
            ) : (
              <>
                {/* 1. Potential Matches Section */}
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950">
                      {t('matchedSchemes')} ({potentialMatches.length})
                    </h2>
                  </div>

                  {potentialMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {potentialMatches.map((match) => (
                        <SchemeCard
                          key={match.schemeId}
                          match={match}
                          onExplainClick={(id) => setExplainSchemeId(id)}
                          onChecklistClick={(id) => setChecklistSchemeId(id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
                      <p className="text-sm text-stone-600">
                        {isHi
                          ? 'आपकी वर्तमान जानकारी के अनुसार इनमें से कोई योजना सीधे मेल नहीं खाती।'
                          : 'No exact matches found under the stated conditions in this curated set.'}
                      </p>
                    </div>
                  )}
                </section>

                {/* 2. More Info Needed Section */}
                {moreInfoNeeded.length > 0 && (
                  <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="w-5 h-5 text-amber-700" />
                      <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                        {t('moreInfoNeeded')} ({moreInfoNeeded.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {moreInfoNeeded.map((match) => (
                        <SchemeCard
                          key={match.schemeId}
                          match={match}
                          onExplainClick={(id) => setExplainSchemeId(id)}
                          onChecklistClick={(id) => setChecklistSchemeId(id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Not Matched Schemes (Collapsible) */}
                {notEligible.length > 0 && (
                  <section className="mb-12 bg-white rounded-3xl p-6 border border-stone-200">
                    <button
                      onClick={() => setShowNotEligible(!showNotEligible)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-stone-500" />
                        <h2 className="text-base sm:text-lg font-bold text-stone-800">
                          {t('notEligibleTitle')} ({notEligible.length})
                        </h2>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-forest-800">
                        <span>{showNotEligible ? (isHi ? 'छिपाएं' : 'Hide') : (isHi ? 'देखें क्यों नहीं मिले' : 'View exclusions')}</span>
                        {showNotEligible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {showNotEligible && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-stone-100">
                        {notEligible.map((match) => (
                          <SchemeCard
                            key={match.schemeId}
                            match={match}
                            onExplainClick={(id) => setExplainSchemeId(id)}
                            onChecklistClick={(id) => setChecklistSchemeId(id)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* 4. No Match / Official myScheme Redirection */}
                <div className="bg-forest-900 text-cream-50 p-6 sm:p-8 rounded-3xl shadow-md my-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold mb-2">
                      {t('noMatchTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                      {t('noMatchDesc')}
                    </p>
                  </div>
                  <a
                    href="https://www.myscheme.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-accent-lime text-forest-950 hover:bg-accent-limeHover transition shrink-0 shadow min-h-[48px]"
                  >
                    <span>{t('visitMyScheme')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Feedback Widget */}
                <FeedbackWidget />
              </>
            )}
          </div>
        )}

        {/* VIEW 4: EXPLORE CATALOG */}
        {view === 'EXPLORE' && (
          <ExploreCatalog
            schemes={allSchemes}
            onExplainClick={(id) => setExplainSchemeId(id)}
            onChecklistClick={(id) => setChecklistSchemeId(id)}
            onStartScreening={() => {
              setView('INTERVIEW');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Modals */}
      {explainSchemeId && (
        <ExplainModal
          schemeId={explainSchemeId}
          profile={activeProfile || undefined}
          onClose={() => setExplainSchemeId(null)}
          onOpenChecklist={(id) => {
            setExplainSchemeId(null);
            setChecklistSchemeId(id);
          }}
        />
      )}

      {checklistSchemeId && (
        <ChecklistView
          schemeId={checklistSchemeId}
          onClose={() => setChecklistSchemeId(null)}
        />
      )}

      {isHowItWorksOpen && (
        <HowItWorksModal
          onClose={() => setIsHowItWorksOpen(false)}
          onStart={() => {
            setIsHowItWorksOpen(false);
            setView('INTERVIEW');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Trust & Verification Footer */}
      <Footer />
    </div>
  );
};
