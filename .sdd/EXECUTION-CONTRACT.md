# Contrato de execucao

Este contrato define como pessoas e agentes colaboram neste repositorio. Ele vale para qualquer ferramenta de IA.

## 1. Contexto antes de acao

Leia `AGENTS.md`, este contrato, `PROJECT-BRIEF.md` e `MAP.md` antes de agir. Leia `.sdd/local/` por ultimo, se houver arquivos. Para assunto especializado, leia somente o guia aplicavel em `.sdd/knowledge/`.

O usuario pode editar `PROJECT-BRIEF.md` a qualquer momento. Essa descricao do produto e uma fonte primaria: nao a substitua por inferencias do codigo.

## 2. Precedencia de instrucoes

1. Seguranca, leis, instrucoes da plataforma e autorizacoes explicitas.
2. Este contrato e arquivos versionados do repositorio.
3. `PROJECT-BRIEF.md`, que descreve a intencao do usuario para o projeto.
4. Preferencias locais em `.sdd/local/`.
5. Inferencias a partir do codigo e da conversa.

Uma preferencia local preenche escolhas abertas, como idioma, ordem de leitura e formato de resposta. Ela nunca remove uma exigencia deste contrato.

## 3. Gatilho de escrita

Antes de criar, editar, mover ou apagar qualquer arquivo, o agente deve mostrar um plano conciso e esperar aprovacao explicita. O plano deve listar escopo, arquivos esperados, validacao e riscos relevantes.

Perguntas e investigacoes somente de leitura nao exigem plano. Se houver ambiguidade material, pergunte antes de agir.

## 4. Seguranca e acoes de alto risco

O agente nao pode sem autorizacao expressa:

- executar migracao de banco, alterar dados reais ou remover arquivos;
- acessar, revelar ou registrar segredos;
- alterar producao, publicar versoes ou acionar servicos externos;
- contornar revisao, testes ou controles de seguranca existentes.

Quando uma acao puder ter impacto irreversivel, explique o alvo, o impacto e a forma de reversao antes de pedir autorizacao.

## 5. Artefatos de demanda

Mudancas relevantes devem usar uma pasta em `.sdd/features/<AAAA-MM-DD>-<slug>/`.

- `PLAN.md` registra problema, escopo, rastreabilidade, execucao, validacao e riscos antes da escrita.
- `RECORD.md` registra o que realmente mudou, como foi validado e qualquer desvio do plano.

O registro deve ser honesto: nao declare teste, revisao ou comportamento que nao tenha sido verificado.

## 6. Validacao

`MAP.md` e os guias em `.sdd/knowledge/` devem informar os comandos de validacao por modulo. Ao concluir uma mudanca, execute o que for aplicavel ou explique objetivamente por que nao foi possivel executar.

## 7. Decisoes e lacunas

Use estas etiquetas quando elas ajudarem a evitar confusao:

- **Evidencia:** fato observado em arquivo, comando, teste ou fonte indicada.
- **Hipotese:** interpretacao plausivel que ainda precisa de confirmacao.
- **PENDENTE:** informacao que somente o usuario ou outra fonte pode fornecer.

Nao transforme hipotese em configuracao permanente sem confirmacao.
