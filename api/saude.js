// Função da Vercel: GET /api/saude (quantos quadros foram carregados e se há chave da OpenAI).
import { criarHandlerSaude } from '../server/vercel.js'

export default criarHandlerSaude()
