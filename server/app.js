import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { responder, validarPedido } from './chat.js'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

/** Limite simples por IP (janela deslizante em memória) — suficiente para uma exposição escolar. */
function limitador({ max, janelaMs }) {
  const acessos = new Map()
  return (req, res, next) => {
    const agora = Date.now()
    const recentes = (acessos.get(req.ip) ?? []).filter((t) => agora - t < janelaMs)
    if (recentes.length >= max) {
      res.status(429).json({ erro: 'Muitas perguntas em pouco tempo. Aguarde um instante e tente de novo.' })
      return
    }
    recentes.push(agora)
    acessos.set(req.ip, recentes)
    if (acessos.size > 5000) for (const [ip, ts] of acessos) if (agora - ts.at(-1) > janelaMs) acessos.delete(ip)
    next()
  }
}

/**
 * Monta o app Express.
 * - `prompts`: Map id → prompt (ver prompts.js)
 * - `cliente`: SDK da OpenAI, ou null quando não há chave configurada
 * - `modelo`: nome do modelo do GPT
 */
export function criarApp({ prompts, cliente, modelo, limite = { max: 20, janelaMs: 60_000 } }) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '64kb' }))

  app.get('/api/saude', (_req, res) => {
    res.json({ ok: true, obras: prompts.size, modelo, chaveConfigurada: Boolean(cliente) })
  })

  app.post('/api/chat', limitador(limite), async (req, res) => {
    const pedido = validarPedido(req.body, prompts)
    if (pedido.erro) {
      res.status(400).json({ erro: pedido.erro })
      return
    }
    if (!cliente) {
      res.status(503).json({ erro: 'O chat ainda não foi configurado no servidor (falta a OPENAI_API_KEY).' })
      return
    }
    try {
      const texto = await responder({ cliente, modelo, prompt: prompts.get(pedido.obraId), historico: pedido.historico })
      res.json({ resposta: texto })
    } catch (erro) {
      console.error(`[chat] ${pedido.obraId}:`, erro?.status ?? '', erro?.message ?? erro)
      const status = erro?.status === 429 ? 429 : 502
      res.status(status).json({
        erro:
          status === 429
            ? 'O serviço de IA está ocupado. Tente novamente em instantes.'
            : 'Não consegui obter a resposta agora. Tente novamente.',
      })
    }
  })

  app.use('/api', (_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))

  // Em produção o mesmo servidor entrega o frontend gerado por `npm run build`.
  if (existsSync(DIST)) {
    app.use(express.static(DIST))
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(`${DIST}/index.html`))
  }

  app.use((erro, _req, res, _next) => {
    const invalido = erro?.type === 'entity.parse.failed' || erro?.type === 'entity.too.large'
    res.status(invalido ? 400 : 500).json({ erro: invalido ? 'Corpo da requisição inválido.' : 'Erro interno.' })
  })

  return app
}
