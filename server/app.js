import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { atenderChat, LIMITE_PADRAO, saude } from './atender.js'
import { criarLimitador } from './limite.js'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

/**
 * Monta o app Express.
 * - `prompts`: Map id → prompt (ver prompts.js)
 * - `cliente`: SDK da OpenAI, ou null quando não há chave configurada
 * - `modelo`: nome do modelo do GPT
 */
export function criarApp({ prompts, cliente, modelo, limite = LIMITE_PADRAO }) {
  const app = express()
  app.disable('x-powered-by')
  // Atrás de um proxy (Render, etc.) o IP verdadeiro do visitante vem no cabeçalho X-Forwarded-For.
  app.set('trust proxy', 1)
  const permitir = criarLimitador(limite)
  app.use(express.json({ limit: '64kb' }))

  app.get('/api/saude', (_req, res) => {
    res.json(saude({ prompts, modelo, cliente }))
  })

  app.post('/api/chat', async (req, res) => {
    const { status, corpo } = await atenderChat({ corpo: req.body, ip: req.ip, prompts, cliente, modelo, permitir })
    res.status(status).json(corpo)
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
