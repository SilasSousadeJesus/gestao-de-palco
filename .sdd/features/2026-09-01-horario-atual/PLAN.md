# `horario-atual` - plan

## Objetivo

Exibir o horario atual (hh:mm:ss, atualizado a cada segundo) no card "Evento Aberto", acima de "Total Planejado".

## Escopo

- `src/app/management-client.tsx`: novo helper `currentTimeLabel(timestamp)`; linha "Horario atual: hh:mm:ss" adicionada no topo do bloco `<strong>` do `event-heading`, reaproveitando o estado `clock` (ja atualizado a cada segundo).

## Fora de escopo

- Qualquer mudanca de fuso horario ou formato alem de hh:mm:ss local do navegador.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: horario atual muda a cada segundo (conferido programaticamente com Playwright, comparando o texto antes e ~2s depois).
