# `crud-eventos-blocos` - plan

## Objetivo

Completar pendencias da Fase 3 do roadmap: permitir editar e excluir eventos, e editar e excluir blocos de tempo (timers), com confirmacao antes de acoes destrutivas.

## Escopo

**Backend**

- `src/features/events/event-service.ts`: `updateEventTitle(database, eventId, title)`, `deleteEvent(database, eventId)`, `updateBlock(database, eventId, blockId, input)`.
- `src/app/api/events/[eventId]/route.ts`: `PATCH` passa a aceitar `title` de forma independente de `status`; novo handler `DELETE`.
- `src/app/api/events/[eventId]/blocks/[blockId]/route.ts`: novo handler `PATCH`.

**Frontend (`src/app/management-client.tsx`)**

- Lista de eventos: icone de edicao (renomear inline) e icone de exclusao (com `confirm()`) por evento. `.event-list` ganha `max-height`/`overflow-y:auto` para rolagem automatica acima de 5 eventos.
- Lista de blocos: botao "Iniciar" substituido por icone de start/stop por bloco (start dispara `command("start", blockId)`; stop, visivel so no bloco ativo, dispara `command("clear")`). Icones de edicao (nome + duracao, inline) e exclusao (com `confirm()`) por bloco.
- Remocao dos botoes globais "Pausar"/"Retomar" de `.live-controls`; "Limpar palco" permanece.
- Novo CSS para os icones e para as linhas em modo de edicao, aditivo (sem alterar regras existentes fora do necessario para a reestruturacao da lista de eventos/blocos).

## Fora de escopo

- Reordenar blocos (drag-and-drop).
- Fechar/reabrir evento por status.
- Mensagens programadas, aviso automatico de atraso, sequencia automatica de blocos.
- Qualquer migration nova (a exclusao usa cascade ja existente no schema).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual em navegador (Playwright): criar evento, editar nome, criar blocos, editar bloco (nome e duracao), iniciar/parar bloco pelo icone, excluir bloco, excluir evento (confirmando cascata via API retornando 404 depois), lista de eventos com 6+ itens mostrando rolagem.

## Riscos

- Exclusao e permanente (sem soft-delete); mitigado com `confirm()` explicito antes de excluir evento ou bloco.
- Excluir o evento aberto no monitor de palco faz a tela HDMI passar a receber 404 no estado — comportamento ja existente do sistema para evento inexistente, nao e uma regressao desta demanda.
