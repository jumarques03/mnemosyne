import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'
import { calcularLayout, LAYOUT_PADRAO } from './medidas.js'

export const LayoutContext = createContext(LAYOUT_PADRAO)

export const useLayout = () => useContext(LayoutContext)

// ---- tamanho da janela ----
// Usamos a visualViewport (a parte da página realmente visível) quando existe: no iOS e no Android
// recente ela encolhe com o teclado virtual, enquanto window.innerHeight não. Multiplicar por `scale`
// desfaz o zoom de pinça, para o layout não mudar de tamanho se o visitante der zoom.
function medirJanela() {
  const vv = window.visualViewport
  const escala = vv ? vv.scale || 1 : 1
  const w = Math.round((vv ? vv.width * escala : window.innerWidth) || 1)
  const h = Math.round((vv ? vv.height * escala : window.innerHeight) || 1)
  return { w: Math.max(1, w), h: Math.max(1, h) }
}

// Já na primeira pintura o contêiner tem a altura certa (o efeito abaixo só a mantém atualizada).
if (typeof window !== 'undefined') {
  document.documentElement.style.setProperty('--altura-app', `${medirJanela().h}px`)
}

// Maior altura vista para a largura atual (a janela sem teclado). Só serve para decidir entre
// paisagem e retrato; o desenho usa a altura visível de verdade.
let larguraRef = 0
let alturaMax = 0

// O snapshot precisa ser estável entre leituras: só trocamos o objeto quando o tamanho muda.
let ultimo = null
function lerJanela() {
  const { w, h } = medirJanela()
  if (!ultimo || ultimo.w !== w || ultimo.h !== h) {
    if (w !== larguraRef) {
      larguraRef = w
      alturaMax = h
    } else if (h > alturaMax) {
      alturaMax = h
    }
    ultimo = { w, h, layout: calcularLayout(w, h, alturaMax) }
  }
  return ultimo
}

function assinar(aviso) {
  const vv = window.visualViewport
  window.addEventListener('resize', aviso)
  window.addEventListener('orientationchange', aviso)
  vv?.addEventListener('resize', aviso)
  return () => {
    window.removeEventListener('resize', aviso)
    window.removeEventListener('orientationchange', aviso)
    vv?.removeEventListener('resize', aviso)
  }
}

/** Layout calculado a partir do tamanho atual da janela (reage a resize, rotação e teclado virtual). */
export function useLayoutDaJanela() {
  const { layout } = useSyncExternalStore(assinar, lerJanela, () => ({ layout: LAYOUT_PADRAO }))

  // O contêiner do app acompanha exatamente a área visível (CSS usa --altura-app).
  useEffect(() => {
    const raiz = document.documentElement
    raiz.style.setProperty('--altura-app', `${layout.alturaVisivel}px`)
    // iOS rola a página para mostrar o campo em foco; como o app é fixo, voltamos ao topo.
    if (layout.teclado) window.scrollTo(0, 0)
  }, [layout.alturaVisivel, layout.teclado])

  // Se o navegador deslocar a área visível (iOS com o teclado aberto), o app desloca junto.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return undefined
    const raiz = document.documentElement
    const acompanhar = () => raiz.style.setProperty('--topo-app', `${Math.round(vv.offsetTop)}px`)
    acompanhar()
    vv.addEventListener('scroll', acompanhar)
    return () => vv.removeEventListener('scroll', acompanhar)
  }, [])

  return layout
}
