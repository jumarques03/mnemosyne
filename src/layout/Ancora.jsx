import { LARGURA, ALTURA } from '../theme.js'
import { useLayout } from './contexto.js'

/**
 * Ancora um grupo às bordas do palco, tomando o desenho de 1440 × 900 como referência.
 * x: 'esq' | 'centro' | 'dir'    y: 'topo' | 'centro' | 'base'
 *
 * No tamanho original do design nada se move. No modo retrato só o eixo y conta
 * (rodapé e cornija continuam colados no fim e no começo da tela); o eixo x é
 * resolvido pelas próprias telas verticais.
 */
export default function Ancora({ x = 'centro', y = 'centro', children }) {
  const { limites, modo } = useLayout()
  const dx = modo === 'retrato' ? 0 : x === 'esq' ? limites.x0 : x === 'dir' ? limites.x1 - LARGURA : 0
  const dy = y === 'topo' ? limites.y0 : y === 'base' ? limites.y1 - ALTURA : 0
  return dx || dy ? <g transform={`translate(${dx} ${dy})`}>{children}</g> : <g>{children}</g>
}
