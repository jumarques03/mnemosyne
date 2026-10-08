import '@fontsource/playfair-display/700.css'
import '@fontsource/jost/400.css'
import '@fontsource/jost/500.css'
import '@fontsource/jost/600.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/500-italic.css'

const FACES = [
  '700 20px "Playfair Display"',
  '400 12px "Jost"',
  '500 12px "Jost"',
  '600 12px "Jost"',
  '500 20px "Cormorant Garamond"',
  'italic 500 20px "Cormorant Garamond"',
]

/** Baixa todas as faces usadas antes da primeira pintura (evita salto de fonte e medidas erradas). */
export function carregarFontes() {
  const texto = 'AÁÇÕéíüº—→←“”·×0123456789'
  return Promise.all(FACES.map((f) => document.fonts.load(f, texto))).catch(() => {})
}
