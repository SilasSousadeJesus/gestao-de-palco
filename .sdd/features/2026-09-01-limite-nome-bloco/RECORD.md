# `limite-nome-bloco` - record

## O que mudou

- `src/app/management-client.tsx`: `BLOCK_TITLE_LIMIT = 40`. Reaproveitado o helper generico `makeLimitedChangeHandler` (ja usado para nome de evento e mensagem) para criar `onBlockTitleChange` (formulario de criar bloco) e `onEditingBlockTitleChange` (formulario de editar bloco), cada um com seu proprio estado de aviso (`blockTitleLimitHit`/`editingBlockTitleLimitHit`), resetado ao abrir/salvar/cancelar a edicao.
- `src/features/events/event-service.ts`: `BLOCK_TITLE_MAX_LENGTH = 40`; `createBlock` e `updateBlock` passaram a rejeitar (`Error`, capturado pela rota como `400`) nomes de bloco acima do limite — defesa em profundidade, mesmo padrao usado para o nome do evento.
- `src/app/globals.css`: `.block-title-warning { grid-column: 1 / -1; }` para o aviso ocupar a linha toda no formulario de criar bloco (que e `display:grid`); `.block-edit-form` ganhou `flex-wrap:wrap` para o aviso (reaproveitando `.event-edit-warning`) quebrar para a proxima linha no formulario de editar bloco (que e `display:flex`).

## Fora de escopo (nao alterado)

- Limite de caracteres em outros campos (ja existentes: nome do evento 20, mensagem 50).

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Teste via `curl`: nome de bloco com 41 caracteres retornou `400` ("Nome do bloco deve ter no maximo 40 caracteres."); com exatamente 40 caracteres foi aceito (`201`).
- Teste visual com Playwright: digitados mais de 40 caracteres no campo "Nome do bloco" (criar) e no campo de edicao de bloco — em ambos, o valor foi truncado em 40 caracteres e o aviso "Limite de 40 caracteres atingido." apareceu corretamente, sem quebrar o layout dos formularios.

## Documentos ativos consultados

- `.sdd/knowledge/design-system.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada sobre o limite de 40 caracteres no nome do bloco.
