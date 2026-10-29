// Geometria das mensagens do chat. As medidas das bolhas partem das da tela 03 do design e foram
// ampliadas para leitura (fonte 24, entrelinha 32, respiro 22…); o que muda entre os layouts é só a área onde elas se distribuem.

export const FONTE_BOLHA = '500 24px "Cormorant Garamond"'
export const LINHA = 32 // entrelinha do texto das bolhas
export const PAD_X = 22 // respiro lateral dentro da bolha
export const ALTURA_DIGITANDO = 34

/** Layout do design (1440 × 900): curadoria à esquerda (avatar em x=570), visitante à direita (x=1352). */
export const CFG_PAISAGEM = {
  quebrasManuais: true, // respeita quebras de linha (\n) nos textos: a saudação do design quebra depois de "diante de"
  topo: 132, // y da primeira bolha
  gap: 46, // da base de uma bolha até o topo da próxima
  gapDigitando: 48, // idem, quando a próxima é o indicador "digitando"
  curadoria: { avatarX: 570, bolhaX: 608, larguraMin: 600, larguraMax: 680 },
  visitante: { avatarX: 1352, bordaDireita: 1322, larguraMax: 500 },
  janela: { x: 540, y: 112, w: 860, base: 684 },
}

/**
 * Layout vertical: as mensagens ficam num bloco de `largura` × `altura` (unidades locais, já
 * com a escala do bloco aplicada de fora), com avatares junto às bordas.
 */
export function cfgRetrato(largura, altura) {
  return {
    quebrasManuais: false, // numa coluna estreita o texto corre livre
    topo: 20,
    gap: 46,
    gapDigitando: 48,
    curadoria: { avatarX: 16, bolhaX: 54, larguraMin: 0, larguraMax: largura - 54 },
    visitante: { avatarX: largura - 16, bordaDireita: largura - 54, larguraMax: largura - 100 },
    janela: { x: 0, y: 0, w: largura, base: altura },
  }
}

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
export function montarLayout(mensagens, digitando, medir, cfg = CFG_PAISAGEM) {
  const itens = []
  let y = cfg.topo
  mensagens.forEach((m, i) => {
    const doVisitante = m.de === 'visitante'
    const lado = doVisitante ? cfg.visitante : cfg.curadoria
    const maxTexto = lado.larguraMax - PAD_X * 2
    const texto = cfg.quebrasManuais ? m.texto : m.texto.split('\n').join(' ')
    const linhas = quebrarLinhas(texto, maxTexto, medir)
    const maisLarga = Math.max(...linhas.map((l) => medir(l)))
    const natural = Math.ceil(maisLarga) + PAD_X * 2
    const w = m.largura ?? (doVisitante ? natural : Math.max(lado.larguraMin, natural))
    const h = linhas.length * LINHA + LINHA
    const x = doVisitante ? lado.bordaDireita - w : lado.bolhaX
    itens.push({ tipo: 'mensagem', m, x, y, w, h, linhas })
    y += h + (i === mensagens.length - 1 && digitando ? cfg.gapDigitando : cfg.gap)
  })
  if (digitando) {
    itens.push({ tipo: 'digitando', y, h: ALTURA_DIGITANDO })
    y += ALTURA_DIGITANDO
  }
  const ultimo = itens[itens.length - 1]
  const fim = ultimo ? ultimo.y + ultimo.h + (ultimo.tipo === 'mensagem' ? 22 : 0) : cfg.topo
  return { itens, fim }
}
