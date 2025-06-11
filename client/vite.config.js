import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
          '/api': {
        target: 'http://pos-webapp-production.up.railway.app:5000/', // replace with your actual domain
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
  }
  }
})
