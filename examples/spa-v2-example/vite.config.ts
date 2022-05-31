import { defineConfig, loadEnv } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import * as path from 'path';

// https://vitejs.dev/config/
const envDir = path.resolve(__dirname, '../..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '');

  return {
    plugins: [createVuePlugin()],
    define: {
      API_KEY: JSON.stringify(env.API_KEY),
    },
  };
});
