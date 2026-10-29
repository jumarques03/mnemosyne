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
import { cfgRetrato, quebrarLinhas } from '../chat/layout.js'

const ESCALA_CONVERSA = 0.7 // as bolhas (fonte 24 no design) ficam com ~17 px num celular
const MARGEM = 20 // lateral da coluna
const ALTURA_COMPLETA = 700 // a partir daqui o cabeçalho mostra a moldura e a ficha da obra
const fonteTitulo = (px) => `700 ${px}px "${fonte.titulo}"`
const fonteArtista = (px) => `italic 500 ${px}px "${fonte.texto}"`
const fonteRotulo = (px) => `400 ${px}px "${fonte.rotulo}"`

// corpo do chip, espaço entre letras e folga lateral, do mais folgado ao mais apertado
const MEDIDAS_CHIP = [
  [14, 0.5, 30],
  [13, 0.3, 22],
  [12, 0, 16],
]

/** Distribui as sugestões em duas fileiras centralizadas em `cx`, apertando-as se não couberem em `larguraMax`. */
function posicionarChips(cx, y1, y2, larguraMax) {
  const gap = 8
  const montar = ([tamanho, espaco, folga]) => {
    const medidas = SUGESTOES.map((texto) => ({ texto, tamanho, w: Math.ceil(medirTexto(texto, fonteRotulo(tamanho), espaco)) + folga * 2, folga }))
    return [medidas.slice(0, 2), medidas.slice(2)]
  }
  const largura = (fila) => fila.reduce((soma, c) => soma + c.w, 0) + gap * (fila.length - 1)
  const opcoes = MEDIDAS_CHIP.map(montar)
  const fileiras = opcoes.find((o) => o.every((fila) => largura(fila) <= larguraMax)) ?? opcoes[opcoes.length - 1]
  return fileiras.flatMap((fila, i) => {
    let x = cx - largura(fila) / 2
    return fila.map((c) => {
      const chip = { ...c, x, y: i === 0 ? y1 : y2, tx: x + c.folga }
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
  const { H, coluna, limites, teclado } = useLayout()
  const x0 = coluna.x
  const cw = coluna.w
  const cx = x0 + cw / 2
  // cabeçalho: completo (moldura + ficha + botões), enxuto (título + botões) ou só o título com o teclado aberto
  const cabecalho = teclado ? 'teclado' : H < ALTURA_COMPLETA ? 'enxuto' : 'completo'
  const assinatura = [obra.artista, obra.ano].filter(Boolean).join(', ')

  // ---- cabeçalho da obra (moldura, ficha e botões) ----
  const larguraQuadro = Math.round(Math.min(150, Math.max(108, cw * 0.34)))
  const alturaQuadro = Math.round(larguraQuadro * 1.3)
  const quadroX = x0 + MARGEM
  const quadroY = 98
  const fichaX = quadroX + larguraQuadro + 14
  const fichaW = x0 + cw - MARGEM - fichaX
  const textoX = fichaX + 14
  const textoW = fichaW - 28
  // Título em até duas linhas, no maior corpo (19 → 14) que couber na ficha.
  let tamanhoTitulo = 19
  let linhasTitulo = quebrarLinhas(obra.titulo, textoW, (t) => medirTexto(t, fonteTitulo(tamanhoTitulo)))
  while (linhasTitulo.length > 2 && tamanhoTitulo > 14) {
    tamanhoTitulo -= 1
    linhasTitulo = quebrarLinhas(obra.titulo, textoW, (t) => medirTexto(t, fonteTitulo(tamanhoTitulo)))
  }
  const nomeArtista = ajustarAoLargura(assinatura, fonteArtista, 17, textoW, 12).tamanho
  const tecnica = ajustarAoLargura(obra.tecnica, fonteRotulo, 12, textoW - 8, 10)
  const acervo = ajustarAoLargura(obra.acervo, fonteRotulo, 12, textoW - 8, 10)
  // Posições (linhas de base) dentro da ficha, de cima para baixo.
  const yTitulo = quadroY + 16 + tamanhoTitulo
  const yArtista = yTitulo + (linhasTitulo.length - 1) * tamanhoTitulo * 1.2 + nomeArtista + 8
  const yTecnica = yArtista + 24
  const yAcervo = yTecnica + 20
  const tituloCompacto = ajustarAoLargura(obra.titulo, fonteTitulo, 17, cw - 48, 12)
  const botoesY = quadroY + alturaQuadro + 34
  const botaoW = (cw - MARGEM * 2 - 10) / 2
  const topoCompacto = 96
  const botoesEnxutosY = topoCompacto + 34
  const conversaTopo = { teclado: topoCompacto + 36, enxuto: botoesEnxutosY + 34 + 10, completo: botoesY + 38 + 12 }[cabecalho]

  // ---- rodapé: sugestões, campo e botão de enviar ----
  const baselineCampo = H - 36
  const linhaCampo = H - 82
  const yChip2 = linhaCampo - 12 - 34
  const yChip1 = yChip2 - 8 - 34
  const fimConversa = (teclado ? linhaCampo : yChip1) - 12
  const conversaAltura = Math.max(120, fimConversa - conversaTopo)

  const cfg = useMemo(
    () => cfgRetrato((cw - 24) / ESCALA_CONVERSA, conversaAltura / ESCALA_CONVERSA),
    [cw, conversaAltura],
  )
  const chips = posicionarChips(cx, yChip1, yChip2, cw - 24)

  const rotuloBotao = (texto) => {
    const grande = [12, 2]
    const pequeno = [11, 1]
    const [tamanho, espaco] = medirTexto(texto, `500 ${grande[0]}px "${fonte.rotulo}"`, grande[1]) <= botaoW - 16 ? grande : pequeno
    return { tamanho, espaco, textoX: (x) => xCentrado(x, botaoW, texto, `500 ${tamanho}px "${fonte.rotulo}"`, espaco) }
  }
  const textoTrocar = '←  OUTRO QUADRO'
  const textoConcluir = 'CONCLUIR'
  const trocar = rotuloBotao(textoTrocar)
  const concluir = rotuloBotao(textoConcluir)

  return (
    <g>
      <Fundo />
      <Cornija />
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />
      <line x1={limites.x0} y1="84" x2={limites.x1} y2="84" stroke={cor.ouro} strokeWidth="1" opacity="0.2" />

      {cabecalho !== 'completo' ? (
        <>
          <text x={cx} y={topoCompacto + 22} textAnchor="middle" fontFamily={fonte.titulo} fontSize={tituloCompacto.tamanho} fontWeight="700" fill={cor.creme}>
            {obra.titulo}
          </text>
          {cabecalho === 'enxuto' && (
            <>
              <Botao
                x={x0 + MARGEM}
                y={botoesEnxutosY}
                w={botaoW}
                h={34}
                variante="neutro"
                texto={textoTrocar}
                rotulo="Trocar de quadro"
                textoX={trocar.textoX(x0 + MARGEM)}
                textoY={botoesEnxutosY + 22}
                tamanho={trocar.tamanho}
                espaco={trocar.espaco}
                onClick={onTrocar}
              />
              <Botao
                x={x0 + MARGEM + botaoW + 10}
                y={botoesEnxutosY}
                w={botaoW}
                h={34}
                variante="ouro"
                texto={textoConcluir}
                rotulo="Concluir conversa"
                textoX={concluir.textoX(x0 + MARGEM + botaoW + 10)}
                textoY={botoesEnxutosY + 22}
                tamanho={concluir.tamanho}
                espaco={concluir.espaco}
                onClick={onConcluir}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Frame x={quadroX} y={quadroY} w={larguraQuadro} h={alturaQuadro} fw={7} moldura={obra.moldura} imagem={obra.imagem} passepartout={3} />
          <Plaquinha x={quadroX + larguraQuadro / 2 - 34} y={quadroY + alturaQuadro + 8} texto={obra.numero} escala={1.2} />

          <rect x={fichaX} y={quadroY} width={fichaW} height={alturaQuadro} rx="2" fill="#EDE3CC" opacity="1" />
          <rect x={fichaX + 5} y={quadroY + 5} width={fichaW - 10} height={alturaQuadro - 10} rx="1" fill="none" stroke="#8F7A4A" strokeWidth="1" opacity="0.6" />
          <text fontFamily={fonte.titulo} fontSize={tamanhoTitulo} fontWeight="700" fill="#1A1410">
            {linhasTitulo.map((linha, i) => (
              <tspan key={i} x={textoX} y={yTitulo + i * tamanhoTitulo * 1.2}>
                {linha}
              </tspan>
            ))}
          </text>
          <text x={textoX} y={yArtista} fontFamily={fonte.texto} fontSize={nomeArtista} fontWeight="500" fontStyle="italic" fill="#4A3F30">
            {assinatura}
          </text>
          <text x={textoX} y={yTecnica} fontFamily={fonte.rotulo} fontSize={tecnica.tamanho} fontWeight="400" fill="#6B5D48" letterSpacing="0.5">
            {obra.tecnica}
          </text>
          <text x={textoX} y={yAcervo} fontFamily={fonte.rotulo} fontSize={acervo.tamanho} fontWeight="400" fill="#6B5D48" letterSpacing="0.5">
            {obra.acervo}
          </text>

          <Botao
            x={x0 + MARGEM}
            y={botoesY}
            w={botaoW}
            h={38}
            variante="neutro"
            texto={textoTrocar}
            rotulo="Trocar de quadro"
            textoX={trocar.textoX(x0 + MARGEM)}
            textoY={botoesY + 24}
            tamanho={trocar.tamanho}
            espaco={trocar.espaco}
            onClick={onTrocar}
          />
          <Botao
            x={x0 + MARGEM + botaoW + 10}
            y={botoesY}
            w={botaoW}
            h={38}
            variante="ouro"
            texto={textoConcluir}
            rotulo="Concluir conversa"
            textoX={concluir.textoX(x0 + MARGEM + botaoW + 10)}
            textoY={botoesY + 24}
            tamanho={concluir.tamanho}
            espaco={concluir.espaco}
            onClick={onConcluir}
          />
        </>
      )}

      <g transform={`translate(${x0 + 12} ${conversaTopo}) scale(${ESCALA_CONVERSA})`}>
        <AreaConversa mensagens={mensagens} digitando={digitando} cfg={cfg} />
      </g>

      {!teclado &&
        chips.map(({ texto, x, y, w, tx, tamanho }) => (
          <Chip key={texto} x={x} y={y} w={w} h={34} tx={tx} texto={texto} tamanho={tamanho} onClick={onPerguntar} />
        ))}

      <line x1={x0 + MARGEM} y1={linhaCampo} x2={x0 + cw - MARGEM} y2={linhaCampo} stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      <CampoPergunta
        x={x0 + MARGEM}
        baseline={baselineCampo}
        w={cw - MARGEM * 2 - 56}
        tamanho={20}
        valor={rascunho}
        onMudar={onRascunho}
        onEnviar={onPerguntar}
      />
      <Pincelada x={x0 + MARGEM} y={baselineCampo + 8} sx={(cw - MARGEM * 2 - 56) / 309} sy={0.2} cor={cor.ouro} opacidade="0.45" />
      <BotaoEnviar cx={x0 + cw - MARGEM - 22} cy={baselineCampo - 12} r={22} onEnviar={() => onPerguntar(rascunho)} />

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
