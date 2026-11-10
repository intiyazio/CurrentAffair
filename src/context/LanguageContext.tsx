import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  translations,
  CATEGORY_TRANSLATIONS,
  GS_PAPER_TRANSLATIONS,
  SOURCE_TRANSLATIONS,
} from '../utils/translations';
import type { Language, Translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;
  translateCategory: (cat: string) => string;
  translateGSPaper: (paper: string) => string;
  translateGSPaperDesc: (paper: string) => string;
  translateSource: (source: string) => string;
}

const STORAGE_KEY = 'upsc_language_pref';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is STRICTLY English ('en') as requested
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') return saved;
      return 'en'; // Default strictly to English
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const value = useMemo<LanguageContextType>(() => {
    const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const t = (key: keyof Translations): string => {
      const dict = translations[language] || translations.en;
      return dict[key] || translations.en[key] || String(key);
    };

    const translateCategory = (cat: string): string => {
      const match = CATEGORY_TRANSLATIONS[cat];
      if (match) {
        return language === 'hi' ? match.hi : match.en;
      }
      return cat;
    };

    const translateGSPaper = (paper: string): string => {
      const match = GS_PAPER_TRANSLATIONS[paper];
      if (match) {
        return language === 'hi' ? match.hi : match.en;
      }
      return paper;
    };

    const translateGSPaperDesc = (paper: string): string => {
      const match = GS_PAPER_TRANSLATIONS[paper];
      if (match) {
        return language === 'hi' ? match.descHi : match.descEn;
      }
      return '';
    };

    const translateSource = (source: string): string => {
      const match = SOURCE_TRANSLATIONS[source];
      if (match) {
        return language === 'hi' ? match.hi : match.en;
      }
      return source;
    };

    return {
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateCategory,
      translateGSPaper,
      translateGSPaperDesc,
      translateSource,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
