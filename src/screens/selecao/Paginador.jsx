import { cor } from '../../theme.js'

function Seta({ cx, cy, direcao, onClick, rotulo }) {
  const d = direcao === 'esq' ? 'M3 -7 L-4 0 L3 7' : 'M-3 -7 L4 0 L-3 7'
  const deslocamento = direcao === 'esq' ? 0.5 : -0.5
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }
  const interativo = Boolean(onClick)
  return (
    <g
      className={interativo ? 'hit' : undefined}
      role={interativo ? 'button' : undefined}
      tabIndex={interativo ? 0 : undefined}
      aria-label={interativo ? rotulo : undefined}
      onClick={interativo ? ativar : undefined}
      onKeyDown={interativo ? ativar : undefined}
    >
      {/* fill transparente: o miolo do círculo também recebe o clique */}
      <circle cx={cx} cy={cy} r="17" fill="transparent" stroke={cor.ouro} strokeWidth="1.2" opacity="0.7" />
      <path
        d={d}
        transform={`translate(${cx + deslocamento} ${cy})`}
        stroke={cor.ouro}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {interativo && <circle className="focus-ring" cx={cx} cy={cy} r="22" fill="none" opacity="0" />}
    </g>
  )
}

/**
 * Setas e pontos de página, como na tela 02. Sem `onIr`/`onAnterior`/`onProximo` é só
 * ilustração (a tela larga mostra todas as obras de uma vez).
 */
export default function Paginador({ cx, cy, total, atual, onAnterior, onProximo, onIr }) {
  return (
    <g>
      <Seta cx={cx - 70} cy={cy} direcao="esq" onClick={onAnterior} rotulo="Obra anterior" />
      <Seta cx={cx + 70} cy={cy} direcao="dir" onClick={onProximo} rotulo="Próxima obra" />
      {Array.from({ length: total }, (_, i) => {
        const x = cx + (i - (total - 1) / 2) * 20
        const ponto =
          i === atual ? (
            <circle cx={x} cy={cy} r="4" fill={cor.ouro} opacity="1" />
          ) : (
            <circle cx={x} cy={cy} r="4" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.6" />
          )
        if (!onIr) return <g key={i}>{ponto}</g>
        const ativar = (e) => {
          if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onIr(i)
          }
        }
        return (
          <g key={i} className="hit" role="button" tabIndex={0} aria-label={`Obra ${i + 1}`} onClick={ativar} onKeyDown={ativar}>
            <circle cx={x} cy={cy} r="10" fill="transparent" />
            {ponto}
            <circle className="focus-ring" cx={x} cy={cy} r="9" fill="none" opacity="0" />
          </g>
        )
      })}
    </g>
  )
}
