import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// テスト用のVite設定
export default defineConfig({
  plugins: [react()],
  define: {
    // ブラウザ環境でのNode.js変数を定義
    'process.env.NODE_ENV': '"production"',
    'global': 'globalThis',
    'process': '{}',
  },
  build: {
    outDir: 'test-dist',
    lib: {
      entry: 'test-main.tsx',
      name: 'ColorTest',
      fileName: 'color-test',
      formats: ['iife']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
})