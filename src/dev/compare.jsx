// Ferramenta de desenvolvimento (não entra no build): compara o SVG original do
// design com a tela em React. Abra /compare.html?tela=inicial&modo=diff
//   modo=diff  → mix-blend-mode: difference (preto = idêntico); ganho=N clareia as diferenças
//   modo=orig  → só o SVG original
//   modo=mine  → só a tela em React
//   modo=num   → rasteriza os dois e lista as regiões que diferem (limiar=N, padrão 24)
import { createRoot } from 'react-dom/client'
import '../index.css'
import { carregarFontes } from '../fonts.js'
import { LARGURA, ALTURA } from '../theme.js'
import { obras, turmas } from '../data/obras.js'
import TelaInicial from '../screens/TelaInicial.jsx'
import { mensagensDeExemplo } from '../screens/chat/exemplo.js'
import inicialSvg from '../../design/01-tela-inicial.svg?raw'
import selecaoSvg from '../../design/02-tela-selecao-quadro.svg?raw'
import chatSvg from '../../design/03-tela-chat.svg?raw'
import fimSvg from '../../design/04-tela-encerramento.svg?raw'

const telas = import.meta.glob('../screens/*.jsx', { eager: true })

function resolver(nome) {
  if (nome === 'inicial') {
    return { svg: inicialSvg, tela: () => <TelaInicial onEntrar={() => {}} /> }
  }
  if (nome === 'selecao' && telas['../screens/TelaSelecao.jsx']) {
    const T = telas['../screens/TelaSelecao.jsx'].default
    return { svg: selecaoSvg, tela: () => <T turmas={turmas} turma={0} onTurma={() => {}} ativa={2} onEscolher={() => {}} onAtiva={() => {}} onInicio={() => {}} /> }
  }
  if (nome === 'chat' && telas['../screens/TelaChat.jsx']) {
    const T = telas['../screens/TelaChat.jsx'].default
    return {
      svg: chatSvg,
      tela: () => (
        <T
          obra={obras[0]}
          mensagens={mensagensDeExemplo}
          digitando
          onEnviar={() => {}}
          onTrocar={() => {}}
          onConcluir={() => {}}
          onInicio={() => {}}
        />
      ),
    }
  }
  if (nome === 'fim' && telas['../screens/TelaEncerramento.jsx']) {
    const T = telas['../screens/TelaEncerramento.jsx'].default
    return { svg: fimSvg, tela: () => <T obra={obras[0]} onOutro={() => {}} onInicio={() => {}} /> }
  }
  return null
}

const params = new URLSearchParams(location.search)
const nome = params.get('tela') ?? 'inicial'
const modo = params.get('modo') ?? 'diff'
const ganho = Number(params.get('ganho') ?? 6)
const limiar = Number(params.get('limiar') ?? 24)
const escala = Number(params.get('escala') ?? Math.min(window.innerWidth / LARGURA, window.innerHeight / ALTURA))
const item = resolver(nome)

