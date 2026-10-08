import { cor } from '../../theme.js'

/** Coluna clássica. (x, capY) = canto do capitel; `fuste` = largura do fuste. */
export function Coluna({ x, capY, fuste, altura, opacidade, idFuste }) {
  const fx = x + 10
  const topo = capY + 22
  const base = topo + altura
  return (
    <g opacity={opacidade}>
      <defs>
        <linearGradient id={idFuste} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E8570" stopOpacity="1" />
          <stop offset="0.3" stopColor="#F1EBDD" stopOpacity="1" />
          <stop offset="0.7" stopColor="#D8CFB9" stopOpacity="1" />
          <stop offset="1" stopColor="#6F6755" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x={x} y={capY} width={fuste + 20} height="12" rx="2" fill="#CFC5AC" opacity="1" />
      <rect x={x + 6} y={capY + 12} width={fuste + 8} height="10" rx="0" fill="#B9AE95" opacity="1" />
      <rect x={fx} y={topo} width={fuste} height={altura} rx="0" fill={`url(#${idFuste})`} opacity="1" />
      {[1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={fx + (fuste * i) / 6}
          y1={topo}
          x2={fx + (fuste * i) / 6}
          y2={base}
          stroke="#3A352A"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
      <rect x={x + 4} y={base} width={fuste + 12} height="8" rx="0" fill="#B9AE95" opacity="1" />
      <rect x={x - 2} y={base + 8} width={fuste + 24} height="10" rx="0" fill="#CFC5AC" opacity="1" />
    </g>
  )
}

/** Busto de mármore. Com `pedestal`, desenha a base preta; sem ela, só ombros e cabeça. */
export function Busto({ x, y, escala, opacidade, pedestal = true, idMarmore, idBase }) {
  const cabeca = (
    <>
      <path d="M-36 0 Q-38 -28 -14 -36 L14 -36 Q38 -28 36 0 Z" fill={`url(#${idMarmore})`} />
      <rect x="-8" y="-52" width="16" height="18" rx="0" fill={`url(#${idMarmore})`} opacity="1" />
      <ellipse cx="0" cy="-72" rx="20" ry="25" fill={`url(#${idMarmore})`} />
      <path d="M-21 -74 Q-22 -100 0 -99 Q22 -100 21 -74 Q14 -88 0 -88 Q-14 -88 -21 -74Z" fill="#CFC5AC" />
      <circle cx="0" cy="-104" r="8" fill="#CFC5AC" opacity="1" />
      <path d="M3 -78 L6 -67 L1 -66" stroke="#8E8570" strokeWidth="1.4" fill="none" />
      <rect x="-10" y="-76" width="6" height="2" rx="0" fill="#6F6755" opacity="1" />
      <rect x="5" y="-76" width="6" height="2" rx="0" fill="#6F6755" opacity="1" />
    </>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} opacity={opacidade}>
      <defs>
        <linearGradient id={idMarmore} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F7F1E3" stopOpacity="1" />
          <stop offset="0.55" stopColor="#D8CFB9" stopOpacity="1" />
          <stop offset="1" stopColor="#8E8570" stopOpacity="1" />
        </linearGradient>
        {pedestal && (
          <linearGradient id={idBase} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2B2B2B" stopOpacity="1" />
            <stop offset="1" stopColor="#0C0C0C" stopOpacity="1" />
          </linearGradient>
        )}
      </defs>
      {pedestal ? (
        <>
          <rect x="-44" y="-12" width="88" height="12" rx="1" fill="#111" opacity="1" />
          <rect x="-36" y="-150" width="72" height="138" rx="0" fill={`url(#${idBase})`} opacity="1" />
          <rect x="-36" y="-150" width="72" height="138" rx="0" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
          <path d="M-20 -140 Q-6 -110 -14 -70 M12 -146 Q22 -100 8 -40" stroke={cor.ouro} strokeWidth="1" opacity=".35" />
          <rect x="-44" y="-162" width="88" height="13" rx="0" fill="#161616" opacity="1" />
          <rect x="-44" y="-162" width="88" height="2" rx="0" fill={cor.ouro} opacity="0.5" />
          <g transform="translate(0 -162)">{cabeca}</g>
        </>
      ) : (
        cabeca
      )}
    </g>
  )
}

/** Arco de pedra com fiadas horizontais (tela de encerramento). */
export function Arco({ x, idFundo }) {
  const dir = x + 240
  const linhas = Array.from({ length: 20 }, (_, i) => 240 + i * 26)
  return (
    <g>
      <defs>
        <linearGradient id={idFundo} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1A12" stopOpacity="1" />
          <stop offset="1" stopColor="#150B08" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={`M${x} 760 V240.0 A120.0 120.0 0 0 1 ${dir} 240.0 V760 Z`} fill={`url(#${idFundo})`} />
      {linhas.map((ly) => (
        <line key={ly} x1={x} y1={ly} x2={dir} y2={ly} stroke="#000" strokeWidth="1" opacity="0.25" />
      ))}
      <path d={`M${x} 760 V240.0 A120.0 120.0 0 0 1 ${dir} 240.0 V760`} stroke={cor.ouro} strokeWidth="1.5" opacity=".4" />
      <path
        d={`M${x + 14} 760 V240.0 A106.0 106.0 0 0 1 ${dir - 14} 240.0 V760`}
        stroke={cor.ouro}
        strokeWidth="1"
        opacity=".2"
      />
    </g>
  )
}
