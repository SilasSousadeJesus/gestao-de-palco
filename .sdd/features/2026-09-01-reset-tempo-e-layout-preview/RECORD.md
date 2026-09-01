# `reset-tempo-e-layout-preview` - record

## O que mudou

**Zerar tempo decorrido junto com "Limpar palco"**

- `src/features/stage/stage-state.ts`: `StageCommand.resetElapsed?: boolean`. No caso `clear` de `nextSnapshot`, `eventElapsedSeconds` passa a ser `0` quando `command.resetElapsed` for verdadeiro; caso contrario mantem o comportamento anterior (`accumulated`, ou seja, preserva o tempo acumulado). Como `clear` ja zera `startedAt`/`mode` para idle, nao ha o risco de afetar o tempo restante do bloco que estava tocando no palco (esse calculo usa `startedAt`, que nao foi tocado por esta mudanca).
- `src/app/api/events/[eventId]/stage/commands/route.ts`: `parseCommand` valida (`typeof resetElapsed !== "boolean"`) e repassa o campo.
- `src/app/management-client.tsx`: o botao "Limpar palco" agora chama `command("clear", undefined, true)`. O icone de "parar" (■) de cada bloco continua chamando `command("clear")` sem o terceiro argumento — ou seja, parar um bloco individualmente nao zera o tempo decorrido do evento, so o botao explicito "Limpar palco" faz isso.
- `tests/stage-state.test.ts`: novo teste `limpar palco preserva o tempo decorrido por padrao, mas zera quando resetElapsed e pedido`.

**Layout: preview em largura total, card "Em breve"**

- `src/app/management-client.tsx`: adicionado `<aside className="placeholder-panel"><p className="eyebrow">EM BREVE</p></aside>` entre o console e o preview.
- `src/app/globals.css`: `.placeholder-panel` entra no mesmo estilo de cartao usado por `.event-panel`/`.console-panel`/`.preview-panel`, com conteudo centralizado e cor neutra. `.preview-panel` ganhou `grid-column: 1 / -1`. O grid (`.management-grid`) continua com as mesmas 3 colunas de antes — nao foi reduzido para 2, conforme pedido, para reservar a terceira coluna a um card futuro.

## Fora de escopo (nao alterado)

- Conteudo do card "Em breve" (permanece so com o titulo).
- Tamanho de fonte do preview (nao foi ajustado para aproveitar o espaco maior; o box 16:9 simplesmente cresce porque a coluna ficou mais larga).
- Nenhuma migration ou mudanca de schema.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (6/6, incluindo o teste novo) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright (viewport 1400x900):
  - Confirmado via `getBoundingClientRect()` que Eventos, Evento Aberto e "Em breve" ficam na mesma linha (top identico, 3 colunas) e que o Preview inicia numa nova linha abaixo, com largura igual a soma das 3 colunas.
  - Bloco iniciado, aguardados ~2s, tempo decorrido mostrou `00:00:02`+.
  - Parado pelo icone ■ do bloco: tempo decorrido continuou (`00:00:03`), confirmando que o icone de parar nao zera o contador.
  - Bloco iniciado de novo, aguardados ~2s, clicado em "Limpar palco": tempo decorrido voltou a `00:00:00` imediatamente.
  - Nenhum erro de console.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`.

## Documentos ativos atualizados

- Nenhuma mudanca de fase, decisao ou risco de produto o suficiente para exigir atualizacao de `docs/PROJECT-STATE.md`/`docs/ROADMAP.md`/`.sdd/MAP.md` alem deste registro: e um refinamento de UX dentro da Fase 3/5 ja documentada, sem mudar o escopo funcional descrito nesses documentos.
