import '@testing-library/jest-dom'

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
