# REA × Codex 云端 × Cloudflare Browser Run：执行交接文档

**版本**：2026-10-25 v1.0  
**目标仓库**：`david4v/loong-toolbox`（Public；研究产物与文档）  
**生产仓库**：`david4v/loong-os`（Private；禁止本任务直接改动）  
**任务定位**：一次性可验收的研发实验；不是常驻服务、不是 LOONG 生产功能。

> 新 Codex 云端会话请从「直接交给 Codex 的任务指令」开始执行。本文件里的方案是目标与验收合同，实施前以实际环境、官方文档、账户权限为准；不能把尚未验证的兼容性表述为成功。

## 0. 直接交给 Codex 的任务指令

你是 LOONG Toolbox 的网站逆向研究工程代理。请在独立云端工作区打开 `david4v/loong-toolbox`，阅读本文件、`01-reverse-engineering/REA.md`、`06-governance/REPOSITORY-POLICY.md`，以及 `david4v/loong-os` 内现行的 AGENTS/工程规则文档（只读）。先确认当前 Codex 云端容器是否允许运行 Node.js 子进程、本地 stdio MCP、安装 npm 包、访问外网和 Cloudflare 浏览器 CDP。如有不支持项，明确记录并停止对应路线，不要声称已安装或已连通。

首轮只针对 **https://roterminal.co/?r=all**，目标是获取：①布局/图表/交互设计证据，②网络接口和字段证据，③可验证的前端计算与指标口径；任何服务端算法均只能给出推断。使用 REA 官方工具与 Cloudflare Browser Run 官方 CDP；二者兼容性需要实际验收。先连通 Cloudflare 的 Chrome DevTools MCP/Playwright 获取截图和网络观察，再测试 REA 浏览器分析是否能直接复用该 Cloudflare CDP session。不要自己造桥接代理、常驻 Worker、数据库、抓取系统。若 REA 不能连接该 session，请报告明确技术阻碍，并在不改变架构的前提下用官方已支持的浏览器分析方式实现能实现的部分；把 REA 兼容性标为未通过。

请执行可完成的步骤、提交成果至本仓库独立分支并创建 PR（如果会话支持）；不要改动生产仓库。每个结论需证据分级（DIRECT / INFERRED / UNKNOWN）。不要向公开仓库提交 API Token、cookie、真实账户信息、可滥用的认证网络日志或专有源代码。输出验收状态、文件路径、PR 链接（若有）、阻碍及下一步。避免向 owner 提出代码操作要求。

## 1. 工程原则（执行约束）

这些规则根据 LOONG owner 已明确确认的规则重述；开始前应阅读 loong-os 现行工程文档核对，发现冲突要说明。

1. **Simple · Efficient · Elegant；Fail early · Fix fast。** 最短路径，用可复用的官方/开源工具；不造轮子，不引入多余服务、数据库、代理层。
2. Owner 不写代码；由 Codex 执行安装、配置、测试、提交与说明。所有说明用清晰中文，涉及必须由 owner 操作的授权只写最少步骤。
3. 从问题和目标出发；不自行扩展到网站镜像、批量抓取、付费供应商、LOONG 生产改造或 Roblox 周报。
4. 不随意切换编程语言、生产架构、采集逻辑；若必须改变，明确解释并获得 owner 同意后执行。
5. **不要静默 fallback，不伪造成功。** 关键步骤失败立即报告具体错误与影响；允许把后续明确独立的步骤标记 SKIPPED。禁止多重兜底掩盖故障。
6. 不能将第三方网页的隐藏服务端逻辑当作已知。尊重网站条款及访问控制，不绕过反爬/登录/验证码/付费墙，不做压力测试。
7. 不删除既有项目重要文件。研究代码与证据限于 toolbox；敏感日志本地暂存，不上传。
8. 文档记录官方链接、软件版本、操作命令、日期、成功与失败证据，保持可重复。

## 2. 目标架构及需要特别验证的边界

```text
Codex 云端研究工作区
 ├── REA（Node.js / MCP；具体 MCP 执行方式待验证）
 ├── Cloudflare Browser Run（远程 Chromium / CDP）
 │    ├── chrome-devtools-mcp 或官方推荐的 CDP 客户端
 │    └── REA：尝试连接相同浏览器会话；可能不兼容
 └── 本仓库 analysis/ 输出：截图、网络结构摘要、指标研究文档
       （不保存 credential / cookie / 原站完整私有代码）
```

**重要**：REA 官网明确网站分析需 Chrome-family browser，CLI/agent 分析在其进程所在环境运行。Cloudflare 提供远程 CDP 不意味着 REA 自动支持认证后的远程 WebSocket。必须实测 CDP session URL / authentication / attach semantics；不允许凭猜测写虚构的 REA 配置。

