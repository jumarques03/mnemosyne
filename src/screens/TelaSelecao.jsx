import { cor, fonte } from '../theme.js'
import { useLayout } from '../layout/contexto.js'
import Ancora from '../layout/Ancora.jsx'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada } from '../components/scene/Ornamentos.jsx'
import { Coluna, Busto } from '../components/scene/Esculturas.jsx'
import Cartao from './selecao/Cartao.jsx'
import Paginador from './selecao/Paginador.jsx'
import TelaSelecaoRetrato from './retrato/TelaSelecaoRetrato.jsx'

const CARTAO_X0 = 135
const CARTAO_PASSO = 300

/** 02 · Seleção de quadro — quatro obras expostas, a "ativa" fica iluminada. */
export default function TelaSelecao({ obras, ativa, onAtiva, onEscolher, onInicio, onVoltar }) {
  const { modo } = useLayout()
  if (modo === 'retrato') {
    return <TelaSelecaoRetrato obras={obras} onEscolher={onEscolher} onInicio={onInicio} onVoltar={onVoltar} />
  }
  return (
    <g>
      <Fundo />
      <LuzJanela xs={[520, 850]} y={40} w={70} h={500} opacidade="0.06" />
      <Cornija />
      <Ancora x="esq">
        <LinhaDecorativa de={[0, 130]} para={[150, 96]} cor={cor.ouro} opLinha="0.3" opLosango="0.55" />
        <Respingo cx={250} cy={190} u={1.6} cor="#E9B72E" opacidade="0.3" />
      </Ancora>
      <Ancora x="dir">
        <LinhaDecorativa de={[1440, 700]} para={[1260, 760]} cor={cor.vermelho} opLinha="0.4" opLosango="0.65" />
        <Respingo cx={1230} cy={215} u={1.4} cor={cor.vermelho} opacidade="0.3" />
      </Ancora>
      <Ancora x="esq" y="base">
        <Coluna x={32} capY={200} fuste={40} altura={550} opacidade="0.55" idFuste="selecao-coluna-1" />
        <Busto x={62} y={200} escala={0.42} opacidade="0.6" pedestal={false} idMarmore="selecao-busto-1" />
      </Ancora>
      <Ancora x="dir" y="base">
        <Coluna x={1348} capY={200} fuste={40} altura={550} opacidade="0.55" idFuste="selecao-coluna-2" />
        <Busto x={1378} y={200} escala={0.42} opacidade="0.6" pedestal={false} idMarmore="selecao-busto-2" />
      </Ancora>
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />

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
        <Cartao
          key={obra.id}
          obra={obra}
          id={i}
          x={CARTAO_X0 + i * CARTAO_PASSO}
          ativo={i === ativa}
          onAtiva={() => onAtiva(i)}
          onEscolher={onEscolher}
        />
      ))}

      <Paginador cx={720} cy={830} total={3} atual={0} />
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
