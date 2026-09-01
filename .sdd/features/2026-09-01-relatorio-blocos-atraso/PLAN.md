# `relatorio-blocos-atraso` - plan

## Objetivo

Substituir o card "Em breve" por um relatorio de blocos (Nome | Tempo | Atraso), atualizado ao vivo, com linha de totais. Decisoes definidas com o usuario antes da implementacao:

1. Atraso atualiza em tempo real enquanto o bloco esta tocando.
2. "Limpar palco" (com `resetElapsed`) zera tambem o historico de tempo usado por bloco (a tabela inteira volta a `—`).
3. A tabela fica na coluna estreita reservada por enquanto (nao vira full-width).

## Escopo

- `src/db/schema.ts` + migration: nova coluna `actual_seconds` (nullable) em `time_blocks`.
- `src/features/stage/stage-state.ts`: ao trocar de bloco (`start`) ou parar (`clear`), o tempo do bloco que estava ativo e somado ao `actual_seconds` dele. `clear` com `resetElapsed: true` zera `actual_seconds` de todos os blocos do evento.
- `src/features/events/event-service.ts`: `TimeBlock`/`listBlocks` passam a expor `actualSeconds`.
- `src/app/management-client.tsx`: card "Em breve" vira "Relatorio de blocos" (tabela + rodape com total de tempo, total de atraso e "Planejado − Decorrido"). Correcao de um bug encontrado durante a validacao: `command()` (usado por iniciar/parar bloco e limpar palco) nao recarregava `active.blocks`, entao a tabela ficava desatualizada apos qualquer acao — corrigido para chamar `openEvent` apos cada comando.
- `src/app/globals.css`: estilos da tabela (`.report-panel`), reaproveitando `.is-late` no padrao de cor ja usado no palco.
- `tests/stage-state.test.ts`: novo teste cobrindo acumulo de `actual_seconds` ao trocar de bloco e o reset em massa via `resetElapsed`.

## Fora de escopo

- Mover a tabela para largura total.
- Persistir o relatorio alem do reset (por decisao do usuario, "Limpar palco" apaga o historico).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: bloco sem rodar ainda (—), bloco rodando ao vivo (valor positivo crescendo), bloco com atraso simulado (negativo, vermelho, coerente com o exemplo do usuario: 30 min planejado / 35 usado = -5 min), "Limpar palco" zerando a tabela inteira.

## Riscos

- Migration aditiva (coluna nullable), baixo risco. Autorizada explicitamente pelo usuario antes de `npm run db:migrate`.
