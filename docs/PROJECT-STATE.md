# Estado vivo do projeto

> Atualize este documento ao concluir uma demanda, tomar uma decisao relevante, descobrir uma fragilidade ou mudar a proxima etapa autorizada. Ele registra estado e contexto; nao substitui o contrato, o produto ou as regras de seguranca.

## Leitura rapida

| Campo                     | Estado atual                                                |
| ------------------------- | ----------------------------------------------------------- |
| Ultima atualizacao        | 01/09/2026                                                  |
| Fase atual                | Fase 1 - Fundacao local concluida                           |
| Software de produto       | Fundacao Next.js e SQLite implementada; recursos ainda nao  |
| Proxima etapa proposta    | Fase 2 - Estado de palco e sincronia                        |
| Proxima escrita de codigo | Exige demanda, plano aprovado e leitura documental completa |

## O que ja existe

- Configuracao de IA em `AGENTS.md` e `.sdd/`.
- Visao de produto e descricao das telas em `docs/PRODUCT.md`.
- Plano de operacao local em `docs/LOCAL-OPERATION.md`.
- Checklist e roadmap em `docs/ROADMAP.md`.
- Aplicacao Next.js 16 com TypeScript e pagina inicial em `src/app/`.
- Schema Drizzle e primeira migracao SQLite para evento, bloco, mensagem, estado de palco e relatorio.
- Banco local aplicado em `data/gestao-de-palco.db`; o arquivo e ignorado pelo Git.
- Comandos de lint, tipagem, teste de migracao, build e desenvolvimento documentados no `README.md`.
- Ainda nao existem eventos funcionais, timers, preview, tela HDMI, mensagens ou sincronizacao ao vivo.

## Decisoes confirmadas

| Decisao                                              | Motivo                                              | Consequencia                                                         |
| ---------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| O PC do palco hospeda tudo localmente                | O culto nao deve depender de internet               | Aplicacao, banco e tela HDMI rodam no mesmo PC                       |
| O PC fica cabeado ao roteador                        | Estabilidade para a tela de palco                   | Tablet e notebook usam o Wi-Fi local                                 |
| Roteador pode ficar sem internet                     | A rede e privada e local                            | Sem dependencia de servico externo durante o culto                   |
| Stack planejada: Next.js, TypeScript e SQLite        | Menor complexidade para um PC unico                 | Nao usar servidor Node separado, Postgres ou servico em nuvem no MVP |
| Estado de palco e persistido e versionado            | Comandos nao podem depender de uma mensagem efemera | Preview e tela HDMI recuperam o ultimo estado salvo                  |
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

## Regra de manutencao

Antes de implementar, leia este documento e `docs/ROADMAP.md`. Ao concluir, atualize esta pagina quando o estado, a decisao, o risco ou a proxima etapa mudar. Atualize tambem o roadmap quando um item realmente for entregue e validado.
