import { useEffect, useRef, useState } from 'react'
import { cor, fonte } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import { Fundo, LuzJanela, Cornija, Cabecalho, Greca, Vinheta } from '../../components/scene/Ambiente.jsx'
import { Pincelada } from '../../components/scene/Ornamentos.jsx'
import Cartao from '../selecao/Cartao.jsx'
import { CARTAO } from '../selecao/medidas.js'
import Paginador from '../selecao/Paginador.jsx'
import SeletorTurma from '../selecao/SeletorTurma.jsx'

const limitar = (v, min, max) => Math.min(max, Math.max(min, v))
const DISTANCIA_DO_ARRASTO = 40

/**
 * 02 · Seleção no layout vertical: seletor de turma no alto e um cartão por vez, com setas,
 * pontos, teclado (← →) e arrasto lateral para passar de obra dentro da turma.
 */
export default function TelaSelecaoRetrato({ turmas, turma, onTurma, onEscolher, onInicio, onVoltar }) {
  const { H, coluna } = useLayout()
  const { obras, nome } = turmas[turma]
  const x0 = coluna.x
  const cx = x0 + coluna.w / 2

  const [pagina, setPagina] = useState(0)
  const [sentido, setSentido] = useState(1)
  const arrasto = useRef({ x: null, moveu: false })

  const ir = (alvo) => {
    const proxima = (alvo + obras.length) % obras.length
    setSentido(alvo > pagina ? 1 : -1)
    setPagina(proxima)
  }

  useEffect(() => {
    const teclas = (e) => {
      if (e.key === 'ArrowLeft') ir(pagina - 1)
      if (e.key === 'ArrowRight') ir(pagina + 1)
    }
    window.addEventListener('keydown', teclas)
    return () => window.removeEventListener('keydown', teclas)
  })

  // O cartão cresce com a altura e a largura da tela (entre 0,5× e 1,5×) e fica um pouco acima do centro.
  // Em telas baixas (celular com barras do navegador) o cabeçalho sobe para sobrar espaço ao cartão.
  const subida = H < 700 ? 18 : 0
  const topoMin = 236 - subida
  const reservaRodape = 92 // paginador + legenda + greca
  const porAltura = (H - topoMin - reservaRodape - 12) / CARTAO.h
  const porLargura = (coluna.w - 40) / CARTAO.w
  const escala = limitar(Math.min(porAltura, porLargura), 0.5, 1.5)
  const sobra = Math.max(0, H - topoMin - reservaRodape - 12 - CARTAO.h * escala)
  const topo = topoMin + sobra * 0.35
  const base = topo + CARTAO.h * escala
  const obra = obras[pagina]

  const soltar = (e) => {
    const a = arrasto.current
    if (a.x === null) return
    const dx = e.clientX - a.x
    a.x = null
    if (Math.abs(dx) > DISTANCIA_DO_ARRASTO) {
      a.moveu = true
      ir(pagina + (dx < 0 ? 1 : -1))
    }
  }

  return (
    <g>
      <Fundo />
      <LuzJanela xs={[x0 + 130, x0 + 320]} y={40} w={60} h={520} opacidade="0.06" />
      <Cornija />
      <Cabecalho onInicio={onInicio} onVoltar={onVoltar} />

      <text
        x={cx + 0.75}
        y={126 - subida}
        textAnchor="middle"
        fontFamily={fonte.titulo}
        fontSize={Math.min(30, Math.round(coluna.w * 0.072))}
        fontWeight="700"
        fontStyle="normal"
        fill={cor.creme}
        letterSpacing="1.5"
      >
        ESCOLHA UM QUADRO
      </text>
      <Pincelada x={cx - 105} y={132 - subida} sx={0.7} sy={0.16} cor={cor.ouro} opacidade="0.55" />
      <text
        x={cx}
        y={168 - subida}
        textAnchor="middle"
        fontFamily={fonte.texto}
        fontSize={Math.max(14, Math.min(20, Math.round(coluna.w * 0.046)))}
        fontWeight="500"
        fontStyle="italic"
        fill={cor.texto}
      >
        selecione a obra sobre a qual você quer conversar
      </text>

      <SeletorTurma cx={cx} cy={206 - subida} turmas={turmas} atual={turma} onIr={onTurma} larguraMax={coluna.w - 24} compacto />

      <g
        onPointerDown={(e) => (arrasto.current = { x: e.clientX, moveu: false })}
        onPointerUp={soltar}
        onPointerCancel={() => (arrasto.current.x = null)}
        onClickCapture={(e) => {
          // Um arrasto não conta como clique no cartão.
          if (arrasto.current.moveu) {
            e.stopPropagation()
            arrasto.current.moveu = false
          }
        }}
      >
        <g transform={`translate(${cx - (CARTAO.w / 2) * escala} ${topo - CARTAO.y * escala}) scale(${escala})`}>
          <g key={pagina} className={sentido > 0 ? 'entra-da-direita' : 'entra-da-esquerda'}>
            <Cartao obra={obra} x={0} id={`v${pagina}`} ativo onAtiva={() => {}} onEscolher={onEscolher} />
          </g>
        </g>
      </g>

      <Paginador
        cx={cx}
        cy={base + 36}
        total={obras.length}
        atual={pagina}
        onAnterior={() => ir(pagina - 1)}
        onProximo={() => ir(pagina + 1)}
        onIr={ir}
      />
      <text
        x={cx + 2}
        y={base + 76}
        textAnchor="middle"
        fontFamily={fonte.rotulo}
        fontSize="11"
        fontWeight="500"
        fontStyle="normal"
        fill={cor.texto}
        letterSpacing="4"
        opacity="0.65"
      >
        {`ACERVO · ${nome.toUpperCase()} · ${obras.length} OBRAS`}
      </text>
      <Greca y={894} opacidade="0.3" />
      <Vinheta />
    </g>
  )
}
