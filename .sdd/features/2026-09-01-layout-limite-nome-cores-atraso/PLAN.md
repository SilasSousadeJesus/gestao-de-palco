# `layout-limite-nome-cores-atraso` - plan

## Objetivo

Tres ajustes pedidos pelo usuario apos o relatorio de blocos:

1. Diminuir a coluna "Eventos" e aumentar as outras duas, principalmente "Relatorio de blocos".
2. Limitar o nome do evento a 20 caracteres, com o mesmo padrao de aviso usado nas mensagens.
3. Colorir a coluna "Atraso" da tabela: vermelho com "-" quando o bloco estourou o tempo, verde com "+" quando terminou adiantado; todos os totais da tabela devem considerar valores positivos e negativos juntos (soma liquida).

## Escopo

- `src/app/globals.css`: `.management-grid` recebe novas proporcoes de coluna; nova classe `.report-panel td.is-early` (verde); `.event-edit-form` ganha `flex-wrap` e uma classe para o aviso quebrar linha.
- `src/app/management-client.tsx`: novo helper generico `makeLimitedChangeHandler` (reaproveitado tambem pela mensagem, substituindo a logica antes duplicada); limite de 20 caracteres no nome do evento (criacao e edicao) com aviso visivel; nova funcao `delayClass` aplicada em todas as celulas de atraso/total/saldo da tabela.
- `src/features/events/event-service.ts`: `createEvent`/`updateEventTitle` validam o limite de 20 caracteres no backend tambem.

## Fora de escopo

- Mudar o calculo do "Atraso" em si (a soma liquida ja funcionava; so faltava a cor).
- Limitar o nome de blocos ou outros campos.

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual: largura das colunas antes/depois; digitar mais de 20 caracteres no nome do evento (criacao e edicao) e ver o aviso truncando; simular um bloco terminado adiantado (verde, +) e outro atrasado (vermelho, -) e conferir que o total soma os dois corretamente.
