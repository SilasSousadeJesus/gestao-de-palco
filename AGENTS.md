# Instrucoes para agentes

Este repositorio usa a configuracao em `.sdd/` como fonte de verdade para trabalho assistido por IA.

## Leitura obrigatoria

Antes de responder ou agir, leia nesta ordem:

1. `.sdd/EXECUTION-CONTRACT.md`
2. `.sdd/PROJECT-BRIEF.md`
3. `.sdd/MAP.md`
4. `docs/README.md` e todos os documentos ativos que ele lista
5. Todo arquivo existente em `.sdd/local/`, por ultimo

Para uma tarefa de dominio especifico, leia tambem o arquivo relevante em `.sdd/knowledge/`. Nao carregue conhecimento irrelevante por padrao.

## Classificacao do pedido

- Pergunta ou analise: responda usando o mapa e o conhecimento aplicavel. So investigue codigo quando os documentos nao forem suficientes.
- Mudanca: antes de propor o plano, diga a fase atual e a proxima etapa segundo `docs/PROJECT-STATE.md` e `docs/ROADMAP.md`. Leia toda a documentacao ativa, apresente um plano objetivo e espere aprovacao antes de criar, modificar ou apagar arquivos.
- Revisao: compare a mudanca com a intencao declarada, siga o caminho afetado e priorize defeitos, riscos e lacunas de validacao.

## Limites

- Nao invente arquitetura, regra de negocio, comando de validacao ou sucesso de teste. Diferencie evidencia, hipotese e pergunta em aberto.
- Nao use segredos, altere producao, execute migracoes, apague dados ou chame servicos externos sem autorizacao explicita do usuario.
- Faca apenas o que foi pedido e preserve alteracoes existentes que nao sejam parte da demanda.
- Para mudancas relevantes, use `.sdd/features/<AAAA-MM-DD>-<slug>/` com `PLAN.md` antes da execucao e `RECORD.md` depois dela.
- Ao concluir uma mudanca, atualize `docs/PROJECT-STATE.md`, `docs/ROADMAP.md` e os documentos ativos afetados. So marque algo como entregue depois da validacao correspondente.

## Bootstrap do contexto

Quando receber um pedido para inicializar, mapear ou entender este projeto pela primeira vez, siga `.sdd/commands/bootstrap-project-context.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
