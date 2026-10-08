let ctx

/** Largura (px, no espaço 1440 × 900) de um texto na fonte indicada, medida pelo próprio navegador. */
export function medirTexto(texto, fonte = '500 21px "Cormorant Garamond"', espacoEntreLetras = 0) {
  ctx ??= document.createElement('canvas').getContext('2d')
  ctx.font = fonte
  // No SVG, o letter-spacing é somado depois de cada letra (inclusive a última).
  return ctx.measureText(texto).width + espacoEntreLetras * [...texto].length
}

/**
 * Posição X inicial de um texto "centralizado" do jeito do design: o SVG foi gerado
 * com uma largura estimada (`fator` × largura real), então o texto sai um pouco
 * à direita do eixo. Usar o mesmo critério mantém a tela idêntica ao design.
 */
export function inicioCentralizado(centro, larguraReal, fator) {
  return centro - (larguraReal * fator) / 2
}

