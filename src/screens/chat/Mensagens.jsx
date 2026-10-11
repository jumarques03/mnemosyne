import { cor, fonte } from '../../theme.js'
import { Cantinhos } from '../../components/scene/Ornamentos.jsx'
import Paleta from '../../components/scene/Paleta.jsx'
import { LINHA, PAD_X } from './layout.js'

function Avatar({ cx, cy, visitante }) {
  if (visitante) {
    return (
      <>
        <circle cx={cx} cy={cy} r="16" fill="#2A0F0C" stroke={cor.vermelho} strokeWidth="1.2" opacity="1" />
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fontFamily={fonte.rotulo}
          fontSize="14"
          fontWeight="500"
          fontStyle="normal"
          fill={cor.creme}
        >
          V
        </text>
      </>
    )
  }
  return (
    <>
      <circle cx={cx} cy={cy} r="16" fill="#17201B" stroke={cor.ouro} strokeWidth="1.2" opacity="1" />
      <Paleta x={cx - 12.07} y={cy - 3.57} escala={0.17} />
    </>
  )
}

/** Uma mensagem: avatar, bolha com cantos decorativos, linhas de texto e horário. */
export function Mensagem({ item, cfg }) {
  const { m, x, y, w, h, linhas } = item
  const visitante = m.de === 'visitante'
  const tinta = visitante ? cor.vermelho : cor.ouro
  const avatarX = visitante ? cfg.visitante.avatarX : cfg.curadoria.avatarX
  return (
    <g>
      {!visitante && <Avatar cx={avatarX} cy={y + 22} />}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="3"
        fill={visitante ? '#2A0F0C' : '#101311'}
        stroke={tinta}
        strokeWidth="1"
        opacity={visitante ? 0.95 : 0.9}
      />
      <Cantinhos x={x} y={y} w={w} h={h} recuo={4} cor={tinta} opacidade="0.9" />
      {linhas.map((linha, i) => (
        <text
          key={i}
          x={x + PAD_X}
          y={y + (visitante ? 36 : 35) + i * LINHA}
          fontFamily={fonte.texto}
          fontSize="24"
          fontWeight="500"
          fontStyle="normal"
          fill={cor.creme}
        >
          {linha}
        </text>
      ))}
      {visitante && <Avatar cx={avatarX} cy={y + 22} visitante />}
      <text
        x={visitante ? cfg.visitante.bordaDireita : cfg.curadoria.bolhaX}
        y={y + h + 18}
        textAnchor={visitante ? 'end' : undefined}
        fontFamily={fonte.rotulo}
        fontSize="11"
        fontWeight="400"
        fontStyle="normal"
        fill={cor.texto}
        letterSpacing="1"
        opacity="0.7"
      >
        {m.hora}
      </text>
    </g>
  )
}

/** Indicador "a curadoria está digitando…" */
export function Digitando({ y, cfg }) {
  const x = cfg.curadoria.bolhaX
  const pontos = [
    [x + 22, cor.ouro, 1, 0],
    [x + 37, cor.vermelho, 1, 0.2],
    [x + 52, cor.texto, 0.7, 0.4],
  ]
  return (
    <g>
      <Avatar cx={cfg.curadoria.avatarX} cy={y + 17} />
      <rect x={x} y={y} width="74" height="34" rx="17" fill="#101311" stroke={cor.ouro} strokeWidth="1" opacity="0.9" />
      {pontos.map(([cx, fill, opacidade, atraso]) => (
        <circle
          key={cx}
          className="typing-dot"
          style={{ animationDelay: `${atraso}s` }}
          cx={cx}
          cy={y + 17}
          r="3.5"
          fill={fill}
          opacity={opacidade}
        />
      ))}
    </g>
  )
}
