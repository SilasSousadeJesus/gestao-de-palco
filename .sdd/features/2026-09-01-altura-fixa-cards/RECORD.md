# `altura-fixa-cards` - record

## O que mudou

- `src/app/globals.css`:
  - `.event-panel, .console-panel, .report-panel` fixados em `height:416.8px`, `display:flex; flex-direction:column; overflow:hidden` (o `.preview-panel` foi mantido fora dessa regra, continua livre para crescer em largura total).
  - `.event-list`: trocado `max-height:22rem` por `flex:1; min-height:0`, preenchendo o espaco restante do card "Eventos" e rolando internamente quando ha mais eventos do que cabem.
  - `.blocks` (lista de blocos do card "Evento Aberto"): mesmo tratamento `flex:1; min-height:0; overflow-y:auto`.
  - Novo `.report-table-wrap { flex:1; min-height:0; overflow-y:auto; }`, envolvendo a tabela do relatorio de blocos.
  - Para sobrar mais espaco para a lista de blocos dentro do card "Evento Aberto" (que tem varios elementos fixos: cabecalho, formulario de bloco, controles ao vivo, formulario de mensagem), as margens/paddings desses elementos foram reduzidas (de `1rem` para `.6rem`/`.4rem` em varios pontos) e o padding interno de cada linha de bloco tambem foi reduzido (`.5rem .7rem`, mais compacto que a linha de evento). Sem esse ajuste, a area de blocos ficava com menos de 45px de altura (praticamente inutil); com o ajuste, ficou com ~73px, o suficiente para mostrar uma linha completa mais uma pista visual da proxima.
- `src/app/management-client.tsx`:
  - Botoes de mensagem encurtados: "Enviar temporaria (20s)" → "Temporaria", "Enviar permanente" → "Permanente", "Limpar mensagem" → "Limpar". Cada um ganhou um atributo `title` com a explicacao completa (tooltip nativo do navegador), para nao perder contexto.
  - A tabela do relatorio de blocos passou a ficar dentro de `<div className="report-table-wrap">`, permitindo rolar so a tabela (cabecalho da secao "RELATORIO DE BLOCOS" continua fixo, fora da area de rolagem).

## Fora de escopo (nao alterado)

- O valor 416.8px foi usado exatamente como pedido, sem arredondar para uma unidade "redonda".
- Nenhuma paginacao foi adicionada; a solucao e rolagem interna, como pedido.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright (viewport 1400x900):
  - Altura dos 3 cards medida em 417px (416.8 arredondado) tanto com 0 blocos/poucos eventos quanto apos adicionar 8 blocos e ter 11 eventos na lista — a altura nao mudou em nenhum dos dois casos.
  - Confirmado `hasScroll: true` em `.event-list` (11 eventos) e em `.blocks` (8 blocos); `.report-table-wrap` com 8 linhas ainda coube sem precisar rolar (369px de conteudo dentro de 369px disponiveis).
  - Confirmado que os 3 botoes de mensagem ficam na mesma linha (`allSameRow: true`), com os rotulos curtos.
  - Foi necessario um ciclo extra de ajuste: a primeira versao deixou a lista de blocos do card "Evento Aberto" com menos de 45px, praticamente inutilizavel (confirmado por screenshot, texto cortado). Corrigido reduzindo margens/paddings dos elementos fixos do card, elevando a area util para ~73px — screenshot final confirma uma linha de bloco completa e legivel.
  - Nenhum erro de console.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nova entrada resumindo a altura fixa dos cards e os botoes de mensagem encurtados.
