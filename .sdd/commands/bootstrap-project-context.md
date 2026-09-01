# Bootstrap do contexto do projeto

Use este prompt quando uma IA for conhecer o repositorio pela primeira vez ou quando o mapa estiver desatualizado.

## Objetivo

Construir uma visao confiavel do projeto a partir de evidencias, combinando o que existe no repositorio com o que o usuario sabe sobre o produto. O objetivo nao e documentar tudo: e preencher o contexto minimo que permite a futuras sessoes trabalhar com seguranca.

## Instrucao para a IA

1. Leia `AGENTS.md`, `.sdd/EXECUTION-CONTRACT.md`, `.sdd/PROJECT-BRIEF.md`, `.sdd/MAP.md` e `.sdd/local/` por ultimo.
2. Inspecione somente em modo leitura: arquivos de entrada, manifestos de dependencias, configuracoes, codigo-fonte, testes, documentacao e automacao de CI que existirem. Nao abra, imprima ou copie segredos.
3. Identifique, com caminho de arquivo quando possivel:
   - modulos e responsabilidades;
   - linguagens, frameworks e comandos de execucao e validacao;
   - fluxos relevantes, dados, integracoes e limites de seguranca;
   - dividas, duplicidades, configuracoes legadas e pontos que precisam de confirmacao humana.
4. Compare as evidencias com `PROJECT-BRIEF.md`. O que o usuario escreveu sobre negocio ou prioridade prevalece sobre inferencia do codigo.
5. Antes de editar qualquer arquivo, entregue um relatorio com quatro secoes: **Evidencias**, **Hipoteses**, **Lacunas para o usuario** e **Plano de preenchimento**. O plano deve listar os arquivos que serao alterados e como serao validados.
6. Pare e espere aprovacao explicita.
7. Depois da aprovacao, preencha `.sdd/MAP.md` usando fatos rastreaveis. Crie guias em `.sdd/knowledge/` somente para temas recorrentes ou de risco. Nao remova campos `PENDENTE` sem evidencia ou resposta do usuario.
8. Se a atualizacao for relevante, crie uma pasta de demanda em `.sdd/features/<AAAA-MM-DD>-<slug>/`, use os templates e registre no `RECORD.md` o que foi confirmado e o que continua em aberto.

## Perguntas que a IA deve fazer quando faltarem dados

- Qual resultado de negocio define sucesso neste momento?
- Quais dados sao sensiveis e quais acoes exigem autorizacao humana?
- Quais ambientes existem e qual deles pode ser alterado durante o trabalho?
- Qual comando representa a validacao minima confiavel?
- Ha regras de dominio, integracoes ou prazos que nao aparecem no codigo?

## Resultado esperado

Depois da aprovacao, `MAP.md` deve permitir que uma nova sessao encontre os modulos, execute a validacao certa e saiba onde ainda nao deve assumir nada. `PROJECT-BRIEF.md` deve continuar sendo um espaco simples para o usuario corrigir ou complementar a leitura automatica.
