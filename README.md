# Mnemosyne · Arte em conversa

Frontend em **React + Vite** gerado a partir dos SVGs do design (`design/`). Quatro telas, fluxo completo:

```
01 Tela inicial → 02 Seleção de quadro → 03 Chat com a curadoria → 04 Encerramento
                        ↑___________________________________________|
```

## Rodar

```bash
npm install
cp .env.example .env        # e preencha OPENAI_API_KEY
npm run dev:server          # API do chat em http://localhost:3001
npm run dev                 # frontend em http://localhost:5173 (o Vite repassa /api para a API)
npm run build               # saída em dist/
npm run lint
npm run test:server         # testes do backend
```

Sem a chave o app abre normalmente, mas as perguntas no chat respondem que o servidor não está configurado.
Em produção, `npm run build` seguido de `npm run server` serve o frontend e a API na mesma porta.

## Turmas e quadros

A tela de seleção tem um seletor de turma (**Oitavo A**, **Oitavo B**, **Oitavo C**, setas ou ← → no layout largo)
e mostra os quadros da turma escolhida: 4, 5 e 6 quadros. Em turmas maiores, os cartões encolhem para caber.

| Turma | Quadros (grupo → obra exibida) |
| --- | --- |
| Oitavo A | La Nuit Étoilée → Retrato de Robespierre · Skrik → Retrato de Pizarro · Todo mundo em pânico → Independência ou Morte · Vanbros → Maria Antonieta e os Filhos |
| Oitavo B | As de Perol → A Morte de Marat · Conjuntivite → Hidalgo e o Estandarte · Future Art → Napoleão Cruzando os Alpes · Monalisos → Retrato de Olympe de Gouges · TECHNOSYNE → Retrato de Luís XVI |
| Oitavo C | Backdoor → Moctezuma e os Antepassados · MALP → Retrato de Leopoldina · NCAM → Retrato de Hernán Cortés · Neo Dream → A Família Imperial · Spook Shack → Aquarela de Túpac Amaru II · Traços com vida → Retrato de Simón Bolívar |

Cada quadro corresponde à personagem do prompt do grupo; a pintura exibida é a obra histórica mais conhecida dessa
personagem ou do episódio que o prompt descreve (dados e imagens em `src/data/obras.js` e `public/obras/`).

## Chat com GPT (backend)

`server/` é um servidor Express que guarda a chave da OpenAI e monta a conversa:

- `server/prompts/<TURMA>/<quadro>.txt`: o prompt de cada quadro. O id do quadro é `<turma>-<quadro>` (ex.: `8efb-as-de-perol`).
- `POST /api/chat` com `{ obraId, mensagens: [{ papel: 'user' | 'assistant', texto }] }` devolve `{ resposta }`.
  O servidor usa o prompt do quadro como mensagem de sistema, acrescenta as regras comuns de `server/chat.js`
  (respostas curtas, texto corrido, linguagem para 8º ano, sem sair da personagem) e envia as últimas 16 mensagens.
- Limites: 1000 caracteres por mensagem, 20 perguntas por minuto por IP; erros da OpenAI não chegam ao navegador.
- `GET /api/saude` mostra quantos quadros foram carregados e se há chave configurada.

Variáveis (arquivo `.env`, fora do git): `OPENAI_API_KEY`, `OPENAI_MODEL` (padrão `gpt-4o-mini`), `PORT` (padrão 3001).

Para trocar o prompt de um quadro, edite o `.txt` correspondente e reinicie o servidor.

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
| Turmas e quadros (título, artista, ano, imagem, personagem) | `src/data/obras.js` |
| Prompts dos quadros | `server/prompts/` |
| Chamada ao chat e saudação | `src/services/curador.js` (frontend) · `server/chat.js` (regras e GPT) |
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

## Créditos das imagens

Pinturas em domínio público, baixadas do Wikimedia Commons e reduzidas para ~1000 px de altura:
Robespierre (pintor desconhecido, c. 1790) · Pizarro (Amable-Paul Coutan, 1834–35) · *Independência ou Morte* (Pedro Américo, 1888) ·
*Maria Antonieta e seus filhos* (Vigée Le Brun, 1787) · *A Morte de Marat* (Jacques-Louis David, 1793) · *Miguel Hidalgo con estandarte* (Antonio Fabrés, 1905) ·
*Napoleão cruzando os Alpes* (David, versão de Malmaison) · Olympe de Gouges (autor desconhecido) · Luís XVI (Antoine-François Callet, versão do Kunsthistorisches Museum) ·
*Moctezuma II visitando as tumbas de seus antepassados* (Daniel del Valle, 1895) · Leopoldina (Joseph Kreutzinger, 1815) · Hernán Cortés (José Salomé Pina, c. 1879, Museu do Prado) ·
*A Família Imperial* (François-René Moreaux, 1857) · aquarela de Túpac Amaru II (autor desconhecido) · Simón Bolívar (José Gil de Castro, c. 1823).
