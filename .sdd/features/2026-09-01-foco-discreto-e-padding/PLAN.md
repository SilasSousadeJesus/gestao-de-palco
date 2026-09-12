# `foco-discreto-e-padding` - plan

## Objetivo

Trocar o contorno de foco padrao do navegador (grosso, preto) por um destaque discreto na cor de acento do app. Reduzir pela metade o padding lateral da pagina, mantendo o padding vertical, para abrir mais espaco horizontal para os cards.

## Escopo

- `src/app/globals.css`:
  - `input, button` ganham `:focus { outline:none; }` e `:focus-visible` com borda/realce sutil em teal (`#127c70`), substituindo o outline padrao do navegador.
  - `.management-shell`: `padding` unico trocado por `padding-block` (mantem o valor atual, vertical) e `padding-inline` (metade do valor atual, lateral).

## Fora de escopo

- Mudar o padding vertical da pagina.
- Mudar o estilo de foco de outros elementos alem de `input`/`button` (ex.: links, se existirem).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: focar um input e conferir o estilo (sem outline padrao, borda/sombra teal suave); medir `padding-left`/`padding-right` computado de `.management-shell` antes/depois (deve cair pela metade).
