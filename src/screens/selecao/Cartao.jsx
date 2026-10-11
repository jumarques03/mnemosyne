import { cor, fonte } from '../../theme.js'
import { ajustarAoLargura } from '../../utils/medirTexto.js'
import Frame from '../../components/art/Frame.jsx'
import { Cantinhos, Luminaria, Plaquinha } from '../../components/scene/Ornamentos.jsx'
import { CARTAO } from './medidas.js'


const fonteTitulo = (px) => `700 ${px}px "${fonte.titulo}"`
const fonteArtista = (px) => `italic 500 ${px}px "${fonte.texto}"`

// Títulos e artistas reais variam bastante de tamanho: o texto encolhe para caber dentro do cartão.
const LARGURA_MAXIMA_TEXTO = 218 // deixa uma folga de ~26 de cada lado dentro do cartão de 270
const TAMANHO_TITULO = 22
const TAMANHO_ARTISTA = 20
const MIN_TITULO = 15
const MIN_ARTISTA = 14

/**
 * Cartão de uma obra: quadro iluminado, plaquinha, título, artista e "CONVERSAR →".
 * `x` = borda esquerda; `ativo` acende o brilho e o botão. `id` distingue as luminárias.
 */
export default function Cartao({ obra, x, id, ativo, onAtiva, onEscolher }) {
  const { y, w, h } = CARTAO
  const centro = x + w / 2
  const artista = `${obra.artista} · ${obra.ano}`
  const titulo = ajustarAoLargura(obra.titulo, fonteTitulo, TAMANHO_TITULO, LARGURA_MAXIMA_TEXTO, MIN_TITULO)
  const nome = ajustarAoLargura(artista, fonteArtista, TAMANHO_ARTISTA, LARGURA_MAXIMA_TEXTO, MIN_ARTISTA)
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
      <Luminaria cx={centro} y={318} fundo={650} meiaBase={120} idCone={`cartao-cone-${id}`} />
      <Frame x={x + 24} y={352} w={222} h={298} fw={14} moldura={obra.moldura} imagem={obra.imagem} passepartout={9} />
      <Plaquinha x={x + 101} y={660} texto={obra.numero} escala={1.4} />
      <text
        x={centro}
        y="704"
        textAnchor="middle"
        fontFamily={fonte.titulo}
        fontSize={titulo.tamanho}
        fontWeight="700"
        fontStyle="normal"
        fill={cor.creme}
      >
        {obra.titulo}
      </text>
      <text
        x={centro}
        y="727"
        textAnchor="middle"
        fontFamily={fonte.texto}
        fontSize={nome.tamanho}
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        {artista}
      </text>
      <line x1={x + 30} y1="744" x2={x + 240} y2="744" stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      {ativo ? (
        <>
          <rect x={x + 45} y="752" width="180" height="34" rx="2" fill={cor.ouro} stroke={cor.ouro} strokeWidth="1" opacity="0.16" />
          <rect x={x + 45} y="752" width="180" height="34" rx="2" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="1" />
          <text
            x={x + 137}
            y="774"
            textAnchor="middle"
            fontFamily={fonte.rotulo}
            fontSize="14"
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
          x={x + 137}
          y="774"
          textAnchor="middle"
          fontFamily={fonte.rotulo}
          fontSize="14"
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
