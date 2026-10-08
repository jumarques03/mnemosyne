// Geometria das mensagens do chat (espaço 1440 × 900), seguindo a tela 03 do design.

export const LINHA = 28 // entrelinha do texto das bolhas
export const PAD_X = 22 // respiro lateral dentro da bolha
export const TOPO = 132 // y da primeira bolha
export const GAP = 46 // da base de uma bolha até o topo da próxima
export const GAP_DIGITANDO = 48 // idem, quando a próxima é o indicador "digitando"
export const ALTURA_DIGITANDO = 34

// Coluna de mensagens: curadoria à esquerda (avatar em x=570), visitante à direita (avatar em x=1352).
export const CURADORIA = { avatarX: 570, bolhaX: 608, larguraMin: 600, larguraMax: 620 }
export const VISITANTE = { avatarX: 1352, bordaDireita: 1322, larguraMax: 460 }

/** Janela visível da conversa (acima das sugestões). */
export const JANELA = { x: 540, y: 112, w: 860, base: 684 }

function quebrarPalavra(palavra, max, medir) {
  const partes = []
  let atual = ''
  for (const letra of palavra) {
    if (atual && medir(atual + letra) > max) {
      partes.push(atual)
      atual = letra
    } else {
      atual += letra
    }
  }
  partes.push(atual)
  return partes
}

/** Quebra o texto em linhas de no máximo `max` px. "\n" força uma nova linha. */
export function quebrarLinhas(texto, max, medir) {
  const linhas = []
  for (const paragrafo of texto.split('\n')) {
    let atual = ''
    for (const palavra of paragrafo.split(' ')) {
      for (const parte of medir(palavra) > max ? quebrarPalavra(palavra, max, medir) : [palavra]) {
        const tentativa = atual ? `${atual} ${parte}` : parte
        if (!atual || medir(tentativa) <= max) {
          atual = tentativa
        } else {
          linhas.push(atual)
          atual = parte
        }
      }
    }
    linhas.push(atual)
  }
  return linhas
}

/**
 * Posiciona as mensagens (e o indicador "digitando") uma abaixo da outra.
 * Cada mensagem pode fixar `largura` (px); sem isso a bolha se ajusta ao texto.
 */
export function montarLayout(mensagens, digitando, medir) {
  const itens = []
  let y = TOPO
  mensagens.forEach((m, i) => {
    const doVisitante = m.de === 'visitante'
    const maxTexto = (doVisitante ? VISITANTE.larguraMax : CURADORIA.larguraMax) - PAD_X * 2
    const linhas = quebrarLinhas(m.texto, maxTexto, medir)
    const maisLarga = Math.max(...linhas.map((l) => medir(l)))
    const natural = Math.ceil(maisLarga) + PAD_X * 2
    const w = m.largura ?? (doVisitante ? natural : Math.max(CURADORIA.larguraMin, natural))
    const h = linhas.length * LINHA + LINHA
    const x = doVisitante ? VISITANTE.bordaDireita - w : CURADORIA.bolhaX
    itens.push({ tipo: 'mensagem', m, x, y, w, h, linhas })
    y += h + (i === mensagens.length - 1 && digitando ? GAP_DIGITANDO : GAP)
  })
  if (digitando) {
    itens.push({ tipo: 'digitando', y, h: ALTURA_DIGITANDO })
    y += ALTURA_DIGITANDO
  }
  const ultimo = itens.at(-1)
  const fim = ultimo ? ultimo.y + ultimo.h + (ultimo.tipo === 'mensagem' ? 22 : 0) : TOPO
  return { itens, fim }
}
