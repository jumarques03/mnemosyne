// "Curadoria virtual". Hoje responde com textos locais a partir dos dados da obra;
// para ligar a um backend/LLM basta trocar o corpo de `perguntar`, mantendo a assinatura.

export const SUGESTOES = ['Quem foi o artista?', 'Qual é a técnica?', 'Contexto histórico', 'Cores e simbolismo']

const normalizar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

// A quebra depois de "diante de" repete a diagramação da tela de chat do design.
export function saudacao(obra) {
  return `Olá! Eu sou a curadoria virtual. Você está diante de\n“${obra.titulo}”. Pergunte o que quiser sobre ela.`
}

function responder(obra, pergunta) {
  const p = normalizar(pergunta)
  if (/(quem|artista|autor|pintou)/.test(p)) {
    return `“${obra.titulo}” é de ${obra.artista}, ${obra.ano}. Quer saber mais sobre a técnica ou sobre o contexto histórico?`
  }
  if (/(tecnica|material|tinta|feito|medida|tamanho)/.test(p)) {
    return `A obra é registrada no acervo como ${obra.tecnica.replace(' · ', ', ')}. Posso falar também sobre as cores ou sobre o estilo.`
  }
  if (/(context|histor|epoca|periodo|movimento)/.test(p)) {
    return `${obra.acervo.replace(' · ', ', ')}. O contexto histórico detalhado de “${obra.titulo}” ainda será cadastrado pelo museu. Enquanto isso, posso descrever a cena ou as cores.`
  }
  if (/(cor|cores|simbol|tom|paleta|laranja|azul|vermelh|amarel|verde)/.test(p)) {
    return `${obra.cores} Quer saber mais sobre o estilo?`
  }
  if (/(mostr|cena|represent|retrat|quer|descrev|ve |ver )/.test(p)) {
    return `${obra.descricao} Quer saber mais sobre as cores ou sobre o estilo?`
  }
  return `${obra.descricao} Posso contar mais sobre o artista, a técnica, o contexto histórico ou as cores.`
}

/** Devolve a resposta da curadoria (com um pequeno atraso para o indicador de digitação). */
export function perguntar(obra, pergunta) {
  const atraso = 900 + Math.random() * 500
  return new Promise((resolve) => setTimeout(() => resolve(responder(obra, pergunta)), atraso))
}
