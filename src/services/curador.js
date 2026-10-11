// Conversa com o quadro. As respostas vêm do servidor (server/), que usa o prompt da
// personagem do quadro e a API do GPT; a chave da OpenAI nunca chega ao navegador.

export const SUGESTOES = ['Quem é você?', 'O que houve aqui?', 'Como era sua época?', 'Seu maior desafio?']

const LIMITE_CARACTERES = 1000
const TEMPO_LIMITE_MS = 60_000

export const MENSAGEM_DE_ERRO = 'Desculpe, não consegui responder agora. Tente de novo em instantes.'

export function saudacao(obra) {
  return `Olá! Eu sou ${obra.personagem}. Você está diante de “${obra.titulo}”. Pergunte o que quiser.`
}

/**
 * Pergunta ao quadro. `conversa` é a lista de mensagens da tela (`{ de, texto }`), já
 * com a pergunta do visitante no final. Devolve o texto da resposta; em caso de falha
 * lança um Error cuja mensagem já pode ser mostrada ao visitante.
 */
export async function perguntar(obra, conversa) {
  const mensagens = conversa.map((m) => ({
    papel: m.de === 'visitante' ? 'user' : 'assistant',
    texto: m.texto.slice(0, LIMITE_CARACTERES),
  }))
  const resposta = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ obraId: obra.id, mensagens }),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  }).catch(() => {
    throw new Error(MENSAGEM_DE_ERRO) // servidor fora do ar, sem rede ou tempo esgotado
  })
  const corpo = await resposta.json().catch(() => ({}))
  if (!resposta.ok) throw new Error(corpo.erro || MENSAGEM_DE_ERRO)
  return corpo.resposta
}
