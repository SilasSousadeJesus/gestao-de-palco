# `mensagens-console-gestao` - plan

## Objetivo

Implementar no console de gestao os controles de mensagem manual (temporaria, permanente e limpeza) que hoje nao existem, usando os comandos `show_message`/`clear_message` ja implementados e testados no dominio de palco.

## Escopo

- `src/app/management-client.tsx`: adicionar formulario de mensagem no console ao vivo com:
  - campo de texto para o conteudo da mensagem;
  - botao "Enviar temporaria (20s)" -> comando `show_message` com `durationSeconds: 20`;
  - botao "Enviar permanente" -> comando `show_message` sem `durationSeconds`; se `snapshot.mode !== "idle"` (timer ativo), pedir confirmacao via `window.confirm` antes de enviar, conforme `docs/PRODUCT.md`;
  - botao "Limpar mensagem" -> comando `clear_message`.
- `src/app/globals.css`: adicionar classes novas e isoladas para o formulario de mensagem, sem alterar regras existentes.
- Atualizar `docs/PROJECT-STATE.md`, `docs/ROADMAP.md` (marcar "Mensagens manuais, temporarias e permanentes" quando validado) e `.sdd/MAP.md`.
- Registrar evidencia no `RECORD.md`.

## Fora de escopo

- Mensagens programadas relativas a inicio de evento/bloco.
- Aviso automatico de atraso a cada minuto de tempo negativo.
- Sequencia automatica de blocos com confirmacao.
- Qualquer migration, mudanca de schema ou dado local.

## Validacao

- `npm run lint`
- `npm run typecheck`
- `npm run test:db`
- `npm run build`
- Verificacao visual manual: `npm run dev`, abrir `/` e `/palco?evento=<id>` em duas janelas; confirmar mensagem temporaria (some em 20s), mensagem permanente (permanece ate limpar), confirmacao ao definir permanente com timer ativo, e ausencia de quebra de layout no console e no preview.

## Riscos

- Medio: primeira mudanca de UI desde a quebra de layout que motivou a reconciliacao documental. Mitigacao: CSS aditivo, sem tocar seletores existentes, e validacao visual obrigatoria antes de fechar a demanda.
