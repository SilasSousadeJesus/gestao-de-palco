# `relatorio-blocos-atraso` - record

## O que mudou

**Schema/migration**

- `src/db/schema.ts`: `timeBlocks.actualSeconds` (integer, nullable).
- `drizzle/0004_woozy_silver_centurion.sql`: `ALTER TABLE time_blocks ADD actual_seconds integer;`. Gerada com `npm run db:generate` e aplicada com `npm run db:migrate` no banco local, com autorizacao explicita do usuario.

**Dominio (`src/features/stage/stage-state.ts`)**

- Dentro da transacao de `applyStageCommand`, antes de calcular o proximo snapshot:
  - Se o comando e `clear` com `resetElapsed: true`: `update time_blocks set actual_seconds = null where event_id = ?` (zera todos os blocos do evento).
  - Senao, se o comando e `start` ou `clear` e havia um bloco ativo rodando (`current.activeBlockId`, `current.mode === "running"`, `current.startedAt !== null`): soma o tempo que ele rodou (`now - startedAt`) ao `actual_seconds` desse bloco (`coalesce(actual_seconds, 0) + ranSeconds`).

**Backend (`src/features/events/event-service.ts`)**

- `TimeBlock.actualSeconds: number | null`; `listBlocks` inclui `actual_seconds as actualSeconds`; `createBlock` inicializa `actualSeconds: null`.

**Frontend (`src/app/management-client.tsx`)**

- Card "Em breve" (`.placeholder-panel`) substituido por "Relatorio de blocos" (`.report-panel`): tabela com colunas Nome | Tempo | Atraso, calculada em `blockReport` (soma `block.actualSeconds` persistido com o tempo ao vivo do bloco atualmente ativo). Atraso = `duration - actual`; celula fica vermelha (`is-late`) quando negativo. Rodape com Total (soma do tempo planejado e soma do atraso apenas dos blocos que ja rodaram) e "Planejado − Decorrido" (usa o `elapsed` do evento inteiro).
- **Correcao de bug encontrado na validacao**: `command()` (usado pelos icones de iniciar/parar bloco e pelo botao "Limpar palco") atualizava apenas `snapshot`, nao `active`. Como a tabela le `active.blocks[].actualSeconds`, ela ficava desatualizada ate o operador reabrir o evento manualmente. Corrigido: `command()` agora tambem chama `openEvent(active.id)` apos um comando bem-sucedido.
- `src/app/globals.css`: estilos de `.report-panel` (tabela compacta, primeira coluna truncada com reticencias, `.is-late` em vermelho `#ff4d45` — mesma cor ja usada para atraso no palco).

**Testes**

- `tests/stage-state.test.ts`: novo teste `trocar de bloco acumula actual_seconds do bloco anterior; limpar palco com resetElapsed zera todos os blocos`, cobrindo troca de bloco, `clear` simples (acumula sem zerar) e `clear` com `resetElapsed` (zera todos os blocos do evento).

## Fora de escopo (nao alterado)

- A tabela continua na coluna estreita reservada (nao virou full-width).
- Nao ha persistencia do relatorio alem do reset — por decisao do usuario, "Limpar palco" apaga o historico junto com o cronometro.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (7/7, incluindo o teste novo) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright, incluindo escrita direta no SQLite local para simular um atraso (tecnica de teste, nao muda comportamento da aplicacao):
  - Blocos recem-criados mostram "—" na coluna Atraso (ainda nao rodaram).
  - Bloco iniciado: apos ~3s, Atraso mostra um valor (confirma que a contagem ao vivo comeca assim que o bloco entra em execucao).
  - Simulado um bloco de 30 min planejado com 35 min de uso real (o mesmo exemplo dado pelo usuario): a celula mostrou exatamente "-5 min" em vermelho, e o Total tambem ficou vermelho.
  - "Limpar palco": tabela inteira voltou a "—" e a contagem de celulas vermelhas foi a 0 — confirmando o reset em massa e a correcao do bug de atualizacao.
  - Nenhum erro de console.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `.sdd/MAP.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nova entrada em "O que ja existe" e nota de evidencia.
- `.sdd/MAP.md`: `src/db/schema.ts` ja documentado como "evoluir somente com migracao versionada" — esta demanda seguiu essa regra; nenhuma mudanca de texto necessaria alem de registrar a migration `0004` (feita via este RECORD.md).
