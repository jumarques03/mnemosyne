import { LARGURA, ALTURA } from '../theme.js'

// Abaixo desta proporção (largura / altura) a tela vira o layout vertical.
const PROPORCAO_RETRATO = 0.95

// No layout vertical o conteúdo vive numa coluna de 480 unidades; em telas mais largas
// (tablet em pé) o palco cresce até 640 e a coluna fica centralizada.
export const COLUNA = 480
const PALCO_RETRATO_MIN = 480
const PALCO_RETRATO_MAX = 640

export const LAYOUT_PADRAO = calcularLayout(LARGURA, ALTURA)

/**
 * A partir do tamanho da janela, decide o modo e o sistema de coordenadas do palco.
 *
 * paisagem: o desenho de 1440 × 900 fica no centro e o palco cresce nos eixos que sobram
 *           (`mx`/`my` = folga de cada lado). O viewBox começa em (-mx, -my), então as
 *           coordenadas do design continuam valendo e o cenário só se estende para fora.
 * retrato:  palco de `largura` × `altura`, com a coluna de 480 centralizada em `x0`.
 */
export function calcularLayout(janelaW, janelaH) {
  const proporcao = janelaW / janelaH
  if (proporcao < PROPORCAO_RETRATO) {
    const largura = Math.min(PALCO_RETRATO_MAX, Math.max(PALCO_RETRATO_MIN, janelaW))
    const altura = (largura * janelaH) / janelaW
    return {
      modo: 'retrato',
      W: largura,
      H: altura,
      viewBox: `0 0 ${largura} ${altura}`,
      limites: { x0: 0, y0: 0, x1: largura, y1: altura },
      coluna: { x: (largura - COLUNA) / 2, w: COLUNA },
    }
  }
  const W = Math.max(LARGURA, ALTURA * proporcao)
  const H = Math.max(ALTURA, LARGURA / proporcao)
  const mx = (W - LARGURA) / 2
  const my = (H - ALTURA) / 2
  return {
    modo: 'paisagem',
    W,
    H,
    viewBox: `${-mx} ${-my} ${W} ${H}`,
    limites: { x0: -mx, y0: -my, x1: LARGURA + mx, y1: ALTURA + my },
    coluna: null,
  }
}
