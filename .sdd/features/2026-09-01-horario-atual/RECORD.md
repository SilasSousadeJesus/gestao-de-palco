# `horario-atual` - record

## O que mudou

- `src/app/management-client.tsx`: adicionado `currentTimeLabel(timestamp)` (formata `hh:mm:ss` local a partir de um timestamp) e a linha "Horario atual: {currentTimeLabel(clock)}" no topo do `<strong>` do `event-heading`, acima de "Total Planejado". Usa o estado `clock` ja existente, que tickava a cada segundo para o calculo de "Tempo Decorrido" — nenhum novo timer foi criado.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (6/6) e `npm run build` passaram.
- Verificacao com Playwright: criado evento, capturado o texto do horario, aguardado ~2.2s, capturado de novo — o horario avancou corretamente (`19:35:51` -> `19:35:53`).

## Documentos ativos

- Mudanca cosmetica pequena dentro da area ja documentada em `docs/PROJECT-STATE.md` (console de gestao); nao alterou comportamento, arquitetura, risco ou fase, entao nenhuma atualizacao adicional foi necessaria alem deste registro.
