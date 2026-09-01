# `layout-limite-nome-cores-atraso` - record

## O que mudou

**01 — Largura das colunas**

- `src/app/globals.css`: `.management-grid` mudou de `minmax(15rem, .7fr) minmax(20rem, 1.2fr) minmax(20rem, 1fr)` para `minmax(12rem, .5fr) minmax(20rem, 1.2fr) minmax(20rem, 1.4fr)` — Eventos mais estreita, Console igual, Relatorio de blocos com o maior ganho de espaco.

**02 — Limite de 20 caracteres no nome do evento**

- `src/app/management-client.tsx`: extraido `makeLimitedChangeHandler(limit, setValue, setLimitHit)`, uma factory reutilizavel (a mesma logica que antes so existia para mensagens). Usada para: mensagem (limite 50, comportamento identico ao de antes, agora via factory), nome do evento na criacao (`titleLimitHit`) e nome do evento na edicao inline (`editingEventTitleLimitHit`), ambas com limite 20 e o aviso "Limite de 20 caracteres atingido." (mesma classe `.message-limit-warning`).
- `src/features/events/event-service.ts`: `EVENT_TITLE_MAX_LENGTH = 20`; `createEvent` e `updateEventTitle` agora rejeitam nomes acima do limite (defesa em profundidade, mesmo padrao usado para mensagens).
- `src/app/globals.css`: `.event-edit-form` ganhou `flex-wrap:wrap` e `.event-edit-warning { flex-basis:100%; }` para o aviso quebrar para a proxima linha em vez de espremer ao lado dos botoes.

**03 — Atraso/Adiantado colorido**

- `src/app/management-client.tsx`: nova funcao `delayClass(seconds)` retorna `"is-late"` (negativo), `"is-early"` (positivo) ou `""` (zero). Aplicada na celula de cada bloco, na linha "Total" e na linha "Planejado − Decorrido". O calculo em si (soma de positivos e negativos) ja funcionava desde a demanda anterior; so faltava a cor.
- `src/app/globals.css`: nova classe `.report-panel td.is-early { color:#127c70; font-weight:700; }` (reaproveita o verde-azulado ja usado como cor de destaque/conectado no app).

## Fora de escopo (nao alterado)

- Nenhuma mudanca no calculo de atraso em si.
- Nenhum limite de caracteres em outros campos (bloco, mensagem ja tinha o seu).

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (7/7) e `npm run build` passaram.
- Verificacao visual com Playwright (viewport 1400x900):
  - Larguras medidas via `getBoundingClientRect()`: Eventos 205px, Console 492px, Relatorio 574px (antes: Eventos era a maior proporcionalmente, agora e a menor das tres).
  - Nome do evento: digitados 50 caracteres no formulario de criacao, valor truncado para exatamente 20, aviso exibido, e o evento realmente criado tem 20 caracteres. Mesmo comportamento confirmado no formulario de edicao inline.
  - Cores: simulado um bloco de 30 min que terminou em 20 min (+10 min, verde) e outro que terminou em 35 min (-5 min, vermelho); "Total" mostrou "+5 min" em verde (soma liquida de +10 e -5) e "Planejado − Decorrido" tambem em verde. Contagem de celulas: 3 verdes, 1 vermelha — exatamente o esperado.
  - Nenhum erro de console.

## Observacao registrada (nao e um bug a corrigir agora)

- Com a coluna "Eventos" mais estreita, o formulario de edicao inline do nome (input + botoes salvar/cancelar) pode quebrar em varias linhas quando o nome e longo, por causa do `flex-wrap`. Continua funcional (todos os botoes clicaveis), so fica visualmente mais compacto. Nao foi pedido ajuste adicional; registrar caso o usuario queira revisitar depois.

## Ajuste pos-entrega: mais respiro na coluna Eventos (01/09/2026)

O usuario reportou (com print) que a coluna "Eventos" ficou apertada demais — o icone de excluir quase encostava na borda direita do cartao. Corrigido em `src/app/globals.css`:

- `.management-grid`: primeira coluna de `minmax(12rem, .5fr)` para `minmax(14rem, .6fr)` (um pouco mais larga que a versao anterior, ainda bem mais estreita que a original de `minmax(15rem, .7fr)`); Console e Relatorio ajustados para `1.15fr`/`1.35fr` (Relatorio continua com o maior espaco).
- `.event-row, .blocks article, .block-edit-form, .event-edit-form`: padding de `.6rem .7rem` para `.65rem .9rem` (mais respiro lateral).
- `.event-row-actions, .block-actions`: gap de `.1rem` para `.2rem`.

Validacao: `lint`, `typecheck`, `build` passaram. Medido com Playwright (viewport 1100px, cenario mais apertado que o teste anterior): espaco entre o icone de excluir e a borda direita do cartao passou a ser 15px (antes, mais proximo de 0). Screenshot do card confirma respiro visual claro.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada resumindo os tres ajustes.
