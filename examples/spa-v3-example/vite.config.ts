import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
const envDir = path.resolve(__dirname, '../..')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')

  return {
    plugins: [vue()],
    define: {
      API_KEY: JSON.stringify(env.API_KEY),
    },
  }
})
