import { cor, fonte } from '../theme.js'
import { medirTexto, inicioCentralizado } from '../utils/medirTexto.js'
import Frame from '../components/art/Frame.jsx'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada, Cantinhos, Luminaria, Plaquinha } from '../components/scene/Ornamentos.jsx'
import { Coluna, Busto } from '../components/scene/Esculturas.jsx'

const CARTAO = { x0: 135, passo: 300, y: 315, w: 270, h: 455 }

// No design, título e artista foram posicionados com a largura estimada do texto
// (não a medida), então ficam levemente à direita do centro do cartão. Repetimos
// a mesma estimativa para a tela ficar idêntica ao SVG.
const FATOR_TITULO = 0.8908
const FATOR_ARTISTA = 0.9984
const FONTE_TITULO = `700 19px "${fonte.titulo}"`
const FONTE_ARTISTA = `italic 500 17px "${fonte.texto}"`

function Cartao({ obra, indice, ativo, onAtiva, onEscolher }) {
  const x = CARTAO.x0 + indice * CARTAO.passo
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
      onMouseEnter={() => onAtiva(indice)}
      onFocus={() => onAtiva(indice)}
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
      <Luminaria cx={centro} y={333} fundo={620} meiaBase={114} idCone={`cartao-cone-${indice}`} />
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

/** 02 · Seleção de quadro — quatro obras expostas, a "ativa" fica iluminada. */
export default function TelaSelecao({ obras, ativa, onAtiva, onEscolher, onInicio }) {
  return (
    <g>
      <Fundo />
      <LuzJanela xs={[520, 850]} y={40} w={70} h={500} opacidade="0.06" />
      <Cornija />
      <LinhaDecorativa de={[0, 130]} para={[150, 96]} cor={cor.ouro} opLinha="0.3" opLosango="0.55" />
      <LinhaDecorativa de={[1440, 700]} para={[1260, 760]} cor={cor.vermelho} opLinha="0.4" opLosango="0.65" />
      <Respingo cx={250} cy={190} u={1.6} cor="#E9B72E" opacidade="0.3" />
      <Respingo cx={1230} cy={215} u={1.4} cor={cor.vermelho} opacidade="0.3" />
      <Coluna x={32} capY={200} fuste={40} altura={550} opacidade="0.55" idFuste="selecao-coluna-1" />
      <Coluna x={1348} capY={200} fuste={40} altura={550} opacidade="0.55" idFuste="selecao-coluna-2" />
      <Busto x={62} y={200} escala={0.42} opacidade="0.6" pedestal={false} idMarmore="selecao-busto-1" />
      <Busto x={1378} y={200} escala={0.42} opacidade="0.6" pedestal={false} idMarmore="selecao-busto-2" />
      <Cabecalho onInicio={onInicio} />

      <text
        x="436.24"
        y="232"
        fontFamily={fonte.titulo}
        fontSize="54"
        fontWeight="700"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="2"
      >
        ESCOLHA UM QUADRO
      </text>
      <Pincelada x={560} y={238} sx={1.067} sy={0.2} cor={cor.ouro} opacidade="0.55" />
      <text
        x="529.07"
        y="272"
        fontFamily={fonte.texto}
        fontSize="22"
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        selecione a obra sobre a qual você quer conversar
      </text>

      {obras.map((obra, i) => (
        <Cartao key={obra.id} obra={obra} indice={i} ativo={i === ativa} onAtiva={onAtiva} onEscolher={onEscolher} />
      ))}

      <g>
        <circle cx="650" cy="830" r="17" fill="none" stroke={cor.ouro} strokeWidth="1.2" opacity="0.7" />
        <path
          d="M653 823 L646 830 L653 837"
          stroke={cor.ouro}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0.5 0)"
        />
        <circle cx="790" cy="830" r="17" fill="none" stroke={cor.ouro} strokeWidth="1.2" opacity="0.7" />
        <path
          d="M787 823 L794 830 L787 837"
          stroke={cor.ouro}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-0.5 0)"
        />
        <circle cx="700" cy="830" r="4" fill={cor.ouro} opacity="1" />
        <circle cx="720" cy="830" r="4" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.6" />
        <circle cx="740" cy="830" r="4" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.6" />
      </g>
      <text
        x="719.35"
        y="870"
        textAnchor="middle"
        fontFamily={fonte.rotulo}
        fontSize="11"
        fontWeight="500"
        fontStyle="normal"
        fill={cor.texto}
        letterSpacing="4"
        opacity="0.65"
      >
        {`ACERVO · ${obras.length} OBRAS CADASTRADAS`}
      </text>
      <Greca y={894} opacidade="0.3" />
      <Vinheta />
    </g>
  )
}
