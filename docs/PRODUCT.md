# Gestao de Palco

## Visao do produto

Gestao de Palco e um sistema local para conduzir o tempo e a comunicacao visual de um culto. Um operador administra o evento em uma tela de gestao; o monitor no chao do palco mostra para quem ministra o tempo restante ou uma mensagem importante, com leitura imediata a distancia.

O software funciona no PC do palco. Ele pode ser controlado nesse mesmo PC ou por notebook e tablet na mesma rede local.

## Objetivos

- Dar visibilidade clara do tempo restante, inclusive quando ele passa do planejado.
- Enviar mensagens discretas e legiveis para o palco sem interromper o culto.
- Preparar eventos antes do inicio e preservar historico e relatorio depois.
- Permitir que o operador veja continuamente o que o monitor do palco exibe.
- Continuar operando sem internet enquanto o PC, o roteador e o navegador estiverem ligados.

## Fora do primeiro escopo

- Aplicativo mobile nativo.
- Multiplas igrejas ou equipes em bancos separados.
- Transmissao de video, audio ou letras de musica.
- Acesso pela internet publica.
- IA como funcionalidade exibida ao operador ou ao palco.

## Conceitos

| Conceito        | Descricao                                                                       |
| --------------- | ------------------------------------------------------------------------------- |
| Evento          | Um culto ou outra programacao que agrupa timers, mensagens e relatorio.         |
| Bloco de tempo  | Uma etapa do evento, como Louvor ou Pregacao, com nome e duracao planejada.     |
| Timer           | A contagem de um bloco em andamento; pode estar rodando, pausado ou finalizado. |
| Mensagem        | Texto exibido no palco de forma temporaria ou permanente.                       |
| Estado de palco | A versao atual e persistida do que a tela de palco deve mostrar.                |
| Operador        | Pessoa que usa a tela de gestao para controlar o evento.                        |

## Ciclo de um evento

1. O operador cria um evento, por exemplo `Culto 01 - 07/09`.
2. Configura blocos de tempo, mensagens e a forma de exibicao no palco.
3. Abre a tela de palco no monitor HDMI e confirma que ela esta conectada.
4. Inicia o evento e controla os blocos, o timer e as mensagens.
5. Ao terminar, escreve o relatorio e encerra o evento.
6. O evento passa a aparecer no historico com sua configuracao e relatorio.

## Funcionalidades

### Eventos e historico

- Criar evento com nome, data e observacoes iniciais.
- Abrir a listagem de eventos presentes e passados.
- Reabrir evento preparado antes do culto.
- Encerrar evento sem apagar o historico.
- Registrar um relatorio textual ao final do evento.

### Configuracao de exibicao

Por evento, o operador escolhe um dos modos iniciais:

- `Timers e mensagens`: o palco mostra o timer e pode receber mensagens.
- `Somente mensagens`: o palco nao exibe timer; mostra mensagens programadas ou permanentes.

Essa escolha pode ser alterada durante o evento pela gestao quando necessario.

### Timers e tempo total

- Criar, editar, reordenar e remover blocos de tempo antes de iniciar o evento.
- Definir nome e duracao de cada bloco.
- Exibir a soma de todos os blocos como tempo planejado total do evento.
- Iniciar, pausar, retomar, encerrar e trocar o bloco atual manualmente.
- Mostrar no palco o tempo restante em tamanho gigante.
- Ao chegar a zero, continuar a contagem em negativo, por exemplo `-05:00`.
- Quando houver tempo negativo, acionar uma mensagem de encerramento a cada minuto, conforme configuracao do evento.

### Sequencia automatica de blocos

O operador pode marcar blocos como sequenciais. Quando um bloco chega a zero:

1. A gestao recebe uma confirmacao para iniciar o proximo bloco.
2. O proximo bloco nao inicia sem acao humana.
3. Enquanto a confirmacao nao acontece, o bloco atual continua em contagem negativa no palco.
4. Ao confirmar, o novo bloco inicia e se torna o timer exibido.

Essa regra impede que uma transicao de culto comece por engano e conserva a informacao de atraso do bloco anterior.

### Mensagens

| Tipo              | Comportamento no palco                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Manual temporaria | O operador envia uma mensagem; ela aparece gigante e o timer fica pequeno. Apos 20 segundos, o timer volta a ocupar a tela. |
| Programada        | A mensagem aparece em horario configurado relativo ao inicio do evento ou do bloco atual.                                   |
| Aviso de atraso   | Quando um timer esta negativo, uma mensagem configurada aparece a cada minuto.                                              |
| Permanente        | A tela mostra somente a mensagem, sem timer, ate o operador limpar ou substituir o estado.                                  |

