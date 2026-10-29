import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cor, fonte } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'

/** Sugestão de pergunta (pílula). Geometria em unidades do layout em uso. */
export function Chip({ x, y = 696, w, h = 34, tx, texto, tamanho = 13, onClick }) {
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(texto)
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label={texto} onClick={ativar} onKeyDown={ativar}>
      <rect className="hit-fill" x={x} y={y} width={w} height={h} rx={h / 2} fill={cor.ouro} opacity="0" />
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="none" stroke={cor.ouro} strokeWidth="1" opacity="0.55" />
      <text
        x={tx}
        y={y + 22 + (h - 34) / 2}
        fontFamily={fonte.rotulo}
        fontSize={tamanho}
        fontWeight="400"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="0.5"
      >
        {texto}
      </text>
      <rect className="focus-ring" x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={h / 2 + 4} fill="none" opacity="0" />
    </g>
  )
}

// Menor corpo de fonte real (px) do campo: abaixo de 16px o Safari do iPhone dá zoom ao focar.
const FONTE_MINIMA_PX = 16

/**
 * Campo de texto da pergunta. O texto-guia é desenhado no palco; o <input> de verdade é HTML
 * (não foreignObject, que se comporta de jeitos diferentes entre navegadores) posicionado em
 * cima de um retângulo-marcador do SVG e redimensionado junto com ele.
 * `baseline` = y da linha de base do texto; `tamanho` = corpo da fonte nas unidades do palco.
 */
export function CampoPergunta({ x, baseline, w, tamanho = 22, valor, onMudar, onEnviar }) {
  const altura = Math.round(tamanho * 2.09)
  // a linha de base do <input> cai a ~0.652 da altura da fonte dentro da caixa
  const topo = baseline - altura * 0.652
  const { viewBox, alturaVisivel } = useLayout()
  const larguraJanela = window.innerWidth
  const marcador = useRef(null)
  const [caixa, setCaixa] = useState(null)

  // Lê onde o marcador está na tela. Repete a leitura sempre que o palco (o <svg>) muda de tamanho,
  // por qualquer motivo: rotação, barra de endereço, teclado virtual, redimensionar a janela…
  useLayoutEffect(() => {
    const medir = () => {
      const r = marcador.current?.getBoundingClientRect()
      if (!r) return
      const nova = { left: r.left, top: r.top, width: r.width, height: r.height }
      setCaixa((atual) =>
        atual && ['left', 'top', 'width', 'height'].every((k) => Math.abs(atual[k] - nova[k]) < 0.25) ? atual : nova,
      )
    }
    medir()
    const svg = marcador.current?.ownerSVGElement
    if (!svg || typeof ResizeObserver === 'undefined') return undefined
    const observador = new ResizeObserver(medir)
    observador.observe(svg)
    return () => observador.disconnect()
  }, [viewBox, alturaVisivel, larguraJanela, x, topo, w, altura])

  const escala = caixa ? caixa.width / w : 1
  return (
    <>
      <rect ref={marcador} x={x} y={topo} width={w} height={altura} fill="none" pointerEvents="none" />
      {valor === '' && (
        <text
          x={x}
          y={baseline}
          fontFamily={fonte.texto}
          fontSize={tamanho}
          fontWeight="500"
          fontStyle="italic"
          fill={cor.texto}
          opacity="0.8"
          pointerEvents="none"
        >
          pergunte algo sobre este quadro…
        </text>
      )}
      {caixa &&
        createPortal(
          <input
            className="chat-input"
            style={{
              left: caixa.left,
              top: caixa.top,
              width: caixa.width,
              height: caixa.height,
              fontSize: Math.max(FONTE_MINIMA_PX, tamanho * escala),
              lineHeight: `${caixa.height}px`,
            }}
            type="text"
            value={valor}
            maxLength={280}
            enterKeyHint="send"
            autoComplete="off"
            aria-label="Pergunte algo sobre este quadro"
            onChange={(e) => onMudar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onEnviar(valor)}
          />,
          document.body,
        )}
    </>
  )
}

/** Botão redondo de enviar (seta). `r` = raio. */
export function BotaoEnviar({ cx, cy, r = 25, onEnviar }) {
  const k = r / 25
  const ativar = (e) => {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEnviar()
    }
  }
  return (
    <g className="hit" role="button" tabIndex={0} aria-label="Enviar pergunta" onClick={ativar} onKeyDown={ativar}>
      <circle cx={cx} cy={cy} r={r} fill={cor.ouro} opacity="1" />
      <path
        d="M-11 0 H11 M3 -9 L12 0 L3 9"
        transform={`translate(${cx} ${cy}) scale(${k})`}
        stroke="#0B0907"
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="focus-ring" cx={cx} cy={cy} r={r + 5} fill="none" opacity="0" />
    </g>
  )
}
