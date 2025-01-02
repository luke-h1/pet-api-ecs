import type { PlaywrightTestConfig } from '@playwright/test';

const baseConfig: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 30 * 1000,
  name: 'pets-api E2E Tests',
  expect: {
    timeout: 30000,
  },
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8000',
    extraHTTPHeaders: {},
  },
  outputDir: 'test-results/',
};

export default baseConfig;
