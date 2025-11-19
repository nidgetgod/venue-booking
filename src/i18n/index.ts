export type Locale = 'zh-TW' | 'en-US';

export const localeNames: Record<Locale, string> = {
  'zh-TW': '繁體中文',
  'en-US': 'English',
};

export const defaultLocale: Locale = 'zh-TW';

export { I18nProvider, useI18n, useLocale } from './I18nContext';
