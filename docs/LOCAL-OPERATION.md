# Operacao local no palco

## Principio

O PC do palco hospeda a aplicacao, o banco de dados e a tela enviada ao monitor HDMI. O roteador cria uma rede privada para que notebook ou tablet controlem o evento. A internet nao e necessaria durante o culto.

```text
Notebook ou tablet
        | Wi-Fi
        v
  Roteador local <---- cabo de rede ---- PC do palco ---- HDMI ---- Monitor
                                           |
                                           +-- Next.js + SQLite
```

## Enderecos de acesso

O servidor roda inicialmente no PC do palco. Para outros dispositivos, ele escuta apenas na rede privada e recebe um IP fixo ou reserva DHCP, por exemplo `192.168.50.10`.

| Uso                          | Endereco de exemplo                    |
| ---------------------------- | -------------------------------------- |
| Gestao no PC do palco        | `http://127.0.0.1:3000/gestao`         |
| Gestao em tablet ou notebook | `http://192.168.50.10:3000/gestao`     |
| Tela HDMI do palco           | `http://127.0.0.1:3000/palco/<evento>` |

`localhost` e `127.0.0.1` funcionam somente no proprio PC. Um tablet deve usar o IP privado do PC do palco, nunca `localhost`.

## Preparacao da rede

1. Conectar o PC do palco ao roteador por cabo de rede.
2. Conectar tablet e notebook ao Wi-Fi do mesmo roteador.
3. Configurar reserva DHCP no roteador para que o PC mantenha sempre o mesmo IP.
4. Usar uma rede Wi-Fi protegida por senha e nao liberar convidados durante a operacao.
5. Manter o PC e o roteador ligados durante todo o evento.

O roteador pode estar sem acesso a internet. Ele continua distribuindo IPs e permitindo comunicacao entre os dispositivos conectados a ele.

## Inicio do culto

1. Ligar PC, roteador e monitor de palco.
2. Iniciar a aplicacao local no PC.
3. Abrir a tela de gestao no monitor principal ou no tablet.
4. Abrir a tela de palco no monitor HDMI em modo kiosk ou tela cheia.
5. Confirmar na gestao que a tela de palco esta conectada e sincronizada.
6. Criar ou abrir o evento e iniciar o primeiro bloco.

O plano de implementacao deve incluir atalho de inicializacao do Windows para iniciar a aplicacao e abrir a tela HDMI sem depender de comandos manuais.

## Acesso rapido por QR Code

A tela de gestao exibe a URL local atual e um QR Code. O operador conecta o tablet ao Wi-Fi do roteador, aponta a camera para o QR Code e abre a gestao.

O QR Code deve representar apenas a URL de acesso. Ele nao deve incluir senha, token administrativo ou informacao de evento.

## Seguranca local

- O painel de gestao exige PIN ou login antes de permitir comandos.
- A tela de palco nao mostra controles administrativos.
- A regra do firewall do Windows libera a porta somente para perfil de rede privada, nunca para rede publica.
- A aplicacao nao deve usar redirecionamento de porta, DDNS ou exposicao na internet.
- Dados e banco ficam no PC do palco e devem ter backup local em meio seguro.

## Falhas e recuperacao

| Situacao                 | Comportamento esperado                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Internet cai             | O sistema continua funcionando; internet nao e dependencia.                                                          |
| Wi-Fi do tablet cai      | O tablet perde controle temporariamente; a tela HDMI e o timer continuam. Ao reconectar, a gestao le o estado atual. |
| Tela HDMI recarrega      | Ela busca o ultimo estado persistido e volta a exibir timer ou mensagem corretos.                                    |
| Aplicacao local reinicia | O estado salvo e recuperado; a operacao deve confirmar a tela de palco antes de continuar.                           |
| PC desliga               | O sistema para. Ao ligar, abre o ultimo estado salvo, mas o operador decide se retoma ou encerra o evento.           |
| Roteador desliga         | O monitor HDMI no PC pode continuar; tablets perdem acesso ate a rede voltar.                                        |

## Observabilidade para o operador

A gestao deve mostrar, em linguagem simples:

- `Palco conectado` ou `Palco desconectado`.
- Hora da ultima confirmacao recebida da tela HDMI.
- Versao do estado exibida no palco.
- Endereco local e QR Code para novo dispositivo de gestao.
