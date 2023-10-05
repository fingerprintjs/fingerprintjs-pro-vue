import { defineNuxtConfig } from 'nuxt/config';
import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(__dirname, '../../.env'),
});

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // Inject FingerprintJS Pro API key
      API_KEY: process.env.API_KEY,
    },
  },
  devtools: { enabled: true },
});
