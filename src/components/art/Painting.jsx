// As cinco pinturas do acervo, desenhadas em um espaço de 300 × 400.
// <Painting> centraliza e escala a pintura para cobrir a área (w × h) recebida,
// do mesmo jeito que as telas do design (cover + crop centralizado).

import { ajusteCover } from './ajusteCover.js'

const f2 = (n) => n.toFixed(2)

function Entardecer() {
  return (
    <>
      <defs>
        <linearGradient id="pt-entardecer-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E2A5E" />
          <stop offset="0.38" stopColor="#B5476B" />
          <stop offset="0.62" stopColor="#F0A24A" />
          <stop offset="1" stopColor="#F7D88A" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#pt-entardecer-ceu)" />
      <circle cx="150" cy="240" r="84" fill="#FBE7A1" opacity=".22" />
      <circle cx="150" cy="240" r="50" fill="#FBE7A1" />
      <path d="M0 262 Q75 214 150 258 T300 246 V400 H0Z" fill="#2E5E4A" />
      <path d="M0 318 Q100 276 200 316 T300 300 V400 H0Z" fill="#1D3F33" />
      <path d="M0 372 Q150 330 300 370 V400 H0Z" fill="#11261E" />
      <path d="M52 400 Q60 320 92 256" stroke="#0C1712" strokeWidth="5" strokeLinecap="round" />
      <path d="M92 256 Q60 236 30 252" stroke="#0C1712" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 256 Q70 226 44 224" stroke="#0C1712" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 256 Q96 222 120 208" stroke="#0C1712" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 256 Q122 234 150 246" stroke="#0C1712" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M92 256 Q112 252 128 266" stroke="#0C1712" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M250 400 Q246 346 232 304" stroke="#0C1712" strokeWidth="4" strokeLinecap="round" />
      <path d="M232 304 Q210 290 192 304" stroke="#0C1712" strokeWidth="3" strokeLinecap="round" />
      <path d="M232 304 Q214 276 196 276" stroke="#0C1712" strokeWidth="3" strokeLinecap="round" />
      <path d="M232 304 Q240 276 260 268" stroke="#0C1712" strokeWidth="3" strokeLinecap="round" />
      <path d="M232 304 Q256 296 270 312" stroke="#0C1712" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M200 120 q6 -6 12 0 q6 -6 12 0 M232 96 q5 -5 10 0 q5 -5 10 0"
        stroke="#F7D88A"
        strokeWidth="2"
        opacity=".8"
      />
    </>
  )
}

function Marinha() {
  return (
    <>
      <defs>
        <linearGradient id="pt-marinha-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E7BE" />
          <stop offset="0.63" stopColor="#F2B56B" />
        </linearGradient>
        <linearGradient id="pt-marinha-mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E7F8A" />
          <stop offset="1" stopColor="#0F3E4F" />
        </linearGradient>
      </defs>
      <rect width="300" height="252" fill="url(#pt-marinha-ceu)" />
      <circle cx="215" cy="178" r="42" fill="#E4572E" />
      <rect y="250" width="300" height="150" fill="url(#pt-marinha-mar)" />
      <path d="M-0 282 Q25 272 50 282 T100 282 T150 282 T200 282 T250 282 T300 282 T350 282" stroke="#7FD0C8" strokeWidth="3" opacity=".5" />
      <path d="M-12 312 Q13 302 38 312 T88 312 T138 312 T188 312 T238 312 T288 312 T338 312" stroke="#7FD0C8" strokeWidth="3" opacity=".5" />
      <path d="M-24 346 Q1 336 26 346 T76 346 T126 346 T176 346 T226 346 T276 346 T326 346" stroke="#7FD0C8" strokeWidth="3" opacity=".5" />
      <path d="M-36 382 Q-11 372 14 382 T64 382 T114 382 T164 382 T214 382 T264 382 T314 382" stroke="#7FD0C8" strokeWidth="3" opacity=".5" />
      <rect x="185.0" y="258" width="60" height="4" fill="#F6A15B" opacity=".7" />
      <rect x="192.0" y="272" width="46" height="4" fill="#F6A15B" opacity=".7" />
      <rect x="200.0" y="288" width="30" height="4" fill="#F6A15B" opacity=".7" />
      <path d="M100 306 L220 306 L204 324 L116 324Z" fill="#2B1D12" />
      <rect x="158" y="226" width="4" height="80" fill="#2B1D12" />
      <path d="M164 232 L164 300 L214 300Z" fill="#F7F1E0" />
      <polygon points="164,268 190.5,268 200.7,282 164,282" fill="#C8261E" />
      <path d="M156 244 L156 300 L120 300Z" fill="#EBD9A8" />
    </>
  )
}

