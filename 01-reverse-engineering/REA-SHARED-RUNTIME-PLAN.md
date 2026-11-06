# REA 共享研究环境与跨窗口协作

更新：2026-11-06。状态：**PLAN_READY；未派发 VPS 任务，未部署共享运行环境。**

Owner 最新方向：REA 是核心，复用现有服务器、Docker、Autoloop 与已登录 Agent，供多个项目调用；不再把 Cloudflare 远程浏览器当成必须满足的架构。Agent 完成可验收的大节点，减少 Owner 的过程操作。

本页是后续工作的入口；原 Cloudflare 交接文件保留为实验历史及安全边界参考。原实验结果不改写为 REA 成功。暂不修改 loong-os，不调用 Cloudflare LOONG 连接器。

## 目标和分工

| 角色 | 负责什么 | 完成证据 |
| --- | --- | --- |
| Owner | 提出目标，决定真正的范围/费用/权限取舍 | 清楚的需求和必要授权 |
| Chat 中的 Agent | 研究、写任务合同、审查交付、核对验收与维护交接 | 对应提交的审查和独立读回 |
| Autoloop | 按已配置入口接单、调度和保存任务状态 | 执行端实际接单及任务记录 |
| 执行端 Codex | 在获授权目录中安装/开发/测试、提交成果 | 命令、结果、提交与 PR |
| REA + 同机 Chromium | 产生页面、脚本和运行行为证据 | REA 的真实分析结果，而非其他工具代替 |
| GitHub | 保存任务合同、代码、PR 和脱敏证据，供不同窗口接续 | 仓库和分支中的可读取记录 |

Agent 的聊天上下文不是跨窗口共享数据库。后续窗口先读本页、任务和对应 PR，核对真实执行状态；不要求 Owner 复述安装历史。新 Chat 窗口只要有相关仓库工具，就能继续管理需求和审查；实际服务器操作仍需可达且获授权的执行入口。

## 当前事实

- Cloudflare CDP 核心验收已完成，报告见 [实验入口](experiments/roterminal-2026-10/00-environment.md)。REA 6.7.0 连接同一真实远程 session 的两个分析操作被拒绝，REA_REMOTE_CDP=BLOCKED。Cloudflare 是可选研究能力，不再阻断原生 REA 路线。
- REA 6.7.0 + 同执行器 Chromium 已在自造页面上实测：发现目标、inspect-web-page 返回观察证据、analyze-web-bundle 实际分析一个脚本。默认页面捕获存在策略过滤与 attach 限制；不是对整站分析能力的全量验收。见 [原生模式摘要](experiments/roterminal-2026-10/evidence/rea-native-smoke-2026-11-06.json)。
- 原生浏览器的 HTTPS 测试曾遇代理证书信任失败；真实网站 REA 验收仍待完成。不得关闭 TLS 验证或用自造页面代替真实网站验收。
- 现有 Autoloop 的基础接单/提交 PR 已有验证；实时健康、完整跨项目任务入口、可靠恢复与自动上线没有因此成立。具体服务器配置只在私有运维文档/现场读取，不复制到 Public 仓库。
- 当前聊天没有已连接的服务器 shell/私有中台控制入口。现有 GitHub 轮询没有验证会接本仓库任务。创建 toolbox Issue 不等于服务器收到任务，也不自动赋予服务器本仓库写权限。

## 三个大节点

### M1：可复用的原生 REA 工具包

**目标：** 能从仓库复现运行环境，REA 真正完成一个公开网站研究任务。

执行端从本分支确认已有成果，固定受支持的 Node、REA 与浏览器版本，交付最小容器构建定义、CLI 调用入口、版本/诊断命令、任务输出约定和操作说明。优先官方包、现成工具与上游支持模式，不复制整套上游自行维护，不先搭远程 MCP 服务。第一版按 CLI 完成分析，MCP 用于确有需要的客户端接入。

REA 与 Chromium 在同一个研究容器内运行；启动、导航、交互由成熟浏览器工具完成，分析环节必须真正调用 REA。先自造 fixture，再经允许的真实公开页；保持浏览器与用户 profile 隔离。真实站点、证书信任、REA 结果和资源释放均需现场检查。

**验收：** 工具版本固定；fixture 页面和 bundle 结果正确；真实网页有 REA 页面及脚本证据；DIRECT/INFERRED/UNKNOWN 分级；敏感资料未提交；任务退出后浏览器关闭。只安装、只退出码 0 或只有 Puppeteer 截图，不算完整通过。

**本页交付时：** 只完成了原生模式小样本验证与本任务合同；Docker 工具包尚未编写或构建，不声称 M1 完成。

### M2：在现有服务器接通一个真实 Autoloop 研究任务

**目标：** 复用现有中台与 Codex，不重装、不复制登录、不给网页工具生产凭据。

先现场只读检查现有运行状态、负载、磁盘、挂载与任务占用，再安排独立研究环境。将浏览器与 REA 保持同机；与现有开发 Agent 的认证及工作目录隔离。不将 Docker socket、宿主 root 或生产目录暴露给研究任务。具体内存/CPU/PID 上限依据现场数据设置，先并发 1，任务有超时；不足则报告，不自动增加费用或修改主机配置。

