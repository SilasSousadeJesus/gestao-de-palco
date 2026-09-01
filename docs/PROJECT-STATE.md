# Estado vivo do projeto

> Atualize este documento ao concluir uma demanda, tomar uma decisao relevante, descobrir uma fragilidade ou mudar a proxima etapa autorizada. Ele registra estado e contexto; nao substitui o contrato, o produto ou as regras de seguranca.

## Leitura rapida

| Campo                     | Estado atual                                                |
| ------------------------- | ----------------------------------------------------------- |
| Ultima atualizacao        | 01/09/2026 (correcao de bloqueios tecnicos da Rodada 5)      |
| Fase atual                | Fase 4 - Tela de palco e timers concluida                   |
| Software de produto       | Gestao local, blocos, console e preview implementados       |
| Proxima etapa proposta    | Fase 5 - Mensagens e automacoes                             |
| Proxima escrita de codigo | Exige demanda, plano aprovado e leitura documental completa |

> **ALERTA:** a Rodada 5 falhou e os ultimos commits foram removidos pelo usuario por quebra de layout. Antes de retoma-la, reavaliar codigo, migrations, testes e comportamento real. Nenhuma funcionalidade da Rodada 5 deve ser considerada entregue sem essa reconciliacao.

> **REGRA OBRIGATORIA:** toda alteracao futura deve atualizar, na mesma demanda, os documentos ativos afetados e o `RECORD.md`. Sem documentacao atualizada, a entrega permanece incompleta.

## Auditoria de reconciliacao em 01/09/2026

- O estado confirmado do Git esta no commit `d314937`; as alteracoes nao commitadas desta demanda sao apenas documentais.
- `npm run lint` passou.
- `npm run typecheck` e `npm run build` falharam no parser de comandos de mensagens.
- `npm run test:db` falhou porque o teste de snapshot nao foi atualizado para os campos de mensagem.
- As migrations `0002_superb_ikaris.sql` (tempo decorrido) e `0003_wonderful_nick_fury.sql` (estado base de mensagem) existem e foram aplicadas localmente.
- A Rodada 5 permanece parcial: dominio e schema possuem base de mensagem, mas a interface de gestao e automacoes nao foram entregues nem validadas.

## Correcao de bloqueios tecnicos em 01/09/2026

- Corrigido o narrowing de tipo de `durationSeconds` em `src/app/api/events/[eventId]/stage/commands/route.ts` (`Number.isInteger` nao e um type guard no TypeScript).
- Atualizado `tests/stage-state.test.ts` para esperar `activeMessageContent` e `messageExpiresAt` no snapshot, e adicionada regressao de pausa/retomada do tempo decorrido.
- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram. Evidencia completa em `.sdd/features/2026-09-01-corrige-bloqueios-rodada-5/RECORD.md`.
- O projeto nao esta mais bloqueado para novas funcionalidades por falha de validacao, mas a interface de mensagens e as automacoes da Rodada 5 continuam pendentes de implementacao.

## Controles de mensagem manual implementados em 01/09/2026

- `management-client.tsx` ganhou um formulario de mensagem no console ao vivo: enviar temporaria (20s), enviar permanente com confirmacao quando o timer esta ativo, e limpar mensagem.
- Validado com `lint`, `typecheck`, `test:db`, `build` e uma verificacao visual automatizada (Playwright headless) cobrindo gestao e palco simultaneamente: mensagem temporaria some sozinha apos 20s, mensagem permanente exige confirmacao e nao expira sozinha, limpar mensagem restaura o timer, sem erros de console e sem quebra do layout de 3 colunas. Evidencia em `.sdd/features/2026-09-01-mensagens-console-gestao/RECORD.md`.

## Retomada obrigatoria da Rodada 5

1. ~~Implementar e validar controles de mensagem temporaria, permanente e limpeza no console de gestao~~ — concluido em 01/09/2026.
2. Implementar mensagens programadas relativas ao inicio de evento ou bloco.
3. Configurar aviso automatico a cada minuto de tempo negativo.
4. Implementar sequencia automatica de blocos com confirmacao humana.

## O que ja existe

- Configuracao de IA em `AGENTS.md` e `.sdd/`.
- Visao de produto e descricao das telas em `docs/PRODUCT.md`.
- Plano de operacao local em `docs/LOCAL-OPERATION.md`.
- Checklist e roadmap em `docs/ROADMAP.md`.
- Aplicacao Next.js 16 com TypeScript e pagina inicial em `src/app/`.
- Schema Drizzle e primeira migracao SQLite para evento, bloco, mensagem, estado de palco e relatorio.
- Banco local aplicado em `data/gestao-de-palco.db`; o arquivo e ignorado pelo Git.
- Comandos de lint, tipagem, teste de migracao, build e desenvolvimento documentados no `README.md`.
- `StageSnapshot` versionado, comandos idempotentes e registro de comandos em SQLite.
- APIs locais para consultar, comandar e receber estado por SSE.
- Pagina tecnica em `/sync-lab` para validar versao, conexao e recuperacao do estado.
- Painel de gestao em `/`, com eventos, blocos, console e preview 16:9.
- Tela HDMI em `/palco?evento=<id>`, com tempo gigante, pausa e atraso.
- Mensagens manuais (temporaria e permanente) e limpeza de mensagem no console de gestao. Mensagens programadas e automacoes de atraso/sequencia de blocos ainda nao existem.

## Decisoes confirmadas

