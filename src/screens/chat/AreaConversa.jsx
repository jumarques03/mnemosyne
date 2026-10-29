import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { medirTexto } from '../../utils/medirTexto.js'
import { FONTE_BOLHA, montarLayout } from './layout.js'
import { Mensagem, Digitando } from './Mensagens.jsx'

const medirBolha = (texto) => medirTexto(texto, FONTE_BOLHA)
const limitar = (v, min, max) => Math.min(max, Math.max(min, v))
const ESMAECER = 18 // faixa (nas bordas da janela) em que as mensagens somem ao rolar
const ATRITO = 0.94 // fração da velocidade que sobra a cada 16 ms depois de soltar o dedo
const VELOCIDADE_MINIMA = 0.015 // unidades por ms; abaixo disso a rolagem para
const JANELA_AMOSTRAS_MS = 100 // só o fim do gesto conta para a velocidade de soltura

/**
 * Lista de mensagens com rolagem (roda do mouse, arrasto com o dedo e inércia). Acompanha o fim da conversa:
 * ao chegar mensagem nova, desce até ela. Desenhada nas unidades locais de `cfg`.
 */
export default function AreaConversa({ mensagens, digitando, cfg }) {
  const id = `conversa-${useId().replace(/:/g, '')}`
  const [ajuste, setAjuste] = useState({ fim: 0, subiu: 0 })
  const arrasto = useRef(null)
  const inercia = useRef(0) // id do requestAnimationFrame da rolagem por inércia
  const vivo = useRef({ subiu: 0, max: 0 })

  const layout = useMemo(() => montarLayout(mensagens, digitando, medirBolha, cfg), [mensagens, digitando, cfg])
  const { x, y, w, base } = cfg.janela
  const maxRolagem = Math.max(0, layout.fim + ESMAECER - base) // deixa o último horário fora da faixa esmaecida

  // O que o visitante "sobe" vale só até chegar algo novo.
  const subiu = ajuste.fim === layout.fim ? ajuste.subiu : 0
  const rolagem = Math.max(0, maxRolagem - subiu)
  const definir = (valor) => setAjuste({ fim: layout.fim, subiu: limitar(valor, 0, maxRolagem) })
  useEffect(() => {
    vivo.current = { subiu, max: maxRolagem } // a inércia lê sempre o valor mais recente
  })

  const pararInercia = () => cancelAnimationFrame(inercia.current)
  useEffect(() => pararInercia, [])

  const iniciarArrasto = (e) => {
    pararInercia()
    arrasto.current = {
      y: e.clientY,
      subiu,
      unidade: e.currentTarget.getScreenCTM().a,
      amostras: [{ t: e.timeStamp, y: e.clientY }],
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const arrastar = (e) => {
    const a = arrasto.current
    if (!a) return
    definir(a.subiu + (e.clientY - a.y) / a.unidade)
    a.amostras.push({ t: e.timeStamp, y: e.clientY })
    while (a.amostras.length > 2 && e.timeStamp - a.amostras[0].t > JANELA_AMOSTRAS_MS) a.amostras.shift()
  }
  const soltar = (e) => {
    const a = arrasto.current
    arrasto.current = null
    if (!a || a.amostras.length < 2) return
    const primeira = a.amostras[0]
    const ultima = a.amostras[a.amostras.length - 1]
    const parado = e.timeStamp - ultima.t > JANELA_AMOSTRAS_MS // segurou o dedo antes de soltar
    let velocidade = parado ? 0 : (ultima.y - primeira.y) / Math.max(1, ultima.t - primeira.t) / a.unidade
    let posicao = vivo.current.subiu
    let anterior = performance.now()
    const passo = (agora) => {
      const dt = Math.min(48, agora - anterior)
      anterior = agora
      posicao = limitar(posicao + velocidade * dt, 0, vivo.current.max)
      velocidade *= Math.pow(ATRITO, dt / 16)
      definir(posicao)
      if (Math.abs(velocidade) > VELOCIDADE_MINIMA && posicao > 0 && posicao < vivo.current.max) {
        inercia.current = requestAnimationFrame(passo)
      }
    }
    if (Math.abs(velocidade) > VELOCIDADE_MINIMA) inercia.current = requestAnimationFrame(passo)
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
        {/* A máscara só esmaece o desenho; quem impede as mensagens que rolaram para fora da janela
            de receberem toque (e roubarem o clique dos botões em volta) é o recorte. */}
        <clipPath id={`${id}-recorte`}>
          <rect x={x} y={y} width={w} height={base - y} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-recorte)`}>
      <g mask={`url(#${id}-mask)`}>
        <g
          onWheel={(e) => {
            pararInercia()
            // deltaMode: 0 = pixels, 1 = linhas (Firefox), 2 = páginas — iguala o passo entre navegadores
            const passo = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? base - y : 1
            definir(subiu - e.deltaY * passo)
          }}
          onPointerDown={iniciarArrasto}
          onPointerMove={arrastar}
          onPointerUp={soltar}
          onPointerCancel={soltar}
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
      </g>
    </>
  )
}
