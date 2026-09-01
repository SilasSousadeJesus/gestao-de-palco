# `preview-terceiro-card` - plan

## Objetivo

Tres ajustes sobre o layout ja entregue:

1. Trocar as posicoes de Preview e Relatorio de Blocos: Preview volta a ser o terceiro card da linha de cima (largura fixa 606.55px); Relatorio de Blocos passa para a linha de baixo, em largura total, crescendo livremente (sem altura fixa nem rolagem, como o Preview fazia antes).
2. Aumentar a altura dos 3 cards do topo (Eventos, Evento Aberto, Preview) de 416.8px para 600px, porque a lista de blocos dentro de "Evento Aberto" ficava espremida demais.
3. Renomear a coluna "Atraso" da tabela de relatorio para "Atraso / Adiantado".

## Escopo

- `src/app/management-client.tsx`: ordem do JSX trocada (preview-panel antes de report-panel); cabecalho da tabela alterado para "Atraso / Adiantado".
- `src/app/globals.css`:
  - `.management-grid`: terceira coluna passa de `minmax(20rem, 1.35fr)` para `606.55px` fixo; segunda coluna simplificada para `minmax(20rem, 1fr)` (unica fr restante, absorve o espaco livre).
  - Altura fixa (600px) movida de `.report-panel` para `.preview-panel`; `.event-panel`/`.console-panel` tambem passam para 600px.
  - `.report-panel` perde a altura fixa e o `overflow:hidden`, ganha `grid-column: 1 / -1` (linha de baixo, largura total); `.report-table-wrap` deixa de ser area de rolagem vertical (agora so `overflow-x:auto` como salvaguarda).
  - `.preview-panel` ganha `height:600px; overflow:hidden;` e perde `grid-column: 1 / -1`.

## Fora de escopo

- Ajustar o espaco vazio que sobra embaixo da caixa 16:9 do preview quando ela e mais baixa que os 600px do card (consequencia esperada de manter a largura fixa em 606.55px).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: medir posicao/largura/altura dos 4 elementos do grid via `getBoundingClientRect()` (Preview deve estar na linha de cima com ~607px de largura e 600px de altura; Relatorio deve estar na linha de baixo, largura total, altura variavel); conferir que a lista de blocos mostra varias linhas antes de precisar rolar; conferir o texto do cabecalho da tabela.
