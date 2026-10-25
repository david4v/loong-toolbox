# Cloudflare CDP 与 REA 兼容性

日期：2026-10-25（UTC+8）。结论：**C=BLOCKED，REA_REMOTE_CDP=BLOCKED**。本轮没有真实 Cloudflare session，不能宣称同 session attach、截图或 Network 成功。

## 已证实的接口边界

- **DIRECT / 官方规格**：[Cloudflare MCP 文档](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/) 使用 `chrome-devtools-mcp` 的 `--wsEndpoint` 和 `--wsHeaders`；浏览器端点形态为 `wss://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/devtools/browser?keep_alive=600000`，认证头为 `Authorization: Bearer <API_TOKEN>`。文档示例不应直接照抄真实 Token 到参数或公开配置。
- **DIRECT / 官方规格**：[Playwright 示例](https://developers.cloudflare.com/browser-run/cdp/playwright/) 使用 `chromium.connectOverCDP(endpoint, {headers})`；后续应从环境读取 Secrets，保留认证头于进程内存，不放命令行。
- **DIRECT / 官方规格**：[HTTP session 管理](https://developers.cloudflare.com/browser-run/cdp/session-management/) 提供 POST acquire、同 session 的 target 列表及 DELETE close。接入以响应给出的地址为准；不能把第二次调用创建的新 session 当同一个 session。
- **DIRECT / 官方规格**：[REA browser observation](https://github.com/morluto/rea/blob/main/docs/browser-observation.md#request-boundary) 限定 literal loopback HTTP / browser WebSocket；排除远程 `wss:`、凭据、查询和非规定路径。
- **DIRECT / 包实测**：6.7.0 的 CLI 和 MCP 均拒绝 Cloudflare 官方远程地址形态，错误见下表。并非只凭 main 文档推断已发布包行为。

## 实测记录

| 通道 | 操作 | 结果 |
| --- | --- | --- |
| CLI | `list-browser-targets <脱敏 Cloudflare wss 地址> --json` | exit 1，code=invalid_request；`CDP endpoint must be an explicit-port HTTP URL on 127.0.0.1 or ::1` |
| MCP stdio | initialize + tools/list | PASS；server=rea/6.7.0，207 tools |
| MCP stdio | list_browser_targets | isError=true，拒绝 cdp_endpoint |
| MCP stdio | inspect_web_page | isError=true，拒绝 cdp_endpoint |
| MCP stdio | analyze_web_bundle | isError=true，拒绝 cdp_endpoint |
| Cloudflare 环境调用 | 前置检查 | Secrets 缺失，代理 CONNECT 403；未发送 acquire |
| Cloudflare 连接器 | 只读会话列表 | UNAUTHORIZED / reauthentication required；停止重试，未创建 session |

验证输入中的账号为字面量 `REDACTED`，target 为 `NOT_A_REAL_TARGET`。**这些是输入边界的负向测试，不是真实同 session 测试，不证明任何 Cloudflare 账号的鉴权结果。** MCP 握手和工具调用只证明一次性 stdio 运行能力；当前聊天的全局注册未应用。

证据：[MCP schema 与调用结果](evidence/rea-mcp-probe.json)、[CLI 错误](evidence/rea-cli-validation.json)、[安装预览摘要](evidence/setup-plan-summary.json)。

没有已验证的官方远程认证/attach 参数可解决本例。未编写桥接、端口转发、认证适配或常驻代理，也没有修改 REA 的端点校验。

## C 恢复后的验收合同

只用一个官方 Playwright/CDP 会话；先 example.com，记录 title、readyState、一张有效页面截图和至少一条 Network 事件，然后访问 RoTerminal。桌面/移动各一张实际页面截图，辅以 DOM/计算后样式和交互后的请求结构。凭据、cookie、账户内容、session socket 和 live-view JWT 不进入公开成果。关闭 session 并记录关闭结果、用量读数；账户总量无法读取时明确 UNKNOWN。

当前 screenshot_count=0、network_record_count=0、session_id=null。未提交占位截图或空 HAR 作为成功证据。REA 的官方 loopback 模式虽然存在，但不迁移到 owner 本地或 VPS，不以其他浏览器冒充 Cloudflare。

[定价](https://developers.cloudflare.com/browser-run/pricing/)区分 browser hours 和月平均并发：Workers Paid 含每月 10 小时，之后 $0.09/小时；并发含 10，之后每个 $2。套餐余额与权限本轮均未验证；本实验未创建计费浏览器，不能据此推断账号总体无用量。
