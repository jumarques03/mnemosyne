// Função da Vercel: POST /api/chat. Toda a lógica está em server/ (a mesma do servidor local).
import { criarHandlerChat } from '../server/vercel.js'

export default criarHandlerChat()