| Decisao                                              | Motivo                                              | Consequencia                                                         |
| ---------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| O PC do palco hospeda tudo localmente                | O culto nao deve depender de internet               | Aplicacao, banco e tela HDMI rodam no mesmo PC                       |
| O PC fica cabeado ao roteador                        | Estabilidade para a tela de palco                   | Tablet e notebook usam o Wi-Fi local                                 |
| Roteador pode ficar sem internet                     | A rede e privada e local                            | Sem dependencia de servico externo durante o culto                   |
| Stack planejada: Next.js, TypeScript e SQLite        | Menor complexidade para um PC unico                 | Nao usar servidor Node separado, Postgres ou servico em nuvem no MVP |
| Estado de palco e persistido e versionado            | Comandos nao podem depender de uma mensagem efemera | Preview e tela HDMI recuperam o ultimo estado salvo                  |
| SSE local notifica mudancas, sem ser fonte de verdade | A notificacao pode cair ou reconectar                | Cada cliente busca o snapshot SQLite ao abrir e ao reconectar        |
| Hub SSE fica no processo Next unico                  | O MVP roda em um PC local                            | Nao executar varias instancias Next ate haver um barramento externo  |
| Preview usa o mesmo componente do palco              | O operador deve ver exatamente o que sera exibido   | Nao criar duas regras visuais de timer ou mensagem                   |
| MR18 e Gestao de Palco usam o mesmo roteador externo | Um PC deve controlar audio e palco sem internet     | PC e MR18 preferem Ethernet; tablet usa Wi-Fi privado                |

## Observacoes operacionais

- O monitor de palco usa HDMI e abre a rota de palco em tela cheia ou kiosk.
- A gestao pode ser usada no monitor principal do PC ou em tablet/notebook na mesma rede privada.
- O tablet acessa o IP privado do PC; `localhost` no tablet aponta para o proprio tablet.
- A tela de gestao devera mostrar conexao do palco, ultima confirmacao e versao do estado exibido.
- A aplicacao deve iniciar por atalho no Windows em uma fase posterior do roadmap.
- A Fase 1 aplicou a primeira migracao apenas no SQLite local de desenvolvimento, autorizada no plano da demanda.
- O Next iniciou em `http://127.0.0.1:3000` e respondeu `200` na validacao local.

## Fragilidades e riscos conhecidos

| Risco                              | Impacto                                                  | Mitigacao planejada                                               |
| ---------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| PC do palco e ponto unico de falha | O sistema para se o PC desligar ou falhar                | Backup do banco, atalho de inicializacao e roteiro de recuperacao |
| Roteador ou Wi-Fi falha            | Tablet perde controle remoto                             | PC e tela HDMI continuam; operador pode controlar pelo PC         |
| Estado local sem backup            | Historico e relatorios podem ser perdidos                | Backup seguro do SQLite e procedimento de restauracao             |
| Tela HDMI recarrega                | Exibicao pode ficar momentaneamente indisponivel         | Buscar ultimo estado persistido e confirmar sincronizacao         |
| Mais de um processo Next           | Clientes podem nao receber notificacoes entre processos  | Manter uma instancia local; evoluir a arquitetura antes de escalar |
| Comando equivocado no culto        | Mensagem ou bloco pode mudar no momento errado           | Confirmacoes para acoes sensiveis e preview permanente            |
| PC e MR18 em redes separadas       | Um operador nao controla os dois sistemas no mesmo lugar | Roteador externo centralizado e reservas DHCP                     |

## Melhorias futuras deliberadamente adiadas

- Modelos reutilizaveis de eventos.
- Usuarios com permissoes distintas, se um PIN local nao bastar.
- Relatorio estruturado alem de texto livre.
- Multiplas igrejas, equipes ou locais.
- Acesso remoto pela internet.
- Aplicativo mobile nativo.
- Integracao de codigo com a MR18; nesta fase ela apenas compartilha a rede local.

## Perguntas abertas

- O painel de gestao tera PIN unico local ou login por usuario?
- O nome do bloco aparecera sempre no palco ou apenas no preview?
- A mensagem de atraso tera texto fixo ou configuracao por evento?
- O relatorio precisa de campos estruturados alem de texto livre?
- Eventos futuros poderao nascer de modelos reutilizaveis?

## Evidencias da Fase 1

- `npm run db:generate` criou a migracao inicial com cinco tabelas.
- `npm run db:migrate` aplicou a migracao em `data/gestao-de-palco.db`.
- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passaram.
- O teste HTTP local confirmou resposta `200` e o texto da pagina de fundacao.

## Evidencias da Fase 2

- `npm run db:generate` criou `drizzle/0001_careless_roland_deschain.sql` para `stage_commands`.
- `npm run db:migrate` aplicou a migration autorizada no SQLite local.
- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passaram.
- Um cliente HTTP local abriu o stream SSE; apos o comando `start`, recebeu o mesmo snapshot persistido na versao `1`.

## Evidencias da Fase 3

- O painel permite criar evento, adicionar bloco e iniciar o bloco no estado sincronizado.
- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passaram.

## Evidencias da Fase 5 (mensagens manuais, 01/09/2026)

- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passaram.
- Verificacao visual automatizada com Playwright headless: criado evento e bloco de teste, iniciado o timer, enviada mensagem temporaria (confirmado que aparece gigante no preview e no palco e some sozinha apos 20s), enviada mensagem permanente com timer ativo (confirmado o dialogo de confirmacao e que a mensagem nao expira sozinha), limpeza de mensagem (confirmado retorno ao timer). Sem erros de console em nenhuma das duas telas; layout de 3 colunas do console preservado.

## Regra de manutencao

Antes de implementar, leia este documento e `docs/ROADMAP.md`. Ao concluir, atualize esta pagina quando o estado, a decisao, o risco ou a proxima etapa mudar. Atualize tambem o roadmap quando um item realmente for entregue e validado.
