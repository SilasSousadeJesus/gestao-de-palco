# Design system do console de gestao

## Quando ler

Antes de criar ou alterar qualquer elemento visual em `src/app/management-client.tsx`, `src/features/stage/stage-presentation.tsx` ou `src/app/globals.css` — botao, input, card, tabela, icone. Isso evita reinventar um padrao que ja existe e evita quebrar a consistencia visual entre telas.

## Invariantes que nao podem ser quebradas

- **Altura padrao de controles: `2.5rem` (40px).** Todo `input` e `button` usa essa altura via `input, button { min-height: 2.5rem; ... }` em `globals.css`. Nao crie um botao ou input com altura diferente sem justificar — o padrao existe para os controles ficarem visualmente alinhados entre si (ex.: "Criar evento", "Adicionar bloco", os inputs do formulario de bloco e os botoes de mensagem devem todos ficar do mesmo tamanho).
- **Texto de botao nunca quebra linha.** A regra global `button { white-space:nowrap; ... }` garante isso. Se um label nao cabe no espaco disponivel, a solucao e encurtar o texto (com `title` explicando por extenso, se precisar) ou dar mais espaco ao botao — nunca deixar quebrar. Um botao com texto quebrado em 2 linhas fica mais alto que `2.5rem`, e como varios controles dividem a mesma linha de grid/flex, isso estica a altura de TODOS os elementos daquela linha (foi exatamente o bug corrigido em 01/09/2026: "Adicionar bloco" e "Limpar palco" quebravam e esticavam os inputs vizinhos para 58px).
- **Itens estreitos num grid/flex nao ficam centralizados ou alinhados a ponta por padrao.** `justify-self`/`align-items` default para `stretch`, entao um botao com `max-width` menor que a coluna fica colado no inicio (esquerda) em vez de centralizado, a nao ser que voce declare `justify-self:center` (grid) ou `margin-inline:auto`/`margin-left:auto` (flex) explicitamente.
- **`font-size` baseado em `vw` so faz sentido quando o elemento realmente escala com o viewport inteiro.** Assim que um card ganha uma largura fixa (ex.: o preview com 606.55px), trocar para um valor fixo em `rem` calibrado para essa largura — `vw` vai continuar calculando a partir da tela toda, nao do card, e pode gerar fontes desproporcionais.
- **Grid com texto que precisa quebrar linha exige `min-width:0` no item.** Sem isso, o navegador pode dimensionar a coluna pelo tamanho do conteudo sem quebra (`max-content`), e o excesso e cortado por `overflow:hidden` em vez de quebrar linha corretamente.

## Paleta de cores

| Uso | Cor | Onde |
| --- | --- | --- |
| Fundo da pagina | `#f5f0e7` | `:root` |
| Fundo de card | `#fff9` (branco translucido) | `.event-panel`, `.console-panel`, `.preview-panel`, `.report-panel` |
| Texto/borda principal (navy) | `#102e38` / `#153b41xx` (varias opacidades) | botoes, bordas, titulos |
| Acento positivo/conectado/selecionado (teal) | `#127c70` | `.event-row.selected`, `.is-early`, status conectado |
| Acao "limpar"/atencao (terracota) | `#9e5016` | `.clear-message-button`, `.message-limit-warning` |
| Exclusao (icone) | `#a8623a` (repouso) / `#7a3d10` (hover) | `.icon-delete` |
| Negativo/atraso | `#ff4d45` | `.is-late` |

## Medidas padrao

- Botoes e inputs: altura `2.5rem`, `border-radius:.45rem`, `border:1px solid #153b4144`, `padding:.55rem .7rem`.
- Icones de acao (editar/excluir/iniciar/parar/finalizar): botao quadrado `1.9rem × 1.9rem`, sem borda, fundo transparente com destaque sutil no hover (`#153b4114`).
- Linhas de lista (evento, bloco): `border-radius:.6rem`, padding `.5rem .7rem` a `.65rem .9rem` dependendo do contexto.
- Cards/paineis: `border-radius:1rem`, padding `1rem`.
- Rotulo tecnico ("eyebrow", ex. "EVENTO ABERTO"): fonte monoespacada (`"Courier New"`), maiusculas, `letter-spacing` largo.

## Cards com altura fixa e rolagem interna

Quando um card precisa de altura fixa (nao crescer com o conteudo), o padrao e:

```css
.card { height: <valor>; display:flex; flex-direction:column; overflow:hidden; }
.area-que-cresce { flex:1; min-height:0; overflow-y:auto; }
```

Os elementos que devem ficar com tamanho fixo dentro do card (cabecalhos, formularios curtos) recebem `flex-shrink:0`. Exemplo real: `.event-panel`/`.console-panel` (altura 600px) com `.event-list`/`.blocks` como area rolavel.

## Arquivos relevantes

- `src/app/globals.css` — toda a folha de estilos do console de gestao (um unico arquivo, regras condensadas em linhas longas por selecao; siga o estilo existente ao adicionar regras).
- `src/app/management-client.tsx` — onde a maioria dos elementos visuais (botoes, inputs, cards) e composta.
- `src/features/stage/stage-presentation.tsx` — componente compartilhado entre o preview e a tela de palco (HDMI); mudancas aqui ou em regras CSS genericas (`.stage-presentation`) podem afetar as duas telas — sempre confirme qual variante (`stage-preview` vs `stage-stage`) uma regra deve atingir antes de generalizar.

## Armadilhas ja conhecidas

- Nunca deixe um botao com `max-width` fixo sem medir se o texto cabe numa linha só — prefira nao fixar `max-width` e deixar o botao se dimensionar pelo conteudo (com `white-space:nowrap` ja garantido globalmente).
- Regras de estilo do preview e do palco (HDMI) sao fisicamente separadas mesmo compartilhando a classe `.stage-presentation` — uma regra generica (`.stage-presentation strong {...}`) pode vazar para as duas telas sem querer. Prefira seletores especificos (`.stage-presentation.stage-preview` ou `.stage-screen .stage-stage`) quando o ajuste for so para uma tela.
- Ao adicionar um novo botao/input a uma linha de grid ou flex que ja tem outros controles, meça a altura resultante — um unico item que quebra linha estica a altura de todos os outros itens da mesma linha.
