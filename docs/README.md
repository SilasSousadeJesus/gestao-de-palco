# Documentacao do projeto

Este diretorio contem a documentacao ativa do Gestao de Palco. Antes de qualquer implementacao, o agente deve ler todos os arquivos Markdown listados nesta pagina, alem da configuracao em `.sdd/` definida no contrato.

## Ordem de leitura para implementacao

1. `AGENTS.md` e `.sdd/EXECUTION-CONTRACT.md`.
2. `.sdd/PROJECT-BRIEF.md` e `.sdd/MAP.md`.
3. Este indice e `PROJECT-STATE.md`.
4. `ROADMAP.md`.
5. `PRODUCT.md` e `LOCAL-OPERATION.md`.
6. Guias em `.sdd/knowledge/` aplicaveis a demanda.
7. Preferencias em `.sdd/local/`, por ultimo.

Depois da leitura, o agente deve dizer em uma frase a fase atual e a proxima etapa planejada antes de propor qualquer implementacao.

## Documentos ativos

| Documento            | Uso                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------- |
| `PROJECT-STATE.md`   | Estado atual, decisoes, observacoes, riscos, melhorias futuras e perguntas abertas. |
| `ROADMAP.md`         | Checklist visual e ordem de implementacao.                                          |
| `PRODUCT.md`         | Visao, regras de negocio, fluxos e telas.                                           |
| `LOCAL-OPERATION.md` | Topologia local, rede, acesso, seguranca e recuperacao operacional.                 |

## Regra de manutencao

Quando uma demanda alterar comportamento, arquitetura, operacao, decisao ou fase do projeto, atualize o documento ativo correspondente. Se criar uma documentacao ativa nova, adicione-a nesta tabela e na ordem de leitura quando ela for obrigatoria.

Nao use este diretorio para registrar notas temporarias de conversa. Decisoes de uma demanda ficam em `.sdd/features/<data>-<slug>/`; fatos vivos do produto ficam nos documentos acima.
