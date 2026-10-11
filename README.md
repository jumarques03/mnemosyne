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

## Layout responsivo

O palco SVG acompanha a proporção da janela (`src/layout/`), sem faixas pretas:

| Janela | Modo | O que acontece |
| --- | --- | --- |
| mais larga que alta (≥ 0,95) | **paisagem** | O desenho de 1440 × 900 fica no centro e o viewBox cresce no eixo que sobrar. Cenário (fundo, cornija, cortina, piso, azulejos, greca, vinheta) vai até as bordas; colunas, quadros, bustos e cavaletes se prendem à lateral/rodapé mais próximo (`<Ancora>`); o conteúdo principal fica centralizado. Em 1440 × 900 nada se move. |
| mais alta que larga (< 0,95) | **retrato** | Composição vertical própria em uma coluna de 480 (palco de até 640 em tablets): início com título e acervo empilhados; seleção com um cartão por vez (setas, pontos, ← →, arrasto lateral); chat com obra e botões no alto, conversa no meio e sugestões/campo embaixo; encerramento com botões empilhados. |

O tamanho vem de `useLayoutDaJanela()` (resize e rotação) e é entregue às telas por contexto (`useLayout()`).
Cada tela escolhe entre o desenho largo e o vertical (`src/screens/retrato/`).

## Como ficou fiel ao design

Cada tela é desenhada em SVG no sistema de coordenadas do design (1440 × 900). Geometria, cores, degradês,
fontes e textos vêm dos SVGs; o que se repete virou componente (moldura, pintura, coluna, busto, cornija, greca,
respingo, luminária…).

Fontes (instaladas localmente com `@fontsource`): Playfair Display, Jost e Cormorant Garamond.

### Conferir contra os SVGs originais

Com o servidor rodando, abra `compare.html` (ferramenta de desenvolvimento, fora do build):

| URL | O que mostra |
| --- | --- |
| `/compare.html?tela=inicial&modo=num` | rasteriza o SVG original e a tela em React e lista as regiões que diferem |
| `/compare.html?tela=chat&modo=diff&ganho=8` | sobreposição em `difference` (preto = idêntico) |
| `/compare.html?tela=fim&modo=orig` / `modo=mine` | só o original / só o React |

`tela` = `inicial` · `selecao` · `chat` · `fim`.

A comparação vale para o layout de paisagem em 1440 × 900. Resultado atual: inicial, chat e encerramento com **0 pixels de diferença**; seleção com ~0,08 % (apenas sub-pixel
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
