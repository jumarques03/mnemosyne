import { LayoutContext } from '../layout/contexto.js'

/**
 * Palco SVG. O viewBox acompanha a proporção da janela (ver layout/medidas.js), então o
 * desenho preenche a tela inteira sem faixas pretas; `meet` só absorve arredondamentos.
 */
export default function Stage({ children, titulo, layout }) {
  return (
    <svg
      className="stage"
      viewBox={layout.viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="application"
      aria-label={titulo}
    >
      <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
    </svg>
  )
}
