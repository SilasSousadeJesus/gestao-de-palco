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
