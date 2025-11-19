import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // 從 localStorage 或 cookies 獲取語言設定
  const locale = 'zh-TW'; // 預設語言

  return {
    locale,
    messages: (await import(`./locales/${locale}.ts`)).default,
  };
});
