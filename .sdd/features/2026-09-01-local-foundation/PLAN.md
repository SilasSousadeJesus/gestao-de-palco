# `local-foundation` - plan

## Problema

O repositorio possui a definicao de produto, mas ainda nao tem aplicacao local, banco, migracoes, comandos de validacao ou mapa tecnico. A Fase 1 cria uma base pequena e verificavel sem antecipar telas, timers ou comunicacao ao vivo das fases posteriores.

## Escopo

- **Dentro:** Next.js com TypeScript, base visual minima, SQLite local via Drizzle, primeira migracao, modelos de dominio, testes da migracao, comandos de desenvolvimento e atualizacao da documentacao viva.
- **Fora:** gestao de eventos em interface, tela de palco, preview, timer, streaming, QR Code, PIN/login, acesso por tablet, backup e atalho Windows.
- **Autorizacao:** aplicar somente a primeira migracao no arquivo SQLite local de desenvolvimento (`data/gestao-de-palco.db`). Nenhum banco remoto existe ou sera acessado.

## Rastreabilidade

| Requisito                          | Entrega                                                |
| ---------------------------------- | ------------------------------------------------------ |
| Projeto Next.js e TypeScript       | `package.json`, `src/app/` e configuracoes             |
| SQLite e primeira migracao         | `src/db/`, `drizzle/` e `drizzle.config.ts`            |
| Modelo inicial de dominio          | tabelas de evento, bloco, mensagem, estado e relatorio |
| Validacao de banco                 | `tests/migration.test.mjs`                             |
| Operacao local e MR18 documentadas | `LOCAL-OPERATION.md`, `PROJECT-STATE.md`               |
| Mapa tecnico real                  | `.sdd/MAP.md`                                          |

## Execucao

| #   | Arquivo ou area              | O que sera feito                                                             | Depende de |
| --- | ---------------------------- | ---------------------------------------------------------------------------- | ---------- |
| 1   | configuracao                 | Criar manifest, TypeScript, ESLint, ambiente de exemplo e ignores            | -          |
| 2   | `src/app`                    | Criar aplicacao Next minima e pagina de fundacao local                       | 1          |
| 3   | `src/db`                     | Definir schema SQLite e cliente local                                        | 1          |
| 4   | `drizzle/`                   | Gerar e aplicar a primeira migracao local                                    | 3          |
| 5   | `tests/`                     | Validar que a migracao cria as tabelas essenciais                            | 4          |
| 6   | `.sdd`, `docs` e `README.md` | Atualizar mapa, estado, operacao, roadmap e entrada do projeto com evidencia | 2, 4, 5    |

## Validacao

- `npm run lint`
- `npm run typecheck`
- `npm run test:db`
- `npm run db:migrate`
- `npm run build`

## Riscos

- SQLite atende um unico PC, mas nao deve ser colocado em pasta sincronizada por nuvem enquanto a aplicacao estiver aberta.
- A conexao MR18 e Gestao de Palco compartilharao o roteador; o PC e a mesa devem preferencialmente usar Ethernet, e o Wi-Fi fica para dispositivos de controle.

## Decisao durante a execucao

O `README.md` raiz ainda descrevia o template de configuracao de IA. Ele passa a descrever a aplicacao e seus comandos para evitar que a primeira leitura de um novo colaborador carregue uma descricao incorreta do repositorio.
