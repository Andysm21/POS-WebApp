import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
          '/api': {
        target: 'https://pos-webapp-production.up.railway.app/', 
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
  }
  }
})
