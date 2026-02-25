# TomorrowDAO Agent Skills

TomorrowDAO skill toolkit with **MCP + OpenClaw + CLI + SDK** interfaces.

## Features

- DAO: create DAO, update metadata, create proposals, vote, withdraw, execute, discussion APIs
- Network Governance: proposal create/vote/release, organization create, contract-name ops, full contract-flow ops
- BP Election: apply, quit, vote, withdraw, change voting option, claim profits, team description ops
- Resource: buy/sell resource tokens and query records
- Execution mode: `simulate` (default) and `send`

## Install

```bash
bun install
```

## Environment

See [.env.example](./.env.example).

Key variables:

- `TMRW_API_BASE` (default `https://api.tmrwdao.com`)
- `TMRW_CHAIN_DEFAULT_DAO` (default `tDVV`)
- `TMRW_CHAIN_DEFAULT_NETWORK` (default `AELF`)
- `TMRW_PRIVATE_KEY`
- `TMRW_SOURCE` (default `nightElf`)
- `TMRW_CA_HASH` (optional)

## CLI

```bash
bun run tomorrowdao_skill.ts dao create --input '{"args":{...}}' --mode simulate
bun run tomorrowdao_skill.ts network proposal-create --input '{"proposalType":"Parliament","args":{...}}' --mode send
bun run tomorrowdao_skill.ts bp apply --input '{"args":{...}}' --mode simulate
bun run tomorrowdao_skill.ts resource buy --input '{"symbol":"WRITE","amount":100000000}' --mode send
```

## MCP

```bash
bun run src/mcp/server.ts
```

Use [mcp-config.example.json](./mcp-config.example.json) as template.

## OpenClaw

`openclaw.json` includes all TomorrowDAO tools.

```bash
bun run bin/setup.ts openclaw --config-path /path/to/your/openclaw-config.json
```

## Setup helpers

```bash
bun run bin/setup.ts claude
bun run bin/setup.ts cursor --global
bun run bin/setup.ts list
```

## Tests

```bash
bun run test:unit
bun run test:integration
bun run test:e2e
```

## Security

- Do not expose private keys in logs/messages.
- Keep `execution_mode=simulate` for pre-check and switch to `send` explicitly only when ready.
