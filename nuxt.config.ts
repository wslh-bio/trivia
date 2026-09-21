// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    // Allows deploying to a GitHub Pages project subpath, e.g. /repo-name/
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },
  runtimeConfig: {
    public: {
      // URL of the deployed Google Apps Script Web App that appends
      // trivia results to a Google Sheet. See README.md for setup.
      gasUrl: process.env.NUXT_PUBLIC_GAS_URL || ''
    }
  }
})
