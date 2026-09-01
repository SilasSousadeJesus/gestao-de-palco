# `corrige-bloqueios-rodada-5` - plan

## Objetivo

Corrigir os tres bloqueios tecnicos registrados em `docs/PROJECT-STATE.md` e `.sdd/MAP.md` (typecheck, build e test:db) sem iniciar qualquer funcionalidade nova da Rodada 5.

## Problema

- `npm run typecheck` e `npm run build` falham em `src/app/api/events/[eventId]/stage/commands/route.ts` porque `Number.isInteger` nao e um type guard no TypeScript; `durationSeconds` permanece tipado como `{}` apos excluir `null`/`undefined`, quebrando a comparacao `< 1` e a atribuicao a `StageCommand`.
- `npm run test:db` falha em `tests/stage-state.test.ts` porque os objetos esperados em `assert.deepEqual` nao incluem `activeMessageContent` e `messageExpiresAt`, campos que o dominio (`stage-state.ts`) ja retorna corretamente desde a migracao `0003`.
- Nao existe teste de regressao para o ciclo pausa/retomada do tempo decorrido via `applyStageCommand`, conforme pedido em `docs/PROJECT-STATE.md`.

## Escopo

- `src/app/api/events/[eventId]/stage/commands/route.ts`: usar `typeof durationSeconds === "number"` para restaurar o narrowing correto antes de `Number.isInteger`/comparacao.
- `tests/stage-state.test.ts`: atualizar os dois objetos esperados para incluir `activeMessageContent: null` e `messageExpiresAt: null`.
- Adicionar um teste de regressao (em `tests/stage-state.test.ts`) que aplica `start` -> `pause` -> `resume` via `applyStageCommand` e confirma `eventElapsedSeconds` e `pausedElapsedSeconds` corretos apos o ciclo.
- Atualizar `docs/PROJECT-STATE.md`, `docs/ROADMAP.md` (sem marcar item novo, apenas remover alerta de bloqueio) e `.sdd/MAP.md` com o resultado.
- Registrar evidencia no `RECORD.md` desta demanda.

## Fora de escopo

- Interface de mensagens no console de gestao (`management-client.tsx`).
- Mensagens programadas, aviso automatico de atraso e sequencia de blocos.
- Qualquer migration nova ou alteracao de dados locais.

## Validacao

- `npm run lint`
- `npm run typecheck`
- `npm run test:db`
- `npm run build`

## Riscos

- Baixo: mudancas isoladas em tipagem e testes, sem alterar schema, migrations ou regras de negocio.
