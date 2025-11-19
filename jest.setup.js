import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'zh-TW',
}));

// Mock @/i18n
jest.mock('@/i18n', () => ({
  useLocale: () => ({ locale: 'zh-TW', setLocale: jest.fn() }),
  localeNames: {
    'zh-TW': '繁體中文',
    'en-US': 'English',
  },
}));

// Polyfill for TextEncoder/TextDecoder (needed for pg in tests)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Suppress console.error in tests unless it's unexpected
// This prevents expected error logs from cluttering test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Only suppress expected error messages from error handling tests
    const message = args[0]?.toString() || '';
    if (
      message.includes('Database error:') ||
      message.includes('Cancel booking error:') ||
      message.includes('Batch booking error:')
    ) {
      return; // Suppress these expected errors
    }
    originalError.call(console, ...args); // Show unexpected errors
  };
});

afterAll(() => {
  console.error = originalError;
});
