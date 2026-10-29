/**
 * Limite simples por IP (janela deslizante em memória) — suficiente para uma exposição escolar.
 * Devolve `permitir(ip)`: true se o IP ainda pode perguntar (e já conta esta pergunta).
 *
 * Em funções serverless (Vercel) cada instância tem a sua própria memória, então o limite vale
 * por instância: ajuda contra abuso simples, mas o teto de gasto da OpenAI é a proteção de fato.
 */
export function criarLimitador({ max, janelaMs }) {
  const acessos = new Map()
  return function permitir(ip) {
    const agora = Date.now()
    const recentes = (acessos.get(ip) ?? []).filter((t) => agora - t < janelaMs)
    if (recentes.length >= max) return false
    recentes.push(agora)
    acessos.set(ip, recentes)
    if (acessos.size > 5000) {
      for (const [outro, tempos] of acessos) if (agora - tempos[tempos.length - 1] > janelaMs) acessos.delete(outro)
    }
    return true
  }
}
