import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { OCCUPATIONS, STATES_AND_UTS } from '../data/occupations.js';
import { UserProfile } from '../types/scheme.js';
import {
  Hammer,
  ShoppingBag,
  Home,
  Truck,
  Sprout,
  Package,
  Scissors,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface InterviewFlowProps {
  initialProfile?: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const InterviewFlow: React.FC<InterviewFlowProps> = ({
  initialProfile,
  onSubmit,
  onCancel,
}) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      occupation: '',
      age: '',
      state: 'All India (Central Schemes)',
      monthlyIncome: '',
      isTaxPayer: false,
      hasEpfoEsic: false,
      hasBankAccount: true,
    }
  );

  const [error, setError] = useState<string | null>(null);

  // Helper to render occupation icons dynamically
  const renderOccupationIcon = (iconName: string) => {
    const iconClass = 'w-7 h-7 text-forest-800 shrink-0';
    switch (iconName) {
      case 'Hammer': return <Hammer className={iconClass} />;
      case 'ShoppingBag': return <ShoppingBag className={iconClass} />;
      case 'Home': return <Home className={iconClass} />;
      case 'Truck': return <Truck className={iconClass} />;
      case 'Sprout': return <Sprout className={iconClass} />;
      case 'Package': return <Package className={iconClass} />;
      case 'Scissors': return <Scissors className={iconClass} />;
      default: return <UserCheck className={iconClass} />;
    }
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!profile.occupation) {
        setError(t('errorOccupation'));
        return false;
      }
    } else if (step === 2) {
      const ageNum = Number(profile.age);
      if (!profile.age || isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
        setError(t('errorAge'));
        return false;
      }
    } else if (step === 4) {
      if (profile.monthlyIncome === '' || profile.monthlyIncome === null) {
        setError(t('errorIncome'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      onSubmit(profile);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
          <span>{t('stepIndicator', { current: currentStep, total: totalSteps })}</span>
          <span className="text-forest-800 font-bold">{Math.round(progressPercentage)}% completed</span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-800 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 relative">
        {/* Step 1: Occupation */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-2">
              {t('step1Title')}
            </h2>
            <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200/80 mb-6 text-xs text-stone-700">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>{t('step1Why')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {OCCUPATIONS.map((occ) => {
                const isSelected = profile.occupation === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, occupation: occ.id });
                      setError(null);
                    }}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition border-2 min-h-[88px] ${
                      isSelected
                        ? 'border-forest-800 bg-forest-50/60 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="mt-0.5">{renderOccupationIcon(occ.iconName)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-forest-950">
                          {language === 'hi' ? occ.labelHi : occ.labelEn}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                        {language === 'hi' ? occ.descriptionHi : occ.descriptionEn}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-forest-800 bg-forest-100/70 px-2 py-0.5 rounded-md">
                        {language === 'hi' ? occ.examplesHi : occ.examplesEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Age */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-2">
              {t('step2Title')}
            </h2>
            <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200/80 mb-6 text-xs text-stone-700">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>{t('step2Why')}</span>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <label htmlFor="age-input" className="block text-sm font-semibold text-stone-800 mb-2">
                {language === 'hi' ? 'अपनी आयु (वर्षों में)' : 'Your Age (in completed years)'}
              </label>
              <input
                id="age-input"
                type="number"
                min="14"
                max="100"
                value={profile.age}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setProfile({ ...profile, age: val });
                  setError(null);
                }}
                placeholder={t('agePlaceholder')}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-stone-300 focus:border-forest-800 focus:outline-none text-xl font-bold text-forest-950 transition"
              />

              {/* Quick Select Age Buttons */}
              <p className="text-xs text-stone-500 mt-3 mb-2 font-medium">
                {language === 'hi' ? 'या तुरंत चुनें:' : 'Or tap quick options:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[19, 25, 32, 38, 45, 52, 62].map((quickAge) => (
                  <button
                    key={quickAge}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, age: quickAge });
                      setError(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      profile.age === quickAge
                        ? 'bg-forest-900 text-white border-forest-900'
                        : 'bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {quickAge} {language === 'hi' ? 'वर्ष' : 'yrs'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: State or UT */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-2">
              {t('step3Title')}
            </h2>
            <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200/80 mb-6 text-xs text-stone-700">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>{t('step3Why')}</span>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <label htmlFor="state-select" className="block text-sm font-semibold text-stone-800 mb-2">
                {language === 'hi' ? 'राज्य या केंद्र शासित प्रदेश चुनें' : 'Select State or Union Territory'}
              </label>
              <select
                id="state-select"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-stone-300 focus:border-forest-800 focus:outline-none text-base font-semibold text-forest-950 bg-white transition"
              >
                {STATES_AND_UTS.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-stone-500 mt-2">
                {language === 'hi'
                  ? 'केंद्रीय योजनाएं (ई-श्रम, पीएम-SYM, सुरक्षा बीमा) पूरे भारत में समान रूप से लागू हैं।'
                  : 'Central schemes (e-Shram, PM-SYM, PMSBY) apply uniformly across all Indian states and UTs.'}
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Approximate Monthly Income */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-2">
              {t('step4Title')}
            </h2>
            <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200/80 mb-6 text-xs text-stone-700">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>{t('step4Why')}</span>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { val: 9000, label: t('incomeUpTo10k'), note: 'Eligible for low-income & pension programs' },
                { val: 13000, label: t('income10kTo15k'), note: 'Within PM-SYM ₹15k cutoff' },
                { val: 20000, label: t('income15kTo25k'), note: 'Eligible for e-Shram & accident insurance' },
                { val: 30000, label: t('incomeAbove25k'), note: 'Higher income bracket' },
              ].map((tier) => {
                const isSelected = profile.monthlyIncome === tier.val;
                return (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, monthlyIncome: tier.val });
                      setError(null);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left border-2 transition min-h-[56px] ${
                      isSelected
                        ? 'border-forest-800 bg-forest-50/70 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-base text-forest-950">{tier.label}</span>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {language === 'hi' ? 'अनौपचारिक कामगार आय सीमा' : tier.note}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-forest-800 bg-forest-800 text-white' : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Broad background checks */}
        {currentStep === 5 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 mb-2">
              {t('step5Title')}
            </h2>
            <div className="flex items-start gap-2 p-3 bg-sage-50 rounded-xl border border-sage-200/80 mb-6 text-xs text-stone-700">
              <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>{t('step5Why')}</span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Income Tax Payer */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="mb-2">
                  <span className="font-bold text-sm text-forest-950">{t('questionTax')}</span>
                  <p className="text-xs text-stone-600 mt-0.5">{t('questionTaxSub')}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, isTaxPayer: true })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.isTaxPayer === true
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionYes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, isTaxPayer: false })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.isTaxPayer === false
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionNo')} ({language === 'hi' ? 'अधिकांश कामगार' : 'Most workers'})
                  </button>
                </div>
              </div>

              {/* EPFO / ESIC PF deductions */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="mb-2">
                  <span className="font-bold text-sm text-forest-950">{t('questionPf')}</span>
                  <p className="text-xs text-stone-600 mt-0.5">{t('questionPfSub')}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, hasEpfoEsic: true })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.hasEpfoEsic === true
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionYes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, hasEpfoEsic: false })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.hasEpfoEsic === false
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionNo')} ({language === 'hi' ? 'असंगठित' : 'Informal'})
                  </button>
                </div>
              </div>

              {/* Bank Account */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="mb-2">
                  <span className="font-bold text-sm text-forest-950">{t('questionBank')}</span>
                  <p className="text-xs text-stone-600 mt-0.5">{t('questionBankSub')}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, hasBankAccount: true })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.hasBankAccount === true
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionYes')} ({language === 'hi' ? 'है' : 'I have one'})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, hasBankAccount: false })}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition ${
                      profile.hasBankAccount === false
                        ? 'border-forest-800 bg-forest-800 text-white'
                        : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {t('optionNo')} ({language === 'hi' ? 'अभी नहीं है' : 'Not yet'})
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy reiteration */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-cream-100 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
              <span>{t('privacyText')}</span>
            </div>
          </div>
        )}

        {/* Friendly Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 mb-6 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Back & Next Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-semibold text-sm text-stone-700 hover:bg-stone-100 transition min-h-[48px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? (language === 'hi' ? 'रद्द करें' : 'Cancel') : t('back')}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-95 shadow-md transition min-h-[48px]"
          >
            <span>{currentStep === totalSteps ? t('seeResults') : t('next')}</span>
            <ChevronRight className="w-4 h-4 text-accent-lime" />
          </button>
        </div>
      </div>
    </div>
  );
};