function Sertao() {
  return (
    <>
      <defs>
        <linearGradient id="pt-sertao-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3D58A" />
          <stop offset="1" stopColor="#E9A44E" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#pt-sertao-ceu)" />
      <circle cx="82" cy="120" r="60" fill="#D9482B" />
      <path d="M0 280 Q100 250 200 275 T300 262 V400 H0Z" fill="#B5532B" />
      <path d="M0 330 Q120 300 300 340 V400 H0Z" fill="#8E3B1E" />
      <rect x="205" y="170" width="16" height="150" rx="8" fill="#2F5A45" />
      <path d="M213 250 H182 V214 M213 222 H244 V190" stroke="#2F5A45" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 300 q20 -6 40 0" stroke="#5E2410" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <path d="M60 350 q24 -8 50 0" stroke="#5E2410" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <path d="M150 320 q20 -6 40 0" stroke="#5E2410" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <path d="M40 90 q8 -8 16 0 q8 -8 16 0" stroke="#5E2410" strokeWidth="2" opacity=".6" />
    </>
  )
}

function NaturezaMorta() {
  return (
    <>
      <defs>
        <linearGradient id="pt-natureza-fundo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1A10" />
          <stop offset="1" stopColor="#47291A" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#pt-natureza-fundo)" />
      <rect y="292" width="300" height="108" fill="#5C3A1E" />
      <rect y="292" width="300" height="6" fill="#8B5E34" />
      <path d="M0 292 L90 292 L40 400 L0 400Z" fill="#8C3B2A" opacity=".55" />
      <path d="M150 184 Q130 160 112 120" stroke="#2E5E3A" strokeWidth="4" strokeLinecap="round" />
      <path d="M152 184 Q158 140 162 96" stroke="#2E5E3A" strokeWidth="4" strokeLinecap="round" />
      <path d="M154 184 Q190 160 205 130" stroke="#2E5E3A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="118" cy="190" rx="22" ry="9" fill="#3E7A4E" transform="rotate(-30 118 190)" />
      <ellipse cx="186" cy="186" rx="22" ry="9" fill="#3E7A4E" transform="rotate(25 186 186)" />
      <path d="M120 292 C100 250 112 214 138 200 L138 184 L162 184 L162 200 C188 214 200 250 180 292 Z" fill="#3E6B73" />
      <path d="M128 280 C116 250 124 224 140 212 L142 214 C130 230 124 252 134 278Z" fill="#5C9199" opacity=".55" />
      <circle cx="112" cy="120" r="26" fill="#E0553B" />
      <circle cx="112" cy="120" r="7.8" fill="#3A1A10" />
      <circle cx="162" cy="96" r="28" fill="#F2B134" />
      <circle cx="162" cy="96" r="8.4" fill="#3A1A10" />
      <circle cx="205" cy="130" r="24" fill="#C8261E" />
      <circle cx="205" cy="130" r="7.2" fill="#3A1A10" />
      <circle cx="140" cy="150" r="17" fill="#F7E3B0" />
      <circle cx="140" cy="150" r="5.1" fill="#3A1A10" />
      <ellipse cx="60" cy="318" rx="34" ry="8" fill="#000" opacity=".3" />
      <circle cx="60" cy="298" r="26" fill="#D98B2B" />
      <circle cx="100" cy="312" r="18" fill="#B8D06B" />
      <ellipse cx="232" cy="326" rx="32" ry="8" fill="#000" opacity=".3" />
      <circle cx="232" cy="308" r="24" fill="#7C1D2B" />
    </>
  )
}

function Geometrica() {
  return (
    <>
      <rect width="300" height="400" fill="#EFE3C8" />
      <circle cx="105" cy="135" r="72" fill="#C8261E" />
      <rect x="150" y="190" width="130" height="160" fill="#1F4E8C" />
      <polygon points="30,390 125,250 220,390" fill="#E9B72E" opacity=".95" />
      <path d="M0 400 V300 A100 100 0 0 1 100 400Z" fill="#2E7D4F" />
      <rect x="148" y="0" width="5" height="400" fill="#141414" />
      <rect x="0" y="188" width="300" height="5" fill="#141414" />
      <circle cx="235" cy="100" r="24" fill="#141414" />
      <circle cx="235" cy="100" r="10" fill="#EFE3C8" />
      <rect x="196" y="352" width="70" height="8" fill="#C8261E" />
    </>
  )
}

const OBRAS = {
  entardecer: Entardecer,
  marinha: Marinha,
  sertao: Sertao,
  naturezaMorta: NaturezaMorta,
  geometrica: Geometrica,
}

export default function Painting({ tipo, w, h }) {
  const Obra = OBRAS[tipo]
  const { escala, dx, dy } = ajusteCover(w, h)
  return (
    <g transform={`translate(${f2(dx)} ${f2(dy)}) scale(${escala.toFixed(4)})`}>
      <Obra />
    </g>
  )
}
