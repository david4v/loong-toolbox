# 环境验收与本轮交付

执行日期：2026-10-25（UTC+8）。目标仅为 `https://roterminal.co/?r=all`。
本轮完成环境、REA CLI/stdio MCP 与远程端点校验；**Cloudflare CDP 和 RoTerminal 现场研究尚未通过验收**。

## Phase A–F 状态

| 阶段 | 状态 | 实际结果 |
| --- | --- | --- |
| A 环境与规格 | PARTIAL | Node 子进程、npm、Git、浏览器可执行文件和 MCP 传输已测；Cloudflare/目标站出站被拒绝 |
| B REA 安装验证 | PASS（CLI/独立 stdio） | npm 包 6.7.0 可运行，MCP initialize + tools/list + tools/call 成功传输；全局 Codex 注册未应用 |
| C Cloudflare CDP | BLOCKED | 缺环境 Secrets，目标出站被拒绝；未创建远程 session，0 张现场截图、0 条目标 Network 记录 |
| D 同 session 兼容 | BLOCKED | `REA_REMOTE_CDP=BLOCKED`；真实 session 测试 SKIPPED；官方远程地址形态被 REA CLI/MCP 本地校验拒绝 |
| E RoTerminal 研究 | SKIPPED | 缺现场证据；四份主题文档明确 UNKNOWN 和取证要求，不宣称研究完成 |
| F 分支与 PR | PASS（阶段性记录） | 已推送 `research/rea-cloudflare-cdp-pilot` 并创建 [Draft PR #1](https://github.com/david4v/loong-toolbox/pull/1)，未合并；不代表 C/E 验收通过 |

## 能力矩阵

以下 DIRECT 为本环境实测，证据见 [environment-probes.json](evidence/environment-probes.json)。

| 项目 | 结果与边界 |
| --- | --- |
| 工作目录 | `/workspace/loong-toolbox`；开始时工作区干净，基线 `d31452d9920ec4bbba8b17cc122f1bba88fcd2e6` |
| 原有运行时 | Node 24.19.0、npm 11.9.0；Node 低于 REA 当前 main 文档的 24.22.1 下限 |
| 隔离运行时 | 在 `/workspace/work/rea-cdp-pilot/runtime` 安装 Node 24.22.1；未替换系统运行时 |
| 子进程 | 开启工具支持的网络权限后，Node `spawnSync(node, ['--version'])` 无 error、exit 0，输出 v24.19.0 |
| 进程工具 | `/usr/bin/ps` 可执行 |
| 本地浏览器 | Chromium 154.0.8037.57 可报告版本；没有据此声称已渲染目标站 |
| npm | registry 元数据查询、Node 包安装、REA 下载与运行成功 |
| Codex CLI | 0.163.0；`codex mcp --help` 可用，`codex mcp list --json` 返回 `[]` |
| MCP | 用官方 `@modelcontextprotocol/client` 2.3.1 启动 REA stdio；服务版本 6.7.0，列出 207 个工具，3 次工具调用返回明确输入错误 |
| 当前聊天集成 | 独立 MCP 客户端可用不等于工具已加载进本聊天；没有修改全局 Codex 配置 |
| GitHub | `git ls-remote origin HEAD` 成功；GitHub 连接器确认 toolbox push 权限；shell 的 `gh api` 被网络拒绝，后续使用连接器创建 PR |
| Cloudflare Secrets | `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 均未设置；只检查存在性，未读取值 |
| 外网 | 受限制；包仓库与 Git 可达，Cloudflare/目标站不通，不能将“可访问 npm”写成“任意外网可用” |

首次未开启工具网络权限时，curl/Git 无法连接代理，Node 子进程还报告 EPERM；启用受支持的 `with_additional_permissions.network.enabled=true` 后 npm/Git 成功。这是显式的工具权限修正，未绕过代理。后续 Cloudflare/RoTerminal 的错误为 **CONNECT 403、origin HTTP 000**，不是目标网站返回 403，更不构成 anti-bot 证据。

运行时状态工具报告 observations_current=true、connected，但网络策略 state=unknown；因此不声称策略已确认 enforced。执行器策略快照为 restricted、vpn_configured=false、TCP domain/IP grants 为空。

## REA 安装方式与复现

npm 官方包 `rea-agents@6.7.0` 的 engines 为 `^22.19.0 || ^24.11.0 || >=26.0.0`，比当前 main 的 README 要求宽。采用更严格文档要求，用隔离 Node 24.22.1 执行。包完整性与版本见 [package-metadata.json](evidence/package-metadata.json)。

本轮实际命令（安装与执行时保留继承的代理和 CA；npm cache 全在工作目录）：

```sh
npm_config_cache=/workspace/work/rea-cdp-pilot/npm-cache npm view rea-agents version engines repository dist.integrity --json
npm_config_cache=/workspace/work/rea-cdp-pilot/npm-cache npm install --prefix /workspace/work/rea-cdp-pilot/runtime --no-audit --no-fund node@24.22.1
PATH=/workspace/work/rea-cdp-pilot/runtime/node_modules/node/bin:$PATH npm_config_cache=/workspace/work/rea-cdp-pilot/npm-cache npx --yes rea-agents@latest setup --help
PATH=/workspace/work/rea-cdp-pilot/runtime/node_modules/node/bin:$PATH npm_config_cache=/workspace/work/rea-cdp-pilot/npm-cache npx --yes rea-agents@6.7.0 --help
PATH=/workspace/work/rea-cdp-pilot/runtime/node_modules/node/bin:$PATH npm_config_cache=/workspace/work/rea-cdp-pilot/npm-cache npx --yes rea-agents@6.7.0 setup --client codex --skill=false --dry-run --json
```

`@latest` 实际解析到 6.7.0，后续固定该版本。安装仅落在 npm cache，未做全局 npm 安装。帮助实测存在 `--client`、`--dry-run`、`--yes`、`--skill`；只读预览为 `planned`、`appliedActions=[]`，计划新增全局 Codex REA 注册，因此未应用。预览 doctor 的 overall healthy=false 涉及未注册及缺少原生分析引擎，不代表网站 CLI/MCP 不能启动，也不需要安装 Ghidra/Hopper/IDA。高级 schema 参数保持默认。

## 规则与权限隔离

已阅读本库 REA.md、REPOSITORY-POLICY.md、交接文件；只读核对 loong-os 当前 AGENTS 和工程原则。规则无影响本任务范围的冲突。私库内容及其内部运行信息未复制到公开成果。

loong-os 仅在独立临时目录读取规则，没有编辑、提交、push、部署；Cloudflare 只尝试一次会话列表读取，失败后停止。没有创建 session、Worker、D1、定时任务、Actions，也没有调整费用或账户设置。公开成果仅含工具结果的脱敏摘要、官方来源与原创分析边界。

## 最少需要 owner 的操作

1. 在 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) 创建实验专用 Token：**Account → Browser Rendering → Edit**（文档写作 `Browser Rendering - Edit`，OpenAPI permission 名为 `Browser Rendering Write`），资源只选目标账号。将 Token 和账号 ID 通过当前 Codex 云环境 Secrets 分别保存为 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。不要发到聊天或保存进仓库。
2. 在当前云环境网络设置加入 `api.cloudflare.com`、`roterminal.co`、`example.com`，应用到执行环境。CDP WebSocket 及代理兼容性仍需实测；若实际返回地址要求其他域名，再按明确失败证据最小添加，不开放通配或整网。GitHub 连接器可交付 PR，无需为 shell 增加 api.github.com。

Cloudflare LOONG 连接器读取会话返回 `UNAUTHORIZED` 并触发重新授权窗口。owner 反馈后已停止使用该连接器；不要求重连它，也不申请它所列的一组额外权限。上述专用 Secrets 路线直接遵循交接合同。

授权恢复后从 C 开始：先一个 example.com 会话、验证 title/readyState/截图/Network，再取 RoTerminal 两种 viewport；最后主动关闭 session 并查看用量。总会话数 1、累计 ≤1 小时。**仅补 Token 无法解除 REA 远程端点限制**；D 保持 BLOCKED，C 成功后用官方 Playwright/CDP 完成可行研究。

官方依据集中在 [sources.md](evidence/sources.md)。
