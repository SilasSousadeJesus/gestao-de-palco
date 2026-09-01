# `mensagens-console-gestao` - record

## O que mudou

- `src/app/management-client.tsx`:
  - Novo estado `messageText` e funcoes `sendMessage(permanent)` e `clearMessage()`.
  - `sendMessage(false)` envia `show_message` com `durationSeconds: 20` (mensagem temporaria).
  - `sendMessage(true)` envia `show_message` sem `durationSeconds` (mensagem permanente); se `snapshot.mode !== "idle"` (timer ativo), pede confirmacao via `window.confirm` antes de enviar, conforme `docs/PRODUCT.md`.
  - `clearMessage()` envia `clear_message`.
  - Novo formulario no console ao vivo, logo apos os controles de pausar/retomar/limpar palco: campo de texto + botoes "Enviar temporaria (20s)", "Enviar permanente" e "Limpar mensagem".
- `src/app/globals.css`: classes novas e isoladas `.message-form` e `.message-actions` (com o botao "Limpar mensagem" em laranja, reutilizando a cor de alerta ja usada em `.connection-reconnecting`). Nenhuma regra existente foi alterada.

## Fora de escopo (nao alterado)

- Mensagens programadas relativas a inicio de evento/bloco.
- Aviso automatico de atraso a cada minuto de tempo negativo.
- Sequencia automatica de blocos com confirmacao.
- Nenhuma migration, schema ou dado local foi alterado; os comandos `show_message`/`clear_message` e os campos de mensagem no schema ja existiam.

