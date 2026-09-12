# `timer-pequeno-com-mensagem` - record

## O que mudou

- `src/features/stage/stage-presentation.tsx`: o ramo que renderiza uma mensagem ativa (`snapshot?.activeMessageContent`) passou a calcular `remaining` (tempo restante) quando ha um `block` e o palco nao esta `idle`, e renderiza `<strong className="stage-mini-timer">` com esse valor formatado, junto com o `<strong className="stage-message-text">` da mensagem e o rotulo "COMUNICADO". Quando nao ha timer aplicavel (ex.: nenhum bloco ativo), so a mensagem aparece, como antes.
- `src/app/globals.css`:
  - `position:relative` adicionado em `.stage-screen .stage-stage` e em `.stage-presentation, .stage-empty` (necessario para o `position:absolute` do mini-timer ancorar no container correto).
  - `.stage-mini-timer { position:absolute; top:0; left:0; margin:0; }` posiciona no canto superior esquerdo; por estar fora do fluxo normal, nao interfere na centralizacao do texto da mensagem (`place-content:center` continua funcionando so para os itens no fluxo).
  - Tamanho e estilo definidos separadamente para palco e preview (`.stage-screen .stage-stage strong.stage-mini-timer` e `.stage-presentation.stage-preview strong.stage-mini-timer`), cada um resetando `letter-spacing`/`transform`/`line-height` da regra generica de `strong` (que tem o "esmagamento" tipografico pensado so para o timer gigante) — mesmo padrao ja usado para `.stage-message-text`, para nao herdar por acidente um estilo pensado para outro contexto.
  - Cor de atraso (`is-late`) do mini-timer tambem definida por contexto: vermelho `#ff4d45` no palco, laranja `#ffbe70` no preview — as mesmas cores ja usadas para o timer grande atrasado, aplicadas so ao mini-timer (nao ao container inteiro, para nao colorir o texto da mensagem por engano).

## Fora de escopo (nao alterado)

- Duracao/confirmacao das mensagens temporaria/permanente.
- `docs/PRODUCT.md` nao precisou de correcao — ja descrevia esse comportamento ("mensagem aparece gigante e o timer fica pequeno"); so a implementacao estava desalinhada com o que o documento sempre disse.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual e funcional com Playwright, cobrindo preview e palco (HDMI) simultaneamente, com um bloco em andamento:
  - Antes de enviar mensagem: sem mini-timer, timer normal mostrando "29:58".
  - Durante mensagem temporaria: mini-timer visivel e contando ("29:57" no preview, "29:58" no palco no mesmo instante — pequena diferenca de origem da chamada, esperado), posicionado em `top:0, left:0` do container no palco (confirmado via `getBoundingClientRect()`); mensagem "Aviso rapido" continua gigante e centralizada.
  - Apos a mensagem temporaria expirar (>20s): mini-timer e mensagem somem, timer grande normal volta ("29:36" no preview, com nome do bloco "Louvor" e rotulo "TEMPO RESTANTE").
  - Mensagem permanente: mini-timer tambem aparece e nao desaparece sozinho.
  - Limpeza manual da mensagem: mini-timer e mensagem somem, mesma logica da expiracao.
  - Screenshots confirmam visualmente o mini-timer no canto superior esquerdo em ambas as telas, sem sobrepor ou distorcer o texto da mensagem.
  - Nenhum erro de console em nenhuma das duas paginas.

## Ajuste pos-entrega: posicao errada no palco e tamanho pequeno demais (01/09/2026)

O usuario testou de verdade e mandou print mostrando que, no palco, o mini-timer aparecia centralizado no topo (nao no canto esquerdo), e que em ambas as telas ele ficava muito pequeno.

**Causa da posicao errada (so no palco):** existe uma regra generica e mais antiga, `.stage-screen .stage-stage strong { justify-self:center; width:100%; text-align:center; ... }`, criada para o timer gigante. Como o mini-timer tambem e um `<strong>` dentro do mesmo container, ele herdava `width:100%` e `text-align:center` dessa regra (maior especificidade que a regra generica `.stage-mini-timer`) — a caixa do mini-timer ficava esticada de ponta a ponta (embora com fundo transparente, invisivel) e o texto centralizado dentro dela, dando a impressao de estar no meio da tela em vez do canto.

**Licao sobre a verificacao anterior:** a checagem automatizada da entrega original mediu `getBoundingClientRect()` do proprio elemento e confirmou `left:0`, o que e verdade — a CAIXA comecava em `x=0`. Mas a caixa tinha `width:100%` e o texto centralizado dentro dela, entao o texto visivel nao ficava no canto. Medir a posicao da caixa nao foi suficiente; o teste deveria ter conferido tambem `text-align`/`width` computados, ou a posicao do texto renderizado, nao so a borda do elemento.

Correcao em `src/app/globals.css`:

- `.stage-screen .stage-stage strong.stage-mini-timer` e `.stage-presentation.stage-preview strong.stage-mini-timer` ganharam `width:auto; text-align:left; justify-self:start;` explicitos, com especificidade suficiente para vencer a regra generica do timer gigante.
- Tamanho aumentado nos dois contextos: palco de `clamp(1.5rem, 4vw, 3.5rem)` para `clamp(2rem, 5vw, 4.5rem)`; preview de `1.1rem` para `1.6rem`.

Validacao: `lint`, `typecheck`, `test:db` (8/8) e `build` passaram. Verificado com Playwright: no palco, `boxLeft` e `miniLeft` iguais (0px) e `miniWidth` de apenas 195px (nao mais 100% da tela), `text-align:left` computado — confirma que agora e a caixa E o texto que ficam no canto, nao so a caixa. Screenshot confirma visualmente o mini-timer firme no canto superior esquerdo em ambas as telas, maior e legivel.

## Documentos ativos consultados

- `docs/PRODUCT.md`, `docs/PROJECT-STATE.md`, `.sdd/knowledge/design-system.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: nota adicionada informando que a apresentacao de mensagem com timer pequeno agora corresponde ao que `docs/PRODUCT.md` ja descrevia.
- `.sdd/knowledge/design-system.md`: adicionada a licao sobre nao usar seletores genericos compartilhados quando palco e preview tem escalas de tela muito diferentes (o mesmo padrao ja registrado para `.stage-message-text`, agora reforcado com o mini-timer).
