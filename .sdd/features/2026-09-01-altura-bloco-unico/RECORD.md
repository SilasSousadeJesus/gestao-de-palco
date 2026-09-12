# `altura-bloco-unico` - record

## O que mudou

- **Causa raiz**: `.blocks` e `.event-list` sao listas `display:grid` dentro de uma area rolavel (`flex:1; min-height:0; overflow-y:auto`). Sem `align-content:start`, o valor padrao (`align-content:normal`) se comporta como `stretch` quando ha espaco livre no eixo de bloco — com poucas linhas (ou uma so), quase todo o espaco livre do card era distribuido para essa(s) linha(s), esticando o item (exatamente o bug do print: 1 bloco tomando o card inteiro).
- `src/app/globals.css`: `align-content:start` adicionado em `.blocks` e `.event-list` — cada linha agora fica do tamanho natural do conteudo, empilhada a partir do topo, com o espaco sobrando em branco abaixo (ou disponivel para rolagem quando o conteudo excede o card).
- `.sdd/knowledge/design-system.md`:
  - Reforcada a regra de altura padrao: 2.5rem sempre para `input`/`button` novos, com excecao apenas quando o usuario pedir explicitamente outra medida para um controle especifico (os icones de acao `1.9rem` continuam sendo a excecao ja documentada e deliberada).
  - Nova armadilha documentada: listas em grid com poucos itens exigem `align-content:start` para nao esticar.

## Fora de escopo (nao alterado)

- A altura padrao em si (2.5rem continua sendo o valor).

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Verificacao visual com Playwright:
  - Evento criado com 1 bloco so ("ASDADAS", mesmo cenario do print): altura da linha medida em 57px (tamanho natural de conteudo — titulo + duracao + padding — nao mais esticada para preencher o card).
  - Adicionados mais 3 blocos: todas as 4 linhas mantiveram 57px de altura, empilhadas a partir do topo.
  - Screenshot confirma visualmente: bloco unico compacto no topo do card, resto do espaco em branco (sem esticar).

## Documentos ativos consultados

- `.sdd/knowledge/design-system.md`.

## Documentos ativos atualizados

- `.sdd/knowledge/design-system.md`: regra de altura reforcada e nova armadilha documentada.
- `docs/PROJECT-STATE.md`: nota adicionada sobre a correcao.
