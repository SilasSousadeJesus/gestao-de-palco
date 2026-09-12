# `altura-bloco-unico` - plan

## Objetivo

Corrigir bug reportado com print: quando um evento tem so 1 bloco (ou 1 evento na lista), a linha desse item se estica para ocupar toda a altura livre do card, em vez de ficar do tamanho natural do conteudo. Reforcar no design system que controles novos sempre nascem com a altura padrao, a nao ser que o usuario peca explicitamente outra medida.

## Diagnostico

`.blocks` e `.event-list` sao `display:grid` dentro de um container `flex:1` (area rolavel de altura variavel). Sem `align-content:start`, o comportamento padrao do grid (`align-content:normal`, que se comporta como `stretch` quando sobra espaco) distribui o espaco livre entre as linhas existentes — com poucas linhas (ou uma so), quase todo o espaco livre vai para essa(s) linha(s), esticando o item.

## Escopo

- `src/app/globals.css`: `align-content:start` adicionado em `.blocks` e `.event-list`.
- `.sdd/knowledge/design-system.md`: reforcada a redacao da regra de altura padrao (2.5rem sempre, exceto pedido explicito do usuario); nova armadilha documentada sobre `align-content:start` em listas de grid com poucos itens.

## Fora de escopo

- Qualquer mudanca na altura padrao em si.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: criar um evento com um unico bloco e medir a altura da linha (deve ficar compacta, nao esticada); adicionar mais blocos e confirmar que continuam compactos e empilhados a partir do topo.
