import { defineNuxtConfig } from 'nuxt';
import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(__dirname, '../../.env'),
});

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    API_KEY: process.env.API_KEY,
    public: {
      API_KEY: process.env.API_KEY,
    },
  },
});
