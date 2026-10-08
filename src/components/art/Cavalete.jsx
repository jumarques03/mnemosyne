import { useId } from 'react'
import Painting from './Painting.jsx'

/** Cavalete de madeira com uma tela apoiada. (x, y) = pé do cavalete. */
export default function Cavalete({ x, y, escala, pintura }) {
  const clipId = `cav-clip-${useId().replace(/:/g, '')}`
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d="M0 -300 L16 -8" stroke="#3E2412" strokeWidth="7" strokeLinecap="round" />
      <path d="M-6 -310 L-78 0" stroke="#8A5A2C" strokeWidth="9" strokeLinecap="round" />
      <path d="M6 -310 L78 0" stroke="#7A4C22" strokeWidth="9" strokeLinecap="round" />
      <rect x="-4" y="-334" width="8" height="320" rx="0" fill="#A06C38" opacity="1" />
      <rect x="-50" y="-112" width="100" height="7" rx="0" fill="#6B4423" opacity="1" />
      <rect x="-86" y="-122" width="172" height="11" rx="0" fill="#8A5A2C" opacity="1" />
      <rect x="-86" y="-122" width="172" height="3" rx="0" fill="#C9965A" opacity="1" />
      <rect x="-66" y="-290" width="132" height="170" rx="1" fill="#EFE7D3" stroke="#9A8A66" strokeWidth="1" opacity="1" />
      <clipPath id={clipId}>
        <rect x="-62" y="-286" width="124" height="162" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <g transform="translate(-62 -286)">
          <Painting tipo={pintura} w={124} h={162} />
        </g>
      </g>
      <rect x="-30" y="-304" width="60" height="10" rx="2" fill="#6B4423" opacity="1" />
    </g>
  )
}
