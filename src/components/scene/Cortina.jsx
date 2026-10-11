import { cor } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import Ancora from '../../layout/Ancora.jsx'

const PAINEL = 288

/** Cortina de veludo vermelho presa por cordões dourados, de ponta a ponta no topo da tela. */
export default function Cortina() {
  const { limites: b } = useLayout()
  const w = b.x1 - b.x0
  const inicio = Math.floor(b.x0 / PAINEL) * PAINEL
  const paineis = []
  for (let x = inicio; x < b.x1; x += PAINEL) paineis.push(x)
  const amarras = [...paineis, paineis.at(-1) + PAINEL].filter((x) => x <= b.x1 + 0.5)
  return (
    <Ancora y="topo">
      <g pointerEvents="none">
        <defs>
          <linearGradient id="cortina-veludo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7A1C14" stopOpacity="1" />
            <stop offset="1" stopColor="#360B08" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="cortina-sombra" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {paineis.map((x0) => {
          const x1 = x0 + PAINEL
          const meio = x0 + PAINEL / 2
          const forma = `M${x0} 0 H${x1} V52 Q${meio} 116 ${x0} 52 Z`
          return (
            <g key={x0}>
              <path d={forma} fill="url(#cortina-veludo)" />
              <path d={forma} fill="url(#cortina-sombra)" />
              <path d={`M${x1} 52 Q${meio} 116 ${x0} 52`} stroke={cor.ouro} strokeWidth="2" opacity=".85" />
              <path d={`M${x0 + 72} 0 Q${x0 + 72} 30 ${x0 + 66} 67`} stroke="#000" strokeWidth="1.2" opacity=".25" />
              <path d={`M${meio} 0 Q${meio} 30 ${meio} 82`} stroke="#000" strokeWidth="1.2" opacity=".25" />
              <path d={`M${x0 + 216} 0 Q${x0 + 216} 30 ${x0 + 222} 67`} stroke="#000" strokeWidth="1.2" opacity=".25" />
            </g>
          )
        })}
        {amarras.map((x) => (
          <g key={x}>
            <line x1={x} y1="52" x2={x} y2="80" stroke={cor.ouro} strokeWidth="2" opacity="1" />
            <circle cx={x} cy="86" r="6" fill={cor.ouro} opacity="1" />
            <path d={`M${x - 5} 90 L${x + 5} 90 L${x + 7} 106 L${x - 7} 106Z`} fill={cor.ouro} opacity=".9" />
          </g>
        ))}
        <rect x={b.x0} y="0" width={w} height="9" rx="0" fill="#B58A2E" opacity="1" />
        <rect x={b.x0} y="0" width={w} height="3" rx="0" fill="#E8CF8A" opacity="0.8" />
      </g>
    </Ancora>
  )
}
