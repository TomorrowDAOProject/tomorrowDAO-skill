# @tomorrowdao/agent-skills

[English](./README.md) | 中文

TomorrowDAO 的 AI Agent Skills 工具包，提供 **MCP + OpenClaw + CLI + SDK** 四种接入方式。

## 功能概览

- DAO：创建 DAO、更新 metadata、创建/投票/撤回/执行提案、讨论区接口
- Network Governance：提案创建/投票/Release、组织创建、合约名管理、合约流程工具
- BP Election：申请/退出、投票/撤回/切票、分红领取、团队信息维护
- Resource：资源代币买卖与记录查询
- 统一返回类型：`ToolResult<T>`、`TxReceipt`
- 执行模式：`simulate`（默认）和 `send`

## 接入方式

| 模式 | 入口 | 适用场景 |
|------|------|------|
| MCP | `src/mcp/server.ts` | Claude Desktop、Cursor、GPT 等 MCP 客户端 |
| CLI | `tomorrowdao_skill.ts` | 终端脚本、OpenClaw |
| SDK | `index.ts` | 自定义 Agent、LangChain/LlamaIndex |

## 架构

```text
tomorrowDAO-skill/
├── index.ts                # SDK 导出
├── tomorrowdao_skill.ts    # CLI 适配层
├── src/
│   ├── core/               # config/auth/http/chain/tx/error/types
│   ├── domains/            # dao/network/bp/resource
│   └── mcp/server.ts       # MCP 适配层
├── lib/                    # 兼容导出
├── bin/setup.ts            # claude/cursor/openclaw 一键配置
├── openclaw.json
├── mcp-config.example.json
└── tests/                  # unit/integration/e2e
```

## 快速开始

### 1. 安装

```bash
bun install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 填写 TMRW_PRIVATE_KEY 等配置
```

### 3. 一键配置（推荐）

```bash
# Claude Desktop
bun run bin/setup.ts claude

# Cursor（项目级）
bun run bin/setup.ts cursor

# Cursor（全局）
bun run bin/setup.ts cursor --global

# OpenClaw（打印配置）
bun run bin/setup.ts openclaw

# OpenClaw（合并到已有配置文件）
bun run bin/setup.ts openclaw --config-path /path/to/openclaw-config.json

# 查看配置状态
bun run bin/setup.ts list
```

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|------|------|
| `TMRW_API_BASE` | 否 | `https://api.tmrwdao.com` | TomorrowDAO API 基地址 |
| `TMRW_AUTH_BASE` | 否 | `https://api.tmrwdao.com` | 鉴权服务基地址 |
| `TMRW_CHAIN_DEFAULT_DAO` | 否 | `tDVV` | DAO 默认链 |
| `TMRW_CHAIN_DEFAULT_NETWORK` | 否 | `AELF` | Network Governance 默认链 |
| `TMRW_AUTH_CHAIN_ID` | 否 | `AELF` | 鉴权签名使用链 ID |
| `TMRW_PRIVATE_KEY` | `send`/鉴权接口需要 | — | 签名私钥 |
| `TMRW_SOURCE` | 否 | `nightElf` | 鉴权 `source` 字段 |
| `TMRW_CA_HASH` | 否 | — | 可选鉴权 `ca_hash` |
| `TMRW_RPC_AELF` | 否 | `https://aelf-public-node.aelf.io` | AELF RPC |
| `TMRW_RPC_TDVV` | 否 | `https://tdvv-public-node.aelf.io` | tDVV RPC |
| `TMRW_HTTP_TIMEOUT_MS` | 否 | `10000` | HTTP 超时时间（毫秒） |
| `TMRW_HTTP_RETRY_MAX` | 否 | `1` | 可重试请求的最大重试次数 |
| `TMRW_HTTP_RETRY_BASE_MS` | 否 | `200` | 重试指数退避基础间隔（毫秒） |
| `TMRW_HTTP_RETRY_POST` | 否 | `0` | 设为 `1/true` 时允许 POST 自动重试 |
| `TMRW_AELF_CACHE_MAX` | 否 | `8` | 长生命周期进程中 AElf 客户端缓存上限 |
| `TMRW_LOG_LEVEL` | 否 | `error` | 结构化日志级别（`error/warn/info/debug`） |

## 使用示例

### CLI

```bash
# DAO
bun run tomorrowdao_skill.ts dao create --input '{"args":{"metadata":{"name":"demo"}}}' --mode simulate

# Network Governance
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

可参考 [mcp-config.example.json](./mcp-config.example.json)：

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

## MCP 工具（共 41 个）

### DAO（12）
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

### Network Governance（13）
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

### BP（11）
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

### Resource（5）
- `tomorrowdao_resource_buy`
- `tomorrowdao_resource_sell`
- `tomorrowdao_resource_realtime_records`
- `tomorrowdao_resource_turnover`
- `tomorrowdao_resource_records`

## 网络与能力范围

- 支持链：`AELF`、`tDVV`
- Network Governance / BP / Resource 的写操作仅支持 `AELF`
- DAO 默认 `tDVV`，可显式传 `chainId`

## 兼容层说明

- `lib/*` 文件用于兼容旧版 import 路径（re-export）。
- 新接入建议优先使用包根导出（`index.ts`）。
- `signature.ts` 中 `buildLegacyTimestampSignature`、`getAuthSigningMessage` 保留为公开兼容 API（legacy）。

## 测试

```bash
bun run test:unit
bun run test:integration
bun run test:e2e
bun run test:coverage

# 覆盖率门禁（仅统计 src/**，默认：lines>=80, funcs>=75）
bun run test:coverage:gate
COVERAGE_MIN_LINES=85 COVERAGE_MIN_FUNCS=80 bun run test:coverage:ci

# 真实只读 e2e（公网 API）
RUN_TMRW_E2E=1 bun run test:e2e
```

## 安全建议

- 不要在日志和对话里暴露私钥。
- 先用 `simulate` 预检，再切到 `send`。
- 主网验收时优先用最小额度/最小影响操作。

## License

MIT
