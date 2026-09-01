# `stage-management-planning` - plan

## Problema

O produto de gestao de palco teve sua visao, operacao local e arquitetura de sincronia definidas em conversa, mas ainda nao possui documentacao versionada que permita iniciar a implementacao com escopo, ordem e criterios claros.

## Escopo

- **Dentro:** descricao de produto, telas de gestao e palco, operacao local, checklist visual e roadmap de implementacao.
- **Fora:** criacao do projeto Next.js, banco SQLite, rotas, interface, instalacao no Windows, configuracao do roteador e qualquer funcionalidade de produto.

## Rastreabilidade

| Requisito                           | Entrega                   |
| ----------------------------------- | ------------------------- |
| Descrever tudo que o produto fara   | `docs/PRODUCT.md`         |
| Detalhar telas de gestao e palco    | `docs/PRODUCT.md`         |
| Registrar o plano de operacao local | `docs/LOCAL-OPERATION.md` |
| Mostrar implementado e pendente     | `docs/ROADMAP.md`         |
| Definir ordem de entrega            | `docs/ROADMAP.md`         |

## Execucao

| #   | Arquivo                   | O que sera feito                              | Depende de |
| --- | ------------------------- | --------------------------------------------- | ---------- |
| 1   | `docs/PRODUCT.md`         | Registrar visao, regras e telas               | -          |
| 2   | `docs/LOCAL-OPERATION.md` | Registrar topologia, acesso e seguranca local | 1          |
| 3   | `docs/ROADMAP.md`         | Criar checklist e fases de implementacao      | 1, 2       |
| 4   | `RECORD.md`               | Registrar o que foi produzido e validado      | 1, 2, 3    |

## Validacao

- Conferir que cada funcionalidade descrita pelo usuario aparece em `PRODUCT.md` ou esta declarada fora de escopo.
- Conferir que `ROADMAP.md` separa planejamento concluido de software ainda nao implementado.
- Rodar Prettier nos arquivos Markdown alterados.

## Riscos

- Decisoes de experiencia ainda podem mudar antes do codigo. O documento usa regras claras onde ja ha decisao e aponta perguntas abertas sem inventar comportamento.
