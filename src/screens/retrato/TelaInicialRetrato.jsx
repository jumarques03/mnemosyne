import { cor, fonte } from '../../theme.js'
import { useLayout } from '../../layout/contexto.js'
import Ancora from '../../layout/Ancora.jsx'
import { medirTexto, xCentrado } from '../../utils/medirTexto.js'
import Frame from '../../components/art/Frame.jsx'
import { Fundo, Vinheta } from '../../components/scene/Ambiente.jsx'
import { Pincelada } from '../../components/scene/Ornamentos.jsx'
import { Piso, PisoTabuas, FaixaAzulejo } from '../../components/scene/Piso.jsx'
import { Busto } from '../../components/scene/Esculturas.jsx'
import Cortina from '../../components/scene/Cortina.jsx'
import Botao from '../../components/scene/Botao.jsx'

const limitar = (v, min, max) => Math.min(max, Math.max(min, v))
const PALAVRAS = ['COR', 'FORMA', 'LUZ', 'MEMÓRIA']

/** 01 · Tela inicial no layout vertical: o mesmo cenário, com o título no centro e o acervo ao redor. */
export default function TelaInicialRetrato({ onEntrar }) {
  const { H, coluna } = useLayout()
  const x0 = coluna.x
  const cx = x0 + coluna.w / 2

  // Espaço livre entre a cortina e o barrado de azulejos.
  const chao = H - 148
  const livre = chao - 124
  const alturaBloco = 262
  const alturaQuadro = limitar(livre - alturaBloco - 36 - 40, 0, 170)
  const comQuadros = alturaQuadro >= 110
  const total = alturaBloco + (comQuadros ? 36 + alturaQuadro : 0)
  const t = 124 + Math.max(24, (livre - total) / 2) // linha de base do rótulo "GALERIA VIRTUAL"

  const fontePalavra = `500 15px "${fonte.rotulo}"`
  const larguras = PALAVRAS.map((p) => medirTexto(p, fontePalavra, 4))
  const folga = 36
  const totalPalavras = larguras.reduce((a, b) => a + b, 0) + folga * (PALAVRAS.length - 1)
  const palavras = PALAVRAS.map((p, i) => {
    const x = cx - totalPalavras / 2 + larguras.slice(0, i).reduce((soma, l) => soma + l + folga, 0)
    return { p, x, losango: x + larguras[i] + folga / 2 - 2 }
  })

  const fw = Math.max(8, Math.round(alturaQuadro * 0.075))
  const largQuadro = Math.round(alturaQuadro * 0.78)
  const yQuadros = t + alturaBloco + 36

  return (
    <g>
      <Fundo />
      <defs>
        <radialGradient id="inicio-penumbra-v" cx={cx} cy={t + 110} r="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0.62" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={cx - 270} y={t + 110 - 270} width="540" height="540" fill="url(#inicio-penumbra-v)" />

      {comQuadros && (
        <>
          <Frame x={cx - largQuadro - 14} y={yQuadros} w={largQuadro} h={alturaQuadro} fw={fw} moldura="dourada" pintura="entardecer" />
          <Frame
            x={cx + 14}
            y={yQuadros}
            w={largQuadro}
            h={alturaQuadro}
            fw={fw}
            moldura="branca"
            pintura="geometrica"
            passepartout={Math.round(fw * 0.7)}
          />
        </>
      )}

      <Piso />
      <PisoTabuas />
      <FaixaAzulejo />
      <Ancora y="base">
        <Busto x={x0 + 44} y={808} escala={0.62} idMarmore="inicio-v-busto-1" idBase="inicio-v-base-1" />
        <Busto x={x0 + coluna.w - 44} y={808} escala={0.62} idMarmore="inicio-v-busto-2" idBase="inicio-v-base-2" />
      </Ancora>

      <text
        x={cx + 3}
        y={t}
        textAnchor="middle"
        fontFamily={fonte.rotulo}
        fontSize="15"
        fontWeight="500"
        fill={cor.ouro}
        letterSpacing="6"
      >
        — GALERIA VIRTUAL —
      </text>
      <text
        x={cx}
        y={t + 76}
        textAnchor="middle"
        fontFamily={fonte.titulo}
        fontSize="68"
        fontWeight="700"
        fill={cor.creme}
        letterSpacing="1"
      >
        Mnemosyne
      </text>
      <Pincelada x={cx - 134} y={t + 88} sx={0.89} sy={0.23} cor={cor.vermelho} opacidade="0.9" />
      <text
        x={cx + 3}
        y={t + 122}
        textAnchor="middle"
        fontFamily={fonte.rotulo}
        fontSize="16"
        fontWeight="400"
        fill={cor.texto}
        letterSpacing="6"
      >
        ARTE EM CONVERSA
      </text>
      {palavras.map(({ p, x, losango }, i) => (
        <g key={p}>
          <text x={x} y={t + 166} fontFamily={fonte.rotulo} fontSize="15" fontWeight="500" fill={cor.creme} letterSpacing="4">
            {p}
          </text>
          {i < palavras.length - 1 && (
            <path d={`M${losango} ${t + 158} l3 3 l-3 3 l-3 -3Z`} fill={cor.ouro} opacity=".7" />
          )}
        </g>
      ))}

      <Botao
        x={cx - 130}
        y={t + 200}
        w={260}
        h={54}
        variante="ouro"
        texto="ENTRAR NA GALERIA"
        textoX={xCentrado(cx - 130, 260, 'ENTRAR NA GALERIA', `500 17px "${fonte.rotulo}"`, 4)}
        textoY={t + 200 + 33}
        tamanho={17}
        onClick={onEntrar}
      />

      <Vinheta />
      <Cortina />
    </g>
  )
}
