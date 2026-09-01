# `living-project-documentation` - plan

## Problema

O repositorio ja possui visao de produto, operacao local e roadmap, mas nenhum gate obriga um agente a ler esse contexto antes de implementar. Sem uma fonte viva, e possivel escrever codigo sem saber a fase atual, decisoes tomadas, riscos, fragilidades e melhorias futuras.

## Escopo

- **Dentro:** documento vivo de estado, indice de documentacao, gate de leitura antes de implementacao, obrigacao de atualizacao apos mudancas relevantes e artefatos SDD da demanda.
- **Fora:** implementacao de produto, mudanca de stack, criacao de banco, alteracao de regras funcionais e reescrita da visao do produto.

## Rastreabilidade

| Requisito                                      | Entrega                              |
| ---------------------------------------------- | ------------------------------------ |
| Agente le documentacao antes de implementar    | `AGENTS.md`, `EXECUTION-CONTRACT.md` |
| Estado atual, decisoes e riscos ficam visiveis | `docs/PROJECT-STATE.md`              |
| Documentacao aplicavel fica encontravel        | `docs/README.md`                     |
| Documentacao evolui junto com o projeto        | contrato, roadmap e `RECORD.md`      |
| Bootstrap usa documentacao como contexto       | `bootstrap-project-context.md`       |

## Execucao

| #   | Arquivo                 | O que sera feito                                                      | Depende de |
| --- | ----------------------- | --------------------------------------------------------------------- | ---------- |
| 1   | `docs/PROJECT-STATE.md` | Criar fonte viva com estado inicial, decisoes, riscos e lacunas       | -          |
| 2   | `docs/README.md`        | Criar indice e protocolo de leitura da documentacao                   | 1          |
| 3   | `AGENTS.md` e contrato  | Tornar leitura e atualizacao da documentacao obrigatorias             | 1, 2       |
| 4   | bootstrap e roadmap     | Ingerir documentos no bootstrap e registrar a capacidade no checklist | 3          |
| 5   | `RECORD.md`             | Registrar alteracoes e validacao real                                 | 1, 2, 3, 4 |

## Validacao

- Conferir que `AGENTS.md`, contrato e bootstrap apontam para o mesmo protocolo de leitura.
- Conferir que estado vivo cita a fase atual e que roadmap nao marca software inexistente como entregue.
- Rodar Prettier em todos os Markdown alterados.

## Riscos

- Um documento vivo pode virar uma segunda fonte contraditoria. O contrato define que ele registra estado e decisoes, sem substituir requisitos de produto ou regras de seguranca.