**Codex 云端约束**：ChatGPT 的 Codex 云端任务、Codex CLI、Codex App 的本地 MCP 支持不一定一致。第一步必须实际检查，若云端任务不支持持久 MCP stdio，则不得宣称 MCP 安装有效。可以评估独立 CLI 调用作为研究模式，但应记录其与云端 MCP 的差异；遇重大模式变更暂停扩大范围。

## 3. 前置条件和权限最小化

- GitHub：仅对 `david4v/loong-toolbox` 写入；对 `david4v/loong-os` 只读；单独工作分支例如 `research/rea-cloudflare-cdp-pilot`。
- Cloudflare：已有 Workers Paid 账号，可访问 Browser Run。不要触碰已有生产 Worker、D1、AI Gateway、VPN 与 cron。
- 使用专门的 Cloudflare API Token，限制 Browser Run 所需权限；不可在终端输出完整 Token，不可写在命令行参数/仓库中。通过 Codex 环境 Secrets 注入 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID`。实际权限名称以官方最新文档为准。
- 用单一浏览器会话、少量公开页面、按需开启，研究后主动关闭；不登录私人账户。
- 禁止把网站抓取自动化做成定时生产任务。

## 4. 执行阶段与 Stop / Go 门槛

### Phase A：核查运行环境与官方规格（先做）
1. `pwd`、`node --version`、`npm --version`、`command -v ps`，确认 REA 当前官方支持的 Node 版本；官网 2026-10-25 列示 Node 22.x >=22.23.4、24.x >=24.22.1、26.12.1+，以实际最新要求为准。
2. 检查 npm 出站、GitHub 权限、Codex 可用 MCP 接入方式、是否可执行子进程、是否有浏览器；记录命令和结果。
3. 阅读 REA 的 `README.md`、`docs/installation.md`、`docs/browser-observation.md`；Cloudflare Browser Run `cdp/mcp-clients/`、`cdp/session-management/` 和定价页。
4. 如果当前云端会话禁止安装 / MCP / 网络，则止步写出能力矩阵及确切阻碍，不迁到 VPS 或本地，除非 owner 重新授权。

**验收 A**：工具环境能力矩阵；所有版本和约束有官方出处。

### Phase B：REA 安装验证
1. 通过官方来源核验包名 `rea-agents` 与版本，先跑 `npx rea-agents@latest setup --help` 查看参数；安装前查明确切的 dry-run 和非交互支持。不要默认旧版本的 `--client codex` 或 `--dry-run` 一定存在。
2. 官方基本命令：`npx rea-agents setup`，有交互菜单则按实际客户端类型选择并审查将修改的文件。避免未经审查覆盖 Codex 全局配置。
3. 若云端不支持注册 MCP，但支持一次性 CLI，请验证 CLI 的 `--help` 与可执行工具范围，记录哪些能力可用。
4. 对 `REA_MCP_INPUT_SCHEMA_PROFILE` 等高级配置，首轮不调整默认参数。
5. 若安装提示原生逆向/反编译器，**不安装 Ghidra/Hopper/IDA**，只使用网站和 JS 分析功能。

**验收 B**：记录版本、安装方式、MCP/CLI 实际状态；无权限时报告 blocker。

### Phase C：Cloudflare Browser Run CDP 连通验收
1. 查阅官方 `Using with MCP clients (CDP)` 的当前端点、认证头、token scope、connection example；优先使用 Cloudflare 的官方示例或 chrome-devtools-mcp 官方参数，不凭印象硬编码 WebSocket URL。
2. 用环境 Secret 连接一个远程 Chromium session，访问公开测试页面（可先用 example.com），收集页面 title、截图、document.readyState、至少一条 Network 记录、session ID 的脱敏版本。
3. 访问 RoTerminal 首页，捕获移动/桌面至少两种 viewport 的截图与页面结构，记录浏览器实际渲染状态。
4. 网络记录只保存**脱敏摘要**：request URL 的 path、method、status、响应字段名、时序、缓存方式、调用触发条件；去除 cookie、token、个人账户信息、正文敏感数据。
5. 会话结束关闭远程 Chromium，查看 Browser Run 用量。

**验收 C**：可复现 CDP 连接、至少 2 张有效截图、网络结构摘要；失败时保留错误信息，不伪造。

### Phase D：REA 同 CDP 兼容性测试
1. 阅读 REA 官方 browser observation 文档，寻找已发布的远程 CDP endpoint 与认证方式，确认是否存在 attach/transport 参数。
2. 尝试通过官方 REA MCP/CLI 对**同一 Cloudflare session** 运行一项网页结构检查和一项 bundle/Network 检查。
3. 若支持：记录用法、成功调用、对应证据及限制。
4. 若不支持：标记 `REA_REMOTE_CDP=BLOCKED`，保留 Cloudflare 官方 CDP 客户端的已验证结果，**不要自己写桥接代理或绕过认证的适配层**。
5. 只有远程 REA 成功，才可以写 `REA_REMOTE_CDP=PASS`。

**验收 D**：明确 PASS / BLOCKED，不模糊陈述。

### Phase E：RoTerminal 研究（核心交付）
- **视觉设计**：桌面/移动布局、信息层级、导航、字体、间距、配色、卡片样式、表格、响应式断点、图表库、交互状态。保留截图、DOM 证据、可公开的 CSS 设计变量；输出可以借鉴的 **独立设计规格**，不得把整站私有 bundle 当模板镜像。
- **前端技术**：框架/图表库识别，静态资源组织、路由及用户交互导致的变化。无法确认就写 UNKNOWN。
- **数据请求**：接口路径、HTTP method、参数、字段、分页、刷新间隔、缓存与触发条件；公开接口也须遵守条款，不进行大规模批量提取。
- **指标口径**：CCU 采样间隔、日/周峰值、Top 5 集中度、Rising 排名、趋势序列。每项明确 `DIRECT`（前端代码/请求/站方文档直接证实）、`INFERRED`（样本推断）、`UNKNOWN`（服务端黑箱）。
- **原型**：只创建本地静态 mock 页面 / 设计规格，使用自造测试数据；不接入 LOONG 生产站。若研究取得足够证据，可选择做一个小的可截图原型。

**验收 E**：四份可独立阅读的报告 + 证据目录，指出 3–5 个真正值得 LOONG 借鉴的设计或算法，并列出最小实现所需真实数据前提。

### Phase F：提交 / 交付
建议路径：
```text
01-reverse-engineering/
  CODEX-CLOUDFLARE-CDP-HANDOFF.md
  experiments/roterminal-2026-10/
    00-environment.md
    01-cdp-and-rea-compatibility.md
    02-visual-design.md
    03-network-and-data-model.md
    04-metrics-and-algorithms.md
    05-loong-reuse-recommendations.md
    evidence/           # 只放脱敏且合规的截图 / 摘要
