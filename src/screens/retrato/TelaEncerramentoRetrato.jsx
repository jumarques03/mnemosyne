import { cor, fonte } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import { medirTexto, xCentrado } from '../../utils/medirTexto.js'
import Frame from '../../components/art/Frame.jsx'
import Botao from '../../components/scene/Botao.jsx'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../../components/scene/Ambiente.jsx'
import { Pincelada, Luminaria, Louro } from '../../components/scene/Ornamentos.jsx'

// O bloco central é desenhado em coordenadas locais: x = 0 no eixo da tela, y = 0 no topo da coroa.
const ALTURA_BLOCO = 548
const TITULO = { tamanho: 40, margem: 40 } // o título cabe na coluna menos a margem

/** 04 · Encerramento no layout vertical: coroa de louro, "visita concluída", título e botões empilhados. */
export default function TelaEncerramentoRetrato({ obra, onOutro, onInicio, onVoltar }) {
  const { H, coluna } = useLayout()
  const cx = coluna.x + coluna.w / 2

  // Se a tela for baixa, o bloco inteiro encolhe; se sobrar espaço, ele se centraliza.
  const disponivel = H - 110 - 40
  const escala = Math.min(1, disponivel / ALTURA_BLOCO)
  const topo = 110 + Math.max(0, (disponivel - ALTURA_BLOCO * escala) / 2)

  const titulo = obra.titulo.toUpperCase()
  const larguraBase = medirTexto(titulo, `700 ${TITULO.tamanho}px "${fonte.titulo}"`, 1)
  const tamanho = TITULO.tamanho * Math.min(1, (coluna.w - TITULO.margem) / escala / larguraBase)
  const larguraBotao = Math.min(280, (coluna.w - 48) / escala)

  const fonteBotao = `500 13px "${fonte.rotulo}"`

  return (
    <g>
      <Fundo />
      <LuzJanela xs={[coluna.x + 60, coluna.x + 250]} y={40} w={60} h={560} opacidade="0.07" />
      <Cornija />
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />

      <g transform={`translate(${cx} ${topo}) scale(${escala})`}>
        <defs>
          <radialGradient id="fim-foco-v" cx="0" cy="130" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="-300" y="-170" width="600" height="600" fill="url(#fim-foco-v)" />

        {/* Coroa, luminária e quadro: o desenho do design, deslocado para o eixo (720 → 0, 150 → 0). */}
        <g transform="translate(-720 -150)">
          <Luminaria cx={720} y={166} fundo={370} meiaBase={79} idCone="fim-cone-v" />
          <Louro />
          <Frame x={655} y={194} w={130} h={170} fw={11} moldura={obra.moldura} imagem={obra.imagem} passepartout={8} />
        </g>

        <text
          x="2.5"
          y="278"
          textAnchor="middle"
          fontFamily={fonte.rotulo}
          fontSize="15"
          fontWeight="500"
          fill={cor.ouro}
          letterSpacing="5"
        >
          — VISITA CONCLUÍDA —
        </text>
        <text x="0" y="318" textAnchor="middle" fontFamily={fonte.texto} fontSize="27" fontWeight="500" fontStyle="italic" fill={cor.texto}>
          você conversou sobre
        </text>
        <text
          x="0.5"
          y="372"
          textAnchor="middle"
          fontFamily={fonte.titulo}
          fontSize={tamanho}
          fontWeight="700"
          fill={cor.creme}
          letterSpacing="1"
        >
          {titulo}
        </text>
        <Pincelada x={-Math.min(160, larguraBotao / 2 + 20)} y={380} sx={1.067} sy={0.2} cor={cor.vermelho} opacidade="0.9" />

        <Botao
          x={-larguraBotao / 2}
          y={436}
          w={larguraBotao}
          h={52}
          variante="ouro"
          texto="VER OUTRO QUADRO"
          textoX={xCentrado(-larguraBotao / 2, larguraBotao, 'VER OUTRO QUADRO', fonteBotao, 4)}
          textoY={436 + 32}
          tamanho={13}
          onClick={onOutro}
        />
        <Botao
          x={-larguraBotao / 2}
          y={496}
          w={larguraBotao}
          h={52}
          variante="neutro"
          texto="VOLTAR AO INÍCIO"
          textoX={xCentrado(-larguraBotao / 2, larguraBotao, 'VOLTAR AO INÍCIO', fonteBotao, 4)}
          textoY={496 + 32}
          tamanho={13}
          onClick={onInicio}
        />
      </g>

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
