# `padronizar-altura-controles` - record

## O que mudou

- **Causa raiz identificada**: medido via Playwright antes da correcao — "Criar evento" tinha 40px de altura (correto), mas "Nome do bloco", o input de duracao, "Adicionar bloco" e "Limpar palco" tinham todos 58px. O motivo: "Adicionar bloco" e "Limpar palco" quebravam o texto em 2 linhas (por estarem em colunas/max-width estreitos demais), e como esses botoes dividem a mesma linha de grid dos inputs vizinhos, a altura maior do botao quebrado esticava tambem os inputs (comportamento padrao de `display:grid`/`display:flex`: todos os itens de uma linha ficam do tamanho do maior item).
- `src/app/globals.css`:
  - `button { ...; white-space:nowrap; }` — regra global, texto de botao nunca mais quebra linha em lugar nenhum do app.
  - `.clear-stage-button` perdeu o `max-width:108.4px` que causava a quebra; o botao agora se dimensiona pelo proprio conteudo (121px de largura natural para "Limpar palco", sem quebrar).
- Com a quebra eliminada, todos os controles voltaram sozinhos para 40px de altura — nao foi necessario nenhum ajuste adicional nos inputs, confirmando que o problema era mesmo o botao esticando a linha.

## Design system documentado

- Novo `.sdd/knowledge/design-system.md`: guia de referencia para criacao de elementos visuais no console de gestao — altura padrao de controles (2.5rem), regra de nunca quebrar texto de botao, paleta de cores usada (navy, teal, terracota, vermelho), medidas de border-radius/padding, padrao de card com altura fixa + rolagem interna, e uma lista de armadilhas ja conhecidas (incluindo esta mesma, para nao se repetir).
- `.sdd/knowledge/README.md`: passou a listar esse guia com uma linha objetiva de "quando ler", seguindo a convencao ja descrita no proprio arquivo.

## Fora de escopo (nao alterado)

- O valor de 2.5rem em si (ja era o padrao desde o inicio do projeto; so foi documentado e reforcado, nao alterado).

## Evidencias de validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db` (8/8) e `npm run build` passaram.
- Medido com Playwright antes e depois da correcao:
  - Antes: Criar evento 40px; Nome do bloco 58px; duracao 58px; Adicionar bloco 58px (texto quebrado); Limpar palco 58px (texto quebrado).
  - Depois: todos os cinco controles em 40px, "Adicionar bloco" e "Limpar palco" com o texto numa linha so.
- Screenshot confirma visualmente: formulario de bloco e a linha de botoes de mensagem/Limpar palco com altura uniforme, sem nenhum botao quebrado.

## Documentos ativos consultados

- `docs/PROJECT-STATE.md`, `.sdd/knowledge/README.md`.

## Documentos ativos atualizados

- `.sdd/knowledge/README.md` e `.sdd/knowledge/design-system.md` (novo).
- `docs/PROJECT-STATE.md`: nota adicionada sobre a padronizacao de altura e a criacao do guia de design system.
