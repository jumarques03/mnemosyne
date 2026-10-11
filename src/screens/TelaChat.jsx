import { useState } from 'react'
import { cor, fonte } from '../theme.js'
import { SUGESTOES } from '../services/curador.js'
import { ajustarAoLargura, medirTexto } from '../utils/medirTexto.js'
import { useLayout } from '../layout/contexto.js'
import Ancora from '../layout/Ancora.jsx'
import Frame from '../components/art/Frame.jsx'
import Botao from '../components/scene/Botao.jsx'
import { Fundo, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada, Luminaria, Plaquinha } from '../components/scene/Ornamentos.jsx'
import { Coluna } from '../components/scene/Esculturas.jsx'
import AreaConversa from './chat/AreaConversa.jsx'
import { Chip, CampoPergunta, BotaoEnviar } from './chat/Entrada.jsx'
import { CFG_PAISAGEM } from './chat/layout.js'
import TelaChatRetrato from './retrato/TelaChatRetrato.jsx'

const fonteRotulo = (px) => `400 ${px}px "${fonte.rotulo}"`
const fonteTitulo = (px) => `700 ${px}px "${fonte.titulo}"`
const fonteArtista = (px) => `italic 500 ${px}px "${fonte.texto}"`

const FONTE_CHIP = `400 15px "${fonte.rotulo}"`
const CHIPS = (() => {
  let x = 560
  return SUGESTOES.map((texto) => {
    const w = Math.ceil(medirTexto(texto, FONTE_CHIP, 0.5)) + 40
    const chip = { x, w, tx: x + 20 }
    x += w + 14
    return chip
  })
})()

/** 03 · Chat — painel com a obra à esquerda e a conversa com a curadoria à direita. */
export default function TelaChat(props) {
  const { obra, mensagens, digitando, onEnviar, onTrocar, onConcluir, onInicio, onVoltar } = props
  const { modo, limites } = useLayout()
  const [rascunho, setRascunho] = useState('')
  const titulo = ajustarAoLargura(obra.titulo, fonteTitulo, 24, 266, 16)
  const tecnica = ajustarAoLargura(obra.tecnica, fonteRotulo, 14, 232, 11)
  const acervo = ajustarAoLargura(obra.acervo, fonteRotulo, 14, 232, 11)
  const assinatura = `${obra.artista}, ${obra.ano}`
  const tamanhoAssinatura = ajustarAoLargura(assinatura, fonteArtista, 19, 266, 14).tamanho

  const enviar = (texto) => {
    const limpo = texto.trim()
    if (!limpo) return
    onEnviar(limpo)
    setRascunho('')
  }

  if (modo === 'retrato') return <TelaChatRetrato {...props} rascunho={rascunho} onRascunho={setRascunho} onPerguntar={enviar} />

  return (
    <g>
      <Fundo />
      <Cornija />
      <Ancora x="esq" y="base">
        <LinhaDecorativa de={[0, 780]} para={[40, 830]} cor={cor.ouro} opLinha="0.25" opLosango="0.5" />
        <Coluna x={19} capY={150} fuste={34} altura={600} opacidade="0.38" idFuste="chat-coluna" />
      </Ancora>
      <Respingo cx={470} cy={640} u={1.2} cor={cor.vermelho} opacidade="0.22" />
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />
      <Ancora y="topo">
        <line x1={limites.x0} y1="104" x2={limites.x1} y2="104" stroke={cor.ouro} strokeWidth="1" opacity="0.2" />
      </Ancora>

      <Luminaria cx={265} y={128} fundo={560} meiaBase={169} idCone="chat-cone" />
      <Frame x={110} y={160} w={310} h={400} fw={17} moldura={obra.moldura} imagem={obra.imagem} passepartout={10} />
      <Plaquinha x={231} y={572} texto={obra.numero} escala={1.3} />

      <rect x="110" y="600" width="310" height="120" rx="2" fill="#EDE3CC" opacity="1" />
      <rect x="116" y="606" width="298" height="108" rx="1" fill="none" stroke="#8F7A4A" strokeWidth="1" opacity="0.6" />
      <text x="134" y="636" fontFamily={fonte.titulo} fontSize={titulo.tamanho} fontWeight="700" fontStyle="normal" fill="#1A1410">
        {obra.titulo}
      </text>
      <text x="134" y="657" fontFamily={fonte.texto} fontSize={tamanhoAssinatura} fontWeight="500" fontStyle="italic" fill="#4A3F30">
        {assinatura}
      </text>
      <text x="134" y="683" fontFamily={fonte.rotulo} fontSize={tecnica.tamanho} fontWeight="400" fontStyle="normal" fill="#6B5D48" letterSpacing="1">
        {obra.tecnica}
      </text>
      <text x="134" y="705" fontFamily={fonte.rotulo} fontSize={acervo.tamanho} fontWeight="400" fontStyle="normal" fill="#6B5D48" letterSpacing="1">
        {obra.acervo}
      </text>

      <Botao
        x={110}
        y={750}
        w={310}
        h={46}
        variante="neutro"
        texto="← &#160;TROCAR DE QUADRO"
        rotulo="Trocar de quadro"
        textoX={157.79}
        textoY={778}
        tamanho={12}
        onClick={onTrocar}
      />
      <Botao
        x={110}
        y={808}
        w={310}
        h={46}
        variante="ouro"
        texto="CONCLUIR CONVERSA"
        textoX={166.94}
        textoY={836}
        tamanho={12}
        onClick={onConcluir}
      />

      <line x1="500" y1="130" x2="500" y2="860" stroke={cor.ouro} strokeWidth="1" opacity="0.18" />

      <AreaConversa mensagens={mensagens} digitando={digitando} cfg={CFG_PAISAGEM} />

      {SUGESTOES.map((texto, i) => (
        <Chip key={texto} {...CHIPS[i]} y={694} h={38} tamanho={15} texto={texto} onClick={enviar} />
      ))}

      <line x1="540" y1="762" x2="1380" y2="762" stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      <CampoPergunta x={560} baseline={808} w={752} tamanho={25} valor={rascunho} onMudar={setRascunho} onEnviar={enviar} />
      <Pincelada x={560} y={814} sx={2.433} sy={0.225} cor={cor.ouro} opacidade="0.45" />
      <BotaoEnviar cx={1340} cy={800} onEnviar={() => enviar(rascunho)} />

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
