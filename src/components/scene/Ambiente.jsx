import { cor } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import Ancora from '../../layout/Ancora.jsx'

/**
 * Fundo da sala: degradê verde-escuro com luz vermelha (topo direito), verde (canto inferior)
 * e dourada (topo esquerdo). Cobre todo o palco; as luzes acompanham os cantos da tela.
 */
export function Fundo() {
  const { limites: b, modo } = useLayout()
  const k = modo === 'retrato' ? 0.7 : 1
  const w = b.x1 - b.x0
  const h = b.y1 - b.y0
  return (
    <g>
      <defs>
        <linearGradient id="sala-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A241F" stopOpacity="1" />
          <stop offset="1" stopColor="#090B0A" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="sala-luz-vermelha" cx={b.x1 - 120} cy={b.y0 + 40} r={640 * k} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9B2A1C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9B2A1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sala-luz-verde" cx={b.x0 + 120} cy={b.y1 - 40} r={680 * k} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2F5A45" stopOpacity="0.75" />
          <stop offset="1" stopColor="#2F5A45" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sala-luz-ouro" cx={b.x0 + 260} cy={b.y0} r={420 * k} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A24B" stopOpacity="0.14" />
          <stop offset="1" stopColor="#C9A24B" stopOpacity="0" />
        </radialGradient>
      </defs>
      {['sala-base', 'sala-luz-vermelha', 'sala-luz-verde', 'sala-luz-ouro'].map((id) => (
        <rect key={id} x={b.x0} y={b.y0} width={w} height={h} rx="0" fill={`url(#${id})`} opacity="1" />
      ))}
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

/** Cornija dourada no topo da sala (com dentículos), de ponta a ponta. */
export function Cornija() {
  const { limites: b } = useLayout()
  const w = b.x1 - b.x0
  const primeiro = Math.floor((b.x0 - 3) / 18)
  const dentes = []
  for (let i = primeiro; 3 + i * 18 < b.x1; i++) dentes.push(3 + i * 18)
  return (
    <Ancora y="topo">
      <defs>
        <linearGradient id="cornija-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A12" stopOpacity="1" />
          <stop offset="1" stopColor="#17100A" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x={b.x0} y="0" width={w} height="16" rx="0" fill="url(#cornija-madeira)" opacity="1" />
      <rect x={b.x0} y="16" width={w} height="3" rx="0" fill={cor.ouro} opacity="0.55" />
      {dentes.map((x) => (
        <rect key={x} x={x} y="21" width="10" height="8" rx="0" fill="#2A1E10" opacity="1" />
      ))}
      <line x1={b.x0} y1="31" x2={b.x1} y2="31" stroke={cor.ouro} strokeWidth="1" opacity="0.3" />
    </Ancora>
  )
}

/** Traçado da greca (meandro) que corre no rodapé, na altura `y`, entre x0 e x1. */
function grecaPath(y, x0, x1) {
  let d = ''
  // No tamanho do design a greca para em 1416 (como no SVG); nos demais, vai até a borda.
  const fim = x1 === 1440 ? 1416 : x1
  for (let x = Math.floor(x0 / 24) * 24; x + 24 <= fim; x += 24) {
    d += `M${x} ${y} V${y - 12} H${x + 16} V${y - 4} H${x + 8} V${y - 8} H${x + 12} M${x + 16} ${y} H${x + 24} `
  }
  return d
}

export function Greca({ y, opacidade }) {
  const { limites: b } = useLayout()
  return (
    <Ancora y="base">
      <path d={grecaPath(y, b.x0, b.x1)} stroke={cor.ouro} strokeWidth="1.6" opacity={opacidade} fill="none" />
    </Ancora>
  )
}

/** Escurecimento nas bordas da tela. */
export function Vinheta() {
  const { limites: b, modo } = useLayout()
  const w = b.x1 - b.x0
  const h = b.y1 - b.y0
  const r = modo === 'retrato' ? Math.hypot(w, h) * 0.53 : 900 * Math.max(w / 1440, h / 900)
  return (
    <g>
      <defs>
        <radialGradient id="vinheta" cx={b.x0 + w / 2} cy={b.y0 + h / 2} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect x={b.x0} y={b.y0} width={w} height={h} rx="0" fill="url(#vinheta)" opacity="1" pointerEvents="none" />
    </g>
  )
}

/** Seta "←" no lugar do menu: mesma posição, traço e cor do ícone original. */
function SetaVoltar({ x, cy, largura, onClick }) {
  const ponta = largura * 0.3
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label="Voltar" onClick={ativar} onKeyDown={ativar}>
      <rect x={x - 12} y={cy - 22} width={largura + 24} height="44" fill="transparent" />
      <path
        d={`M${x + largura} ${cy} H${x} M${x + ponta} ${cy - ponta} L${x} ${cy} L${x + ponta} ${cy + ponta}`}
        stroke={cor.creme}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <rect className="focus-ring" x={x - 14} y={cy - 24} width={largura + 28} height="48" rx="4" fill="none" opacity="0" />
    </g>
  )
}

/**
 * Cabeçalho: marca MNEMOSYNE à esquerda (leva ao início) e, à direita, a seta de voltar
 * (`onVoltar`). Sem `onVoltar`, desenha o ícone de menu do design original.
 * Cada lado fica preso à sua borda.
 */
// Logo (public/logo-mnemosyne.png, 229 × 99): moldura rosa com o nome em branco, no lugar do texto "MNEMOSYNE".
const LOGO = { src: '/logo-mnemosyne.png', proporcao: 229 / 99 }

export function Cabecalho({ onInicio, onVoltar }) {
  const { modo, coluna, H } = useLayout()
  const retrato = modo === 'retrato'
  const marcaX = retrato ? coluna.x + 24 : 60
  // Em telas baixas de celular a logo encolhe um pouco para sobrar espaço ao conteúdo.
  const logoAltura = retrato ? (H < 700 ? 44 : 52) : 62
  const logoLargura = Math.round(logoAltura * LOGO.proporcao)
  const logoY = retrato ? 32 : 30
  const menuX = retrato ? coluna.x + coluna.w - 24 - 32 : 1352
  const menuLargura = retrato ? 32 : 40
  const menuY = retrato ? [47, 57, 67] : [38, 50, 62]

  const marca = (
    <image
      href={LOGO.src}
      x={marcaX}
      y={logoY}
      width={logoLargura}
      height={logoAltura}
      preserveAspectRatio="xMinYMid meet"
      role="img"
      aria-label="Mnemosyne"
    />
  )
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onInicio()
    }
  }
  return (
    <g>
      <Ancora x="esq" y="topo">
        {onInicio ? (
          <g className="hit" role="link" tabIndex={0} aria-label="Voltar ao início" onClick={ativar} onKeyDown={ativar}>
            <rect x={marcaX - 8} y={logoY - 4} width={logoLargura + 16} height={logoAltura + 8} fill="transparent" />
            {marca}
            <rect className="focus-ring" x={marcaX - 10} y={logoY - 6} width={logoLargura + 20} height={logoAltura + 12} rx="4" fill="none" opacity="0" />
          </g>
        ) : (
          marca
        )}
      </Ancora>
      <Ancora x="dir" y="topo">
        {onVoltar ? (
          <SetaVoltar x={menuX} cy={menuY[1]} largura={menuLargura} onClick={onVoltar} />
        ) : (
          menuY.map((y) => (
            <line key={y} x1={menuX} y1={y} x2={menuX + menuLargura} y2={y} stroke={cor.creme} strokeWidth="1.5" opacity="0.85" />
          ))
        )}
      </Ancora>
    </g>
  )
}
