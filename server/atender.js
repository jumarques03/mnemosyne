import { responder, validarPedido } from './chat.js'

export const LIMITE_PADRAO = { max: 20, janelaMs: 60_000 }

/**
 * Atende um POST /api/chat, sem depender de Express: o servidor local e a função da Vercel
 * chamam esta mesma função e só traduzem o resultado `{ status, corpo }` para a sua resposta HTTP.
 *
 * - `corpo`: JSON recebido; `ip`: endereço do visitante (para o limite de perguntas)
 * - `prompts`: Map id → prompt; `cliente`: SDK da OpenAI (ou null sem chave); `modelo`: modelo do GPT
 * - `permitir(ip)`: limitador (ver limite.js); opcional
 */
export async function atenderChat({ corpo, ip, prompts, cliente, modelo, permitir }) {
  if (permitir && !permitir(ip)) {
    return { status: 429, corpo: { erro: 'Muitas perguntas em pouco tempo. Aguarde um instante e tente de novo.' } }
  }
  const pedido = validarPedido(corpo, prompts)
  if (pedido.erro) return { status: 400, corpo: { erro: pedido.erro } }
  if (!cliente) {
    return { status: 503, corpo: { erro: 'O chat ainda não foi configurado no servidor (falta a OPENAI_API_KEY).' } }
  }
  try {
    const texto = await responder({ cliente, modelo, prompt: prompts.get(pedido.obraId), historico: pedido.historico })
    return { status: 200, corpo: { resposta: texto } }
  } catch (erro) {
    console.error(`[chat] ${pedido.obraId}:`, erro?.status ?? '', erro?.message ?? erro)
    const ocupado = erro?.status === 429
    return {
      status: ocupado ? 429 : 502,
      corpo: {
        erro: ocupado
          ? 'O serviço de IA está ocupado. Tente novamente em instantes.'
          : 'Não consegui obter a resposta agora. Tente novamente.',
      },
    }
  }
}

/** Corpo de GET /api/saude. */
export const saude = ({ prompts, modelo, cliente }) => ({
  ok: true,
  obras: prompts.size,
  modelo,
  chaveConfigurada: Boolean(cliente),
})
