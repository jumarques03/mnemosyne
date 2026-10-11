import { useMemo } from 'react'
import { cor, fonte } from '../../theme.js'
import { SUGESTOES } from '../../services/curador.js'
import { useLayout } from '../../layout/contexto.js'
import { ajustarAoLargura, medirTexto, xCentrado } from '../../utils/medirTexto.js'
import Frame from '../../components/art/Frame.jsx'
import Botao from '../../components/scene/Botao.jsx'
import { Fundo, Cornija, Cabecalho, Greca, Vinheta } from '../../components/scene/Ambiente.jsx'
import { Pincelada, Plaquinha } from '../../components/scene/Ornamentos.jsx'
import AreaConversa from '../chat/AreaConversa.jsx'
import { Chip, CampoPergunta, BotaoEnviar } from '../chat/Entrada.jsx'
import { cfgRetrato } from '../chat/layout.js'

const ESCALA_CONVERSA = 0.9 // as bolhas usam as medidas do design, reduzidas um pouco para caber
const FONTE_CHIP = `400 15px "${fonte.rotulo}"`
const ESPACO_CHIP = 0.5
const fonteTitulo = (px) => `700 ${px}px "${fonte.titulo}"`
const fonteArtista = (px) => `italic 500 ${px}px "${fonte.texto}"`

/** Distribui as sugestões em duas fileiras centralizadas em `cx`. */
function posicionarChips(cx, y1, y2) {
  const medidas = SUGESTOES.map((texto) => ({ texto, w: Math.ceil(medirTexto(texto, FONTE_CHIP, ESPACO_CHIP)) + 36 }))
  const fileiras = [medidas.slice(0, 2), medidas.slice(2)]
  const gap = 10
  return fileiras.flatMap((fila, i) => {
    const total = fila.reduce((soma, c) => soma + c.w, 0) + gap * (fila.length - 1)
    let x = cx - total / 2
    return fila.map((c) => {
      const chip = { ...c, x, y: i === 0 ? y1 : y2, tx: x + 18 }
      x += c.w + gap
      return chip
    })
  })
}

/** 03 · Chat no layout vertical: obra e botões no alto, conversa no meio, sugestões e campo embaixo. */
export default function TelaChatRetrato({
  obra,
  mensagens,
  digitando,
  onTrocar,
  onConcluir,
  onInicio,
  onVoltar,
  rascunho,
  onRascunho,
  onPerguntar,
}) {
  const { H, coluna, limites } = useLayout()
  const x0 = coluna.x
  const cx = x0 + coluna.w / 2
  const titulo = ajustarAoLargura(obra.titulo, fonteTitulo, 21, 256, 14)
  const assinatura = `${obra.artista}, ${obra.ano}`
  const tamanhoAssinatura = ajustarAoLargura(assinatura, fonteArtista, 18, 256, 13).tamanho

  // Medidas verticais, contadas a partir do rodapé.
  const baselineCampo = H - 50
  const linhaCampo = H - 100
  const yChip2 = linhaCampo - 14 - 30
  const yChip1 = yChip2 - 8 - 30
  const conversaTopo = 304
  const conversaAltura = Math.max(120, yChip1 - 14 - conversaTopo)

  const cfg = useMemo(
    () => cfgRetrato((coluna.w - 24) / ESCALA_CONVERSA, conversaAltura / ESCALA_CONVERSA),
    [coluna.w, conversaAltura],
  )
  const chips = posicionarChips(cx, yChip1, yChip2)

  const fonteBotao = `500 11px "${fonte.rotulo}"`
  const textoTrocar = '←  TROCAR DE QUADRO'
  const textoConcluir = 'CONCLUIR CONVERSA'

  return (
    <g>
      <Fundo />
      <Cornija />
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />
      <line x1={limites.x0} y1="84" x2={limites.x1} y2="84" stroke={cor.ouro} strokeWidth="1" opacity="0.2" />

      <Frame x={x0 + 24} y={102} w={124} h={164} fw={9} moldura={obra.moldura} imagem={obra.imagem} passepartout={8} />
      <Plaquinha x={x0 + 52} y={274} texto={obra.numero} escala={1.3} />

      <rect x={x0 + 164} y="102" width="292" height="104" rx="2" fill="#EDE3CC" opacity="1" />
      <rect x={x0 + 169} y="107" width="282" height="94" rx="1" fill="none" stroke="#8F7A4A" strokeWidth="1" opacity="0.6" />
      <text x={x0 + 184} y="134" fontFamily={fonte.titulo} fontSize={titulo.tamanho} fontWeight="700" fill="#1A1410">
        {obra.titulo}
      </text>
      <text x={x0 + 184} y="157" fontFamily={fonte.texto} fontSize={tamanhoAssinatura} fontWeight="500" fontStyle="italic" fill="#4A3F30">
        {assinatura}
      </text>
      <text x={x0 + 184} y="181" fontFamily={fonte.rotulo} fontSize="11" fontWeight="400" fill="#6B5D48" letterSpacing="1">
        {obra.tecnica}
      </text>
      <text x={x0 + 184} y="198" fontFamily={fonte.rotulo} fontSize="11" fontWeight="400" fill="#6B5D48" letterSpacing="1">
        {obra.acervo}
      </text>

      <Botao
        x={x0 + 164}
        y={216}
        w={292}
        h={32}
        variante="neutro"
        texto={textoTrocar}
        rotulo="Trocar de quadro"
        textoX={xCentrado(x0 + 164, 292, textoTrocar, fonteBotao, 3)}
        textoY={216 + 21}
        tamanho={11}
        espaco={3}
        onClick={onTrocar}
      />
      <Botao
        x={x0 + 164}
        y={254}
        w={292}
        h={32}
        variante="ouro"
        texto={textoConcluir}
        textoX={xCentrado(x0 + 164, 292, textoConcluir, fonteBotao, 3)}
        textoY={254 + 21}
        tamanho={11}
        espaco={3}
        onClick={onConcluir}
      />

      <g transform={`translate(${x0 + 12} ${conversaTopo}) scale(${ESCALA_CONVERSA})`}>
        <AreaConversa mensagens={mensagens} digitando={digitando} cfg={cfg} />
      </g>

      {chips.map(({ texto, x, y, w, tx }) => (
        <Chip key={texto} x={x} y={y} w={w} h={30} tx={tx} texto={texto} tamanho={15} onClick={onPerguntar} />
      ))}

      <line x1={x0 + 24} y1={linhaCampo} x2={x0 + 456} y2={linhaCampo} stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      <CampoPergunta
        x={x0 + 24}
        baseline={baselineCampo}
        w={372}
        tamanho={22}
        valor={rascunho}
        onMudar={onRascunho}
        onEnviar={onPerguntar}
      />
      <Pincelada x={x0 + 24} y={baselineCampo + 8} sx={1.2} sy={0.2} cor={cor.ouro} opacidade="0.45" />
      <BotaoEnviar cx={x0 + 432} cy={baselineCampo - 10} r={22} onEnviar={() => onPerguntar(rascunho)} />

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