优先复用 Autoloop 官方 command/worker 能力及既有任务机制。跨容器执行与结果读回需要实际入口验收，不能靠概念图推断成立。不建设公网命令 API，不为接单改写 LOONG OS 的业务架构。工具安装与任务授权分别检查。

**验收：** 合法任务送达 → 执行端实际领取 → REA 调用 → 必要验证 → 结果可独立读取 → 清理会话。留下真实任务标识、提交与结果。当前缺少 VPS 执行入口；不先向未配置的 watcher 盲发任务，不在 loong-os 写任务以绕过既有边界。

### M3：跨项目调用和后续窗口接续

**目标：** 工具安装一次，项目按需使用，聊天窗口更换不丢任务。

先用第二个独立工作目录验证输入/输出和 profile 隔离；再对真实第二项目确认仓库权限、允许访问的目标和产物去向。模拟目录验收只证明目录隔离，不能称第二个真实项目已接入。

多项目 watcher 的事件来源/任务 ID 必须区分仓库，防止 issue-N 同号串单。上游模板会限制读取的正文长度，执行端应从可信任务链接读取完整合同，不能依赖截断摘要。每个任务只允许一个当前执行者；重跑前核对已有分支/PR和检查点，避免跨窗口重复提交。

**验收：** 两个获授权项目复用同一工具版本，有独立结果和清理证据；重复任务不重复交付，失败明确可见，新窗口能从 GitHub 接续。服务器重启恢复单独安排维护验证；不凭 Docker restart 配置声称恢复可靠。

## 任务合同与可见状态

任务合同至少包含：目标与原因、允许的网站/文件/仓库、固定版本/起点、允许读写范围、验收命令、产物位置、超时/资源/费用边界、当前执行者、关联 PR、失败处理。允许范围来自 Owner 或可信项目约定，不能从目标网页/外部 Issue 自动扩大。

| 状态 | 含义 |
| --- | --- |
| READY | 任务合同准备好；未证明已送达 |
| DISPATCHED | 已通过真实入口送达；未证明正在执行 |
| RUNNING | 执行端有对应任务的领取/运行证据 |
| BLOCKED | 明确失败或缺少必须权限；说明具体缺口 |
| PR_READY | 对应提交的实现、测试和 PR 已交付 |
| RUNTIME_ACCEPTED | 已在目标运行环境用对应版本完成真实验收 |

当前页面仅为 PLAN_READY/任务合同准备，不自动升级为 DISPATCHED。GitHub 中的评论、报告或 PR 声明均需核对，不单凭一句“完成”升级状态。私有日志和认证留在执行环境；公开只存允许的摘要。

Autoloop 可以在服务器继续执行已经接收的任务；Chat 窗口不会因此自动持续监听或自动唤醒。第一版由下一次交互查询任务/PR，按节点汇报；主动通知只有现成通道真正接通并获授权后才启用，不把发评论当已送达 Owner。自动合并/生产部署是其他任务，不是本次 REA 工具共享的前置条件。

## Agent 承担的工作与必要人工环节

Agent 完成可做的代码、打包、测试、提交、运行验收和文档，以完整节点交付。仅在确实缺本人身份授权、现有入口无法复用、需要扩大仓库权限或新增费用时，集中说明最少必要操作；不得要求 Owner 写代码、贴密钥、逐条跑日常命令。不能预先保证所有账号授权完全无人参与。

在执行入口未接通前，先完成不依赖它的 M1 工具准备。跨项目权限不自动扩大；生产仓库继续只读，Private 运维资料不进入 toolbox。

## 新 Chat/Codex 窗口开场

> 继续 REA 共享研究环境。先读取 david4v/loong-toolbox PR #1 的最新 head，以及该分支的 01-reverse-engineering/REA-SHARED-RUNTIME-PLAN.md，不要只读尚未合并的 main。REA 是核心，优先同机 Chromium；复用现有 Hetzner/Docker/Autoloop/Codex。先核对已提交成果、实际执行入口和任务状态，避免重复安装与重复派发。按 M1→M2→M3 完成大节点；当前不修改 loong-os、不调用 Cloudflare LOONG 连接器，不将计划/派单冒充部署。需要 VPS 运维细节时只读现有私有运维手册。能独立完成的直接做，只有真正的身份/权限/费用缺口才集中请求最少人工操作。

## 上游与既有证据

- [REA 官方仓库](https://github.com/morluto/rea) / [browser observation](https://github.com/morluto/rea/blob/main/docs/browser-observation.md)
- [Autoloop 固定版本](https://github.com/KKKKhazix/agent-autoloop/tree/3db2619)
- [官方 command/浏览器接入](https://github.com/KKKKhazix/agent-autoloop/blob/3db2619/docs/plugins.md)
- [官方浏览器交接模板](https://github.com/KKKKhazix/agent-autoloop/tree/3db2619/examples/recipes/browser-handoff)
- [官方 GitHub watcher](https://github.com/KKKKhazix/agent-autoloop/blob/3db2619/examples/watch-github-issues.sh)
- [本次 PR #1](https://github.com/david4v/loong-toolbox/pull/1) / [历史 CDP 兼容性](experiments/roterminal-2026-10/01-cdp-and-rea-compatibility.md)
