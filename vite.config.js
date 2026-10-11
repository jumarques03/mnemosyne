import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Em desenvolvimento, as chamadas do chat vão para o servidor em `npm run dev:server`.
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
})
