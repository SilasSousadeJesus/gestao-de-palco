# `crud-eventos-blocos` - record

## O que mudou

**Backend**

- `src/features/events/event-service.ts`: novas funcoes `updateEventTitle`, `deleteEvent` e `updateBlock`.
- `src/app/api/events/[eventId]/route.ts`: `PATCH` passou a aceitar `title` independentemente de `status` (antes so aceitava `status`); novo handler `DELETE` (usa o `onDelete: cascade` ja existente no schema para apagar blocos, estado de palco, comandos, mensagens e relatorio do evento).
- `src/app/api/events/[eventId]/blocks/[blockId]/route.ts`: novo handler `PATCH` para editar titulo e/ou duracao de um bloco.

**Frontend (`src/app/management-client.tsx`, reescrito com formatacao normal em vez da linha unica anterior, mesmo comportamento preservado)**

- Lista de eventos: cada linha ganhou icone ✎ (edicao inline do nome, formulario substitui a linha) e icone 🗑 (exclusao com `confirm()` explicando que blocos/timers/mensagens serao apagados). `.event-list` ganhou `max-height:22rem; overflow-y:auto`, entao a rolagem aparece sozinha quando ha mais eventos do que cabem (~5) sem JS adicional.
- Lista de blocos: botao "Iniciar" substituido por icone ▶ (inicia o bloco) / ■ (aparece so no bloco ativo, chama o comando `clear` ja existente no dominio). Cada bloco ganhou tambem icone ✎ (edicao inline de nome e duracao) e 🗑 (exclusao com `confirm()`, usa o endpoint `DELETE` que ja existia).
- Removidos os botoes globais "Pausar" e "Retomar" de `.live-controls`; "Limpar palco" permanece no mesmo lugar.
- `command()` teve o tipo restringido a `"start" | "clear"` (os unicos tipos ainda disparados pela interface).
- `src/app/globals.css`: novas classes `.event-row`, `.event-select`, `.event-row-actions`, `.event-edit-form`, `.block-actions`, `.block-edit-form`, `.icon-button`; regras existentes (`.event-list button` -> `.event-select`, `.event-list button.selected` -> `.event-row.selected .event-select`) foram adaptadas para a nova estrutura em vez de removidas.

**Correcao incidental**

- `clock` (usado para calcular "Tempo Decorrido") comecava em `0` em vez da hora real, causando `-1:-1:-1` no primeiro instante apos iniciar um bloco, antes do primeiro tick do `setInterval`. Corrigido inicializando o estado com `Date.now()`. Bug pre-existente, encontrado durante a verificacao visual desta demanda, nao relacionado ao CRUD em si.

## Fora de escopo (nao alterado)

- Reordenar blocos (drag-and-drop).
- Fechar/reabrir evento por status (`updateEventStatus` continua existindo e sem uso na interface, como antes).
- Mensagens programadas, aviso automatico de atraso, sequencia automatica de blocos.
- Nenhuma migration nova.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Verificacao visual e funcional completa com Playwright headless (instalado e removido com `npm install/uninstall --no-save playwright`; `package.json`/`package-lock.json` inalterados):
  1. Criado evento, renomeado via icone de edicao (formulario inline funcionou, titulo atualizado na tela).
  2. Criados dois blocos; um deles editado (nome e duracao) via icone de edicao — duracao exibida corretamente como "12 min" apos salvar.
  3. Bloco iniciado pelo icone ▶; icone mudou para ■ no bloco ativo. Confirmado que os botoes "Pausar"/"Retomar" nao existem mais (contagem 0) e que "Limpar palco" continua presente (contagem 1).
  4. Bloco parado pelo icone ■; voltou a mostrar ▶.
  5. Bloco excluido pelo icone 🗑 apos confirmar no dialogo; removido da lista.
  6. Evento excluido pelo icone 🗑 apos confirmar no dialogo (texto do dialogo conferido); console voltou ao estado "Crie ou selecione um evento"; requisicao `GET /api/events/<id>` retornou `404`, confirmando que a exclusao (e a cascata) realmente aconteceu no banco.
  7. Lista de eventos com 11 itens: `scrollHeight` (996px) maior que `clientHeight` (352px) — rolagem ativa, mostrando cerca de 5 eventos antes de precisar rolar.
  8. "Tempo Decorrido" exibiu `00:00:00` corretamente apos iniciar um bloco (antes da correcao, mostrava `-1:-1:-1` no instante inicial).
  9. Nenhum erro de console durante todo o fluxo.

## Ajuste visual pos-entrega: icones minimalistas e cartao unificado (01/09/2026)

O usuario testou e reportou dois problemas visuais nos icones da listagem de eventos: (1) os icones de editar/excluir usavam emojis/caracteres Unicode (✎🗑) em botoes quadrados grandes e coloridos (azul-marinho solido e laranja solido), destoando do resto da interface; (2) esses botoes ficavam como elementos separados ao lado do cartao branco do evento, em vez de dentro do mesmo cartao, como acontece nos blocos.

Correcao em `src/app/management-client.tsx` e `src/app/globals.css`:

- Substituidos todos os icones (editar, excluir, iniciar, parar, salvar, cancelar) por SVGs inline minimalistas (`stroke`/`fill` em `currentColor`, 15x15), em vez de emoji/Unicode.
- `.icon-button` deixou de ser um botao solido colorido: agora e "ghost" (fundo transparente, icone em cinza-azulado neutro `#5b7278`, fundo sutil so no hover). O icone de excluir usa `.icon-delete` (cor terracota `#a8623a`, mais escura no hover), sem depender de `:last-child`.
- `.event-row` passou a ser o proprio cartao (borda, padding, fundo branco, raio), igual a `.blocks article` — o botao de selecionar evento (`.event-select`) e os icones de acao ficam juntos, dentro do mesmo cartao, em vez do botao ficar num cartao separado ao lado de botoes soltos.

Validacao:

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Reexecutado o mesmo roteiro de verificacao funcional (renomear, editar bloco, iniciar/parar por icone, excluir bloco, excluir evento com cascata, rolagem) — todos os resultados identicos aos da primeira rodada, sem regressao.
- Nova captura de tela confirma visualmente: cartoes de evento e bloco com a mesma aparencia (icones pequenos e discretos dentro do cartao), sem os quadrados coloridos anteriores.

## Documentos ativos consultados

- `AGENTS.md`, `.sdd/EXECUTION-CONTRACT.md`, `.sdd/PROJECT-BRIEF.md`, `.sdd/MAP.md`.
- `docs/README.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md`.

## Documentos ativos atualizados

- `docs/PROJECT-STATE.md`: registrada a entrega de edicao/exclusao de eventos e blocos, e a correcao do bug do relogio.
- `docs/ROADMAP.md`: Fase 3 atualizada — edicao de blocos deixa de ser pendencia (reordenacao continua pendente); marcado que eventos agora podem ser editados e excluidos.
- `.sdd/MAP.md`: nenhuma mudanca de arquitetura ou risco novo além do que ja estava registrado; nenhuma atualizacao necessaria alem da tabela de modulos, que continua correta.
