import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext.js';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

export const FeedbackWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('haq_saathi_feedback');
    if (saved === 'yes' || saved === 'no') {
      setFeedback(saved);
    }
  }, []);

  const handleVote = (vote: 'yes' | 'no') => {
    setFeedback(vote);
    localStorage.setItem('haq_saathi_feedback', vote);
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm max-w-md mx-auto text-center my-8">
      {feedback ? (
        <div className="flex items-center justify-center gap-2 text-forest-800 text-xs font-bold py-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('helpfulThanks')}</span>
        </div>
      ) : (
        <div>
          <p className="text-xs font-bold text-stone-800 mb-3">
            {t('helpfulPrompt')}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleVote('yes')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-forest-50 text-forest-900 border border-forest-200 hover:bg-forest-100 active:scale-95 transition min-h-[40px]"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-forest-700" />
              <span>{t('yes')}</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 active:scale-95 transition min-h-[40px]"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('no')}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-2">
            {language === 'hi' ? 'कोई व्यक्तिगत डेटा एकत्र नहीं किया जाता' : 'Stored locally on your device only'}
          </p>
        </div>
      )}
    </div>
  );
};
