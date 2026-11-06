# RoTerminal 网络与数据模型报告

观察：2026-11-06（UTC+8），两个短浏览器运行约 46/32 秒；仅公开页面。以下 DIRECT 来自浏览器 Network，不包含认证头、正文值、个人账户或原始 HAR。[完整选择性字段证据](evidence/network-summary-2026-11-06.json)。

| 路径 | Method/status | 关键结构 | 缓存与触发 |
| --- | --- | --- | --- |
| /api/robot/list/discover | GET 200 | at；now.{v,chg,chart}；sections；cover；all | no-store；首页加载，聚合区块结构 |
| /api/history/seed | GET 200 | dt:number[]；dv:number[]；live:number[][]；record:number[] | public,max-age=15；首页趋势初始化 |
| /api/history | GET 200 | dt:number[]；dv:number[]；v:string | public,max-age=30,stale-while-revalidate=600；seed 后延迟补全 |
| /api/robot/list/pulse | GET 200 | t；rows 中事件字段 | no-store；首页事件栏 |
| /api/robot/page/r:rising | GET 200 | ref；source；card.{spec,rows,games}；at；views；range；ranges；rank | no-store；点击 Rising 导航 |

上述请求本次 query_keys 均为空；`/?r=all` 是页面 URL 参数，不代表每个 API 都含 r。前端脚本还声明 /api/history?v=版本标记，该形式是代码直接证据，本轮没有主动重放带版本的请求。Rising card.rows 样本字段为 name、v、game、spark；字段名 v 不能脱离 spec/渲染语境自动解释为当前 CCU。服务端返回排序/卡片结构，不足以公开服务器算法。

## 更新机制与时序

DIRECT / 前端代码：discover 模块设置 30,000ms 的可见页更新定时器；history seed 优先内嵌初值或 fetch，load 后 idle 调度补取历史。1W 切换时未观察到独立的新增业务请求，符合已加载历史在前端切片的实现；这不是对所有时间范围的保证。

初次普通浏览器导航由网站自动创建 /api/stream EventSource，请求 200、no-cache/no-transform。公开脚本声明 hello/live/baseline/history 消息与断线退避；**没有保存或主动回放 SSE 正文**，没有据此测定采集频率。响应缓存 TTL、UI 刷新、SSE 消息和底层采样是不同概念。

随后读取 [robots.txt](https://roterminal.co/robots.txt)：允许一般页面，禁止 /api/e、/api/stream、/api/me、/api/account 等。后续补证运行在浏览器拦截这些路径，不直接请求这些接口；由此该次实时时效性不参与验收。初始页面自主发出的遥测、匿名账户、广告/缩略图等不纳入公开研究字段证据。没有登录、绕过权限或批量提取；robots 的 Allow 不等同于数据再分发授权。

浏览器两次普通导航会自动加载数百条资源，不能将资源数称为数百次主动 API 抓取。公开只保存本表少量业务请求的 shape，动态实体 ID 字典统一改为 `<entity_id>`。TTFB 来自 Chromium timing，不等于服务器计算耗时。未验证分页合同、长期刷新可靠性、数据授权条款或限流阈值，均 UNKNOWN。
