import { cor, fonte } from '../../theme.js'

/** Sugestão de pergunta (pílula). Geometria em unidades do layout em uso. */
export function Chip({ x, y = 696, w, h = 34, tx, texto, tamanho = 13, onClick }) {
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(texto)
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label={texto} onClick={ativar} onKeyDown={ativar}>
      <rect className="hit-fill" x={x} y={y} width={w} height={h} rx={h / 2} fill={cor.ouro} opacity="0" />
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.55" />
      <text
        x={tx}
        y={y + 22 + (h - 34) / 2}
        fontFamily={fonte.rotulo}
        fontSize={tamanho}
        fontWeight="400"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="0.5"
      >
        {texto}
      </text>
      <rect className="focus-ring" x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={h / 2 + 4} fill="none" opacity="0" />
    </g>
  )
}

/**
 * Campo de texto da pergunta. Enquanto vazio, mostra o texto-guia desenhado em SVG (como no
 * design); o <input> de verdade fica por cima, transparente.
 * `baseline` = y da linha de base do texto; `tamanho` = corpo da fonte.
 */
export function CampoPergunta({ x, baseline, w, tamanho = 22, valor, onMudar, onEnviar }) {
  const altura = Math.round(tamanho * 2.09)
  return (
    <>
      {valor === '' && (
        <text
          x={x}
          y={baseline}
          fontFamily={fonte.texto}
          fontSize={tamanho}
          fontWeight="500"
          fontStyle="italic"
          fill={cor.texto}
          opacity="0.8"
          pointerEvents="none"
        >
          pergunte algo sobre este quadro…
        </text>
      )}
      {/* a linha de base do <input> cai a ~0.652 da altura da fonte dentro da caixa */}
      <foreignObject x={x} y={baseline - altura * 0.652} width={w} height={altura}>
        <input
          className="chat-input"
          style={{ fontSize: tamanho, lineHeight: `${altura}px` }}
          type="text"
          value={valor}
          maxLength={280}
          autoComplete="off"
          aria-label="Pergunte algo sobre este quadro"
          onChange={(e) => onMudar(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnviar(valor)}
        />
      </foreignObject>
    </>
  )
}

/** Botão redondo de enviar (seta). `r` = raio. */
export function BotaoEnviar({ cx, cy, r = 25, onEnviar }) {
  const k = r / 25
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEnviar()
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label="Enviar pergunta" onClick={ativar} onKeyDown={ativar}>
      <circle cx={cx} cy={cy} r={r} fill={cor.ouro} opacity="1" />
      <path
        d="M-11 0 H11 M3 -9 L12 0 L3 9"
        transform={`translate(${cx} ${cy}) scale(${k})`}
        stroke="#0B0907"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="focus-ring" cx={cx} cy={cy} r={r + 5} fill="none" opacity="0" />
    </g>
  )
}
