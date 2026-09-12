# `padronizar-altura-controles` - plan

## Objetivo

Corrigir botoes ("Limpar palco", "Adicionar bloco") cujo texto quebrava em 2 linhas, esticando a altura deles e dos inputs vizinhos na mesma linha de grid. Padronizar a altura de todos os botoes/inputs para o mesmo tamanho do botao "Criar evento" (2.5rem/40px) e documentar isso como um design system, para ser consultado em futuras criacoes de elementos visuais.

## Diagnostico

`.clear-stage-button` (Limpar palco) tinha `max-width:108.4px` — menor que o necessario para "Limpar palco" numa linha so, entao quebrava em "Limpar"/"palco". O mesmo acontecia com "Adicionar bloco" na coluna `auto` de `.block-form`. Como esses botoes dividem a mesma linha de grid dos inputs "Nome do bloco" e da duracao, a altura maior do botao quebrado (58px) esticava os inputs junto (o grid estica todos os itens da linha para a altura do maior).

## Escopo

- `src/app/globals.css`:
  - Regra global `button` ganha `white-space:nowrap` (texto de botao nunca quebra linha).
  - `.clear-stage-button` perde o `max-width:108.4px` (nao e mais necessario; o botao se dimensiona pelo proprio conteudo, sem quebrar).
- `.sdd/knowledge/design-system.md` (novo): guia de design system do console de gestao — altura padrao de controles, paleta de cores, medidas, padrao de cards com altura fixa/rolagem, armadilhas conhecidas (incluindo esta mesma).
- `.sdd/knowledge/README.md`: passa a listar o novo guia.

## Fora de escopo

- Mudar a altura padrao em si (2.5rem continua sendo o valor usado desde o inicio do projeto).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: medir a altura de "Criar evento", "Nome do bloco", input de duracao, "Adicionar bloco" e "Limpar palco" via `getBoundingClientRect()` — todos devem ficar em 40px.
