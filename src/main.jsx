import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { carregarFontes } from './fonts.js'
import App from './App.jsx'

carregarFontes().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
