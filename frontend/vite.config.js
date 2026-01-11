import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../backend/public', // Build directly to backend public folder
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ai-invoice-app-backend2.onrender.com/', // Your backend URL
        changeOrigin: true,
      },
    },
  },
})
