# `preview-overflow-e-limpar-palco` - plan

## Objetivo

Corrigir bug reportado com print: mensagem de 50 caracteres estourava a caixa do preview (letras cortadas na borda), enquanto no palco (HDMI) ficava correta. Mover o botao "Limpar palco" para dentro do card "Preview ao vivo", embaixo da caixa de preview.

## Diagnostico

O preview agora fica numa coluna de largura fixa (606.55px), mas o `font-size` da mensagem no preview ainda usava `vw` (unidade relativa ao viewport inteiro, nao a largura do card). Em telas largas, isso calculava uma fonte quase no maximo (~4.7rem) para uma caixa estreita. Alem disso, o grid interno do preview nao tinha `min-width:0`, entao o texto forcava a coluna a crescer pelo tamanho maximo do conteudo (sem quebrar linha) e a caixa cortava (`overflow:hidden`) o excesso — daí as letras cortadas na borda do print.

## Escopo

- `src/app/globals.css`:
  - Regra da fonte da mensagem no preview reescopada especificamente para `.stage-presentation.stage-preview` (nao mexe na regra do palco, que já tem seletor proprio e mais especifico `.stage-screen .stage-stage`).
  - `font-size` do preview trocado de `clamp(1.8rem, 5.5vw, 4.7rem)` (dependia do viewport) para um valor fixo `2.2rem`, calibrado para a largura fixa de 606.55px.
  - `min-width:0` adicionado no container do preview e no texto da mensagem, para o texto realmente quebrar linha dentro da caixa em vez de forcar a coluna a crescer.
- `src/app/management-client.tsx`: botao "Limpar palco" removido do card "Evento Aberto" (`.live-controls`, que ficou vazio e foi removido) e adicionado no card "Preview ao vivo", logo abaixo da caixa de preview.
- `src/app/globals.css`: regra `.live-controls` removida (ficou sem uso).

## Fora de escopo

- Qualquer mudanca na tela de palco (HDMI) — o pedido foi explicito para nao mexer la.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: enviar mensagem de 50 caracteres e conferir, via `getBoundingClientRect()`, que o texto do preview nao ultrapassa os limites do card; conferir que a fonte do palco continua no tamanho grande de sempre (nao mudou); conferir que "Limpar palco" sumiu do card "Evento Aberto" e aparece no card "Preview ao vivo".
