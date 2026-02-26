# @tomorrowdao/agent-skills

[中文版](./README.zh-CN.md) | English

TomorrowDAO AI agent skill toolkit on aelf, with **MCP + OpenClaw + CLI + SDK** interfaces.

## Features

- DAO: create DAO, update metadata, create/vote/withdraw/execute proposal, discussion APIs
- Network governance: proposal create/vote/release, organization create, contract-name management, contract-flow actions
- BP election: apply, quit, vote, withdraw, change vote, claim profits, team description updates
- Resource: buy/sell resource token and query market records
- Unified result model: `ToolResult<T>` and `TxReceipt`
- Execution mode: `simulate` (default) and `send`

## Consumption Modes

| Mode | Entry | Use Case |
|------|------|------|
| MCP | `src/mcp/server.ts` | Claude Desktop, Cursor, GPT and other MCP clients |
| CLI | `tomorrowdao_skill.ts` | terminal scripts, OpenClaw |
| SDK | `index.ts` | custom agents, LangChain/LlamaIndex integrations |

## Architecture

```text
tomorrowDAO-skill/
├── index.ts                # SDK exports
├── tomorrowdao_skill.ts    # CLI adapter
├── src/
│   ├── core/               # config/auth/http/chain/tx/error/types
│   ├── domains/            # dao/network/bp/resource
│   └── mcp/server.ts       # MCP adapter
├── lib/                    # compatibility re-exports
├── bin/setup.ts            # setup for claude/cursor/openclaw
├── openclaw.json
├── mcp-config.example.json
└── tests/                  # unit/integration/e2e
```

## Quick Start

### Install

```bash
bun install
```

### Configure Env

```bash
cp .env.example .env
# fill TMRW_PRIVATE_KEY and other values
```

### One-Click Setup

```bash
# Claude Desktop
bun run bin/setup.ts claude

# Cursor (project-level)
bun run bin/setup.ts cursor

# Cursor (global)
bun run bin/setup.ts cursor --global

# OpenClaw (print config)
bun run bin/setup.ts openclaw

# OpenClaw (merge into existing config)
bun run bin/setup.ts openclaw --config-path /path/to/openclaw-config.json

# Check setup status
bun run bin/setup.ts list
```

## Environment Variables

| Variable | Required | Default | Description |
|------|------|------|------|
| `TMRW_API_BASE` | No | `https://api.tmrwdao.com` | TomorrowDAO API base URL |
| `TMRW_AUTH_BASE` | No | `https://api.tmrwdao.com` | Auth server base URL |
| `TMRW_CHAIN_DEFAULT_DAO` | No | `tDVV` | Default DAO chain |
| `TMRW_CHAIN_DEFAULT_NETWORK` | No | `AELF` | Default network governance chain |
| `TMRW_AUTH_CHAIN_ID` | No | `AELF` | Chain id used in auth signature grant |
| `TMRW_PRIVATE_KEY` | Yes for `send`/auth APIs | — | Signer private key |
| `TMRW_SOURCE` | No | `nightElf` | Auth `source` field |
| `TMRW_CA_HASH` | No | — | Optional auth `ca_hash` |
| `TMRW_RPC_AELF` | No | `https://aelf-public-node.aelf.io` | AELF RPC endpoint |
| `TMRW_RPC_TDVV` | No | `https://tdvv-public-node.aelf.io` | tDVV RPC endpoint |
| `TMRW_HTTP_TIMEOUT_MS` | No | `10000` | HTTP timeout in milliseconds |
| `TMRW_HTTP_RETRY_MAX` | No | `1` | Max retry count for retryable HTTP requests |
| `TMRW_HTTP_RETRY_BASE_MS` | No | `200` | Retry base backoff milliseconds |
| `TMRW_HTTP_RETRY_POST` | No | `0` | Retry POST when set to `1/true` |
| `TMRW_AELF_CACHE_MAX` | No | `8` | Max cached AElf client instances in long-lived process |
| `TMRW_LOG_LEVEL` | No | `error` | Structured logger level (`error/warn/info/debug`) |

## Usage

### CLI

```bash
# DAO
bun run tomorrowdao_skill.ts dao create --input '{"args":{"metadata":{"name":"demo"}}}' --mode simulate

# Network governance
bun run tomorrowdao_skill.ts network proposal-create --input '{"proposalType":"Parliament","args":{...}}' --mode send

# BP
bun run tomorrowdao_skill.ts bp apply --input '{"args":{...}}' --mode send

# Resource
bun run tomorrowdao_skill.ts resource buy --input '{"symbol":"CPU","amount":100000000}' --mode send
```

