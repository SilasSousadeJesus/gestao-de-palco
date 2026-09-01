# Gestao de Palco

Aplicacao local para controlar tempo e mensagens exibidos no palco durante um culto. O PC do palco executa a aplicacao e o banco SQLite; o monitor HDMI mostra a apresentacao e tablet ou notebook podem controlar a gestao pela rede privada.

## Estado atual

A fundacao local esta pronta. Eventos, timers, tela de palco, preview e sincronizacao ao vivo pertencem as proximas fases do roadmap.

Leia [a documentacao do projeto](docs/README.md) para entender a fase atual, decisoes, operacao local e ordem de implementacao.

## Requisitos locais

- Node.js 22 ou superior.
- npm 11 ou superior.

## Comandos

```bash
npm install
npm run db:migrate
npm run dev
```

A aplicacao inicia em `http://localhost:3000`. O banco local padrao fica em `data/gestao-de-palco.db` e nao deve ser colocado em pasta sincronizada por nuvem enquanto estiver em uso.

## Validacao

```bash
npm run lint
npm run typecheck
npm run test:db
npm run build
```

## Documentacao e IA

As instrucoes para agentes estao em `AGENTS.md`. Antes de implementar, leia o indice em `docs/README.md`, o estado vivo e todos os documentos ativos. Cada mudanca relevante exige plano aprovado, registro de evidencia e atualizacao da documentacao afetada.
