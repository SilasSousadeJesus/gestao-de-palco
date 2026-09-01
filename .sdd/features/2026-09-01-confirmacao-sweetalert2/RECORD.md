# `confirmacao-sweetalert2` - record

## O que mudou

- `package.json`/`package-lock.json`: adicionada a dependencia `sweetalert2` (`^11.26.25`).
- `src/lib/confirm-dialog.ts` (novo): exporta `confirmDelete({ title, text?, confirmButtonText? })`, um wrapper reutilizavel de `Swal.fire` com icone de aviso, botao de confirmar em terracota (`#9e5016`) e cancelar em azul-marinho (`#102e38`), coerente com a paleta ja usada no app (mesma cor do botao "Limpar mensagem"). Importa o CSS do SweetAlert2 uma unica vez.
- `src/app/management-client.tsx`: `removeEvent` e `removeBlock` passaram a usar `await confirmDelete(...)` em vez de `window.confirm(...)`.

## Fora de escopo (nao alterado)

- O `confirm()` nativo da mensagem permanente com timer ativo permanece — nao e uma exclusao.
- Nenhuma migration, schema ou dado alterado.

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (5/5) e `npm run build` passaram.
- Verificacao visual com Playwright: excluir bloco e clicar "Cancelar" no dialogo — bloco permanece; excluir bloco de novo e clicar "Excluir" — bloco e removido; excluir evento e confirmar — evento e removido e o console volta ao estado vazio. Titulo e texto do dialogo conferidos (`Excluir o bloco "Bloco X"?` e `Excluir o evento "..."?` com o aviso de cascata). Nenhum erro de console.
- Confirmado visualmente (apos aguardar a animacao de entrada de 0.3s do SweetAlert2) que o dialogo usa as cores do app: icone de aviso laranja, botao "Cancelar" azul-marinho, botao "Excluir" terracota.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`.

## Documentos ativos atualizados

- Nenhum documento ativo precisou de atualizacao de conteudo alem deste registro: a funcionalidade de exclusao ja estava documentada como entregue em `docs/PROJECT-STATE.md`/`docs/ROADMAP.md` pela demanda `2026-09-01-crud-eventos-blocos`; esta demanda apenas troca a implementacao do dialogo de confirmacao, sem mudar o comportamento observavel pelo usuario (ainda pede confirmacao antes de excluir).
