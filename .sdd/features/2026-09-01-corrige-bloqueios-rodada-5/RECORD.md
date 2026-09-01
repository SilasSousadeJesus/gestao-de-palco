# `corrige-bloqueios-rodada-5` - record

## O que mudou

- `src/app/api/events/[eventId]/stage/commands/route.ts`: adicionado `typeof durationSeconds !== "number"` na validacao de `parseCommand`, restaurando o narrowing de tipo que `Number.isInteger` nao fornece (nao e um type guard no TypeScript). Corrige o erro de tipagem que bloqueava `typecheck` e `build`.
- `tests/stage-state.test.ts`:
  - Os dois objetos esperados em `assert.deepEqual` no teste `comandos de palco persistem versao e sao idempotentes` passaram a incluir `activeMessageContent: null` e `messageExpiresAt: null`, alinhando o teste ao snapshot real que o dominio ja produzia desde a migracao `0003`.
  - Adicionado o teste `tempo decorrido persiste corretamente apos um ciclo de pausa e retomada`, cobrindo `start -> pause -> resume -> pause` via `applyStageCommand` e validando `eventElapsedSeconds`, `pausedElapsedSeconds` e `startedAt` em cada etapa.

## Fora de escopo (nao alterado)

- Nenhuma migration nova, nenhuma alteracao de schema ou dado local.
- Interface de mensagens no console de gestao (`management-client.tsx`) continua inexistente.
- Mensagens programadas, aviso automatico de atraso e sequencia de blocos continuam pendentes.

## Evidencias de validacao

- `npm run lint`: passou, sem saida de erro.
- `npm run typecheck`: passou, sem erros (antes: 2 erros em `route.ts:34` e `route.ts:43`).
- `npm run test:db`: 5/5 testes passaram (antes: 3/4, falha em `stage-state.test.ts:52`).
- `npm run build`: build de producao concluido com sucesso, incluindo checagem de tipos (antes: falhava com os mesmos erros do `typecheck`).

## Documentos ativos consultados

- `AGENTS.md`, `.sdd/EXECUTION-CONTRACT.md`, `.sdd/PROJECT-BRIEF.md`, `.sdd/MAP.md`.
- `docs/README.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md`, `docs/LOCAL-OPERATION.md`.
- `.sdd/features/2026-09-01-documentation-reconciliation/PLAN.md` e `RECORD.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: removido o bloqueio de `typecheck`/`test:db`/`build`; registrada a correcao e o novo estado desbloqueado para a Rodada 5.
- `.sdd/MAP.md`: atualizada a secao "Estado tecnico bloqueante" para refletir que as tres validacoes voltaram a passar.
- `docs/ROADMAP.md`: nenhuma caixa de funcionalidade marcada (esta demanda foi correcao tecnica, nao entrega de escopo da Fase 5); apenas a nota de bloqueio foi removida.

## Observacao

A Rodada 5 continua parcial: schema e dominio de mensagem existem e agora estao validados por testes, mas a interface de gestao (envio/limpeza de mensagem no console), mensagens programadas, aviso automatico de atraso e sequencia de blocos ainda nao foram implementados. Nenhum desses itens deve ser considerado entregue.
