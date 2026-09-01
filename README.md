# AI Config Model

Template minimo para iniciar projetos preparados para colaboracao com IA. Ele nao depende de plataforma de board, hospedagem de codigo, proxy, gateway ou infraestrutura especifica.

## O que este template resolve

- Da ao agente uma ordem clara para entender o projeto antes de agir.
- Mantem regras de seguranca e validacao em um contrato compartilhado.
- Registra o contexto real da aplicacao sem inventar informacoes.
- Separa preferencias pessoais do que vale para todo o time.
- Guarda a intencao e a evidencia de mudancas relevantes.

## Estrutura

```text
AGENTS.md                         Entrada para agentes de IA
.sdd/
  EXECUTION-CONTRACT.md            Regras obrigatorias de trabalho
  PROJECT-BRIEF.md                 Informacoes fornecidas pelo usuario
  MAP.md                           Mapa real do projeto, preenchido no bootstrap
  commands/
    bootstrap-project-context.md   Prompt universal de inicializacao
  knowledge/                       Guias curtos por tema, quando necessarios
  local/                           Preferencias locais, fora do Git
  features/template/               Plano e registro para mudancas relevantes
```

## Primeiro uso: inicializar o contexto

1. Preencha o que souber em [`.sdd/PROJECT-BRIEF.md`](.sdd/PROJECT-BRIEF.md). Campos desconhecidos podem ficar como `PENDENTE`.
2. Inicie uma nova conversa com a sua IA e envie o comando abaixo.
3. Revise o plano que a IA propoe. Ela so deve preencher documentos depois da sua aprovacao.

```text
Leia e execute .sdd/commands/bootstrap-project-context.md para inicializar o contexto deste projeto. Considere as informacoes que eu ja preenchi em .sdd/PROJECT-BRIEF.md. Antes de alterar qualquer arquivo, mostre as evidencias encontradas, as hipoteses, as lacunas e um plano de preenchimento para minha aprovacao.
```

O prompt funciona com qualquer agente que consiga ler arquivos. Ferramentas que suportam comandos locais podem adotar o mesmo arquivo como seu comando `bootstrap-project-context`.

## Uso cotidiano com IA

- Para perguntas: a IA le `AGENTS.md`, o contrato, o mapa e apenas o conhecimento relacionado ao assunto.
- Para mudancas: a IA propoe um plano e espera aprovacao antes de criar artefatos ou editar codigo.
- Para tarefas relevantes: crie uma pasta em `.sdd/features/<AAAA-MM-DD>-<slug>/` a partir dos templates `PLAN.md` e `RECORD.md`.
- Para contexto pessoal: crie arquivos Markdown em `.sdd/local/`. Eles nao sao enviados ao Git e nao podem enfraquecer regras compartilhadas.

## Como adaptar sem perder o modelo

Preencha `PROJECT-BRIEF.md` com a linguagem do negocio e com as restricoes que nao aparecem no codigo. Deixe o bootstrap levantar a arquitetura que realmente existe e registrar duvidas em vez de adivinhar. Adicione arquivos em `.sdd/knowledge/` somente quando uma pergunta ou armadilha voltar a acontecer.

Integracoes externas, automacoes, revisao em CI e controles centralizados podem ser adicionados depois, quando houver uma necessidade concreta. A configuracao base deve continuar simples.
