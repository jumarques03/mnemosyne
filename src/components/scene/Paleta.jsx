/** Paleta de pintor (avatar da curadoria). (x, y) = ponto de origem do desenho; `escala` 0.17 no chat. */
export default function Paleta({ x, y, escala }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <defs>
        <linearGradient id="paleta-madeira" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCA46A" stopOpacity="1" />
          <stop offset="1" stopColor="#8A5628" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0 30 C-12 -10 30 -42 82 -36 C132 -30 154 12 122 42 C102 64 72 48 62 64 C50 82 8 84 0 30 Z"
        fill="url(#paleta-madeira)"
        stroke="#4A2A12"
        strokeWidth="2.5"
      />
      <circle cx="34" cy="22" r="7.5" fill="#120D09" stroke="#4A2A12" strokeWidth="1.5" opacity="1" />
      <circle cx="22" cy="2" r="9" fill="#C8261E" opacity="1" />
      <circle cx="19" cy="-1" r="3" fill="#FFFFFF" opacity="0.35" />
      <circle cx="46" cy="-14" r="9" fill="#E9B72E" opacity="1" />
      <circle cx="43" cy="-17" r="3" fill="#FFFFFF" opacity="0.35" />
      <circle cx="76" cy="-18" r="9" fill="#1F4E8C" opacity="1" />
      <circle cx="73" cy="-21" r="3" fill="#FFFFFF" opacity="0.35" />
      <circle cx="104" cy="-6" r="9" fill="#2E7D4F" opacity="1" />
      <circle cx="101" cy="-9" r="3" fill="#FFFFFF" opacity="0.35" />
      <circle cx="116" cy="20" r="9" fill="#F4ECD8" opacity="1" />
      <circle cx="113" cy="17" r="3" fill="#FFFFFF" opacity="0.35" />
      <circle cx="96" cy="38" r="9" fill="#A8442A" opacity="1" />
      <circle cx="93" cy="35" r="3" fill="#FFFFFF" opacity="0.35" />
    </g>
  )
}