No modo `Somente mensagens`, a programacao usa o inicio do evento como referencia. No modo com timers, uma mensagem programada pode usar o inicio do evento ou o inicio de um bloco como referencia.

## Tela de gestao

A tela de gestao e o painel do operador. Ela deve ser funcional em notebook, tablet e no monitor principal do PC do palco.

### Estrutura principal

```text
+----------------------------------------------------------------+
| Evento ativo | status do palco | tempo total | encerrar evento |
+--------------------------------+-------------------------------+
| Controles e timeline           | Preview ao vivo 16:9          |
| - bloco atual                  | mesma saida do monitor HDMI   |
| - iniciar / pausar / retomar   |                               |
| - proximo bloco                |                               |
| - mensagens                    |                               |
+--------------------------------+-------------------------------+
| Relatorio e historico de acoes                                 |
+----------------------------------------------------------------+
```

### Areas e acoes

| Area            | O que o operador faz                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Eventos         | Cria, abre, encerra e consulta eventos anteriores.                            |
| Preparacao      | Configura modo de exibicao, blocos, duracoes, sequencia e mensagens.          |
| Console ao vivo | Controla timer, muda bloco, envia ou limpa mensagem e confirma proxima etapa. |
| Preview         | Ve em tempo integral a mesma apresentacao enviada ao palco.                   |
| Saude do palco  | Ve conexao, ultima confirmacao e versao atualmente exibida no monitor.        |
| Relatorio       | Registra observacoes e ocorrencias do evento.                                 |

### Preview ao vivo

O preview nao e uma simulacao. Ele renderiza o mesmo componente e o mesmo estado usados pela tela de palco, apenas dentro de uma moldura identificada como `Preview`. Timer, mensagem temporaria, mensagem permanente, tempo negativo e mudanca de bloco devem ser visualmente iguais nas duas telas.

O painel mostra tambem a versao do estado exibida no preview e no palco. Isso permite ao operador verificar se o monitor remoto aplicou o mesmo comando.

### Confirmacoes importantes

A tela pede confirmacao antes de:

- iniciar o proximo bloco sequencial;
- encerrar um evento;
- apagar um bloco ou mensagem programada;
- colocar uma mensagem permanente no palco, quando houver timer ativo.

## Tela de palco

A tela de palco roda em tela cheia no monitor HDMI, sem barra do navegador e sem controles administrativos.

### Estados visuais

| Estado                   | Exibicao                                                                  |
| ------------------------ | ------------------------------------------------------------------------- |
| Timer positivo           | Tempo restante gigante; nome do bloco pode aparecer de forma discreta.    |
| Timer negativo           | Tempo gigante com sinal negativo e destaque visual de atraso.             |
| Mensagem temporaria      | Mensagem gigante; timer pequeno permanece visivel por 20 segundos.        |
| Mensagem permanente      | Apenas a mensagem gigante, mantida ate novo comando.                      |
| Pausado                  | Timer congelado com indicacao discreta de pausa.                          |
| Aguardando proximo bloco | O timer anterior segue negativo enquanto a gestao decide a proxima etapa. |
| Sem evento ativo         | Tela neutra, sem dados de evento anterior.                                |

### Requisitos de leitura

- Alto contraste, tipografia muito grande e poucos elementos.
- Layout 16:9 responsivo para monitores de diferentes resolucoes.
- Sem informacoes administrativas, nomes de usuarios ou opcoes clicaveis.
- Atualizacao imediata de comandos recebidos e reconstrucao do estado ao recarregar a pagina.

## Sincronia e confiabilidade

O PC do palco e a fonte local de verdade. Cada comando de gestao grava um `Estado de palco` com numero de versao crescente no banco local. O preview e a tela HDMI aplicam apenas estados mais novos.

```text
Comando -> grava estado versao N -> notifica telas -> telas aplicam versao N
```

O timer e calculado localmente a partir do horario de inicio e nao depende de uma atualizacao recebida por segundo. Se a tela recarregar, ela le o ultimo estado salvo; se o tablet perder Wi-Fi, o timer no monitor HDMI continua.

## Perguntas abertas para antes da implementacao

- O painel de gestao tera somente um PIN local ou usuarios com login separado?
- O nome do bloco deve aparecer sempre no palco ou apenas no preview?
- A mensagem de atraso tera texto fixo ou sera configuravel por evento?
- O relatorio precisa de campos estruturados alem de texto livre?
- Eventos futuros devem poder ser criados a partir de um modelo reutilizavel?
