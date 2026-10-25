# REA — Reverse Engineer Anything

**状态：VERIFIED_DOCS；P1**  
官方：https://rea.tools/  源码：https://github.com/morluto/rea

## 能力
用于 Codex 等编程代理的 MCP/CLI 逆向分析；可通过浏览器 CDP 观察网页 JavaScript、网络请求、模块和运行行为，也支持 Electron 和二进制分析。官方安装示例：`npx rea-agents@latest setup`。

## LOONG 用途
- RoTerminal：调查 Rising 排名、历史 CCU 和可见聚合逻辑。
- Entropy：TVL、代币化资产统计口径、前端图表与 API 请求。
- 其他优秀数据网站：研究布局、交互与可借鉴组件。

## 最小试验
独立 Chrome profile → CDP 检视公开页面 → 保存 URL、时间和证据 → 分离可见实现与服务端未知逻辑。

## 风险
无法直接读取远程服务器算法；可见 API 不意味着有抓取许可。不得暴露个人浏览器 cookie、生产账号或密钥。

## 来源
- https://rea.tools/ — How it works / Setup
- https://github.com/morluto/rea — README