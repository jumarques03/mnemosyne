import { cor } from '../../theme.js'

/** Piso de madeira escura com brilho central, rodapé e tábuas. */
export function Piso() {
  return (
    <g>
      <defs>
        <linearGradient id="piso-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B1A0E" stopOpacity="1" />
          <stop offset="1" stopColor="#0B0705" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="piso-brilho" cx="720" cy="800" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="0.22" />
          <stop offset="1" stopColor="#E8CF8A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="790" width="1440" height="110" rx="0" fill="url(#piso-madeira)" opacity="1" />
      <rect x="0" y="780" width="1440" height="12" rx="0" fill="#1A130C" opacity="1" />
      <line x1="0" y1="780" x2="1440" y2="780" stroke={cor.ouro} strokeWidth="1" opacity="0.35" />
      <line x1="0" y1="812" x2="1440" y2="812" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <line x1="0" y1="838" x2="1440" y2="838" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <line x1="0" y1="870" x2="1440" y2="870" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <rect x="0" y="790" width="1440" height="110" rx="0" fill="url(#piso-brilho)" opacity="1" />
    </g>
  )
}

/** Juntas das tábuas: 5 fiadas, alternando o deslocamento de 45px. */
export function PisoTabuas() {
  const fiadas = [0, 1, 2, 3, 4].map((i) => {
    const y = 790 + i * 22
    const deslocamento = i % 2 ? -45 : 0
    const xs = []
    for (let x = deslocamento; x < 1440; x += 90) xs.push(x)
    return { y, xs, linhaInferior: i < 4 }
  })
  return (
    <g>
      <line x1="0" y1="790" x2="1440" y2="790" stroke="#000" strokeWidth="1" opacity="0.35" />
      {fiadas.map(({ y, xs, linhaInferior }) => (
        <g key={y}>
          {xs.map((x) => (
            <line key={x} x1={x} y1={y} x2={x} y2={y + 22} stroke="#000" strokeWidth="1" opacity="0.3" />
          ))}
          {linhaInferior && <line x1="0" y1={y + 22} x2="1440" y2={y + 22} stroke="#000" strokeWidth="1" opacity="0.35" />}
        </g>
      ))}
    </g>
  )
}

function Azulejo({ x }) {
  const azul = cor.azul
  return (
    <g>
      <rect x={x} y="752" width="28" height="28" rx="0" fill="#EDE6D2" stroke={azul} strokeWidth="0.8" opacity="1" />
      <circle cx={x + 14} cy="761.5" r="4" fill={azul} opacity="0.9" />
      <circle cx={x + 14} cy="770.5" r="4" fill={azul} opacity="0.9" />
      <circle cx={x + 9.5} cy="766" r="4" fill={azul} opacity="0.9" />
      <circle cx={x + 18.5} cy="766" r="4" fill={azul} opacity="0.9" />
      <circle cx={x + 14} cy="766" r="2.4" fill="#EDE6D2" opacity="1" />
      <circle cx={x + 3} cy="755" r="1.8" fill={azul} opacity="0.9" />
      <circle cx={x + 25} cy="755" r="1.8" fill={azul} opacity="0.9" />
      <circle cx={x + 3} cy="777" r="1.8" fill={azul} opacity="0.9" />
      <circle cx={x + 25} cy="777" r="1.8" fill={azul} opacity="0.9" />
    </g>
  )
}

/** Faixa de azulejos azuis e brancos (barrado da parede). */
export function FaixaAzulejo() {
  return (
    <g>
      <g opacity="0.5">
        {Array.from({ length: 52 }, (_, i) => (
          <Azulejo key={i} x={i * 28} />
        ))}
      </g>
      <line x1="0" y1="752" x2="1440" y2="752" stroke={cor.ouro} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="780" x2="1440" y2="780" stroke={cor.ouro} strokeWidth="1" opacity="0.4" />
    </g>
  )
}
