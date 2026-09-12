# `limite-nome-bloco` - plan

## Objetivo

Limitar o nome do bloco (timer) a 40 caracteres, no mesmo padrao ja usado para nome de evento (20) e mensagem (50): truncar ao digitar/colar, mostrar aviso, e validar no backend tambem.

## Escopo

- `src/app/management-client.tsx`: `BLOCK_TITLE_LIMIT = 40`; novos estados `blockTitleLimitHit`/`editingBlockTitleLimitHit`; `onBlockTitleChange`/`onEditingBlockTitleChange` via `makeLimitedChangeHandler` ja existente; aviso "Limite de 40 caracteres atingido." nos dois formularios (criar e editar bloco).
- `src/features/events/event-service.ts`: `BLOCK_TITLE_MAX_LENGTH = 40`; `createBlock`/`updateBlock` rejeitam nomes acima do limite.
- `src/app/globals.css`: `.block-title-warning` (span todas as colunas do `.block-form`, que e grid) e `.block-edit-form` ganha `flex-wrap:wrap` para o aviso quebrar linha (reaproveita `.event-edit-warning` para o flex-basis).

## Fora de escopo

- Limite de caracteres em qualquer outro campo (ja cobertos: evento 20, mensagem 50).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Teste via `curl`: nome de bloco com 41 caracteres rejeitado (400), com 40 aceito.
- Teste visual: digitar mais de 40 caracteres no formulario de criar bloco e no de editar bloco, conferir truncamento e aviso nos dois.
