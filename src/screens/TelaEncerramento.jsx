import { cor, fonte } from '../theme.js'
import { useLayout } from '../layout/contexto.js'
import Ancora from '../layout/Ancora.jsx'
import { medirTexto, inicioCentralizado } from '../utils/medirTexto.js'
import Frame from '../components/art/Frame.jsx'
import Botao from '../components/scene/Botao.jsx'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada, Luminaria, Louro } from '../components/scene/Ornamentos.jsx'
import { Busto, Arco } from '../components/scene/Esculturas.jsx'
import TelaEncerramentoRetrato from './retrato/TelaEncerramentoRetrato.jsx'

const TITULO = { tamanho: 66, espaco: 1, larguraMax: 880, fator: 0.8793 }

/** 04 · Encerramento — "visita concluída" com a obra sobre a qual o visitante conversou. */
export default function TelaEncerramento({ obra, onOutro, onInicio, onVoltar }) {
  const { modo } = useLayout()
  if (modo === 'retrato') return <TelaEncerramentoRetrato obra={obra} onOutro={onOutro} onInicio={onInicio} onVoltar={onVoltar} />

  // Títulos longos encolhem para caber; o ponto de partida repete a estimativa do design
  // (ver `inicioCentralizado`), que deixa o título levemente à direita do eixo.
  const titulo = obra.titulo.toUpperCase()
  const larguraBase = medirTexto(titulo, `700 ${TITULO.tamanho}px "${fonte.titulo}"`, TITULO.espaco)
  const encolher = Math.min(1, TITULO.larguraMax / larguraBase)
  const tamanho = TITULO.tamanho * encolher
  const tituloX = inicioCentralizado(720, larguraBase * encolher, TITULO.fator)
  return (
    <g>
      <Fundo />
      <LuzJanela xs={[170, 440, 710, 980]} y={40} w={70} h={560} opacidade="0.07" />
      <Cornija />

      <Ancora x="esq" y="base">
        <Arco x={40} idFundo="fim-arco-1" />
        <g opacity=".72">
          <Frame x={75} y={250} w={170} h={230} fw={12} moldura="madeira" pintura="marinha" />
        </g>
        <Busto x={160} y={758} escala={0.85} opacidade="0.85" idMarmore="fim-busto-1" idBase="fim-base-1" />
      </Ancora>

      <Ancora x="dir" y="base">
        <Arco x={1160} idFundo="fim-arco-2" />
        <g opacity=".72">
          <Frame x={1195} y={250} w={170} h={230} fw={12} moldura="dourada" pintura="sertao" />
        </g>
        <Busto x={1280} y={758} escala={0.85} opacidade="0.85" idMarmore="fim-busto-2" idBase="fim-base-2" />
      </Ancora>

      <Respingo cx={430} cy={560} u={1.6} cor={cor.vermelho} opacidade="0.25" />
      <Respingo cx={1010} cy={570} u={1.4} cor="#E9B72E" opacidade="0.25" />
      <Ancora x="esq" y="base">
        <LinhaDecorativa de={[0, 800]} para={[30, 840]} cor={cor.ouro} opLinha="0.25" opLosango="0.5" />
      </Ancora>
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />

      <defs>
        <radialGradient id="fim-foco" cx="720" cy="440" r="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="420" y="100" width="600" height="700" rx="0" fill="url(#fim-foco)" opacity="1" />

      <Luminaria cx={720} y={166} fundo={370} meiaBase={79} idCone="fim-cone" />
      <Louro />
      <Frame x={655} y={194} w={130} h={170} fw={11} moldura={obra.moldura} pintura={obra.pintura} passepartout={8} />

      <text
        x="575.22"
        y="426"
        fontFamily={fonte.rotulo}
        fontSize="13"
        fontWeight="500"
        fontStyle="normal"
        fill={cor.ouro}
        letterSpacing="7"
      >
        — VISITA CONCLUÍDA —
      </text>
      <text
        x="624.37"
        y="470"
        fontFamily={fonte.texto}
        fontSize="26"
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        você conversou sobre
      </text>
      <text
        x={tituloX}
        y="542"
        fontFamily={fonte.titulo}
        fontSize={tamanho}
        fontWeight="700"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="1"
      >
        {titulo}
      </text>
      <Pincelada x={560} y={554} sx={1.067} sy={0.225} cor={cor.vermelho} opacidade="0.9" />

      <Botao
        x={448}
        y={632}
        w={260}
        h={56}
        variante="ouro"
        texto="VER OUTRO QUADRO"
        textoX={475.43}
        textoY={665}
        tamanho={14}
        onClick={onOutro}
      />
      <Botao
        x={732}
        y={632}
        w={260}
        h={56}
        variante="neutro"
        texto="VOLTAR AO INÍCIO"
        textoX={767.29}
        textoY={665}
        tamanho={14}
        onClick={onInicio}
      />

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
