# Mapa do projeto

## Visao geral

| Campo                    | Valor                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| Estado do mapeamento     | Fase 4 concluida em 01/09/2026                                          |
| Arquitetura              | Aplicacao Next.js auto-hospedada em um unico PC, com SQLite local       |
| Linguagens e frameworks  | TypeScript, Next.js 16, React 19, Drizzle ORM e SQLite                  |
| Como executar localmente | `npm install`, `npm run db:migrate`, `npm run dev`                      |
| Como validar             | `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build` |

## Modulos

| Modulo ou caminho  | Responsabilidade                              | Tecnologia           | Validacao             | Riscos e observacoes                                                |
| ------------------ | --------------------------------------------- | -------------------- | --------------------- | ------------------------------------------------------------------- |
| `src/app/`         | Gestao, preview e APIs locais                  | Next.js App Router   | `npm run build`       | Tela HDMI final entra na Fase 4                                    |
| `src/features/events/` | Eventos e blocos do culto                   | TypeScript e SQLite | `npm run test:db`     | Edicao e reordenacao visual ainda pendentes                         |
| `src/db/schema.ts` | Contrato do dominio persistido                | Drizzle ORM e SQLite | `npm run db:generate` | Schema inicial; evoluir somente com migracao versionada             |
| `src/db/client.ts` | Conexao SQLite local e pragmas de integridade | `better-sqlite3`     | `npm run db:migrate`  | Cria a pasta local, habilita chaves estrangeiras e WAL              |
| `src/features/stage/` | Estado de palco, SSE e reconexao            | TypeScript e React   | `npm run test:db`     | SSE requer uma unica instancia local do Next                         |
| `drizzle/`         | Historico de migracoes SQL                    | Drizzle Kit          | `npm run test:db`     | Versionado; nunca editar migracao ja aplicada sem nova demanda      |
| `tests/`           | Teste estrutural da migracao inicial          | Node test runner     | `npm run test:db`     | Testa em memoria; nao substitui teste de interface                  |
| `data/`            | Banco local de desenvolvimento                | SQLite               | `npm run db:migrate`  | Arquivos `.db` sao ignorados e nao devem ir para pasta sincronizada |

## Fluxos importantes

| Fluxo               | Entrada              | Componentes envolvidos          | Saida                          | Invariantes                                    |
| ------------------- | -------------------- | ------------------------------- | ------------------------------ | ---------------------------------------------- |
| Inicializacao local | `npm run dev`        | Next.js e `src/app/`            | Aplicacao em `localhost:3000`  | Nao depende de internet                        |
| Migracao local      | `npm run db:migrate` | Drizzle Kit, `drizzle/`, SQLite | Banco atualizado em `data/`    | So aplicar migracoes autorizadas e versionadas |
| Validacao do schema | `npm run test:db`    | SQL gerado e SQLite em memoria  | Tabelas essenciais verificadas | O teste nao altera o banco local               |
| Comando de palco   | `POST /api/events/:id/stage/commands` | SQLite, log idempotente e hub SSE | Snapshot versionado | `commandId` repetido devolve o mesmo resultado |
| Sincronia de palco | `GET /api/events/:id/stage/stream` | SSE e cliente React | Snapshot atualizado | Reabertura sempre busca o snapshot SQLite      |

## Dados e integracoes

| Item           | Tipo                                  | Onde e configurado            | Sensibilidade                   | Observacoes                                                              |
| -------------- | ------------------------------------- | ----------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| SQLite local   | Banco de dados                        | `DATABASE_URL` em `.env`      | Historico e relatorios do culto | Padrao: `data/gestao-de-palco.db`                                        |
| MR18           | Controle de audio pela mesma LAN      | Roteador externo e X Air Edit | Controle de mesa                | Mesa e PC devem preferir Ethernet; nao e integracao de codigo nesta fase |
| Roteador local | Rede privada sem internet obrigatoria | DHCP e firewall do Windows    | Acesso ao painel                | Reservar IP para PC e MR18 em fase operacional                           |

## Dividas e armadilhas conhecidas

- A aplicacao ainda nao possui autenticacao.
- Mensagens programadas, aviso automatico de atraso e sequencia automatica de blocos ainda nao existem; mensagens manuais (temporaria, permanente, limpeza) foram entregues em 01/09/2026.
- O SQLite foi escolhido para um unico PC; nao usar o mesmo arquivo simultaneamente por pasta de sincronizacao em nuvem.
- A fundacao nao libera acesso pela LAN ainda; isso entra na Fase 6 com PIN/login e regras de firewall.
- O hub de SSE e local ao processo. Nao escalar para varias instancias Next sem substituir essa notificacao por um barramento compartilhado.
- A Rodada 5 foi parcialmente retomada em 01/09/2026: bloqueios de validacao corrigidos e mensagens manuais entregues e validadas visualmente. Falta agendamento, aviso de atraso e sequencia de blocos.

## Regra obrigatoria de documentacao

Toda alteracao futura deve atualizar os documentos ativos afetados, o roadmap e o `RECORD.md` da demanda. Sem esses registros, a demanda nao esta concluida.

## Estado tecnico bloqueante

- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passam (corrigido em 01/09/2026, ver `.sdd/features/2026-09-01-corrige-bloqueios-rodada-5/RECORD.md`).
- Nao ha mais bloqueio tecnico de validacao para novas funcionalidades. A interface de mensagens e as automacoes da Rodada 5 continuam pendentes de implementacao.

## Lacunas a confirmar com o usuario

- PIN unico local ou login por usuario.
- Nome do bloco sempre no palco ou apenas no preview.
- Texto fixo ou configuravel para aviso de atraso.
- Relatorio livre ou com campos estruturados.
- Modelos reutilizaveis de eventos.
