# Mapa do projeto

## Visao geral

| Campo                    | Valor                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| Estado do mapeamento     | Fase 1 concluida em 01/09/2026                                          |
| Arquitetura              | Aplicacao Next.js auto-hospedada em um unico PC, com SQLite local       |
| Linguagens e frameworks  | TypeScript, Next.js 16, React 19, Drizzle ORM e SQLite                  |
| Como executar localmente | `npm install`, `npm run db:migrate`, `npm run dev`                      |
| Como validar             | `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build` |

## Modulos

| Modulo ou caminho  | Responsabilidade                              | Tecnologia           | Validacao             | Riscos e observacoes                                                |
| ------------------ | --------------------------------------------- | -------------------- | --------------------- | ------------------------------------------------------------------- |
| `src/app/`         | Entrada web e base visual do aplicativo       | Next.js App Router   | `npm run build`       | Ainda nao contem telas funcionais de gestao ou palco                |
| `src/db/schema.ts` | Contrato do dominio persistido                | Drizzle ORM e SQLite | `npm run db:generate` | Schema inicial; evoluir somente com migracao versionada             |
| `src/db/client.ts` | Conexao SQLite local e pragmas de integridade | `better-sqlite3`     | `npm run db:migrate`  | Cria a pasta local, habilita chaves estrangeiras e WAL              |
| `drizzle/`         | Historico de migracoes SQL                    | Drizzle Kit          | `npm run test:db`     | Versionado; nunca editar migracao ja aplicada sem nova demanda      |
| `tests/`           | Teste estrutural da migracao inicial          | Node test runner     | `npm run test:db`     | Testa em memoria; nao substitui teste de interface                  |
| `data/`            | Banco local de desenvolvimento                | SQLite               | `npm run db:migrate`  | Arquivos `.db` sao ignorados e nao devem ir para pasta sincronizada |

## Fluxos importantes

| Fluxo               | Entrada              | Componentes envolvidos          | Saida                          | Invariantes                                    |
| ------------------- | -------------------- | ------------------------------- | ------------------------------ | ---------------------------------------------- |
| Inicializacao local | `npm run dev`        | Next.js e `src/app/`            | Aplicacao em `localhost:3000`  | Nao depende de internet                        |
| Migracao local      | `npm run db:migrate` | Drizzle Kit, `drizzle/`, SQLite | Banco atualizado em `data/`    | So aplicar migracoes autorizadas e versionadas |
| Validacao do schema | `npm run test:db`    | SQL gerado e SQLite em memoria  | Tabelas essenciais verificadas | O teste nao altera o banco local               |

## Dados e integracoes

| Item           | Tipo                                  | Onde e configurado            | Sensibilidade                   | Observacoes                                                              |
| -------------- | ------------------------------------- | ----------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| SQLite local   | Banco de dados                        | `DATABASE_URL` em `.env`      | Historico e relatorios do culto | Padrao: `data/gestao-de-palco.db`                                        |
| MR18           | Controle de audio pela mesma LAN      | Roteador externo e X Air Edit | Controle de mesa                | Mesa e PC devem preferir Ethernet; nao e integracao de codigo nesta fase |
| Roteador local | Rede privada sem internet obrigatoria | DHCP e firewall do Windows    | Acesso ao painel                | Reservar IP para PC e MR18 em fase operacional                           |

## Dividas e armadilhas conhecidas

- A aplicacao ainda nao possui autenticacao, sincronizacao, interface de evento ou tela HDMI.
- O SQLite foi escolhido para um unico PC; nao usar o mesmo arquivo simultaneamente por pasta de sincronizacao em nuvem.
- A fundacao nao libera acesso pela LAN ainda; isso entra na Fase 6 com PIN/login e regras de firewall.

## Lacunas a confirmar com o usuario

- PIN unico local ou login por usuario.
- Nome do bloco sempre no palco ou apenas no preview.
- Texto fixo ou configuravel para aviso de atraso.
- Relatorio livre ou com campos estruturados.
- Modelos reutilizaveis de eventos.
