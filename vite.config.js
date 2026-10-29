import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Código compatível com iPhones e Androids de alguns anos atrás (sem sintaxe muito recente).
  build: { target: ['es2020', 'safari14', 'chrome87', 'firefox78'] },
  // Em desenvolvimento, as chamadas do chat vão para o servidor em `npm run dev:server`.
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
})
