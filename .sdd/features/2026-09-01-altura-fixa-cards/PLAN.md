# `altura-fixa-cards` - plan

## Objetivo

Impedir que os cards "Eventos", "Evento Aberto" e "Relatorio de Blocos" cresçam conforme conteudo e adicionado (evento novo, bloco novo, linha nova na tabela). Travar a altura em 416.8px e usar rolagem interna onde o conteudo excede esse espaco. No card "Evento Aberto", colocar os 3 botoes de mensagem (temporaria/permanente/limpar) na mesma linha, com rotulos mais curtos.

## Escopo

- `src/app/globals.css`:
  - `.event-panel, .console-panel, .report-panel` ganham `height:416.8px; display:flex; flex-direction:column; overflow:hidden;` (nao inclui `.preview-panel`, que continua livre para crescer).
  - `.event-list` passa de `max-height:22rem` para `flex:1; min-height:0;` (mesmo `overflow-y:auto`), preenchendo o espaco restante do card e rolando internamente.
  - `.blocks` (lista de blocos dentro do card "Evento Aberto") ganha o mesmo tratamento `flex:1; min-height:0; overflow-y:auto;`, ja que e a parte desse card que cresce com o conteudo.
  - Novo `.report-table-wrap` com `flex:1; min-height:0; overflow-y:auto;`, envolvendo a tabela do relatorio.
  - Elementos fixos do card "Evento Aberto" (cabecalho, formulario de bloco, controles ao vivo, formulario de mensagem) marcados `flex-shrink:0` e com margens/paddings reduzidos para sobrar mais espaco para a lista de blocos.
- `src/app/management-client.tsx`: rotulos dos botoes de mensagem encurtados ("Temporaria", "Permanente", "Limpar", com `title` explicando cada um); tabela do relatorio envolvida por `<div className="report-table-wrap">`.

## Fora de escopo

- Mudar o valor 416.8px para outra altura.
- Adicionar paginacao (a solucao e rolagem, nao paginacao).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: altura dos 3 cards medida via `getBoundingClientRect()` antes e depois de adicionar 8 blocos/11 eventos — deve permanecer 416.8px (417px arredondado) em ambos os casos; conferir rolagem interna funcionando nas 3 areas; conferir que os 3 botoes de mensagem ficam na mesma linha.
