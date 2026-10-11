import { cor, fonte } from '../../theme.js'

const n = (v) => Number(v.toFixed(2))

/** Respingo de tinta. `u` é a unidade de escala (raio da gota principal = 7u). */
export function Respingo({ cx, cy, u, cor: tinta, opacidade }) {
  const gotas = [
    [0, 0, 7],
    [11, -5, 2.5],
    [-13, 4, 3],
    [5, 13, 2],
    [-6, -12, 1.75],
    [17, 6, 1.5],
    [-17, -4, 1.25],
    [2, -18, 1.25],
    [14, -14, 1],
  ]
  return (
    <g>
      {gotas.map(([dx, dy, r], i) => (
        <circle key={i} cx={n(cx + dx * u)} cy={n(cy + dy * u)} r={n(r * u)} fill={tinta} opacity={opacidade} />
      ))}
      <rect
        x={n(cx - 1.5 * u)}
        y={n(cy + 3 * u)}
        width={n(3 * u)}
        height={n(15 * u)}
        rx={n(1.5 * u)}
        fill={tinta}
        opacity={opacidade}
      />
      <circle cx={cx} cy={n(cy + 20 * u)} r={n(2.5 * u)} fill={tinta} opacity={opacidade} />
    </g>
  )
}

/** Pincelada decorativa (sublinhado). */
export function Pincelada({ x, y, sx, sy, cor: tinta, opacidade }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <path
        d="M2 22 C20 6 70 2 130 6 C190 10 250 4 296 14 L288 18 L298 24 L280 26 L292 32 C230 40 150 36 90 38 C50 40 20 34 2 22Z"
        fill={tinta}
        opacity={opacidade}
      />
      <path d="M14 20 C80 12 190 14 280 20" stroke="#FFF" strokeWidth="1.2" opacity=".2" />
      <path d="M20 29 C100 24 200 28 270 28" stroke="#000" strokeWidth="1.2" opacity=".2" />
    </g>
  )
}

/** Linha em degraus que termina num losango. */
export function LinhaDecorativa({ de, para, cor: tinta, opLinha, opLosango }) {
  const [x0, y0] = de
  const [x1, y1] = para
  const meio = (x0 + x1) / 2
  return (
    <g>
      <path d={`M${x0} ${y0} H${meio} V${y1} H${x1}`} stroke={tinta} strokeWidth="1" opacity={opLinha} />
      <path d={`M${x1} ${y1 - 4} L${x1 + 4} ${y1} L${x1} ${y1 + 4} L${x1 - 4} ${y1} Z`} fill={tinta} opacity={opLosango} />
    </g>
  )
}

/** Cantos em "L" nas pontas de um painel. */
export function Cantinhos({ x, y, w, h, recuo, cor: tinta, opacidade }) {
  const a = recuo
  const d =
    `M${x + a} ${y + a + 9} V${y + a} H${x + a + 9} ` + `M${x + w - a - 9} ${y + h - a} H${x + w - a} V${y + h - a - 9}`
  return <path d={d} stroke={tinta} strokeWidth="1.6" opacity={opacidade} fill="none" />
}

/** Luminária de parede com cone de luz sobre o quadro. */
export function Luminaria({ cx, y, fundo, meiaBase, idCone }) {
  return (
    <g>
      <defs>
        <linearGradient id={idCone} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="0.3" />
          <stop offset="1" stopColor="#E8CF8A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M${cx - 26} ${y + 8} L${cx + 26} ${y + 8} L${cx + meiaBase} ${fundo} L${cx - meiaBase} ${fundo} Z`}
        fill={`url(#${idCone})`}
      />
      <path d={`M${cx} ${y} V${y - 14}`} stroke="#B58A2E" strokeWidth="2" />
      <rect x={cx - 34} y={y} width="68" height="9" rx="4.5" fill="#B58A2E" opacity="1" />
      <rect x={cx - 34} y={y} width="68" height="3" rx="1.5" fill="#E8CF8A" opacity="0.8" />
    </g>
  )
}

/** Plaquinha dourada com o número da obra. `escala` a amplia em torno do próprio centro. */
export function Plaquinha({ x, y, texto, textoX, escala = 1 }) {
  return (
    <g transform={escala === 1 ? undefined : `translate(${x + 34} ${y + 6.5}) scale(${escala}) translate(${-(x + 34)} ${-(y + 6.5)})`}>
      <defs>
        <linearGradient id="plaquinha-ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="1" />
          <stop offset="1" stopColor="#A67C25" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width="68" height="13" rx="1" fill="url(#plaquinha-ouro)" stroke="#5E4210" strokeWidth="0.8" opacity="1" />
      <text
        x={textoX ?? x + 34}
        y={y + 9.5}
        textAnchor={textoX ? undefined : 'middle'}
        fontFamily={fonte.rotulo}
        fontSize="8"
        fontWeight="600"
        fontStyle="normal"
        fill="#2A1E0A"
        letterSpacing="2"
      >
        {texto}
      </text>
    </g>
  )
}

/** Coroa de louro (duas ramas espelhadas). */
export function Louro() {
  const pontos = Array.from({ length: 14 }, (_, i) => {
    const fi = ((100 + i * 10.5) * Math.PI) / 180
    return { x: 720 + 118 * Math.cos(fi), y: 274 + 118 * Math.sin(fi), rot: -208 + i * 10.5 }
  })
  const f1 = (v) => v.toFixed(1)
  const folha = (x, y, rot, op, k) => (
    <ellipse
      key={k}
      cx={f1(x)}
      cy={f1(y)}
      rx="11"
      ry="4.2"
      fill={cor.ouro}
      opacity={op}
      transform={`rotate(${rot} ${f1(x)} ${f1(y)})`}
    />
  )
  const ramo = (espelhar) => {
    const px = (p) => (espelhar ? 1440 - p.x : p.x)
    const folhas = pontos.flatMap((p, i) => {
      const x = px(p)
      return espelhar
        ? [folha(x, p.y, 180 - (p.rot + 76), '0.90', `${i}a`), folha(x, p.y, 180 - p.rot, '0.75', `${i}b`)]
        : [folha(x, p.y, p.rot, '0.90', `${i}a`), folha(x, p.y, p.rot + 76, '0.75', `${i}b`)]
    })
    const d = pontos.map((p, i) => `${i ? 'L' : 'M'}${f1(px(p))} ${f1(p.y)}`).join(' ')
    return (
      <>
        {folhas}
        <path d={d} stroke={cor.ouro} strokeWidth="1.6" opacity="0.9" fill="none" />
      </>
    )
  }
  return (
    <g>
      {ramo(false)}
      {ramo(true)}
    </g>
  )
}


