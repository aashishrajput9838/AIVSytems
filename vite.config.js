import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

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
        '@': resolve(__dirname_local, './src'),
        '@/components': resolve(__dirname_local, './src/components'),
        '@/features': resolve(__dirname_local, './src/features'),
        '@/shared': resolve(__dirname_local, './src/shared'),
        '@/hooks': resolve(__dirname_local, './src/hooks'),
        '@/services': resolve(__dirname_local, './src/services'),
        '@/utils': resolve(__dirname_local, './src/shared/utils'),
        '@/constants': resolve(__dirname_local, './src/shared/constants'),
        '@/types': resolve(__dirname_local, './src/types'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
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
