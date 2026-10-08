import { LARGURA, ALTURA } from '../theme.js'

/**
 * Palco de 1440 × 900: toda a arte vive nesse sistema de coordenadas e o SVG
 * escala para caber na janela mantendo a proporção do design.
 */
export default function Stage({ children, titulo }) {
  return (
    <svg
      className="stage"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="application"
      aria-label={titulo}
    >
      {children}
    </svg>
  )
}
