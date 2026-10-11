import { cor, fonte } from '../../theme.js'
import { medirTexto, inicioCentralizado } from '../../utils/medirTexto.js'
import Frame from '../../components/art/Frame.jsx'
import { Cantinhos, Luminaria, Plaquinha } from '../../components/scene/Ornamentos.jsx'
import { CARTAO } from './medidas.js'


// No design, título e artista foram posicionados com a largura estimada do texto
// (não a medida), então ficam levemente à direita do centro do cartão. Repetimos
// a mesma estimativa para a tela ficar idêntica ao SVG.
const FATOR_TITULO = 0.8908
const FATOR_ARTISTA = 0.9984
const FONTE_TITULO = `700 19px "${fonte.titulo}"`
const FONTE_ARTISTA = `italic 500 17px "${fonte.texto}"`

/**
 * Cartão de uma obra: quadro iluminado, plaquinha, título, artista e "CONVERSAR →".
 * `x` = borda esquerda; `ativo` acende o brilho e o botão. `id` distingue as luminárias.
 */
export default function Cartao({ obra, x, id, ativo, onAtiva, onEscolher }) {
  const { y, w, h } = CARTAO
  const centro = x + w / 2
  const artista = `${obra.artista} · ${obra.ano}`
  const tituloX = inicioCentralizado(centro, medirTexto(obra.titulo, FONTE_TITULO), FATOR_TITULO)
  const artistaX = inicioCentralizado(centro, medirTexto(artista, FONTE_ARTISTA), FATOR_ARTISTA)
  const escolher = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEscolher(obra)
    }
  }
  return (
    <g
      className="hit"
      role="button"
      tabIndex={0}
      aria-label={`Conversar sobre ${obra.titulo}`}
      onMouseEnter={onAtiva}
      onFocus={onAtiva}
      onClick={escolher}
      onKeyDown={escolher}
    >
      {ativo && (
        <>
          <defs>
            <filter id="cartao-brilho" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <rect x={x} y={y} width={w} height={h} rx="4" fill={cor.ouro} opacity=".22" filter="url(#cartao-brilho)" />
        </>
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill="#0E0F0D"
        stroke={cor.ouro}
        strokeWidth={ativo ? 1.6 : 1}
        opacity={ativo ? 0.95 : 0.82}
      />
      <Cantinhos x={x} y={y} w={w} h={h} recuo={8} cor={cor.ouro} opacidade="0.6" />
      <Luminaria cx={centro} y={333} fundo={620} meiaBase={114} idCone={`cartao-cone-${id}`} />
      <Frame x={x + 35} y={370} w={200} h={250} fw={13} moldura={obra.moldura} pintura={obra.pintura} passepartout={9} />
      <Plaquinha x={x + 101} y={629} texto={obra.numero} />
      <text
        x={tituloX}
        y="664"
        fontFamily={fonte.titulo}
        fontSize="19"
        fontWeight="700"
        fontStyle="normal"
        fill={cor.creme}
      >
        {obra.titulo}
      </text>
      <text
        x={artistaX}
        y="686"
        fontFamily={fonte.texto}
        fontSize="17"
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        {artista}
      </text>
      <line x1={x + 30} y1="704" x2={x + 240} y2="704" stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      {ativo ? (
        <>
          <rect x={x + 63} y="720" width="144" height="32" rx="2" fill={cor.ouro} stroke={cor.ouro} strokeWidth="1" opacity="0.16" />
          <rect x={x + 63} y="720" width="144" height="32" rx="2" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="1" />
          <text
            x={x + 65.9}
            y="741"
            fontFamily={fonte.rotulo}
            fontSize="12"
            fontWeight="500"
            fontStyle="normal"
            fill={cor.ouro}
            letterSpacing="4"
          >
            CONVERSAR &#160;→
          </text>
        </>
      ) : (
        <text
          x={x + 65.9}
          y="741"
          fontFamily={fonte.rotulo}
          fontSize="12"
          fontWeight="500"
          fontStyle="normal"
          fill={cor.texto}
          letterSpacing="4"
          opacity="0.85"
        >
          CONVERSAR &#160;→
        </text>
      )}
    </g>
  )
}
