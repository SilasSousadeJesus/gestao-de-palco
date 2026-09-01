# `confirmacao-sweetalert2` - plan

## Objetivo

Substituir o `window.confirm()` nativo por um dialogo SweetAlert2 reutilizavel nas confirmacoes de exclusao (evento e bloco), preparando o padrao para outros componentes que venham a ter exclusao no futuro.

## Escopo

- Adicionar a dependencia `sweetalert2`.
- Criar `src/lib/confirm-dialog.ts` com `confirmDelete({ title, text, confirmButtonText })`, retornando `Promise<boolean>`, estilizado com as cores do app (confirmar em terracota, cancelar em azul-marinho).
- Trocar os dois `window.confirm(...)` de exclusao em `management-client.tsx` (excluir evento, excluir bloco) pelo novo helper.
- O `confirm()` da mensagem permanente com timer ativo nao e uma exclusao; permanece nativo por enquanto.

## Fora de escopo

- Nenhuma mudanca de schema, migration ou dado.
- Nenhuma mudanca em outros fluxos de confirmacao alem de exclusao.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual em navegador: excluir bloco (cancelar e confirmar), excluir evento (confirmar), conferindo texto, cores e comportamento do dialogo.

## Riscos

- Baixo: nova dependencia de UI, sem impacto em dados ou dominio. CSS do SweetAlert2 e importado uma vez no helper.
