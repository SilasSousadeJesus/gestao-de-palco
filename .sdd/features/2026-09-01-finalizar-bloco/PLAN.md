# `finalizar-bloco` - plan

## Objetivo

Adicionar um botao "Finalizar" por bloco: para o cronometro do bloco (se estiver ativo) e marca o bloco como concluido de forma permanente — nao e mais possivel dar play nem stop nele, so editar e excluir.

## Problema

Hoje so existe "Limpar palco" (reseta tudo, incluindo o tempo decorrido do evento) ou trocar de bloco. Nao ha como concluir um bloco especifico sem afetar o resto, nem como travar um bloco que ja acabou para impedir reinicio acidental.

## Escopo

- `src/db/schema.ts` + migration: nova coluna `time_blocks.finished_at` (timestamp, nullable).
- `src/features/stage/stage-state.ts`: novo tipo de comando `finish` (exige `blockId`). Se o bloco e o ativo em execucao, o tempo e dobrado em `actual_seconds` (mesma logica ja usada por `start`/`clear`) e o palco volta a idle. `finished_at` do bloco e sempre marcado. `start` e `finish` em um bloco ja finalizado sao rejeitados (`invalid_state`).
- `src/features/events/event-service.ts`: `TimeBlock`/`listBlocks`/`createBlock` passam a expor `finishedAt`.
- `src/app/management-client.tsx`: novo icone "Finalizar" (bandeira) ao lado de iniciar/parar; quando o bloco esta finalizado, a linha fica visualmente desabilitada (fundo neutro, titulo apagado, rotulo "Finalizado") e mostra somente os icones de editar e excluir.
- `src/app/globals.css`: estilo `.is-finished` e hover do novo icone.
- `tests/stage-state.test.ts`: novo teste cobrindo finalizar um bloco ativo (para o cronometro, marca `finished_at`) e a rejeicao de `start`/`finish` num bloco ja finalizado.

## Fora de escopo

- Reabrir/desfazer um bloco finalizado (nao foi pedido).
- Qualquer confirmacao antes de finalizar (o usuario nao pediu; e uma acao operacional frequente, nao uma exclusao).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: iniciar um bloco, finalizar, conferir que fica sem play/stop/finalizar (so editar/excluir), com rotulo "Finalizado"; conferir que editar e excluir continuam funcionando num bloco finalizado; conferir que outro bloco nao tocado continua com todos os controles.
