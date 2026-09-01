# `local-foundation` - record

> Escreva no passado. Nao declare teste, revisao ou comportamento sem evidencia.

## O que mudou

| Area      | Mudanca                                                             | Arquivos principais                                                    |
| --------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Aplicacao | Fundacao Next.js 16 e TypeScript, com pagina inicial local          | `package.json`, `src/app/`                                             |
| Banco     | Schema Drizzle e primeira migracao para cinco tabelas do dominio    | `src/db/`, `drizzle/`                                                  |
| Validacao | Teste de migracao SQLite em memoria e comandos de qualidade         | `tests/migration.test.mjs`, `package.json`                             |
| Operacao  | Rede compartilhada entre MR18 e Gestao de Palco registrada          | `docs/LOCAL-OPERATION.md`                                              |
| Contexto  | Mapa, estado vivo, roadmap e README atualizados com fatos da Fase 1 | `.sdd/MAP.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `README.md` |

## Comportamento

`npm run dev` inicia a aplicacao Next em `http://localhost:3000`. O banco padrao fica em `data/gestao-de-palco.db`; a conexao habilita chaves estrangeiras e WAL. O schema inicial contem `events`, `time_blocks`, `message_cues`, `stage_states` e `event_reports`, mas nenhuma tela funcional de produto foi entregue nesta fase.

## Validacao executada

- `npm run db:generate` gerou `drizzle/0000_regular_fabian_cortez.sql` para cinco tabelas.
- `npm run db:migrate` aplicou a primeira migracao no SQLite local autorizado.
- `npm run lint` passou sem achados.
- `npm run typecheck` passou sem erros.
- `npm run test:db` passou: 1 teste verde para a migracao em SQLite em memoria.
- `npm run build` passou e gerou build otimizado do Next.js.
- O servidor iniciado em `127.0.0.1:3000` respondeu `200` e exibiu a pagina de fundacao.

## Decisoes e desvios

- O `README.md` raiz foi atualizado alem dos arquivos inicialmente listados no plano. Ele ainda descrevia o template de IA, o que ficaria incorreto depois da criacao do aplicativo; a mudanca foi adicionada ao plano antes da escrita.
- A primeira tentativa de `npm install` continuou em segundo plano e bloqueou uma segunda tentativa. A instalacao em andamento foi aguardada, sem apagar dependencias, e terminou com manifesto e lockfile consistentes.
- O Drizzle nao cria a pasta do banco; `data/.gitkeep` foi adicionado e os arquivos SQLite permanecem ignorados.

## Documentos consultados e atualizados

- Consultados: `docs/README.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md` e `docs/LOCAL-OPERATION.md`.
- Atualizados: `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/LOCAL-OPERATION.md`, `.sdd/MAP.md` e `README.md`.
- A proxima etapa registrada e Fase 2 - Estado de palco e sincronia.

## Lacunas ou proximos passos confirmados

- A Fase 2 deve criar o `StageSnapshot` versionado, comandos idempotentes e a notificacao local. Ela nao deve antecipar a tela visual completa das fases 3 e 4.
