# `mensagem-vermelha` - record

## O que mudou

- `src/app/globals.css`: `color:#ff4d45` adicionado a `.stage-screen .stage-stage strong.stage-message-text` (palco) e `.stage-presentation.stage-preview strong.stage-message-text` (preview) — mesmo vermelho ja usado para atraso (`.is-late`) em outros pontos do app. O texto da mensagem (temporaria ou permanente) agora aparece sempre em vermelho, em vez da cor de texto padrao (`#f7f4ea`, off-white).

## Fora de escopo (nao alterado)

- Cor do mini-timer, do rotulo "COMUNICADO" (permanece cinza-esverdeado discreto) ou de qualquer outro elemento.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual com Playwright: enviada mensagem temporaria, cor computada do texto conferida em `rgb(255, 77, 69)` (= `#ff4d45`) tanto no preview quanto no palco. Screenshot confirma visualmente.

## Documentos ativos consultados

- `.sdd/knowledge/design-system.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada sobre a cor vermelha da mensagem.
