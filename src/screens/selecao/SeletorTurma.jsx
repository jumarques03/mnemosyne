import { cor, fonte } from '../../theme.js'
import { medirTexto } from '../../utils/medirTexto.js'

const ALTURA = 38
const GAP = 8

/**
 * Seletor de turma: um botão por turma ("OITAVO A", "OITAVO B"…), no lugar dos pontos de página
 * da tela 02 (←/→ também trocam de turma). `compacto` aperta o espaçamento para a coluna estreita do layout vertical; com
 * `larguraMax` os botões se apertam mais, se preciso, para caber na tela.
 */
// corpo, espaço entre letras e folga lateral, do mais folgado ao mais apertado
const MEDIDAS = [
  [15, 4, 32],
  [13, 2, 20],
  [12, 1.5, 14],
  [11, 1, 10],
]

function medir(turmas, [tamanho, espaco, folga]) {
  const fonteRotulo = `500 ${tamanho}px "${fonte.rotulo}"`
  const largura = Math.ceil(Math.max(...turmas.map((t) => medirTexto(t.rotulo, fonteRotulo, espaco)))) + folga
  return { tamanho, espaco, largura, total: turmas.length * largura + (turmas.length - 1) * GAP }
}

export default function SeletorTurma({ cx, cy, turmas, atual, onIr, compacto = false, larguraMax = Infinity }) {
  const candidatas = MEDIDAS.slice(compacto ? 1 : 0).map((m) => medir(turmas, m))
  const { tamanho, espaco, largura, total } = candidatas.find((c) => c.total <= larguraMax) ?? candidatas[candidatas.length - 1]
  const x0 = cx - total / 2

  return (
    <g role="group" aria-label="Turma">
      {turmas.map((turma, i) => {
        const x = x0 + i * (largura + GAP)
        const ativa = i === atual
        const ativar = (e) => {
          if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onIr(i)
          }
        }
        return (
          <g
            key={turma.id}
            className="hit"
            role="button"
            tabIndex={0}
            aria-pressed={ativa}
            aria-label={`Turma ${turma.nome}`}
            onClick={ativar}
            onKeyDown={ativar}
          >
            {ativa && (
              <rect x={x} y={cy - ALTURA / 2} width={largura} height={ALTURA} rx="2" fill={cor.ouro} opacity="0.16" />
            )}
            <rect
              className={ativa ? undefined : 'hit-stroke-soft'}
              x={x}
              y={cy - ALTURA / 2}
              width={largura}
              height={ALTURA}
              rx="2"
              fill="transparent"
              stroke={cor.ouro}
              strokeWidth="1"
              opacity={ativa ? 1 : 0.35}
            />
            <text
              x={x + largura / 2 + espaco / 2}
              y={cy + tamanho * 0.37}
              textAnchor="middle"
              fontFamily={fonte.rotulo}
              fontSize={tamanho}
              fontWeight="500"
              fontStyle="normal"
              fill={ativa ? cor.ouro : cor.texto}
              letterSpacing={espaco}
              opacity={ativa ? 1 : 0.85}
            >
              {turma.rotulo}
            </text>
            <rect className="focus-ring" x={x - 4} y={cy - ALTURA / 2 - 4} width={largura + 8} height={ALTURA + 8} rx="4" />
          </g>
        )
      })}
    </g>
  )
}
