# `preview-overflow-e-limpar-palco` - record

## O que mudou

**Correcao do overflow no preview**

- Causa raiz: `.stage-presentation strong.stage-message-text` usava `font-size:clamp(1.8rem, 5.5vw, 4.7rem)` — a unidade `vw` e relativa a largura do VIEWPORT inteiro, nao a largura do card do preview. Desde que o preview passou a ter largura fixa de 606.55px (demanda anterior), essa conta gerava uma fonte proxima do maximo (perto de 4.7rem/75px) para uma caixa bem mais estreita. Sem `min-width:0` no container, o grid interno crescia para acomodar o texto sem quebrar linha, e o `overflow:hidden` do card cortava o excesso — exatamente o efeito visto no print (letras cortadas na borda direita).
- `src/app/globals.css`: a regra foi reescopada para `.stage-presentation.stage-preview strong.stage-message-text` (antes valia para `.stage-presentation` de forma generica, o que so nao quebrava o palco porque a regra do palco, `.stage-screen .stage-stage strong.stage-message-text`, e mais especifica e sempre vencia la). `font-size` trocado do `clamp` baseado em `vw` para um valor fixo `2.2rem`, calibrado para a largura conhecida do card. Adicionado `min-width:0` em `.stage-presentation.stage-preview` e no texto da mensagem, para o texto quebrar linha corretamente dentro da caixa em vez de forcar a coluna a crescer.
- **A regra do palco (`.stage-screen .stage-stage strong.stage-message-text`) nao foi tocada.**

**"Limpar palco" movido para o card do preview**

- `src/app/management-client.tsx`: o botao saiu do card "Evento Aberto" (estava sozinho dentro de `.live-controls`, que foi removido) e passou para o card "Preview ao vivo", logo abaixo da caixa de preview, acima da linha "Versao X · conectado". Continua condicionado a ter um evento aberto (`{active && <button>...}`).
- `src/app/globals.css`: regra `.live-controls` removida (sem uso apos a mudanca).

## Fora de escopo (nao alterado)

- Tela de palco (HDMI): nenhuma regra do palco foi alterada, testado explicitamente para confirmar.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright (gestao em 1500x1000, palco em 1920x1080), enviando uma mensagem de 50 caracteres:
  - No preview: `getBoundingClientRect()` do texto da mensagem confirmou `overflowsRight: false` e `overflowsLeft: false` (texto totalmente dentro do card); `font-size` computado = 35.2px (= 2.2rem, o valor fixo esperado).
  - No palco: `font-size` computado do mesmo tipo de mensagem = 136px, exatamente o comportamento anterior (baseado em `clamp(3rem, 8.5vw, 8.5rem)`), confirmando que a tela de palco nao mudou.
  - Confirmado por contagem: 0 ocorrencias de "Limpar palco" dentro de `.console-panel`, 1 dentro de `.preview-panel`.
  - Screenshot confirma visualmente: preview com a mensagem de 50 "a"s quebrada em 2 linhas legiveis dentro da caixa, botao "Limpar palco" logo abaixo; palco com a mesma mensagem em fonte gigante, identica ao comportamento anterior.
  - Nenhum erro de console em nenhuma das duas paginas.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada sobre a correcao do overflow no preview e o botao "Limpar palco" movido para o card do preview.
