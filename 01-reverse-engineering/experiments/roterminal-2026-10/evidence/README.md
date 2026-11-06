# 证据索引

2026-11-06 增量证据：

- [CDP/环境/REA 同会话/关闭记录](cdp-resume-2026-11-06.json)
- [选择性网络字段与缓存摘要](network-summary-2026-11-06.json)
- [DOM、少量样式与交互摘要](dom-design-summary-2026-11-06.json)
- [历史时间差统计](history-sample-summary-2026-11-06.json)
- [前端脚本指纹](frontend-artifact-index-2026-11-06.json)，仅路径/哈希，无第三方源码
- [最小可复现 CDP 探针](run-cdp-probe.cjs)，只访问 example.com；[独立复现结果](probe-reproduction-2026-11-06.json)
- 截图：[example](example.png)、[桌面](roterminal-desktop.png)、[移动](roterminal-mobile.png)、[1W](roterminal-week.png)、[Rising](roterminal-rising.png)

两次取证发生于 UTC 15:24:23–15:25:09、15:26:40–15:27:12（北京时间同日 23:24–23:27）。首轮桌面为 1440×1000；补证移动为 390×844，移动已切换 1W。截图是现场状态，含公开游戏名称与数值，不作授权复用素材。

10 月 25 日历史文件保留：environment-probes、package-metadata、rea-cli-validation、rea-mcp-probe、setup-plan-summary、sources；其中缺 Secret/出站拒绝描述已被本轮结果更新，不能当当前状态。

无原始 HAR、认证头、Cookie、Token、账号 ID、完整 session URL、live-view JWT、完整 bundle 或个人账户数据。实体字典键已泛化。活动 session 列表不是账单读数；月度用量 UNKNOWN。
