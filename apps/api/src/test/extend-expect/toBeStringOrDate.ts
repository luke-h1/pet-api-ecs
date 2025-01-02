import {
  matcherHint,
  printReceived,
  RECEIVED_COLOR as receivedColor,
} from 'jest-matcher-utils';

const toBeStringOrDate: jest.CustomMatcher = function toBeStringOrDate(
  received,
) {
  const pass = typeof received === 'string' || received instanceof Date;
  if (pass) {
    return {
      message: () =>
        `${matcherHint('.toBeStringOrDate')}\n\n` +
        `Expected value to not be a string or date:\n` +
        `  ${receivedColor(printReceived(received))}`,
      pass: true,
    };
  }
  return {
    message: () =>
      `${matcherHint('.toBeStringOrDate')}\n\n` +
      `Expected value to be a string or date:\n` +
      `  ${receivedColor(printReceived(received))}`,
    pass: false,
  };
};
export default toBeStringOrDate;
