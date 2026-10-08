import { cor } from '../../theme.js'

/** Cortina de veludo vermelho presa por cordões dourados (tela inicial). */
export default function Cortina() {
  const paineis = [0, 1, 2, 3, 4].map((i) => i * 288)
  const amarras = [0, 1, 2, 3, 4, 5].map((i) => i * 288)
  return (
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
        const x1 = x0 + 288
        const meio = x0 + 144
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
      <rect x="0" y="0" width="1440" height="9" rx="0" fill="#B58A2E" opacity="1" />
      <rect x="0" y="0" width="1440" height="3" rx="0" fill="#E8CF8A" opacity="0.8" />
    </g>
  )
}