function Mine() {
  const Tela = item.tela
  return (
    <svg id="mine" width={LARGURA} height={ALTURA} fill="none" viewBox={`0 0 ${LARGURA} ${ALTURA}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <Tela />
    </svg>
  )
}

function Compare() {
  const camada = { position: 'absolute', left: 0, top: 0, width: LARGURA, height: ALTURA }
  return (
    <div style={{ width: LARGURA * escala, height: ALTURA * escala, overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LARGURA,
          height: ALTURA,
          transformOrigin: '0 0',
          transform: `scale(${escala})`,
          filter: modo === 'diff' ? `brightness(${ganho})` : undefined,
          isolation: 'isolate',
          background: '#000',
        }}
      >
        {modo !== 'mine' && <div style={camada} dangerouslySetInnerHTML={{ __html: item.svg }} />}
        {modo !== 'orig' && (
          <div style={{ ...camada, mixBlendMode: modo === 'diff' ? 'difference' : 'normal' }}>
            <Mine />
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- modo numérico ----------

async function cssDeFontes() {
  const regras = []
  for (const folha of document.styleSheets) {
    for (const regra of folha.cssRules) {
      if (regra instanceof CSSFontFaceRule) regras.push({ regra, base: folha.href })
    }
  }
  const partes = await Promise.all(
    regras.map(async ({ regra, base }) => {
      let css = regra.cssText
      const urls = [...css.matchAll(/url\("?([^")]+)"?\)/g)].map((m) => m[1])
      for (const u of urls) {
        const buf = await (await fetch(new URL(u, base ?? location.href))).arrayBuffer()
        let bin = ''
        new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)))
        css = css.replace(u, `data:font/woff2;base64,${btoa(bin)}`)
      }
      return css
    }),
  )
  return partes.join('\n')
}

async function rasterizar(svgTexto, css) {
  const comEstilo = svgTexto.replace(/<svg([^>]*)>/, `<svg$1><style>${css}</style>`)
  const url = URL.createObjectURL(new Blob([comEstilo], { type: 'image/svg+xml;charset=utf-8' }))
  const img = new Image()
  await new Promise((ok, erro) => {
    img.onload = ok
    img.onerror = erro
    img.src = url
  })
  const canvas = document.createElement('canvas')
  canvas.width = LARGURA
  canvas.height = ALTURA
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, LARGURA, ALTURA)
  return ctx.getImageData(0, 0, LARGURA, ALTURA).data
}

async function relatorioNumerico() {
  const css = await cssDeFontes()
  const minha = new XMLSerializer().serializeToString(document.getElementById('mine')).replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '')
  const [a, b] = await Promise.all([rasterizar(item.svg, css), rasterizar(minha, css)])
  const celula = 40
  const colunas = Math.ceil(LARGURA / celula)
  const celulas = new Map()
  let total = 0
  let soma = 0
  let brilho = 0
  for (let i = 0; i < a.length; i += 4) {
    brilho += a[i] + a[i + 1] + a[i + 2]
    const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]))
    soma += d
    if (d > limiar) {
      total++
      const p = i / 4
      const x = p % LARGURA
      const y = (p / LARGURA) | 0
      const k = Math.floor(y / celula) * colunas + Math.floor(x / celula)
      const c = celulas.get(k) ?? { n: 0, x0: x, x1: x, y0: y, y1: y }
      c.n++
      c.x0 = Math.min(c.x0, x)
      c.x1 = Math.max(c.x1, x)
      c.y0 = Math.min(c.y0, y)
      c.y1 = Math.max(c.y1, y)
      celulas.set(k, c)
    }
  }
  const top = [...celulas.values()].sort((p, q) => q.n - p.n).slice(0, 25)
  const linhas = [
    `tela=${nome} limiar=${limiar}`,
    `pixels acima do limiar: ${total} de ${LARGURA * ALTURA} (${((total / (LARGURA * ALTURA)) * 100).toFixed(4)}%)`,
    `diferença média por pixel: ${(soma / (LARGURA * ALTURA)).toFixed(4)}`,
    `brilho médio do original (sanidade, deve ser > 0): ${(brilho / (LARGURA * ALTURA * 3)).toFixed(2)}`,
    ...top.map((c) => `  ${c.n} px  x ${c.x0}–${c.x1}  y ${c.y0}–${c.y1}`),
  ]
  return linhas.join('\n')
}

carregarFontes().then(() => {
  createRoot(document.getElementById('root')).render(<Compare />)
  if (modo === 'num') {
    setTimeout(async () => {
      const pre = document.createElement('pre')
      pre.style.cssText = 'position:fixed;left:8px;top:8px;margin:0;padding:8px;background:#fff;color:#000;font:12px monospace;z-index:9'
      pre.id = 'relatorio'
      try {
        pre.textContent = await relatorioNumerico()
      } catch (e) {
        pre.textContent = `erro: ${e?.message ?? e}`
      }
      document.body.append(pre)
    }, 400)
  }
})
