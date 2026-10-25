# TwitterAPI.io — 第三方 X API

**状态：CANDIDATE；P1**  
https://twitterapi.io/ | https://twitterapi.io/pricing

## 能力
X 公开帖、账号、搜索及其他 REST 数据，省去自维护浏览器爬虫。官网曾显示推文 $0.15 / 1000 条；采购前复核实时计费和不同端点。

## LOONG 应用
约 100 个关注账号 → 每日增量采集 → 保留 post_id、user_id、时间、内容、URL、引用关系 → 按 AIHOT 启发的去重、聚簇与观点变化追踪进入 X 观察池。

## 成本模型
100 账号×30 天，每天平均 2 / 10 / 30 帖 = 6000 / 30000 / 90000 帖；按 $0.15/千帖，仅内容费 $0.90 / $4.50 / $13.50。额外查询、翻页、重试、模型和税费未计入。

## 验证
10 账号×7 天测试遗漏率、延迟、历史补采、API 分页与真实账单；核对支付、条款和稳定性。

## 来源
- https://twitterapi.io/pricing — Tweets / Profiles