# `reset-tempo-e-layout-preview` - plan

## Objetivo

Fazer o botao "Limpar palco" tambem zerar o tempo decorrido do evento, e mover o preview ao vivo para uma linha propria em largura total, abaixo dos cards existentes, reservando o espaco antigo do preview para um card "Em breve".

## Escopo

- `src/features/stage/stage-state.ts`: `StageCommand` ganha campo opcional `resetElapsed`; o caso `clear` de `nextSnapshot` zera `eventElapsedSeconds` quando `resetElapsed` for verdadeiro, preservando o comportamento atual (acumula) quando nao for informado.
- `src/app/api/events/[eventId]/stage/commands/route.ts`: `parseCommand` valida e repassa `resetElapsed`.
- `src/app/management-client.tsx`: botao "Limpar palco" passa `resetElapsed: true`; o icone de "parar" por bloco continua chamando `clear` sem esse parametro (nao deve zerar o tempo decorrido s√≥ por parar um bloco). Grid da gestao ganha um card `.placeholder-panel` ("EM BREVE") na terceira coluna, e o preview passa a ocupar a largura total numa linha abaixo.
- `src/app/globals.css`: `.placeholder-panel` com o mesmo estilo de cartao; `.preview-panel` ganha `grid-column: 1 / -1`.
- `tests/stage-state.test.ts`: novo teste cobrindo `clear` com e sem `resetElapsed`.

## Fora de escopo

- O conteudo do card "Em breve" (fica so com o titulo por enquanto).
- Qualquer ajuste de tamanho de fonte do preview para aproveitar o novo espaco maior (nao pedido).
- Migration ou mudanca de schema.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: layout com evento aberto (3 cards em cima, preview embaixo em largura total); zerar tempo decorrido via "Limpar palco" com o timer rodando; confirmar que o icone de "parar" de um bloco individual NAO zera o tempo decorrido.

## Riscos

- Baixo: mudanca aditiva no dominio (campo opcional, comportamento padrao inalterado) e mudanca de layout puramente visual.
