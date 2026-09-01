# `preview-terceiro-card` - record

## O que mudou

**01 — Preview volta a ser o terceiro card; Relatorio de Blocos vai para baixo**

- `src/app/management-client.tsx`: o `<section className="preview-panel">` foi movido para antes do `<aside className="report-panel">` no JSX (ordem no DOM define a posicao no grid).
- `src/app/globals.css`:
  - `.management-grid`: terceira coluna trocada de `minmax(20rem, 1.35fr)` para `606.55px` fixo (largura pedida pelo usuario); segunda coluna simplificada para `minmax(20rem, 1fr)`.
  - `.preview-panel` perdeu `grid-column: 1 / -1` (volta a ocupar so a terceira coluna) e ganhou `height:600px; overflow:hidden;`.
  - `.report-panel` ganhou `grid-column: 1 / -1` (linha de baixo, largura total) e perdeu a altura fixa/`overflow:hidden` que tinha — volta a crescer livremente com o conteudo, do mesmo jeito que o Preview crescia antes.
  - `.report-table-wrap` deixou de ser uma area de rolagem vertical (`flex:1; min-height:0; overflow-y:auto`) — agora e so `overflow-x:auto`, ja que a tabela nao esta mais confinada a uma altura fixa.

**02 — Altura dos 3 cards do topo aumentada para 600px**

- `.event-panel, .console-panel` passaram de `height:416.8px` para `height:600px` (mantendo `display:flex; flex-direction:column; overflow:hidden`).
- Nao foi pedido um valor especifico desta vez ("aumenta mais"); escolhido 600px por dar espaco confortavel para 4 blocos completos antes de precisar rolar (antes, com 416.8px, a area de blocos mal mostrava 1 linha).

**03 — Coluna "Atraso" renomeada**

- Cabecalho da tabela alterado de `<th>Atraso</th>` para `<th>Atraso / Adiantado</th>`. Como a tabela agora esta em largura total (nao mais espremida numa coluna estreita), o texto mais longo nao causa problema de espaco.

## Fora de escopo (nao alterado)

- O espaco vazio que sobra abaixo da caixa 16:9 do preview quando o evento esta ocioso (a caixa, a 606.55px de largura, fica com ~341px de altura por causa do aspect-ratio 16:9, menor que os 600px do card) — consequencia esperada de manter a largura fixa pedida; nao foi tratado.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual com Playwright (viewport 1500x1000), evento com 6 blocos:
  - Medido via `getBoundingClientRect()`: Eventos, Evento Aberto e Preview na mesma linha (top identico), todos com 600px de altura; Preview com 607px de largura (606.55 arredondado); Relatorio de Blocos numa linha abaixo, com 1404px de largura (largura total do grid) e altura variavel (303px, sem limite fixo).
  - Lista de blocos do card "Evento Aberto": com 6 blocos, mostrou 4 completos antes de precisar rolar (antes, com a altura anterior, mal mostrava 1).
  - Cabecalho da tabela confirmado como "ATRASO / ADIANTADO".
  - Nenhum erro de console.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota atualizada descrevendo a nova disposicao (Preview de volta ao topo, Relatorio embaixo, altura 600px, coluna renomeada).
