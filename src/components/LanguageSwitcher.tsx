'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/i18n';
import { Locale, localeNames } from '@/i18n';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const t = useTranslations('lang');

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'zh-TW' ? 'en-US' : 'zh-TW';
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      title={t('switchTo')}
    >
      <Languages size={18} />
      <span>{localeNames[locale === 'zh-TW' ? 'en-US' : 'zh-TW']}</span>
    </button>
  );
};

export default LanguageSwitcher;
