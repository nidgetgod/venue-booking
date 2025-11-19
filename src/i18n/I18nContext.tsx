'use client';

import React, { createContext, useContext, useState } from 'react';
import { IntlProvider } from 'next-intl';
import zhTW from './locales/zh-TW';
import enUS from './locales/en-US';

export type Locale = 'zh-TW' | 'en-US';

const messages = {
  'zh-TW': zhTW,
  'en-US': enUS,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'zh-TW' || savedLocale === 'en-US')) {
        return savedLocale;
      }
    }
    return 'zh-TW';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider 
        locale={locale} 
        messages={messages[locale]}
        timeZone="Asia/Taipei"
        now={new Date()}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within an I18nProvider');
  }
  return context;
}

// 為了向後兼容，保留 useI18n
export function useI18n() {
  const { locale, setLocale } = useLocale();
  return { locale, setLocale };
}
