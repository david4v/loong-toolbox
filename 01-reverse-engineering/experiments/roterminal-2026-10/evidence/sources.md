# 官方来源与版本锚点

核查日期：2026-10-25（UTC+8）。公开网页文档用于规格核对，不能替代本容器运行验收。

| 来源 | 使用范围 |
| --- | --- |
| [REA 官方仓库](https://github.com/morluto/rea) | 官方 npm 来源、Node 支持要求；读取 main 时远端 HEAD 为 `4232399079cd48c160cab6961085d44399993f6d` |
| [REA installation](https://github.com/morluto/rea/blob/4232399079cd48c160cab6961085d44399993f6d/docs/installation.md) | 安装预览、非交互参数与注册边界；已用包 6.7.0 的 help/dry-run 单独验证 |
| [REA browser observation](https://github.com/morluto/rea/blob/4232399079cd48c160cab6961085d44399993f6d/docs/browser-observation.md) | loopback 端点限制、attach 与被动观察 |
| [REA client configuration](https://github.com/morluto/rea/blob/4232399079cd48c160cab6961085d44399993f6d/docs/client-configuration.md#codex-and-devin) | Codex 注册和用户设置保护；未应用全局修改 |
| [npm registry 元数据](https://registry.npmjs.org/rea-agents/6.7.0) | 当前 latest=6.7.0；不将 main 的后续源码当已发布包行为 |
| [发布 tag](https://github.com/morluto/rea/tree/rea-agents-6.7.0) | `git ls-remote` 的 tag ref=`27dc42d10249f0410904a75c0997842eb03b931c`；这里只记录 ref，不假定 annotated tag 的 peeled commit |
| [Cloudflare CDP MCP](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/) | 官方端点、认证头、Browser Rendering - Edit |
| [Cloudflare CDP Playwright](https://developers.cloudflare.com/browser-run/cdp/playwright/) | `connectOverCDP` 与内存 headers |
| [Cloudflare session 管理](https://developers.cloudflare.com/browser-run/cdp/session-management/) | acquire、target、close 生命周期 |
| [Cloudflare 定价](https://developers.cloudflare.com/browser-run/pricing/) | browser hours 与月平均并发；不证明本账号套餐与余额 |
| [Token 创建说明](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) | 专用 Token 与资源范围 |
| [RoTerminal 目标](https://roterminal.co/?r=all) | 研究范围；本轮未成功读取，不作为已验证功能来源 |

REA main 下载文件 SHA-256（用于后续核对，不上传全文）：

```text
README.md              3a7f76363e62c0e188cc93261fc5292d734b23e2139f087885ad90296d7f3b32
installation.md        e6b8bcf11e57c1af3fd220fb92414e791ac1108f3c9f3f0ac757aa99f79cedc4
browser-observation.md 42bae3a979e60ac2094fe7a39a96fb86219ba2104501dae9486e903f1b02eb1a
```

Cloudflare LOONG 连接器的 OpenAPI 搜索使用 `/browser-rendering/` 路径，并将权限写作 Browser Rendering Write/Read；当前公开 CDP 文档使用 `/browser-run/`。本轮未成功调用业务端点，因此不推断两个路径可互换，不以旧路径拼出未验证的连接配置。
