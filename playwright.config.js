import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'tests/e2e',timeout:20000,workers:1,
  use:{baseURL:process.env.TEST_BASE_URL||'http://127.0.0.1:4173/ssafy-algorithm-mock/',headless:true,screenshot:'only-on-failure'},
  webServer:process.env.TEST_BASE_URL?undefined:{command:'node scripts/serve.mjs',port:4173,reuseExistingServer:!process.env.CI}
});
