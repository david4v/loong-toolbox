# Cloudflare CDP 与 REA 兼容性

更新：2026-11-06（UTC+8）。**CDP 核心取证 PASS；REA_REMOTE_CDP=BLOCKED。** 账户月度用量仍 UNKNOWN。

## 真实连接与资源关闭

依据 [Cloudflare Puppeteer](https://developers.cloudflare.com/browser-run/cdp/puppeteer/) 与 [session 管理](https://developers.cloudflare.com/browser-run/cdp/session-management/)：通过环境 Secret 的 Bearer 头 POST acquire，使用响应返回的 socket 地址，而非自行拼接会话地址。文档采用 browser-run 路径，实际返回 socket 为 browser-rendering 路径；原样采用响应。只连接 api.cloudflare.com，未使用 live-view URL/JWT。

默认 Playwright socket 未走环境代理，报 EAI_AGAIN；本轮没有把它写成成功。显式 HTTPS_PROXY agent 的 ws 可以握手并执行 Browser.getVersion，随后按 Puppeteer 公开 [ConnectOptions](https://pptr.dev/api/puppeteer.connectoptions) / [ConnectionTransport](https://pptr.dev/api/puppeteer.connectiontransport) 接口连接。没有新服务或桥接代理，也没有放宽 REA 校验。

同一次初始研究运行先访问 example.com：title=Example Domain、readyState=complete、文档响应 200，并生成 [截图](evidence/example.png)；再访问目标。两种 viewport：1440×1000、390×844，均 readyState=complete、文档宽度等于 viewport。补证运行切换 1W 并打开 /rising；有曲线/标题/业务请求变化。五张截图均经过人工视觉检查。

两次取证 session 的 acquire、脱敏 session 指纹、时段和 DELETE closed 见 [验收 JSON](evidence/cdp-resume-2026-11-06.json)。最终活动 session=0。前置短探针也逐一关闭；账户月度计费量未取得，不将关闭成功等同于零费用。

## REA 对同一真实 session 的测试

在初始研究的 Chromium 仍连接且目标页已打开时，将 **同一个 acquire 响应 socket** 与其真实目标 ID 传给 REA 6.7.0：

| CLI | exit | 结果 |
| --- | --- | --- |
| inspect-web-page | 1 | invalid_request / invalid_input，拒绝 cdp_endpoint |
| analyze-web-bundle | 1 | invalid_request / invalid_input，拒绝 cdp_endpoint |

错误要求 explicit-port HTTP URL on 127.0.0.1 or ::1。本轮没有把 Token 放入 CLI 参数；REA 在地址校验阶段即拒绝，未进行远程鉴权。真实错误全文已脱敏存入验收 JSON。前轮 MCP 输入校验记录仍见 [rea-mcp-probe.json](evidence/rea-mcp-probe.json)，本轮没有重做 MCP 握手或宣称全局注册完成。

当前 [REA browser observation](https://github.com/morluto/rea/blob/main/docs/browser-observation.md#request-boundary) 仍排除远程 wss、非 loopback 地址及认证等。包实测与此一致。Cloudflare 的远程 session 可用，并不能解除 REA 的本地边界；D 的失败独立于 C。没有写端口桥接、修改上游校验或冒用其他浏览器作为同会话。

## 复现

依赖和具体请求形态见 [最小探针](evidence/run-cdp-probe.cjs)。在隔离工作目录安装验收 JSON 中固定版本的 puppeteer-core、ws、https-proxy-agent；运行 Node 24.22.1。继承当前环境代理、CA、两个 Cloudflare 变量，不把密钥写入参数。脚本只访问 example.com 并关闭资源；报告中的 RoTerminal 研究另按 UI 操作、字段摘要与脚本指纹复核，不批量抓取。
