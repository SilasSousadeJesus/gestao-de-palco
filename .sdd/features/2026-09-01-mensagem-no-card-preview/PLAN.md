# `mensagem-no-card-preview` - plan

## Objetivo

Mover o input "Mensagem para o palco" e os botoes Temporaria/Permanente/Limpar do card "Evento Aberto" para o card "Preview ao vivo", ficando embaixo da caixa de preview, na mesma linha do botao "Limpar palco".

## Escopo

- `src/app/management-client.tsx`: o `<form className="message-form">` (input + aviso de limite + acoes) saiu de dentro do card "Evento Aberto" e passou para o card "Preview ao vivo", logo apos o `<StagePresentation />` e antes da linha "Versao X". O botao "Limpar palco" deixou de ser um elemento solto no card e passou a ser o 4o botao dentro de `.message-actions`, junto com Temporaria/Permanente/Limpar.
- `src/app/globals.css`:
  - O botao de limpar mensagem ganhou uma classe propria `.clear-message-button` (cor laranja), substituindo o seletor `:last-child` que dependia da posicao (agora "Limpar palco" e que fica por ultimo na linha).
  - `.clear-stage-button` trocou `justify-self:end` (fazia sentido como item solto de um grid) por `margin-left:auto` (o equivalente correto dentro do flex row de `.message-actions`), mantendo o mesmo efeito visual de ficar encostado a direita.

## Fora de escopo

- Qualquer mudanca de comportamento das mensagens ou do botao "Limpar palco" (so mudou a localizacao/agrupamento visual).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: confirmar que o input/botoes de mensagem nao existem mais dentro de `.console-panel` e existem dentro de `.preview-panel`; confirmar que os 4 botoes (Temporaria/Permanente/Limpar/Limpar palco) aparecem juntos na mesma linha; enviar e limpar uma mensagem a partir da nova localizacao para confirmar que continua funcionando.
