import { useMemo, useState } from 'react'
import { cor, fonte } from '../theme.js'
import { SUGESTOES } from '../services/curador.js'
import { medirTexto } from '../utils/medirTexto.js'
import Frame from '../components/art/Frame.jsx'
import Botao from '../components/scene/Botao.jsx'
import { Fundo, Cornija, Cabecalho, Greca, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada, Luminaria, Plaquinha } from '../components/scene/Ornamentos.jsx'
import { Coluna } from '../components/scene/Esculturas.jsx'
import { Mensagem, Digitando } from './chat/Mensagens.jsx'
import { montarLayout, JANELA } from './chat/layout.js'

const CHIPS = [
  { x: 560, w: 188, tx: 596.26 },
  { x: 762, w: 173, tx: 795.79 },
  { x: 949, w: 180, tx: 984.98 },
  { x: 1143, w: 180, tx: 1174 },
]

function Chip({ x, w, tx, texto, onClick }) {
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(texto)
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label={texto} onClick={ativar} onKeyDown={ativar}>
      <rect className="hit-fill" x={x} y="696" width={w} height="34" rx="17" fill={cor.ouro} opacity="0" />
      <rect x={x} y="696" width={w} height="34" rx="17" fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.55" />
      <text
        x={tx}
        y="718"
        fontFamily={fonte.rotulo}
        fontSize="13"
        fontWeight="400"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="0.5"
      >
        {texto}
      </text>
      <rect className="focus-ring" x={x - 4} y="692" width={w + 8} height="42" rx="21" fill="none" opacity="0" />
    </g>
  )
}

/** 03 · Chat — painel com a obra à esquerda e a conversa com a curadoria à direita. */
export default function TelaChat({ obra, mensagens, digitando, onEnviar, onTrocar, onConcluir, onInicio }) {
  const [rascunho, setRascunho] = useState('')
  const [ajuste, setAjuste] = useState({ fim: 0, subiu: 0 })

  const layout = useMemo(() => montarLayout(mensagens, digitando, medirTexto), [mensagens, digitando])
  const maxRolagem = Math.max(0, layout.fim - JANELA.base)

  // A conversa acompanha o fim; o que o visitante "sobe" com a roda vale só até chegar algo novo.
  const subiu = ajuste.fim === layout.fim ? ajuste.subiu : 0
  const rolagem = Math.max(0, maxRolagem - subiu)
  const rolar = (e) => setAjuste({ fim: layout.fim, subiu: Math.min(maxRolagem, Math.max(0, subiu - e.deltaY)) })

  const enviar = (texto) => {
    const limpo = texto.trim()
    if (!limpo) return
    onEnviar(limpo)
    setRascunho('')
  }

  const idAreaMensagens = 'chat-area-mensagens'
  return (
    <g>
      <Fundo />
      <Cornija />
      <LinhaDecorativa de={[0, 780]} para={[40, 830]} cor={cor.ouro} opLinha="0.25" opLosango="0.5" />
      <Coluna x={19} capY={150} fuste={34} altura={600} opacidade="0.38" idFuste="chat-coluna" />
      <Respingo cx={470} cy={640} u={1.2} cor={cor.vermelho} opacidade="0.22" />
      <Cabecalho onInicio={onInicio} />
      <line x1="0" y1="104" x2="1440" y2="104" stroke={cor.ouro} strokeWidth="1" opacity="0.2" />

      <Luminaria cx={265} y={128} fundo={560} meiaBase={169} idCone="chat-cone" />
      <Frame x={110} y={160} w={310} h={400} fw={17} moldura={obra.moldura} pintura={obra.pintura} passepartout={10} />
      <Plaquinha x={231} y={572} texto={obra.numero} />

      <rect x="110" y="600" width="310" height="120" rx="2" fill="#EDE3CC" opacity="1" />
      <rect x="116" y="606" width="298" height="108" rx="1" fill="none" stroke="#8F7A4A" strokeWidth="1" opacity="0.6" />
      <text x="134" y="634" fontFamily={fonte.titulo} fontSize="21" fontWeight="700" fontStyle="normal" fill="#1A1410">
        {obra.titulo}
      </text>
      <text x="134" y="657" fontFamily={fonte.texto} fontSize="17" fontWeight="500" fontStyle="italic" fill="#4A3F30">
        {`${obra.artista}, ${obra.ano}`}
      </text>
      <text x="134" y="683" fontFamily={fonte.rotulo} fontSize="12" fontWeight="400" fontStyle="normal" fill="#6B5D48" letterSpacing="1">
        {obra.tecnica}
      </text>
      <text x="134" y="703" fontFamily={fonte.rotulo} fontSize="12" fontWeight="400" fontStyle="normal" fill="#6B5D48" letterSpacing="1">
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

      <clipPath id={idAreaMensagens}>
        <rect x={JANELA.x} y={JANELA.y} width={JANELA.w} height={JANELA.base - JANELA.y} />
      </clipPath>
      <g clipPath={`url(#${idAreaMensagens})`}>
        <rect x={JANELA.x} y={JANELA.y} width={JANELA.w} height={JANELA.base - JANELA.y} fill="transparent" onWheel={rolar} />
        <g transform={`translate(0 ${-rolagem})`} onWheel={rolar}>
          {layout.itens.map((item) =>
            item.tipo === 'digitando' ? (
              <Digitando key="digitando" y={item.y} />
            ) : (
              <Mensagem key={item.m.id} item={item} />
            ),
          )}
        </g>
      </g>

      {SUGESTOES.map((texto, i) => (
        <Chip key={texto} {...CHIPS[i]} texto={texto} onClick={enviar} />
      ))}

      <line x1="540" y1="762" x2="1380" y2="762" stroke={cor.ouro} strokeWidth="1" opacity="0.25" />
      {rascunho === '' && (
        <text
          x="560"
          y="806"
          fontFamily={fonte.texto}
          fontSize="22"
          fontWeight="500"
          fontStyle="italic"
          fill={cor.texto}
          opacity="0.8"
          pointerEvents="none"
        >
          pergunte algo sobre este quadro…
        </text>
      )}
      <foreignObject x="560" y="776" width="752" height="46">
        <input
          className="chat-input"
          type="text"
          value={rascunho}
          maxLength={280}
          autoComplete="off"
          aria-label="Pergunte algo sobre este quadro"
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar(rascunho)}
        />
      </foreignObject>
      <Pincelada x={560} y={814} sx={2.433} sy={0.225} cor={cor.ouro} opacidade="0.45" />
      <g
        className="hit"
        role="button"
        tabIndex={0}
        aria-label="Enviar pergunta"
        onClick={() => enviar(rascunho)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), enviar(rascunho))}
      >
        <circle cx="1340" cy="800" r="25" fill={cor.ouro} opacity="1" />
        <path
          d="M1329 800 H1351 M1343 791 L1352 800 L1343 809"
          stroke="#0B0907"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle className="focus-ring" cx="1340" cy="800" r="30" fill="none" opacity="0" />
      </g>

      <Greca y={898} opacidade="0.28" />
      <Vinheta />
    </g>
  )
}
