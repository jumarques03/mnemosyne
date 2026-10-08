# Mnemosyne · Arte em conversa

Frontend em **React + Vite** gerado a partir dos SVGs do design (`design/`). Quatro telas, fluxo completo:

```
01 Tela inicial → 02 Seleção de quadro → 03 Chat com a curadoria → 04 Encerramento
                        ↑___________________________________________|
```

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # saída em dist/
npm run lint
```

## Como ficou fiel ao design

Cada tela é desenhada em SVG num palco fixo de **1440 × 900** (`src/components/Stage.jsx`), que escala para
caber na janela mantendo a proporção. Geometria, cores, degradês, fontes e textos vêm dos SVGs; o que se repete
virou componente (moldura, pintura, coluna, busto, cornija, greca, respingo, luminária…).

Fontes (instaladas localmente com `@fontsource`): Playfair Display, Jost e Cormorant Garamond.

### Conferir contra os SVGs originais

Com o servidor rodando, abra `compare.html` (ferramenta de desenvolvimento, fora do build):

| URL | O que mostra |
| --- | --- |
| `/compare.html?tela=inicial&modo=num` | rasteriza o SVG original e a tela em React e lista as regiões que diferem |
| `/compare.html?tela=chat&modo=diff&ganho=8` | sobreposição em `difference` (preto = idêntico) |
| `/compare.html?tela=fim&modo=orig` / `modo=mine` | só o original / só o React |

`tela` = `inicial` · `selecao` · `chat` · `fim`.

Resultado atual: inicial, chat e encerramento com **0 pixels de diferença**; seleção com ~0,08 % (apenas sub-pixel
nos títulos "Título da obra 0N", cujo X no SVG foi calculado com uma largura estimada).

## Onde mexer

| O quê | Onde |
| --- | --- |
| Obras (título, artista, ano, técnica, pintura, moldura) | `src/data/obras.js` — hoje com os mesmos textos-modelo do design |
| Respostas da curadoria | `src/services/curador.js` (`perguntar` é o ponto para ligar um backend/LLM) |
| Fluxo e estado | `src/App.jsx` |
| Telas | `src/screens/` |
| Molduras e pinturas | `src/components/art/` |
| Cenário (sala, cornija, colunas, bustos…) | `src/components/scene/` |
| Layout das mensagens do chat | `src/screens/chat/layout.js` |
| Tokens do guia visual | `src/theme.js` |

## Interações

- **Início:** "Entrar na galeria".
- **Seleção:** passar o mouse (ou focar com Tab) ilumina o quadro; clicar/Enter abre o chat. O quadro Nº 03 começa
  iluminado, como no design.
- **Chat:** sugestões, campo de texto (Enter envia), indicador "digitando", rolagem automática e com a roda do mouse.
  "Trocar de quadro" volta à seleção; "Concluir conversa" vai ao encerramento.
- **Encerramento:** "Ver outro quadro" e "Voltar ao início". A marca MNEMOSYNE no cabeçalho também volta ao início.
- Tudo é acessível por teclado (Tab / Enter / Espaço).
