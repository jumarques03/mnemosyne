import { useEffect, useState } from 'react'
import { cor, fonte } from '../theme.js'
import { useLayout } from '../layout/contexto.js'
import Ancora from '../layout/Ancora.jsx'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada } from '../components/scene/Ornamentos.jsx'
import { Coluna, Busto } from '../components/scene/Esculturas.jsx'
import Cartao from './selecao/Cartao.jsx'
import SeletorTurma from './selecao/SeletorTurma.jsx'
import { Seta } from './selecao/Paginador.jsx'
import { CARTAO } from './selecao/medidas.js'
import TelaSelecaoRetrato from './retrato/TelaSelecaoRetrato.jsx'

// A tela mostra no máximo quatro cartões (270 com 30 de vão) em tamanho cheio; turmas com mais
// quadros ganham setas nas pontas da fileira para deslizar de um em um.
const CARTAO_PASSO = 300
const VISIVEIS = 4
const ESQUERDA_CARTOES = 135
const SETA_ESQ_X = 100
const SETA_DIR_X = 1340

/** 02 · Seleção de quadro — as obras da turma escolhida ficam expostas; a "ativa" fica iluminada. */
export default function TelaSelecao({ turmas, turma, onTurma, ativa, onAtiva, onEscolher, onInicio, onVoltar }) {
  const { modo } = useLayout()
  const { obras, nome } = turmas[turma]
  const [deslocados, setDeslocados] = useState({}) // primeiro cartão visível de cada turma
  const inicio = Math.min(deslocados[turma] ?? 0, Math.max(0, obras.length - VISIVEIS))
  const deslizar = (passo) => setDeslocados((d) => ({ ...d, [turma]: Math.max(0, Math.min(obras.length - VISIVEIS, inicio + passo)) }))

  // No layout largo, ← e → trocam de turma (no vertical, passam de obra).
  useEffect(() => {
    if (modo !== 'paisagem') return
    const teclas = (e) => {
      if (e.key === 'ArrowLeft') onTurma(turma - 1)
      if (e.key === 'ArrowRight') onTurma(turma + 1)
    }
    window.addEventListener('keydown', teclas)
    return () => window.removeEventListener('keydown', teclas)
  }, [modo, turma, onTurma])

  if (modo === 'retrato') {
    return (
      <TelaSelecaoRetrato
        key={turmas[turma].id}
        turmas={turmas}
        turma={turma}
        onTurma={onTurma}
        onEscolher={onEscolher}
        onInicio={onInicio}
        onVoltar={onVoltar}
      />
    )
  }
  const visiveis = obras.slice(inicio, inicio + VISIVEIS)
  const centroY = CARTAO.y + CARTAO.h / 2
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
        x="720"
        y="274"
        textAnchor="middle"
        fontFamily={fonte.texto}
        fontSize="25"
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        selecione a obra sobre a qual você quer conversar
      </text>

      {visiveis.map((obra, i) => (
        <g key={obra.id} transform={`translate(${ESQUERDA_CARTOES + i * CARTAO_PASSO} 0)`}>
          <Cartao obra={obra} id={i} x={0} ativo={inicio + i === ativa} onAtiva={() => onAtiva(inicio + i)} onEscolher={onEscolher} />
        </g>
      ))}
      {obras.length > VISIVEIS && (
        <>
          {inicio > 0 && <Seta cx={SETA_ESQ_X} cy={centroY} direcao="esq" onClick={() => deslizar(-1)} rotulo="Quadros anteriores" />}
          {inicio < obras.length - VISIVEIS && (
            <Seta cx={SETA_DIR_X} cy={centroY} direcao="dir" onClick={() => deslizar(1)} rotulo="Mais quadros" />
          )}
        </>
      )}

      <SeletorTurma cx={720} cy={830} turmas={turmas} atual={turma} onIr={onTurma} />
      <text
        x="719.35"
        y="874"
        textAnchor="middle"
        fontFamily={fonte.rotulo}
        fontSize="14"
        fontWeight="500"
        fontStyle="normal"
        fill={cor.texto}
        letterSpacing="4"
        opacity="0.8"
      >
        {`ACERVO · ${nome.toUpperCase()} · ${obras.length} OBRAS`}
      </text>
      <Greca y={894} opacidade="0.3" />
      <Vinheta />
    </g>
  )
}
