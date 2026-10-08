import { cor, fonte } from '../../theme.js'

/** Fundo da sala: degradê verde-escuro com luz vermelha (topo direito) e verde (canto inferior). */
export function Fundo() {
  return (
    <g>
      <defs>
        <linearGradient id="sala-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A241F" stopOpacity="1" />
          <stop offset="1" stopColor="#090B0A" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="sala-luz-vermelha" cx="1320" cy="40" r="640" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9B2A1C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9B2A1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sala-luz-verde" cx="120" cy="860" r="680" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2F5A45" stopOpacity="0.75" />
          <stop offset="1" stopColor="#2F5A45" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sala-luz-ouro" cx="260" cy="0" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A24B" stopOpacity="0.14" />
          <stop offset="1" stopColor="#C9A24B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="900" rx="0" fill="url(#sala-base)" opacity="1" />
      <rect x="0" y="0" width="1440" height="900" rx="0" fill="url(#sala-luz-vermelha)" opacity="1" />
      <rect x="0" y="0" width="1440" height="900" rx="0" fill="url(#sala-luz-verde)" opacity="1" />
      <rect x="0" y="0" width="1440" height="900" rx="0" fill="url(#sala-luz-ouro)" opacity="1" />
    </g>
  )
}

/** Faixas de luz que entram pela janela. */
export function LuzJanela({ xs, y, w, h, opacidade }) {
  return (
    <g>
      <defs>
        <linearGradient id="luz-janela" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="1" />
          <stop offset="1" stopColor="#E8CF8A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {xs.map((x) => (
        <path key={x} d={`M${x} ${y} h${w} l-80 ${h} h-${w} Z`} fill="url(#luz-janela)" opacity={opacidade} />
      ))}
    </g>
  )
}

/** Cornija dourada no topo da sala (com dentículos). */
export function Cornija() {
  return (
    <g>
      <defs>
        <linearGradient id="cornija-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A12" stopOpacity="1" />
          <stop offset="1" stopColor="#17100A" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="16" rx="0" fill="url(#cornija-madeira)" opacity="1" />
      <rect x="0" y="16" width="1440" height="3" rx="0" fill={cor.ouro} opacity="0.55" />
      {Array.from({ length: 80 }, (_, i) => (
        <rect key={i} x={3 + i * 18} y="21" width="10" height="8" rx="0" fill="#2A1E10" opacity="1" />
      ))}
      <line x1="0" y1="31" x2="1440" y2="31" stroke={cor.ouro} strokeWidth="1" opacity="0.3" />
    </g>
  )
}

/** Traçado da greca (meandro) que corre no rodapé, na altura `y`. */
function grecaPath(y) {
  let d = ''
  for (let x = 0; x < 1416; x += 24) {
    d += `M${x} ${y} V${y - 12} H${x + 16} V${y - 4} H${x + 8} V${y - 8} H${x + 12} M${x + 16} ${y} H${x + 24} `
  }
  return d
}

export function Greca({ y, opacidade }) {
  return <path d={grecaPath(y)} stroke={cor.ouro} strokeWidth="1.6" opacity={opacidade} fill="none" />
}

/** Escurecimento nas bordas da tela. */
export function Vinheta() {
  return (
    <g>
      <defs>
        <radialGradient id="vinheta" cx="720" cy="450" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="900" rx="0" fill="url(#vinheta)" opacity="1" pointerEvents="none" />
    </g>
  )
}

/** Cabeçalho: marca MNEMOSYNE e ícone de menu. A marca leva de volta ao início. */
export function Cabecalho({ onInicio }) {
  const marca = (
    <text
      x="60"
      y="56"
      fontFamily={fonte.titulo}
      fontSize="20"
      fontWeight="700"
      fontStyle="normal"
      fill={cor.creme}
      letterSpacing="3"
    >
      MNEMOSYNE
    </text>
  )
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onInicio()
    }
  }
  return (
    <g>
      {onInicio ? (
        <g className="hit" role="link" tabIndex={0} aria-label="Voltar ao início" onClick={ativar} onKeyDown={ativar}>
          <rect x="52" y="34" width="190" height="30" fill="transparent" />
          {marca}
          <rect className="focus-ring" x="48" y="30" width="198" height="38" rx="4" fill="none" opacity="0" />
        </g>
      ) : (
        marca
      )}
      <g>
        <line x1="1352" y1="38" x2="1392" y2="38" stroke={cor.creme} strokeWidth="1.5" opacity="0.85" />
        <line x1="1352" y1="50" x2="1392" y2="50" stroke={cor.creme} strokeWidth="1.5" opacity="0.85" />
        <line x1="1352" y1="62" x2="1392" y2="62" stroke={cor.creme} strokeWidth="1.5" opacity="0.85" />
      </g>
    </g>
  )
}
