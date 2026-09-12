# `timer-pequeno-com-mensagem` - plan

## Objetivo

Quando uma mensagem (temporaria ou permanente) esta sendo exibida, o timer nao deve mais sumir por completo: ele passa a aparecer pequeno no canto superior esquerdo, enquanto a mensagem continua gigante e centralizada. Ao remover a mensagem (temporaria expirando ou limpeza manual), o timer volta ao tamanho e posicao normais.

Isso ja estava descrito em `docs/PRODUCT.md` ("Manual temporaria: mensagem aparece gigante e o timer fica pequeno") mas nunca tinha sido implementado dessa forma — a implementacao anterior escondia o timer por completo enquanto havia mensagem.

## Escopo

- `src/features/stage/stage-presentation.tsx`: no ramo de mensagem, calcular o tempo restante (quando ha bloco ativo e o palco nao esta idle) e renderizar um `<strong className="stage-mini-timer">` adicional, junto com o texto da mensagem.
- `src/app/globals.css`: `.stage-mini-timer` posicionado com `position:absolute; top:0; left:0;` (exige `position:relative` no container `.stage-presentation`/`.stage-empty` e em `.stage-screen .stage-stage`, adicionados agora). Tamanho e cor de atraso definidos separadamente para palco e preview, seguindo o mesmo padrao ja usado para `.stage-message-text` (nunca usar uma regra generica compartilhada quando os dois contextos tem tamanhos de tela muito diferentes).

## Fora de escopo

- Mudar o comportamento de mensagem permanente/temporaria em si (duracao, confirmacao) — so a apresentacao visual mudou.
- Mudar `docs/PRODUCT.md` no que ja estava certo (o documento ja descrevia esse comportamento; nao precisa de correcao, so a implementacao precisava alcancar o que ja estava escrito).

## Validacao

- `npm run lint`, `npm run typecheck`, `npm run test:db`, `npm run build`.
- Verificacao visual e funcional em preview e palco simultaneamente: enviar mensagem temporaria com um bloco em andamento, conferir que o mini-timer aparece no canto (continuando a contar) junto com a mensagem gigante; aguardar a mensagem expirar (20s) e conferir que o timer grande volta ao normal; enviar mensagem permanente e conferir que o mini-timer tambem aparece e nao some sozinho; limpar a mensagem manualmente e conferir que o timer volta ao normal.
