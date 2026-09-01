# `events-management-console` - plan

## Escopo

- Criar painel de gestao, eventos, blocos de tempo, controles ao vivo e preview 16:9.
- Reutilizar o estado versionado e o SSE da Fase 2.
- Nao criar migration: as tabelas existentes comportam esta rodada.
- Adiar tela HDMI final, mensagens, sequencia automatica, relatorio e acesso LAN.

## Validacao

- Executar lint, tipagem, testes de banco e build.
- Criar evento e bloco localmente, iniciar o bloco e confirmar o snapshot ativo.

## Riscos

- O preview e a primeira implementacao compartilhada do palco; a tela HDMI em tela cheia e o tratamento visual completo pertencem a Fase 4.
- O timer deriva de `startedAt`; o banco e o snapshot continuam sendo a fonte de verdade.
