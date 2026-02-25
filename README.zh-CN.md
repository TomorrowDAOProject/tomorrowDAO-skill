# TomorrowDAO Agent Skills

TomorrowDAO 能力工具包，包含 **MCP + OpenClaw + CLI + SDK** 四种接入方式。

## 能力范围

- DAO：创建 DAO、更新 metadata、创建提案、投票、撤回、执行、讨论区接口
- Network Governance：提案创建/投票/Release、组织创建、合约名管理、合约提案完整流程
- BP Election：申请/退出、投票/撤回/切票、领取收益、团队信息维护
- Resource：资源代币买卖与记录查询
- 执行模式：`simulate`（默认）和 `send`

## 安装

```bash
bun install
```

## 环境变量

请参考 [.env.example](./.env.example)。

关键变量：

- `TMRW_API_BASE`（默认 `https://api.tmrwdao.com`）
- `TMRW_CHAIN_DEFAULT_DAO`（默认 `tDVV`）
- `TMRW_CHAIN_DEFAULT_NETWORK`（默认 `AELF`）
- `TMRW_PRIVATE_KEY`
- `TMRW_SOURCE`（默认 `nightElf`）
- `TMRW_CA_HASH`（可选）

## CLI 用法

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

MCP 配置模板见 [mcp-config.example.json](./mcp-config.example.json)。

## OpenClaw

仓库内已提供 `openclaw.json`。

```bash
bun run bin/setup.ts openclaw --config-path /path/to/your/openclaw-config.json
```

## 平台配置脚本

```bash
bun run bin/setup.ts claude
bun run bin/setup.ts cursor --global
bun run bin/setup.ts list
```

## 测试

```bash
bun run test:unit
bun run test:integration
bun run test:e2e
```

## 安全建议

- 不要在日志/消息中暴露私钥。
- 先用 `execution_mode=simulate` 做预检，确认后再切换到 `send`。