### MCP

```bash
bun run src/mcp/server.ts
```

Use [mcp-config.example.json](./mcp-config.example.json) as template:

```json
{
  "mcpServers": {
    "tomorrowdao-agent-skills": {
      "command": "bun",
      "args": ["run", "/ABSOLUTE/PATH/TO/src/mcp/server.ts"],
      "env": {
        "TMRW_PRIVATE_KEY": "<YOUR_PRIVATE_KEY>",
        "TMRW_API_BASE": "https://api.tmrwdao.com",
        "TMRW_CHAIN_DEFAULT_DAO": "tDVV",
        "TMRW_CHAIN_DEFAULT_NETWORK": "AELF"
      }
    }
  }
}
```

### SDK

```ts
import { daoCreate, networkProposalCreate } from '@tomorrowdao/agent-skills';

const daoRes = await daoCreate({
  chainId: 'tDVV',
  mode: 'simulate',
  args: { metadata: { name: 'hello codex' } },
});

const proposalRes = await networkProposalCreate({
  chainId: 'AELF',
  proposalType: 'Parliament',
  mode: 'simulate',
  args: { title: 'demo', description: 'demo' },
});
```

## MCP Tools (41)

### DAO (12)
- `tomorrowdao_dao_create`
- `tomorrowdao_dao_update_metadata`
- `tomorrowdao_dao_upload_files`
- `tomorrowdao_dao_remove_files`
- `tomorrowdao_dao_proposal_create`
- `tomorrowdao_dao_vote`
- `tomorrowdao_dao_withdraw`
- `tomorrowdao_dao_execute`
- `tomorrowdao_discussion_list`
- `tomorrowdao_discussion_comment`
- `tomorrowdao_dao_proposal_my_info`
- `tomorrowdao_dao_token_allowance_view`

### Network Governance (13)
- `tomorrowdao_network_proposals_list`
- `tomorrowdao_network_proposal_get`
- `tomorrowdao_network_proposal_create`
- `tomorrowdao_network_proposal_vote`
- `tomorrowdao_network_proposal_release`
- `tomorrowdao_network_org_create`
- `tomorrowdao_network_org_list`
- `tomorrowdao_network_contract_name_check`
- `tomorrowdao_network_contract_name_add`
- `tomorrowdao_network_contract_name_update`
- `tomorrowdao_network_contract_flow_start`
- `tomorrowdao_network_contract_flow_release`
- `tomorrowdao_network_contract_flow_status`

### BP (11)
- `tomorrowdao_bp_apply`
- `tomorrowdao_bp_quit`
- `tomorrowdao_bp_vote`
- `tomorrowdao_bp_withdraw`
- `tomorrowdao_bp_change_vote`
- `tomorrowdao_bp_claim_profits`
- `tomorrowdao_bp_votes_list`
- `tomorrowdao_bp_team_desc_get`
- `tomorrowdao_bp_team_desc_list`
- `tomorrowdao_bp_team_desc_add`
- `tomorrowdao_bp_vote_reclaim`

### Resource (5)
- `tomorrowdao_resource_buy`
- `tomorrowdao_resource_sell`
- `tomorrowdao_resource_realtime_records`
- `tomorrowdao_resource_turnover`
- `tomorrowdao_resource_records`

## Network Scope

- Supported chains: `AELF`, `tDVV`
- Network governance/BP/resource write operations are `AELF` only
- DAO defaults to `tDVV` unless `chainId` is explicitly set

## Compatibility Layer

- `lib/*` files are compatibility re-exports for older import paths.
- New integrations should prefer `index.ts` exports from package root.
- Legacy helpers in `signature.ts` (`buildLegacyTimestampSignature`, `getAuthSigningMessage`) are kept as public backward-compatible APIs.

## Testing

```bash
bun run test:unit
bun run test:integration
bun run test:e2e
bun run test:coverage

# coverage gate (src-only, default: lines>=80, funcs>=75)
bun run test:coverage:gate
COVERAGE_MIN_LINES=85 COVERAGE_MIN_FUNCS=80 bun run test:coverage:ci

# run real read-only e2e against public APIs
RUN_TMRW_E2E=1 bun run test:e2e
```

## Security

- Never expose private keys in logs/messages.
- Use `simulate` first for pre-check, then switch to `send`.
- For acceptance on mainnet, use minimal value operations first.

## License

MIT
