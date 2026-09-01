# `stage-state-sync` - plan

## Problema

Gestao, preview e monitor de palco precisam representar o mesmo estado mesmo apos recarga da pagina. A fundacao local possui a tabela de estado, mas nao possui comandos confiaveis nem notificacao entre clientes.

## Escopo

- **Dentro:** snapshot persistido e versionado, comandos `start`, `pause`, `resume` e `clear`, idempotencia, API local, SSE, reconexao, pagina de diagnostico, testes e atualizacao da documentacao viva.
- **Fora:** telas finais de gestao e palco, eventos em interface, blocos de tempo, mensagens, acesso LAN, PIN/login e automacoes.
- **Autorizacao:** criar e aplicar uma migration SQLite local para `stage_commands`, usada para registrar comandos idempotentes. Nenhum banco remoto sera acessado.

## Decisoes

- SQLite continua como fonte de verdade; SSE apenas entrega a notificacao de mudanca.
- O hub de eventos fica em memoria e exige um unico processo Next, compativel com o PC local do palco.
- O cliente sempre busca o snapshot ao abrir e ao reconectar, evitando confiar somente na conexao SSE.
- A pagina `/sync-lab` e diagnostico temporario, nao substitui o console da Fase 3.

## Validacao

- Gerar e aplicar migration local autorizada.
- Executar lint, tipagem, teste de banco e build.
- Abrir `/sync-lab` em duas janelas e validar atualizacao sem recarga e recuperacao apos recarregar uma delas.
