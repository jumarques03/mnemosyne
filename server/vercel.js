import OpenAI from 'openai'
import { atenderChat, LIMITE_PADRAO, saude } from './atender.js'
import { criarLimitador } from './limite.js'
import { carregarPrompts } from './prompts.js'

// Em funções serverless o Node pode "esquentar" a mesma instância várias vezes: o que não
// depende do pedido (prompts, cliente da OpenAI, limitador) é criado uma vez, no módulo.
let padrao
function dependenciasPadrao() {
  padrao ??= {
    prompts: carregarPrompts(),
    cliente: process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null,
    modelo: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    permitir: criarLimitador(LIMITE_PADRAO),
  }
  return padrao
}

/** IP do visitante: a Vercel (e outros proxies) informam o endereço original em x-forwarded-for. */
function ipDoPedido(req) {
  const encaminhado = req.headers?.['x-forwarded-for']
  const primeiro = (Array.isArray(encaminhado) ? encaminhado[0] : encaminhado)?.split(',')[0]?.trim()
  return primeiro || req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'desconhecido'
}

const responder = (res, status, corpo) => {
  res.setHeader('Cache-Control', 'no-store')
  res.status(status).json(corpo)
}

/** Função da Vercel para POST /api/chat. `dependencias` só é passado nos testes. */
export function criarHandlerChat(dependencias) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return responder(res, 405, { erro: 'Use POST.' })
    }
    let deps
    try {
      deps = dependencias ?? dependenciasPadrao()
    } catch (erro) {
      console.error('[chat] falha ao iniciar:', erro?.message ?? erro)
      return responder(res, 500, { erro: 'Erro interno.' })
    }
    // Na Vercel o JSON já chega interpretado em req.body; se vier texto, tentamos interpretar.
    let corpo = req.body
    if (typeof corpo === 'string') {
      try {
        corpo = JSON.parse(corpo)
      } catch {
        return responder(res, 400, { erro: 'Corpo da requisição inválido.' })
      }
    }
    const { status, corpo: resposta } = await atenderChat({ ...deps, corpo, ip: ipDoPedido(req) })
    return responder(res, status, resposta)
  }
}

/** Função da Vercel para GET /api/saude. */
export function criarHandlerSaude(dependencias) {
  return function handler(_req, res) {
    return responder(res, 200, saude(dependencias ?? dependenciasPadrao()))
  }
}
