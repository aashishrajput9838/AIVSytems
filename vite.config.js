import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, root, '')
  const proxyTarget = env.VITE_PROXY_TARGET
  const __dirname_local = path.dirname(fileURLToPath(import.meta.url))

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname_local, './src'),
      },
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
  }
})
