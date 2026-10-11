import { cor } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import Ancora from '../../layout/Ancora.jsx'

/** Piso de madeira escura com brilho central e rodapé, de ponta a ponta e colado no fim da tela. */
export function Piso() {
  const { limites: b } = useLayout()
  const w = b.x1 - b.x0
  return (
    <Ancora y="base">
      <defs>
        <linearGradient id="piso-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B1A0E" stopOpacity="1" />
          <stop offset="1" stopColor="#0B0705" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="piso-brilho" cx={b.x0 + w / 2} cy="800" r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="0.22" />
          <stop offset="1" stopColor="#E8CF8A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={b.x0} y="790" width={w} height="110" rx="0" fill="url(#piso-madeira)" opacity="1" />
      <rect x={b.x0} y="780" width={w} height="12" rx="0" fill="#1A130C" opacity="1" />
      <line x1={b.x0} y1="780" x2={b.x1} y2="780" stroke={cor.ouro} strokeWidth="1" opacity="0.35" />
      <line x1={b.x0} y1="812" x2={b.x1} y2="812" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <line x1={b.x0} y1="838" x2={b.x1} y2="838" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <line x1={b.x0} y1="870" x2={b.x1} y2="870" stroke={cor.ouro} strokeWidth="1" opacity="0.07" />
      <rect x={b.x0} y="790" width={w} height="110" rx="0" fill="url(#piso-brilho)" opacity="1" />
    </Ancora>
  )
}

/** Juntas das tábuas: 5 fiadas, alternando o deslocamento de 45px. */
export function PisoTabuas() {
  const { limites: b } = useLayout()
  const fiadas = [0, 1, 2, 3, 4].map((i) => {
    const y = 790 + i * 22
    const deslocamento = i % 2 ? -45 : 0
    const xs = []
    for (let x = deslocamento + Math.floor((b.x0 - deslocamento) / 90) * 90; x < b.x1; x += 90) xs.push(x)
    return { y, xs, linhaInferior: i < 4 }
  })
  return (
    <Ancora y="base">
      <line x1={b.x0} y1="790" x2={b.x1} y2="790" stroke="#000" strokeWidth="1" opacity="0.35" />
      {fiadas.map(({ y, xs, linhaInferior }) => (
        <g key={y}>
          {xs.map((x) => (
            <line key={x} x1={x} y1={y} x2={x} y2={y + 22} stroke="#000" strokeWidth="1" opacity="0.3" />
          ))}
          {linhaInferior && <line x1={b.x0} y1={y + 22} x2={b.x1} y2={y + 22} stroke="#000" strokeWidth="1" opacity="0.35" />}
        </g>
      ))}
    </Ancora>
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

/** Faixa de azulejos azuis e brancos (barrado da parede), de ponta a ponta. */
export function FaixaAzulejo() {
  const { limites: b } = useLayout()
  const xs = []
  for (let x = Math.floor(b.x0 / 28) * 28; x < b.x1; x += 28) xs.push(x)
  return (
    <Ancora y="base">
      <g opacity="0.5">
        {xs.map((x) => (
          <Azulejo key={x} x={x} />
        ))}
      </g>
      <line x1={b.x0} y1="752" x2={b.x1} y2="752" stroke={cor.ouro} strokeWidth="1" opacity="0.4" />
      <line x1={b.x0} y1="780" x2={b.x1} y2="780" stroke={cor.ouro} strokeWidth="1" opacity="0.4" />
    </Ancora>
  )
}
