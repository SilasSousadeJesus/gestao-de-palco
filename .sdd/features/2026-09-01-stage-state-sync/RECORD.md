# `stage-state-sync` - record

> Escreva no passado. Nao declare teste, revisao ou comportamento sem evidencia.

## O que mudou

| Area | Mudanca | Arquivos principais |
| --- | --- | --- |
| Estado | Snapshot versionado e comandos de palco persistidos | `src/features/stage/stage-state.ts`, `src/db/schema.ts` |
| Confiabilidade | Log de comandos com chave composta para idempotencia | `stage_commands`, `drizzle/0001_careless_roland_deschain.sql` |
| Transporte | APIs de leitura, comando e streaming SSE | `src/app/api/events/[eventId]/stage/` |
| Diagnostico | Pagina temporaria de sincronia com versao e conexao | `src/app/sync-lab/` |
| Contexto | Roadmap, estado vivo e mapa atualizados | `docs/ROADMAP.md`, `docs/PROJECT-STATE.md`, `.sdd/MAP.md` |

## Comportamento

O estado de um evento e lido do SQLite. Cada comando usa `commandId`; ao repetir o mesmo identificador para o mesmo evento, o sistema devolve o snapshot registrado sem incrementar a versao. Um comando com `expectedVersion` desatualizada retorna conflito e nao altera o estado. Apos uma transacao bem-sucedida, o hub local publica o snapshot no SSE. Clientes buscam o estado ao iniciar e ao reconectar, portanto a notificacao nao e a fonte de verdade.

`/sync-lab` cria somente o evento tecnico `sync-lab` e permite validar `start`, `pause`, `resume` e `clear` em mais de uma janela. Esta pagina nao e parte do produto final e sera substituida na Fase 3.

## Validacao executada

- `npm run db:generate` gerou a migration `0001_careless_roland_deschain.sql`.
- `npm run db:migrate` aplicou a migration SQLite local autorizada.
- `npm run lint` passou sem erros ou avisos.
- `npm run typecheck` passou sem erros.
- `npm run test:db` passou com tres testes: schema, restricao de idempotencia e regras de comando/versionamento.
- `npm run build` passou e reconheceu as tres rotas de palco, a rota de diagnostico e `/sync-lab`.
- Com o servidor local em `127.0.0.1:3000`, um consumidor SSE recebeu o snapshot da versao `1` depois de um `POST start`.

## Decisoes e limites

- O SSE envia um comentario inicial para que clientes estabelecam a conexao sem aguardar a primeira mudanca de estado.
- O hub de eventos usa memoria do processo. Ele atende o MVP em um PC e uma instancia Next, mas nao deve ser reutilizado para multiplos processos ou servidores.
- A rota de streaming ainda nao autentica clientes porque o acesso LAN protegido pertence a Fase 6. Nesta fase, a aplicacao deve permanecer acessivel apenas no PC local.

## Documentos consultados e atualizados

- Consultados: `docs/README.md`, `docs/PROJECT-STATE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md`, `docs/LOCAL-OPERATION.md`, `.sdd/MAP.md` e a documentacao local de Route Handlers do Next.
- Atualizados: `docs/ROADMAP.md`, `docs/PROJECT-STATE.md` e `.sdd/MAP.md`.
- A proxima etapa registrada e Fase 3 - Eventos e console de gestao.
