# `mensagem-no-card-preview` - record

## O que mudou

- `src/app/management-client.tsx`: o formulario de mensagem (`input` "Mensagem para o palco", aviso de limite de 50 caracteres, e os botoes Temporaria/Permanente/Limpar) saiu do card "Evento Aberto" e passou para o card "Preview ao vivo", posicionado logo abaixo da caixa de preview. O botao "Limpar palco" deixou de ser um elemento isolado no card e virou o 4o botao dentro da mesma linha de acoes (`.message-actions`), ao lado de Temporaria/Permanente/Limpar.
- `src/app/globals.css`:
  - Novo seletor `.clear-message-button` (cor laranja `#9e5016`) para o botao de limpar mensagem, substituindo `.message-actions button:last-child` — necessario porque agora "Limpar palco" e que ocupa a ultima posicao da linha, entao o seletor por posicao apontaria para o botao errado.
  - `.clear-stage-button` trocou `justify-self:end` por `margin-left:auto`, ja que o botao deixou de ser um item de grid solto e passou a ser um item de um flex row (`.message-actions`); o efeito visual (encostado a direita da linha) foi preservado.

## Fora de escopo (nao alterado)

- Comportamento de envio/limpeza de mensagem e do "Limpar palco" — só a localizacao e o agrupamento visual mudaram.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright (viewport 1500x1050):
  - Confirmado que `.console-panel input[placeholder="Mensagem para o palco"]` nao existe mais e `.preview-panel input[placeholder="Mensagem para o palco"]` existe.
  - Confirmado que `.message-actions` (dentro do preview) tem 4 botoes na ordem: Temporaria, Permanente, Limpar, Limpar palco.
  - Enviada uma mensagem temporaria a partir da nova localizacao (apareceu "COMUNICADO" corretamente, texto centralizado, sem overflow — validacao da demanda anterior continua valendo); limpa a mensagem pelo botao `.clear-message-button` e confirmado que ela sumiu.
  - Screenshot confirma visualmente: input e os 4 botoes logo abaixo da caixa de preview, "Limpar palco" alinhado a direita da mesma linha dos outros 3.
  - Nenhum erro de console.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota atualizada informando que o formulario de mensagem agora mora no card "Preview ao vivo", junto com "Limpar palco".
