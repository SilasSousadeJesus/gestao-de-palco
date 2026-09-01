# `events-management-console` - record

## O que mudou

- O caminho `/` passou a ser o console de gestao.
- Eventos podem ser criados, selecionados e ter seu status atualizado pela API local.
- Blocos podem ser adicionados e removidos pela API; o painel permite adiciona-los e iniciar um bloco.
- O estado de palco passou a registrar `activeBlockId`; o comando `start` exige um bloco do evento.
- `StagePresentation` e o preview 16:9 exibem o tempo restante, pausa e atraso a partir do mesmo snapshot sincronizado.

## Validacao executada

- `npm run lint`, `npm run typecheck`, `npm run test:db` e `npm run build` passaram.
- Na instancia local, foi criado o evento tecnico `Validacao Rodada 3`, o bloco `Pregacao` de 30 minutos e o comando `start` retornou `mode: running`, versao `1` e o identificador do bloco ativo.

## Documentacao

- Consultados: `docs/README.md`, `docs/PRODUCT.md`, `docs/ROADMAP.md`, `docs/PROJECT-STATE.md` e `.sdd/MAP.md`.
- Atualizados: `docs/ROADMAP.md`, `docs/PROJECT-STATE.md` e `.sdd/MAP.md`.
