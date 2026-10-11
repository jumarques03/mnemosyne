import { createContext, useContext, useSyncExternalStore } from 'react'
import { calcularLayout, LAYOUT_PADRAO } from './medidas.js'

export const LayoutContext = createContext(LAYOUT_PADRAO)

export const useLayout = () => useContext(LayoutContext)

// ---- tamanho da janela ----
// O snapshot precisa ser estável entre leituras: guardamos o último par (w, h) e só
// trocamos o objeto quando o tamanho muda de verdade.
let ultimo = null
function lerJanela() {
  const w = Math.max(1, Math.round(window.innerWidth))
  const h = Math.max(1, Math.round(window.innerHeight))
  if (!ultimo || ultimo.w !== w || ultimo.h !== h) ultimo = { w, h, layout: calcularLayout(w, h) }
  return ultimo
}

function assinar(aviso) {
  window.addEventListener('resize', aviso)
  window.addEventListener('orientationchange', aviso)
  return () => {
    window.removeEventListener('resize', aviso)
    window.removeEventListener('orientationchange', aviso)
  }
}

/** Layout calculado a partir do tamanho atual da janela (reage a resize/rotação). */
export function useLayoutDaJanela() {
  return useSyncExternalStore(assinar, lerJanela, () => ({ layout: LAYOUT_PADRAO })).layout
}
