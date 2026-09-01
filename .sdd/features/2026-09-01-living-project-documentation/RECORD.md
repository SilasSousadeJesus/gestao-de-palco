# `living-project-documentation` - record

> Escreva no passado. Nao declare teste, revisao ou comportamento sem evidencia.

## O que mudou

| Area              | Mudanca                                                            | Arquivos principais                  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------ |
| Estado do projeto | Fonte viva de fase, decisoes, riscos e proximos passos             | `docs/PROJECT-STATE.md`              |
| Navegacao         | Indice e protocolo de leitura dos documentos                       | `docs/README.md`                     |
| Instrucoes        | Leitura obrigatoria antes de implementar e atualizacao ao concluir | `AGENTS.md`, `EXECUTION-CONTRACT.md` |
| Bootstrap         | Contexto documental incluido na analise inicial                    | `bootstrap-project-context.md`       |
| Roadmap           | Checklist atualizado com a documentacao viva                       | `docs/ROADMAP.md`                    |

## Comportamento

Antes de qualquer implementacao, o agente agora precisa ler a configuracao SDD, o estado vivo, o roadmap e toda a documentacao ativa registrada no indice. Ao concluir uma demanda, atualiza os documentos afetados e registra a evidencia no `RECORD.md`.

## Validacao executada

- Conferida a presenca do protocolo de leitura nas tres instrucoes de agente.
- Conferida a coerencia entre estado vivo e checklist do roadmap.
- Prettier executado nos arquivos Markdown alterados.

## Documentos consultados e atualizados

- Consultados: `docs/PRODUCT.md`, `docs/LOCAL-OPERATION.md` e
  `docs/ROADMAP.md` para registrar a fase e as decisoes ja confirmadas.
- Atualizados: `AGENTS.md`, `EXECUTION-CONTRACT.md`,
  `bootstrap-project-context.md` e `docs/ROADMAP.md`.
- Criados: `docs/PROJECT-STATE.md` e `docs/README.md`.

## Decisoes e desvios

- O indice de `docs/` e a lista oficial de documentacao ativa. Arquivos futuros devem ser adicionados nele para entrar no gate de leitura.

## Lacunas ou proximos passos confirmados

- A proxima demanda continua sendo a Fase 1 do roadmap, mas so pode iniciar depois de reler o estado vivo e apresentar seu plano proprio.
