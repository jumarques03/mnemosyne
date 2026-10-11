import OpenAI from 'openai'
import { criarApp } from './app.js'
import { carregarPrompts } from './prompts.js'

const PORTA = Number(process.env.PORT) || 3001
const MODELO = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const prompts = carregarPrompts()
const cliente = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

criarApp({ prompts, cliente, modelo: MODELO }).listen(PORTA, () => {
  console.log(`Mnemosyne · API em http://localhost:${PORTA} — ${prompts.size} quadros, modelo ${MODELO}`)
  if (!cliente) console.warn('Aviso: OPENAI_API_KEY não definida. Copie .env.example para .env e preencha a chave.')
})
