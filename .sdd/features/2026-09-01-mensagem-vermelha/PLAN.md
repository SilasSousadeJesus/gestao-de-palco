# `mensagem-vermelha` - plan

## Objetivo

Fazer o texto da mensagem (temporaria ou permanente) aparecer sempre em vermelho, no palco e no preview.

## Escopo

- `src/app/globals.css`: `color:#ff4d45` (mesmo vermelho ja usado para atraso, `.is-late`) adicionado em `.stage-screen .stage-stage strong.stage-message-text` e `.stage-presentation.stage-preview strong.stage-message-text`.

## Fora de escopo

- Cor do mini-timer, do rotulo "COMUNICADO" ou de qualquer outro elemento.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: enviar mensagem e conferir a cor computada do texto no palco e no preview.
