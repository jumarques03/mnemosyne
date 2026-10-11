import { useCallback, useRef, useState } from 'react'
import Stage from './components/Stage.jsx'
import { useLayoutDaJanela } from './layout/contexto.js'
import TelaInicial from './screens/TelaInicial.jsx'
import TelaSelecao from './screens/TelaSelecao.jsx'
import TelaChat from './screens/TelaChat.jsx'
import TelaEncerramento from './screens/TelaEncerramento.jsx'
import { obras } from './data/obras.js'
import { perguntar, saudacao } from './services/curador.js'

const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

// No design a terceira obra aparece iluminada na seleção.
const OBRA_ILUMINADA_INICIAL = 2

export default function App() {
  const layout = useLayoutDaJanela()
  const [tela, setTela] = useState('inicial') // inicial → selecao → chat → fim
  const [obra, setObra] = useState(obras[0])
  const [ativa, setAtiva] = useState(OBRA_ILUMINADA_INICIAL)
  const [mensagens, setMensagens] = useState([])
  const [aguardando, setAguardando] = useState(0)

  const proximoId = useRef(1)
  const sessao = useRef(0) // invalida respostas que chegam depois de sair do chat

  const adicionar = useCallback((de, texto) => {
    setMensagens((atual) => [...atual, { id: proximoId.current++, de, texto, hora: agora() }])
  }, [])

  const irParaInicio = () => setTela('inicial')
  const irParaSelecao = () => {
    sessao.current++
    setAguardando(0)
    setTela('selecao')
  }

  const escolher = (escolhida) => {
    sessao.current++
    setObra(escolhida)
    setAtiva(obras.findIndex((o) => o.id === escolhida.id))
    setAguardando(0)
    setMensagens([{ id: proximoId.current++, de: 'curadoria', texto: saudacao(escolhida), hora: agora() }])
    setTela('chat')
  }

  const enviar = (pergunta) => {
    const minhaSessao = sessao.current
    adicionar('visitante', pergunta)
    setAguardando((n) => n + 1)
    perguntar(obra, pergunta).then((resposta) => {
      if (minhaSessao !== sessao.current) return
      adicionar('curadoria', resposta)
      setAguardando((n) => n - 1)
    })
  }

  // A seta do cabeçalho volta uma etapa; do encerramento, retoma a conversa de onde parou.
  const voltarParaChat = () => setTela('chat')

  const concluir = () => {
    sessao.current++
    setAguardando(0)
    setTela('fim')
  }

  return (
    <Stage titulo="Mnemosyne · Arte em conversa" layout={layout}>
      <g key={tela} className="screen">
        {tela === 'inicial' && <TelaInicial onEntrar={irParaSelecao} />}
        {tela === 'selecao' && (
          <TelaSelecao obras={obras} ativa={ativa} onAtiva={setAtiva} onEscolher={escolher} onInicio={irParaInicio} onVoltar={irParaInicio} />
        )}
        {tela === 'chat' && (
          <TelaChat
            obra={obra}
            mensagens={mensagens}
            digitando={aguardando > 0}
            onEnviar={enviar}
            onTrocar={irParaSelecao}
            onConcluir={concluir}
            onInicio={irParaInicio}
            onVoltar={irParaSelecao}
          />
        )}
        {tela === 'fim' && <TelaEncerramento obra={obra} onOutro={irParaSelecao} onInicio={irParaInicio} onVoltar={voltarParaChat} />}
      </g>
    </Stage>
  )
}
