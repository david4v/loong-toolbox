# 环境验收与本轮交付

更新：2026-11-06（UTC+8）。延续 [Draft PR #1](https://github.com/david4v/loong-toolbox/pull/1)，目标仅为公开 RoTerminal 页面及其 Rising 导航。10 月 25 日阻碍记录保留在 Git 历史及原有 evidence 中；以下为本轮实测状态。

| 阶段 | 状态 | 本轮结果 |
| --- | --- | --- |
| A / B | 既有验证保留，运行时复核 PASS | 隔离 Node 24.22.1、REA 6.7.0；未修改全局 MCP 注册 |
| C | 核心 CDP 验收 PASS；账单用量 UNKNOWN | 真实远程 Chromium、example title/readyState/Network、桌面与移动截图、交互及接口摘要；已关闭 |
| D | BLOCKED | 对同一真实 session 的页面与 bundle 检查均被 REA 端点校验拒绝 |
| E | 受限研究交付完成 | 四份报告、五张截图、DOM/字段/前端计算证据；服务端算法与部分口径 UNKNOWN |
| F | PR #1 分支交付 | 更新现有研究分支，保留 draft，不合并；以 GitHub 远端提交读回确认交付 |

## 密钥和域名是否生效

DIRECT：环境状态 observations_current=true，网络策略 enforced。`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 均 ready；Token verify HTTP 200 / active。example.com、roterminal.co HTTP 200；Cloudflare acquire HTTP 200。这证明本次实验所需权限可用，不代表 Token 具备其他账户权限。

工具必须显式启用 `with_additional_permissions.network.enabled=true`；默认沙箱请求无法连接代理或 EPERM。所有成功请求保留继承代理与 CA，TLS 验证未关闭，没有修改网络策略或开放其他域名。未调用 Cloudflare LOONG 连接器。

## 版本、运行方式与能力边界

系统 Node 24.19.0；实验隔离 Node 24.22.1。Puppeteer 25.16.0、远程 Chrome 152.0.7977.64；完整依赖版本见 [本轮验收 JSON](evidence/cdp-resume-2026-11-06.json)。安装在 `/workspace/work/rea-cdp-resume`，npm cache 同目录；没有安装本地浏览器或原生逆向软件。复用前轮 REA 6.7.0，不把当前 main 文档等同于包行为。

Playwright 默认 connectOverCDP 在此环境返回 EAI_AGAIN；标准 Node 全局代理设置也没有修复其 socket 路径。显式代理的 ws 握手成功后，采用 Cloudflare 文档支持的 Puppeteer，并通过其公开 ConnectionTransport 接口传递现有 ws 消息。这是进程内传输设置，没有本地监听、转发服务、Worker 或 REA 认证适配。Playwright 路线保持失败记录，没有冒称其已连通。

本轮有六个顺序执行的短预检 session、两次浏览器取证 session，以及交付探针的一次 example.com 复现 session；同时最多一个，前一个关闭后才创建下一个。初始研究运行约 46 秒，交互补证约 32 秒；预检包括只创建/关闭、Playwright 失败及一次 ws 版本读取。每次显式 DELETE 均返回 200 closed；最终列表为 0 个活动 session。未接近一小时上限。账户月度用量、剩余额度与精确账单 UNKNOWN；活动会话数和墙钟耗时均不能替代计费读数。

## 证据与规则

已阅读 toolbox 交接/REA/治理规则，并只读核对当前 loong-os AGENTS 与工程原则。本轮未修改 loong-os，也没有部署、Actions、生产配置、账单或权限变更。

[本轮证据索引](evidence/README.md)区分历史记录与新证据。只发布字段结构、选择性的计算后样式、原创计算说明、脚本指纹和公开游戏页面截图；不上传原始 HAR、完整第三方 bundle、cookies、Token、账号 ID、session/socket URL、用户个人信息。

不再要求 owner 重做此前两项设置，它们已生效。剩余技术阻碍是 REA 官方远程端点限制；如需账单精确数值，另需可用的账户用量读入口，但本次没有扩大权限。

交付脚本已独立复现成功：[运行结果](evidence/probe-reproduction-2026-11-06.json)。时间编码与时长均值还用自造数据在现场脚本模块上执行断言，均通过；不将测试值当网站真实样本。

## 交付检查

JSON 解析、相对链接、截图文件签名与人工视觉检查、凭据/账号字面值及敏感模式扫描、探针语法与真实复现、计算断言、git diff --check 均通过。检查未触发 GitHub Actions。
