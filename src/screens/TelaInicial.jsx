import { cor, fonte } from '../theme.js'
import Frame from '../components/art/Frame.jsx'
import Cavalete from '../components/art/Cavalete.jsx'
import { Fundo, LuzJanela, Vinheta } from '../components/scene/Ambiente.jsx'
import { LinhaDecorativa, Respingo, Pincelada, Plaquinha } from '../components/scene/Ornamentos.jsx'
import { Piso, PisoTabuas, FaixaAzulejo } from '../components/scene/Piso.jsx'
import { Busto } from '../components/scene/Esculturas.jsx'
import Cortina from '../components/scene/Cortina.jsx'
import Botao from '../components/scene/Botao.jsx'

const FOCOS = [
  'M157.0 0 L173.0 0 L295.2 400 L34.80000000000001 400 Z',
  'M217.0 0 L233.0 0 L342.8 580 L107.2 580 Z',
  'M1237.0 0 L1253.0 0 L1362.8 370 L1127.2 370 Z',
  'M1207.0 0 L1223.0 0 L1370.0 580 L1060.0 580 Z',
]

function Texto({ x, y, fonte: familia, tamanho, peso = '500', cor: fill, espaco, opacidade, children }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={familia}
      fontSize={tamanho}
      fontWeight={peso}
      fontStyle="normal"
      fill={fill}
      letterSpacing={espaco}
      opacity={opacidade}
    >
      {children}
    </text>
  )
}

/** 01 · Tela inicial — "Mnemosyne · Arte em conversa". */
export default function TelaInicial({ onEntrar }) {
  return (
    <g>
      <Fundo />
      <LuzJanela xs={[300, 450, 600]} y={90} w={80} h={560} opacidade="0.08" />
      <defs>
        <linearGradient id="foco-luz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8CF8A" stopOpacity="0.16" />
          <stop offset="1" stopColor="#E8CF8A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {FOCOS.map((d) => (
        <path key={d} d={d} fill="url(#foco-luz)" />
      ))}
      <LinhaDecorativa de={[0, 650]} para={[170, 610]} cor={cor.ouro} opLinha="0.3" opLosango="0.55" />
      <LinhaDecorativa de={[1440, 620]} para={[1290, 700]} cor={cor.vermelho} opLinha="0.4" opLosango="0.65" />
      <Respingo cx={320} cy={500} u={1.6} cor={cor.azul} opacidade="0.35" />
      <Respingo cx={1075} cy={340} u={1.4} cor={cor.vermelho} opacidade="0.4" />

      <Frame x={60} y={110} w={210} h={280} fw={15} moldura="dourada" pintura="entardecer" />
      <Frame x={130} y={400} w={190} h={170} fw={13} moldura="madeira" pintura="marinha" />
      <Frame x={1150} y={110} w={190} h={250} fw={13} moldura="branca" pintura="geometrica" passepartout={10} />
      <Frame x={1090} y={400} w={250} h={170} fw={15} moldura="dourada" pintura="sertao" />
      <Plaquinha x={191} y={584} texto="Nº 02" textoX={209.45} />
      <Plaquinha x={1181} y={580} texto="Nº 04" textoX={1199.32} />

      <defs>
        <radialGradient id="inicio-penumbra" cx="720" cy="420" r="430" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0.62" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="330" y="130" width="780" height="560" rx="0" fill="url(#inicio-penumbra)" opacity="1" />

      <Piso />
      <PisoTabuas />
      <FaixaAzulejo />
      <Busto x={405} y={808} escala={0.9} idMarmore="inicio-busto-1" idBase="inicio-base-1" />
      <Busto x={1030} y={808} escala={0.9} idMarmore="inicio-busto-2" idBase="inicio-base-2" />
      <Cavalete x={1235} y={850} escala={0.78} pintura="naturezaMorta" />
      <Cavalete x={195} y={850} escala={0.78} pintura="geometrica" />

      <Texto x="380" y="160" fonte={fonte.rotulo} tamanho="11" cor={cor.ouro} espaco="3" opacidade="0.5">
        ACERVO Nº 014
      </Texto>
      <Texto x="1010" y="190" fonte={fonte.rotulo} tamanho="11" cor={cor.vermelho} espaco="3" opacidade="0.7">
        SALA 02
      </Texto>
      <Texto x="1010" y="214" fonte={fonte.rotulo} tamanho="11" cor={cor.ouro} espaco="3" opacidade="0.35">
        1920 — 1980
      </Texto>
      <Texto x="583.92" y="240" fonte={fonte.rotulo} tamanho="13" cor={cor.ouro} espaco="7">
        — GALERIA VIRTUAL —
      </Texto>
      <Texto x="474.69" y="342" fonte={fonte.titulo} tamanho="96" peso="700" cor={cor.creme} espaco="1">
        Mnemosyne
      </Texto>
      <Pincelada x={530} y={360} sx={1.267} sy={0.325} cor={cor.vermelho} opacidade="0.9" />
      <Texto x="560.35" y="410" fonte={fonte.rotulo} tamanho="22" peso="400" cor={cor.texto} espaco="7">
        ARTE EM CONVERSA
      </Texto>
      <Texto x="472.88" y="495" fonte={fonte.rotulo} tamanho="14" cor={cor.creme} espaco="5">
        COR
      </Texto>
      <Texto x="608.34" y="495" fonte={fonte.rotulo} tamanho="14" cor={cor.creme} espaco="5">
        FORMA
      </Texto>
      <Texto x="775.52" y="495" fonte={fonte.rotulo} tamanho="14" cor={cor.creme} espaco="5">
        LUZ
      </Texto>
      <Texto x="895.16" y="495" fonte={fonte.rotulo} tamanho="14" cor={cor.creme} espaco="5">
        MEMÓRIA
      </Texto>
      <path d="M570 487 l4 4 l-4 4 l-4 -4Z" fill={cor.ouro} opacity=".7" />
      <path d="M720 487 l4 4 l-4 4 l-4 -4Z" fill={cor.ouro} opacity=".7" />
      <path d="M870 487 l4 4 l-4 4 l-4 -4Z" fill={cor.ouro} opacity=".7" />

      <Botao
        x={580}
        y={560}
        w={280}
        h={58}
        variante="ouro"
        texto="ENTRAR NA GALERIA"
        textoX={611.72}
        textoY={594}
        tamanho={15}
        onClick={onEntrar}
      />
      <Vinheta />
      <Cortina />
    </g>
  )
}
