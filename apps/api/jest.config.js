/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  testMatch: [
    '<rootDir>/src/**/*.(test).{js,jsx,ts,tsx}',
    '<rootDir>/test/**/*.(test).{js,jsx,ts,tsx}',
  ],
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost:8000/',
  },
  setupFiles: ['dotenv/config', './src/test/setEnvVars.js'],
  resetMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'e2e'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/$1',
    '^@validation/(.*)$': '<rootDir>/../../packages/validation/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  coverageThreshold: {
    global: {
      statements: 93.8,
      branches: 85,
      lines: 95,
      functions: 96,
    },
  },
};
module.exports = config;
