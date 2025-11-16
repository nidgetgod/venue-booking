import '@testing-library/jest-dom'

// Polyfill for TextEncoder/TextDecoder (needed for pg in tests)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
