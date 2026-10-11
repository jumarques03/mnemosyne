import { useId, useMemo, useRef, useState } from 'react'
import { medirTexto } from '../../utils/medirTexto.js'
import { FONTE_BOLHA, montarLayout } from './layout.js'
import { Mensagem, Digitando } from './Mensagens.jsx'

const medirBolha = (texto) => medirTexto(texto, FONTE_BOLHA)
const limitar = (v, min, max) => Math.min(max, Math.max(min, v))
const ESMAECER = 18 // faixa (nas bordas da janela) em que as mensagens somem ao rolar

/**
 * Lista de mensagens com rolagem (roda do mouse ou arrasto). Acompanha o fim da conversa:
 * ao chegar mensagem nova, desce até ela. Desenhada nas unidades locais de `cfg`.
 */
export default function AreaConversa({ mensagens, digitando, cfg }) {
  const id = `conversa-${useId().replace(/:/g, '')}`
  const [ajuste, setAjuste] = useState({ fim: 0, subiu: 0 })
  const arrasto = useRef(null)

  const layout = useMemo(() => montarLayout(mensagens, digitando, medirBolha, cfg), [mensagens, digitando, cfg])
  const { x, y, w, base } = cfg.janela
  const maxRolagem = Math.max(0, layout.fim + ESMAECER - base) // deixa o último horário fora da faixa esmaecida

  // O que o visitante "sobe" vale só até chegar algo novo.
  const subiu = ajuste.fim === layout.fim ? ajuste.subiu : 0
  const rolagem = Math.max(0, maxRolagem - subiu)
  const definir = (valor) => setAjuste({ fim: layout.fim, subiu: limitar(valor, 0, maxRolagem) })

  const iniciarArrasto = (e) => {
    arrasto.current = { y: e.clientY, subiu, unidade: e.currentTarget.getScreenCTM().a }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const arrastar = (e) => {
    const a = arrasto.current
    if (a) definir(a.subiu + (e.clientY - a.y) / a.unidade)
  }

  return (
    <>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset={ESMAECER / (base - y)} stopColor="#fff" stopOpacity="1" />
          <stop offset={1 - ESMAECER / (base - y)} stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={base - y}>
          <rect x={x} y={y} width={w} height={base - y} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <g
          style={{ touchAction: 'none' }}
          onWheel={(e) => definir(subiu - e.deltaY)}
          onPointerDown={iniciarArrasto}
          onPointerMove={arrastar}
          onPointerUp={() => (arrasto.current = null)}
          onPointerCancel={() => (arrasto.current = null)}
        >
          <rect x={x} y={y} width={w} height={base - y} fill="transparent" />
          <g transform={`translate(0 ${-rolagem})`}>
            {layout.itens.map((item) =>
              item.tipo === 'digitando' ? (
                <Digitando key="digitando" y={item.y} cfg={cfg} />
              ) : (
                <Mensagem key={item.m.id} item={item} cfg={cfg} />
              ),
            )}
          </g>
        </g>
      </g>
    </>
  )
}