```
将变更提交到 `loong-toolbox` 的新分支并创建 PR；如无法使用 PR，就提交到已授权分支并报告差异，不能声称合并。首轮不做部署、不创建 GitHub Actions、不触碰 Cloudflare 生产配置。

## 5. 成本与资源边界
Cloudflare Browser Run Workers Paid：浏览器时数每月前 10 小时包含，之后 $0.09/小时；Browser Sessions 月平均并发前 10 个包含，超出另计。当前是“套餐包含额度”，不等于完全无限免费。独立模型调用、Codex 计算及外部服务另外按各自条款计费。首次试验建议累计浏览器运行 **≤ 1 小时**、同时 1 个 session，若超过先报告。

## 6. 遇到失败如何处理
- **云端 Codex 不支持本地 MCP**：不假装安装成功；尝试官方支持的一次性 CLI 仅作可行性验证，不换架构。
- **Cloudflare Token 缺权限**：给出所需最低权限的准确名称和官方设置链接，只请求必要授权。
- **REA 不支持远程 CDP**：D=BLOCKED，继续使用官方 Chrome DevTools MCP 获得已证实的网站证据，不写桥接层。
- **网站 403 / anti-bot / robots**：如实写 BLOCKED；不绕过或冒充用户；使用站方公开文档替代，但清楚标示不是现场网页实测。
- **指标算法位于服务端**：标记 UNKNOWN，最多做带样本范围说明的 INFERRED，不逆向推演成确定性定义。
- **费用或权限不足**：停止该阶段，不启用付费升级、不修改生产配置。
- **资料不完整**：交付已验证部分与 blocker，避免无意义“全成功”。

## 7. 完成标准

- [ ] Codex 环境的 Node/npm/MCP/CLI 能力得到实测记录
- [ ] REA 安装/调用方式明确且版本可复现
- [ ] Cloudflare 远程 CDP 能连、能截图、能检查 Network
- [ ] REA 与同一 CDP session：明确 PASS 或 BLOCKED
- [ ] RoTerminal UI / 网络 / 指标报告都有原始证据与 DIRECT/INFERRED/UNKNOWN 标识
- [ ] 敏感信息未进入 Public 仓库
- [ ] 没有更改 loong-os、Cloudflare 生产任务和账单配置
- [ ] 提交 toolbox 分支及 PR 或明确说明阻碍

## 8. 官方参考

- REA：https://github.com/morluto/rea （README / Quick start / Website requirements）
- REA browser observation：https://github.com/morluto/rea/blob/main/docs/browser-observation.md
- REA installation：https://github.com/morluto/rea/blob/main/docs/installation.md
- Cloudflare CDP MCP：https://developers.cloudflare.com/browser-run/cdp/mcp-clients/
- Cloudflare CDP sessions：https://developers.cloudflare.com/browser-run/cdp/
- Cloudflare pricing：https://developers.cloudflare.com/browser-run/pricing/
- RoTerminal：https://roterminal.co/?r=all
