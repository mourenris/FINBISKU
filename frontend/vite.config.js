import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/FINBISKU',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost/FINBISKU',
        changeOrigin: true,
      }
    }
  }
})
