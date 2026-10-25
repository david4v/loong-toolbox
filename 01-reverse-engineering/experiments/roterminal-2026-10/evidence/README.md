# 脱敏证据索引

2026-10-25（UTC+8）。本目录没有 RoTerminal 现场截图、DOM、HAR 或业务响应。

| 文件 | 来源与用途 |
| --- | --- |
| environment-probes.json | 本轮命令与连接器结果的人工裁剪摘要；区分沙箱错误、代理拒绝和站点响应 |
| package-metadata.json | npm 元数据与安装后的版本读回；含公开包完整性摘要 |
| setup-plan-summary.json | 官方 dry-run JSON 的白名单字段；未复制个人目录和其他客户端配置 |
| rea-mcp-probe.json | 官方 MCP 客户端的真实握手、选定工具 inputSchema 和负向调用结果；去掉庞大 outputSchema |
| rea-cli-validation.json | CLI 对无真实凭据的 Cloudflare 地址形态的原始错误 JSON |
| sources.md | 官方参考、版本与来源校验摘要；不复制官方全文或私库规则 |

MCP 参数中的 `REDACTED`、`NOT_A_REAL_TARGET` 为测试时即使用的字面量，不是真实 session/账号的替换回执。不能将这些负向测试视作真实远程 session 请求。
