import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const envDir = fileURLToPath(new URL('../..', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')

  return {
    plugins: [vue()],
    define: {
      API_KEY: JSON.stringify(env.API_KEY),
    },
  }
})
