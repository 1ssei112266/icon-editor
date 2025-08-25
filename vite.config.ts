import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // WordPress環境でのNode.js変数を定義（ブラウザ互換性）
    'process.env.NODE_ENV': '"production"',
    'global': 'globalThis',
    'process': '{}',
  },
})
