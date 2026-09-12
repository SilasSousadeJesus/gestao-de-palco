# `foco-discreto-e-padding` - record

## O que mudou

- `src/app/globals.css`:
  - `input:focus, button:focus { outline:none; }` remove o contorno padrao do navegador (o "preto forte" reportado).
  - `input:focus-visible { outline:none; border-color:#127c70; box-shadow:0 0 0 3px #127c7026; }` e `button:focus-visible { outline:none; box-shadow:0 0 0 3px #127c7040; }` — usa `:focus-visible` (mostra o destaque para navegacao por teclado; para clique de mouse o destaque tambem aparece, ja que nao ha diferenciacao adicional, mas fica discreto o suficiente para nao incomodar). Cor reaproveitada do teal ja usado como acento no app (`#127c70`, mesma cor de `.event-row.selected` e `.is-early`).
  - `.management-shell`: `padding: clamp(1.25rem, 4vw, 3rem)` (todos os lados) virou `padding-block: clamp(1.25rem, 4vw, 3rem)` (vertical, inalterado) + `padding-inline: clamp(.625rem, 2vw, 1.5rem)` (lateral, exatamente metade dos valores anteriores).

## Fora de escopo (nao alterado)

- Padding vertical da pagina.
- Estilo de foco de elementos alem de `input`/`button`.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual com Playwright (viewport 1500px):
  - `padding-left`/`padding-right` computado de `.management-shell`: 24px (antes seria 48px, a metade exata — o `padding-top` continuou em 48px, confirmando que so o lateral mudou).
  - Foco no campo de nome do evento: `outline:none`, `border-color: rgb(18, 124, 112)` (`#127c70`), `box-shadow` com halo suave da mesma cor — sem nenhum contorno preto do navegador.
  - Screenshot confirma visualmente: campo com anel teal discreto ao ser clicado; cards com mais respiro horizontal em relacao a borda da pagina.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`, `.sdd/knowledge/design-system.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada sobre o novo estilo de foco e o padding lateral reduzido.
- `.sdd/knowledge/design-system.md`: adicionado o padrao de foco como parte do design system, para ser reaproveitado em novos elementos.
