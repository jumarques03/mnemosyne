import { useId } from 'react'
import Painting from './Painting.jsx'

// Quatro molduras do guia visual: dourada, madeira, branca e preta.
const TEMAS = {
  dourada: {
    gradiente: ['#F0D68A', '#B58A2E', '#F0D68A', '#5E4210'],
    realce: '#F6E3A6',
    borda: '#5E4210',
    fundo: '#5E4210',
    prego: '#F6E3A6',
  },
  madeira: {
    gradiente: ['#7A4A2A', '#3E2412', '#7A4A2A', '#1E1006'],
    realce: '#C9A24B',
    borda: '#1E1006',
    fundo: '#1E1006',
    prego: '#C9A24B',
  },
  branca: {
    gradiente: ['#F3EEE4', '#CFC6B4', '#F3EEE4', '#8F8570'],
    realce: '#FFFFFF',
    borda: '#8F8570',
    fundo: '#8F8570',
    passepartout: '#EFE7D3',
  },
  preta: {
    gradiente: ['#2E2E2E', '#121212', '#2E2E2E', '#000000'],
    realce: '#8C7A4B',
    borda: '#000000',
    fundo: '#000000',
  },
}

const OFFSETS_GRADIENTE = [0, 0.35, 0.62, 1]
const n = (v) => Number(v.toFixed(2))

function Defs() {
  return (
    <defs>
      <filter id="fr-sombra" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
      <linearGradient id="fr-brilho" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.16" />
        <stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      {Object.entries(TEMAS).map(([nome, t]) => (
        <linearGradient key={nome} id={`fr-${nome}`} x1="0" y1="0" x2="1" y2="1">
          {t.gradiente.map((cor, i) => (
            <stop key={i} offset={OFFSETS_GRADIENTE[i]} stopColor={cor} stopOpacity="1" />
          ))}
        </linearGradient>
      ))}
    </defs>
  )
}

function Pregos({ x, y, w, h, fw, tema }) {
  const meio = fw / 2
  const s = fw * 0.3
  const r = fw * 0.42
  const rInterno = fw * 0.15
  const cantos = [
    [x + meio, y + meio],
    [x + w - meio, y + meio],
    [x + meio, y + h - meio],
    [x + w - meio, y + h - meio],
  ]
  const losango = (px, py) => `M${n(px)} ${n(py)} l${n(s)} ${n(s)} l${n(-s)} ${n(s)} l${n(-s)} ${n(-s)}Z`
  return (
    <>
      {cantos.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={n(r)} fill={tema.prego} stroke={tema.fundo} strokeWidth="1" opacity="0.95" />
          <circle cx={cx} cy={cy} r={n(rInterno)} fill={tema.fundo} opacity="0.9" />
        </g>
      ))}
      <path d={losango(x + w / 2, y + meio - s)} fill={tema.prego} opacity=".9" />
      <path d={losango(x + w / 2, y + h - meio - s)} fill={tema.prego} opacity=".9" />
      <path d={losango(x + meio, y + h / 2 - s)} fill={tema.prego} opacity=".9" />
      <path d={losango(x + w - meio, y + h / 2 - s)} fill={tema.prego} opacity=".9" />
    </>
  )
}

/**
 * Quadro completo: sombra, moldura, fundo, pintura e pregos.
 * (x, y, w, h) = retângulo externo; fw = largura da moldura.
 * `passepartout` = respiro extra da moldura branca.
 */
export default function Frame({ x, y, w, h, fw, moldura, pintura, passepartout = 10 }) {
  const tema = TEMAS[moldura]
  const clipId = `fr-clip-${useId().replace(/:/g, '')}`
  const folga = tema.passepartout ? fw + 3 + passepartout : fw + 3
  const ax = x + folga
  const ay = y + folga
  const aw = w - folga * 2
  const ah = h - folga * 2
  const borda = fw * 0.62

  return (
    <g>
      <Defs />
      <rect x={x + 6} y={y + 16} width={w} height={h} fill="#000" opacity=".55" filter="url(#fr-sombra)" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={`url(#fr-${moldura})`} opacity="1" />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="1" fill="none" stroke={tema.realce} strokeWidth="1" opacity="0.55" />
      <rect
        x={n(x + borda)}
        y={n(y + borda)}
        width={n(w - borda * 2)}
        height={n(h - borda * 2)}
        rx="0"
        fill="none"
        stroke={tema.borda}
        strokeWidth="2"
        opacity="0.7"
      />
      <rect x={x + fw} y={y + fw} width={w - fw * 2} height={h - fw * 2} rx="0" fill={tema.fundo} opacity="1" />
      {tema.passepartout && (
        <rect
          x={x + fw + 3}
          y={y + fw + 3}
          width={w - (fw + 3) * 2}
          height={h - (fw + 3) * 2}
          rx="0"
          fill={tema.passepartout}
          opacity="1"
        />
      )}
      <clipPath id={clipId}>
        <rect x={ax} y={ay} width={aw} height={ah} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${ax} ${ay})`}>
          <Painting tipo={pintura} w={aw} h={ah} />
        </g>
        <rect x={ax} y={ay} width={aw} height={ah} rx="0" fill="url(#fr-brilho)" opacity="1" />
        <rect x={ax} y={ay} width={aw} height={ah} rx="0" fill="none" stroke="#000" strokeWidth="6" opacity="0.3" />
      </g>
      {tema.prego && <Pregos x={x} y={y} w={w} h={h} fw={fw} tema={tema} />}
    </g>
  )
}