## Evidencias de validacao

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test:db`: 5/5 testes passaram (nenhum teste novo era necessario; a logica de mensagem ja era coberta no dominio).
- `npm run build`: build de producao concluido com sucesso.
- **Verificacao visual em navegador (obrigatoria por `AGENTS.md`, dado que a Rodada 5 anterior quebrou o layout):** usei Playwright headless (instalado temporariamente com `npm install --no-save playwright`, depois removido com `npm uninstall --no-save playwright`; `package.json`/`package-lock.json` nao foram alterados) contra o servidor de desenvolvimento ja em execucao em `localhost:3000`. Fluxo automatizado:
  1. Criado evento de teste e bloco de 30 minutos; bloco iniciado.
  2. Abertas duas paginas: `/` (gestao) e `/palco?evento=<id>` (tela de palco).
  3. Enviada mensagem temporaria: apareceu gigante com rotulo "COMUNICADO" no preview e no palco; apos 22s (> 20s configurados) a mensagem sumiu sozinha e o timer voltou em ambas as telas (`stillMessage` count = 0).
  4. Enviada mensagem permanente com timer ativo: apareceu o dialogo `window.confirm` com o texto esperado; apos aceitar, a mensagem ficou visivel no preview e no palco e nao expirou sozinha apos 22s (`stillPermanent` count = 1).
  5. Clique em "Limpar mensagem": a mensagem sumiu imediatamente em ambas as telas (`clearedCount` = 0) e o timer voltou a ser exibido.
  6. Nenhum erro de console (`console --errors` equivalente via listener `page.on("console"/"pageerror")`) em nenhuma das duas paginas.
  7. Screenshots confirmam visualmente que a grade de 3 colunas do console (Eventos / Console / Preview) permanece intacta, o novo formulario de mensagem aparece de forma discreta abaixo dos controles existentes, e a tela de palco mostra a mensagem em tela cheia sem sobreposicao ou quebra de layout.

## Documentos ativos consultados

- `AGENTS.md`, `.sdd/EXECUTION-CONTRACT.md`, `.sdd/PROJECT-BRIEF.md`, `.sdd/MAP.md`.
- `docs/README.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md`.
- `.sdd/features/2026-09-01-corrige-bloqueios-rodada-5/RECORD.md` (bloqueios corrigidos imediatamente antes desta demanda).

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: registrada a entrega e validacao das mensagens manuais; atualizada a lista "O que ja existe" e a "Retomada obrigatoria da Rodada 5"; adicionada secao "Evidencias da Fase 5 (mensagens manuais)".
- `docs/ROADMAP.md`: marcado `[x]` em "Mensagens manuais, temporarias e permanentes"; atualizada a nota de estado da Fase 5.
- `.sdd/MAP.md`: atualizadas as "Dividas e armadilhas conhecidas" para refletir que mensagens manuais existem e o que ainda falta na Rodada 5.

## Observacao

A Rodada 5 continua parcial: mensagens manuais estao entregues e validadas, mas mensagens programadas, aviso automatico de atraso e sequencia automatica de blocos ainda nao foram implementados. Nenhum desses itens deve ser considerado entregue.

## Correcao pos-entrega: tamanho da fonte da mensagem (01/09/2026)

O usuario testou a mensagem temporaria manualmente no monitor de palco (fora do fluxo automatizado desta demanda) e encontrou um defeito real: o texto da mensagem usava a mesma regra de `font-size` do timer (`min(52vw,70vh)` na tela de palco e `clamp(3rem, 8vw, 7rem)` no preview), alem do `letter-spacing:-.13em` e `transform:scaleX(.72)` pensados para os digitos do relogio. Para uma frase como "Hora de terminar", isso produzia letras enormes e cortadas nas bordas da tela.

Correcao:

- `src/features/stage/stage-presentation.tsx`: o `<strong>` da mensagem passou a receber a classe `stage-message-text`, distinta do `<strong>` do timer.
- `src/app/globals.css`: adicionadas as regras `.stage-screen .stage-stage strong.stage-message-text` e `.stage-presentation strong.stage-message-text`, com `font-size` proprio (`clamp(1.8rem, 5vw, 5rem)` no palco e `clamp(1.1rem, 3.2vw, 2.75rem)` no preview), `letter-spacing:normal`, sem o `scaleX` do timer e `max-width:88%` para permitir quebra de linha confortavel. As regras do timer (`strong` sem essa classe) nao foram alteradas.

Validacao:

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram novamente.
- Nova verificacao visual com Playwright headless: reenviei a mesma mensagem "Hora de terminar" e uma frase mais longa ("Por favor, aguarde mais cinco minutos antes de continuar o culto"); ambas aparecem legiveis, centralizadas e dentro da tela no palco e no preview. Conferido tambem que o timer ("29:59"/"29:53") continua no tamanho gigante original, sem nenhuma mudanca visual.
- Nenhum erro de console nas duas paginas.

Esta correcao ainda nao foi commitada; os commits `c9a62ae` (correcao de bloqueios) e `10973a4` (mensagens no console) ja existem no historico local, criados fora desta sessao.

## Ajuste adicional: fonte da mensagem 30% maior (01/09/2026)

A pedido do usuario, apos validar a correcao acima, os tamanhos de `stage-message-text` foram aumentados em 30% (min, valor em vw e maximo do `clamp`), sem alterar nenhuma regra do timer:

- Palco: de `clamp(1.8rem, 5vw, 5rem)` para `clamp(2.3rem, 6.5vw, 6.5rem)`.
- Preview: de `clamp(1.1rem, 3.2vw, 2.75rem)` para `clamp(1.4rem, 4.2vw, 3.6rem)`.

Revalidado com `lint`, `typecheck`, `test:db` (5/5) e `build`, alem de nova verificacao visual com Playwright confirmando que o texto ficou visivelmente maior e ainda cabe na tela (mensagem curta e mensagem longa), e que o timer permanece identico ao anterior.

## Segundo ajuste: mais 30% de fonte e correcao de quebra de linha (01/09/2026)

O usuario testou no monitor real e relatou dois pontos: (1) pediu mais 30% de aumento na fonte da mensagem; (2) em mensagens longas, o texto se esticava numa unica linha horizontal em vez de quebrar normalmente para a linha de baixo.

Causa da quebra de linha: `max-width:88%` sozinho nao limita o comprimento da linha em telas muito largas — a 88% da largura de um monitor grande, uma frase inteira pode caber numa unica linha esticada de ponta a ponta, o que o usuario percebeu como "quebrando a tela" em vez de se comportar como um paragrafo normal.

Correcao aplicada em `src/app/globals.css` (`.stage-message-text` no palco e no preview):

- Fonte aumentada mais 30% (total de ~69% acima do valor original da primeira correcao): palco de `clamp(2.3rem, 6.5vw, 6.5rem)` para `clamp(3rem, 8.5vw, 8.5rem)`; preview de `clamp(1.4rem, 4.2vw, 3.6rem)` para `clamp(1.8rem, 5.5vw, 4.7rem)`.
- `max-width` trocado de `88%`/`88%` para `min(85%, 30ch)`/`min(88%, 30ch)`, limitando o comprimento da linha a cerca de 30 caracteres (a unidade `ch` acompanha o tamanho da fonte), forcando a quebra em varias linhas mesmo em monitores muito largos.
- Adicionado `white-space:normal`, `overflow-wrap:break-word` e `word-break:break-word` como reforco contra uma palavra isolada muito longa.
- Nenhuma regra do timer (`strong` sem a classe `.stage-message-text`) foi alterada.

Validacao:

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Verificacao visual com Playwright em viewport de 1920x1080 (simulando um monitor real, maior que o padrao de teste anterior): a mensagem curta ("Hora de terminar") e a longa ("Por favor, aguarde mais cinco minutos antes de continuar o culto") aparecem bem maiores, quebradas em multiplas linhas centralizadas, sem tocar as bordas.
- Checagem programatica via `getBoundingClientRect()` do elemento da mensagem confirmou `overflowsX: false` (o elemento ficou entre 199px e 1721px dentro de um viewport de 1920px de largura).
- Timer (`29:53`) permanece no mesmo tamanho e estilo de antes.

## Terceiro ajuste: limite de 50 caracteres na mensagem (01/09/2026)

A pedido do usuario, o campo de mensagem passou a aceitar no maximo 50 caracteres, em dois pontos:

- `src/app/management-client.tsx`: `maxLength={50}` no input do formulario de mensagem (impede digitar/colar alem do limite na interface).
- `src/app/api/events/[eventId]/stage/commands/route.ts`: `parseCommand` passou a rejeitar `message.length > 50` com `400 Comando de palco invalido`, seguindo o mesmo padrao ja usado para o limite de `commandId` (100 caracteres). Isso protege a API mesmo se chamada diretamente, fora da interface.

Validacao:

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Teste manual via `curl`: mensagem com 51 caracteres retornou `400`; mensagem com exatamente 50 caracteres foi aceita e aplicada ao estado de palco.

## Quarto ajuste: aviso ao atingir o limite de 50 caracteres (01/09/2026)

O atributo HTML `maxLength` sozinho bloqueia a digitacao silenciosamente, sem avisar o operador. A pedido do usuario, adicionei feedback visivel:

- `src/app/management-client.tsx`: novo estado `messageLimitHit` e funcao `onMessageTextChange`, que substitui o `maxLength` nativo do input. Ela trunca o valor para 50 caracteres (cobrindo tanto digitar alem do limite quanto colar um texto longo de uma vez) e liga `messageLimitHit` enquanto o valor exceder 50; volta a `false` assim que o texto fica dentro do limite ou a mensagem e enviada com sucesso.
- JSX: `<small className="message-limit-warning">Limite de 50 caracteres atingido.</small>` aparece logo abaixo do campo somente enquanto `messageLimitHit` for verdadeiro.
- `src/app/globals.css`: nova classe `.message-limit-warning` (cor de alerta laranja, mesma usada em `.message-actions button:last-child` e `.connection-reconnecting`).

Validacao:

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Verificacao com Playwright: digitar caractere a caractere alem de 50 trunca o campo em exatamente 50 e mostra o aviso; colar um texto longo de uma vez tambem trunca e mostra o aviso; apagar ate ficar com menos de 50 caracteres remove o aviso. Screenshot confirma o aviso aparecendo em laranja logo abaixo do campo, sem quebrar o layout do console.
