import { cor, fonte } from '../../theme.js'

/**
 * Botão desenhado em SVG (como no design). `ouro` = preenchimento translúcido
 * + contorno dourado; `neutro` = contorno creme discreto.
 */
export default function Botao({ x, y, w, h, variante, texto, textoX, textoY, tamanho, espaco = 4, onClick, rotulo }) {
  const ouro = variante === 'ouro'
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label={rotulo ?? texto} onClick={ativar} onKeyDown={ativar}>
      {ouro && <rect className="hit-fill" x={x} y={y} width={w} height={h} rx="2" fill={cor.ouro} opacity="0.12" />}
      <rect
        className={ouro ? undefined : 'hit-stroke-soft'}
        x={x}
        y={y}
        width={w}
        height={h}
        rx="2"
        fill="none"
        stroke={ouro ? cor.ouro : cor.creme}
        strokeWidth={ouro ? 1.5 : 1}
        opacity={ouro ? 1 : 0.35}
      />
      <text
        x={textoX}
        y={textoY}
        fontFamily={fonte.rotulo}
        fontSize={tamanho}
        fontWeight="500"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing={espaco}
      >
        {texto}
      </text>
      <rect className="focus-ring" x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx="4" fill="none" opacity="0" />
    </g>
  )
}
