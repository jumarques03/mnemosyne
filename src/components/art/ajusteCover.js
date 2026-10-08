// As pinturas são desenhadas num espaço de 300 × 400.
const LARGURA_BASE = 300
const ALTURA_BASE = 400

/** Escala e deslocamento para a pintura cobrir (w × h), recortando o excesso de forma centralizada. */
export function ajusteCover(w, h) {
  const escala = Math.max(w / LARGURA_BASE, h / ALTURA_BASE)
  return {
    escala,
    dx: (w - LARGURA_BASE * escala) / 2,
    dy: (h - ALTURA_BASE * escala) / 2,
  }
}
