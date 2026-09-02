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

## Ajuste pos-entrega: texto torto e botao ocupando a largura toda (01/09/2026)

O usuario testou e mandou print mostrando que o texto da mensagem no preview corrigiu o overflow, mas ficou desalinhado (deslocado para a esquerda, "torto") em vez de centralizado; e que o botao "Limpar palco" (na nova posicao, dentro do card do preview) ocupava a largura inteira do card.

Causas e correcoes em `src/app/globals.css`:

- **Texto torto**: `.stage-presentation, .stage-empty` usa `display:grid; place-content:center`, mas o `justify-self` de cada item por padrao e `stretch`. Como o texto da mensagem tem `max-width` menor que a largura total da coluna, ele ficava mais estreito que a area do grid, porem ainda alinhado ao inicio (esquerda) em vez de centralizado — sobrava espaco vazio so do lado direito. Corrigido adicionando `justify-self:center` em `.stage-presentation.stage-preview strong.stage-message-text`. (A tela de palco ja tinha esse `justify-self:center` numa regra generica de `strong`, por isso nunca teve esse problema.)
- **Botao ocupando tudo**: pelo mesmo motivo (`justify-self` padrao `stretch` num grid), o botao "Limpar palco" esticava para a largura toda do card. Corrigido com uma classe propria `.clear-stage-button { max-width:108.4px; justify-self:end; }` (valores exatos pedidos pelo usuario).

Validacao: `lint`, `typecheck`, `test:db` (8/8) e `build` passaram. Verificado com Playwright: diferenca entre o centro do texto e o centro da caixa preta = 0px (antes, deslocado); largura do botao = 108px (108.4 arredondado), alinhado a direita (borda direita do botao coincide com a borda direita util do card).

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada sobre a correcao do overflow no preview e o botao "Limpar palco" movido para o card do preview.
