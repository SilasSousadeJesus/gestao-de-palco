# Roadmap de implementacao

> Estado em 01/09/2026. Itens marcados representam documentacao ou codigo que realmente existem; um item desmarcado ainda nao foi implementado.

## Checklist visual

### Planejamento

- [x] Configuracao de IA e contrato de trabalho do repositorio.
- [x] Visao do produto, telas e operacao local documentadas.
- [x] Estado vivo, indice de documentacao e gate de leitura antes de implementar.
- [x] Decisao de operacao local: PC do palco, HDMI, roteador e acesso por Wi-Fi.
- [x] Decisao de sincronia: estado persistido, versionado e notificacao local.

### Aplicacao

- [x] Projeto Next.js com TypeScript configurado.
- [x] Banco SQLite local e migracoes.
- [ ] Inicializacao automatica no Windows.
- [x] Tela de gestao e preview permanente.
- [ ] Tela de palco em tela cheia.
- [x] Estado de palco versionado e sincronizacao local.
- [x] Eventos e historico basico.
- [ ] Timers positivos, pausa e contagem negativa.
- [ ] Mensagens manuais, temporarias e permanentes.
- [ ] Mensagens programadas e aviso automatico de atraso.
- [ ] Sequencia de blocos com confirmacao.
- [ ] Acesso por tablet/notebook, PIN ou login e QR Code.
- [ ] Backup, recuperacao e validacao em dois dispositivos.

## Fase 1 - Fundacao local

**Objetivo:** rodar uma aplicacao local confiavel no PC do palco.

- Criar projeto Next.js com TypeScript e interface base.
- Configurar SQLite e a primeira migracao de banco.
- Criar estrutura de dominio para evento, bloco, mensagem, estado de palco e relatorio.
- Configurar execucao local, arquivo de ambiente de exemplo e comandos de teste.
- Registrar no mapa do projeto como executar e validar cada modulo.

**Pronto quando:** a aplicacao inicia no PC, cria e le dados locais de teste e passa nas validacoes basicas.

## Fase 2 - Estado de palco e sincronia

**Objetivo:** garantir que gestao, preview e monitor HDMI representem o mesmo estado.

- [x] Criar `StageSnapshot` persistido com versao crescente.
- [x] Criar comandos idempotentes para iniciar, pausar, retomar e limpar estado.
- [x] Implementar notificacao local por streaming e reconexao.
- [x] Fazer a tela buscar estado ao abrir ou ao reconectar.
- [x] Exibir versao e conexao na pagina tecnica de diagnostico; o painel definitivo entra na Fase 3.

**Pronto quando:** duas janelas no mesmo PC aplicam o mesmo comando sem recarga manual e a tela HDMI se recupera apos recarregar. A fundacao tecnica foi validada por HTTP e SSE; a validacao visual em duas janelas deve acompanhar a Fase 3, quando existirem gestao e palco.

## Fase 3 - Eventos e console de gestao

**Objetivo:** permitir preparar e controlar um culto manualmente.

- [x] Criar e abrir eventos; o encerramento por controle visual fica pendente.
- [x] Listar historico basico de eventos.
- [x] Criar blocos e remover blocos pela API; edicao e reordenacao ficam pendentes.
- [x] Mostrar tempo total planejado do evento.
- [x] Implementar console ao vivo com bloco atual e controles de timer.
- [x] Adicionar preview 16:9 permanente com o mesmo componente do palco.

**Pronto quando:** o operador prepara um culto e acompanha no preview o mesmo timer que seria exibido no monitor de palco. A base foi entregue; os controles de edicao e encerramento serao completados junto aos fluxos de conclusao da Fase 7.

## Fase 4 - Tela de palco e timers

**Objetivo:** entregar leitura clara e correta para quem esta ministrando.

- Criar modo tela cheia e kiosk para o monitor HDMI.
- Exibir timer gigante positivo, pausado e negativo.
- Exibir nome de bloco de forma discreta, se confirmado no produto.
- Preservar contagem negativa enquanto a proxima etapa aguarda confirmacao.
- Validar contraste, fontes e leitura a distancia em resolucao 16:9.

**Pronto quando:** o monitor mostra tempo legivel, continua negativo apos zero e permanece sincronizado com o preview.

## Fase 5 - Mensagens e automacoes

**Objetivo:** comunicar orientacoes ao palco sem tirar o controle do operador.

- Enviar mensagem manual temporaria por 20 segundos.
- Mostrar timer pequeno durante mensagem temporaria e restaurar o timer gigante depois.
- Criar mensagem permanente sem timer.
- Programar mensagens relativas ao inicio de evento ou bloco.
- Configurar aviso automatico a cada minuto de tempo negativo.
- Implementar sequencia de blocos com confirmacao humana.

**Pronto quando:** mensagens manuais e programadas aparecem no palco e no preview com o comportamento configurado, sem iniciar proximo bloco por engano.

## Fase 6 - Operacao em rede local

**Objetivo:** controlar o PC do palco por tablet ou notebook sem internet.

- Permitir que o servidor escute na rede privada.
- Implementar PIN ou login para o painel de gestao.
- Exibir URL local e QR Code de acesso.
- Documentar configuracao de reserva DHCP e firewall privado do Windows.
- Testar PC cabeado e tablet conectado ao Wi-Fi do mesmo roteador.

**Pronto quando:** um tablet abre a gestao pelo IP local, controla o palco e nao ha acesso pela rede publica ou pela internet.

## Fase 7 - Historico, relatorio e resiliencia

**Objetivo:** concluir o ciclo do evento e tornar a operacao recuperavel.

- Adicionar relatorio textual de evento.
- Registrar historico de comandos relevantes e tempos efetivos.
- Criar backup seguro do banco local e procedimento de restauracao.
- Criar atalho de inicializacao para iniciar sistema e tela HDMI no Windows.
- Executar roteiro de falhas: perda de Wi-Fi, recarga da tela, reinicio da aplicacao e reinicio do PC.

**Pronto quando:** um evento e preparado, executado, encerrado, consultado no historico e recuperado com seguranca apos uma falha simulada.

## Ordem de entrega

As fases devem ser feitas na ordem apresentada. A tela bonita nao deve preceder o estado de palco persistido: a confiabilidade da comunicacao e parte central do produto, nao acabamento.

Cada fase vira uma demanda propria em `.sdd/features/`, com `PLAN.md`, `RECORD.md`, validacao e aprovacao antes de escrita.
