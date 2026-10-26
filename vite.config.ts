import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Each page is its own entry: privacy/index.html builds to dist/privacy/index.html, so GitHub Pages
  // serves /privacy/, and likewise /ko/, /games/night-of-vargold/, /playdata/ and /balance/.
  build: {
    rolldownOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ko: path.resolve(__dirname, 'ko/index.html'),
        vargold: path.resolve(__dirname, 'games/night-of-vargold/index.html'),
        koVargold: path.resolve(__dirname, 'ko/games/night-of-vargold/index.html'),
        privacy: path.resolve(__dirname, 'privacy/index.html'),
        playdata: path.resolve(__dirname, 'playdata/index.html'),
        balance: path.resolve(__dirname, 'balance/index.html'),
      },
    },
  },
})
