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

/**
 * Posição e tamanho de uma imagem `{ w, h, foco }` para cobrir (w × h) sem distorcer.
 * `foco` [0–1, 0–1] define qual parte do excesso é cortada (0.5 = centralizado).
 */
export function ajusteImagem(imagem, w, h) {
  const escala = Math.max(w / imagem.w, h / imagem.h)
  const largura = imagem.w * escala
  const altura = imagem.h * escala
  const [fx, fy] = imagem.foco ?? [0.5, 0.5]
  return { x: (w - largura) * fx, y: (h - altura) * fy, largura, altura }
}
